// models/ProducteurPremium.js
import { pool } from '../config/database.js';

class ProducteurPremium {
    // Créer un abonnement premium
    static async creerAbonnement(donnees) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Vérifier si le producteur a déjà un abonnement actif
            const existant = await client.query(
                `SELECT * FROM producteurs_premium 
                 WHERE producteur_id = $1 AND statut = 'actif'`,
                [donnees.producteurId]
            );
            
            if (existant.rows.length > 0) {
                throw new Error('Un abonnement actif existe déjà');
            }
            
            // Créer l'abonnement
            const requete = `
                INSERT INTO producteurs_premium (
                    producteur_id,
                    type_abonnement,
                    frequence_collecte,
                    date_debut,
                    date_fin,
                    montant_abonnement,
                    statut
                ) VALUES ($1, $2, $3, $4, $5, $6, 'actif')
                RETURNING *
            `;
            
            const valeurs = [
                donnees.producteurId,
                donnees.typeAbonnement || 'premium',
                donnees.frequenceCollecte || 'hebdomadaire',
                donnees.dateDebut || new Date(),
                donnees.dateFin,
                donnees.montantAbonnement
            ];
            
            const resultat = await client.query(requete, valeurs);
            const abonnement = resultat.rows[0];
            
            // Mettre à jour le type de compte du producteur
            await client.query(
                `UPDATE producteurs 
                 SET type_compte = 'premium' 
                 WHERE id = $1`,
                [donnees.producteurId]
            );
            
            await client.query('COMMIT');
            return abonnement;
            
        } catch (erreur) {
            await client.query('ROLLBACK');
            console.error('❌ Erreur création abonnement premium:', erreur);
            throw erreur;
        } finally {
            client.release();
        }
    }

    // Renouveler un abonnement
    static async renouvelerAbonnement(abonnementId, nouvelleDateFin, nouveauMontant) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            const requete = `
                UPDATE producteurs_premium 
                SET date_fin = $1,
                    montant_abonnement = $2,
                    modifie_le = CURRENT_TIMESTAMP
                WHERE id = $3 AND statut = 'actif'
                RETURNING *
            `;
            
            const resultat = await client.query(requete, [nouvelleDateFin, nouveauMontant, abonnementId]);
            
            await client.query('COMMIT');
            return resultat.rows[0];
            
        } catch (erreur) {
            await client.query('ROLLBACK');
            console.error('❌ Erreur renouvellement abonnement:', erreur);
            throw erreur;
        } finally {
            client.release();
        }
    }

    // Résilier un abonnement
    static async resilierAbonnement(abonnementId) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Récupérer l'abonnement
            const abonnement = await client.query(
                `SELECT producteur_id FROM producteurs_premium WHERE id = $1`,
                [abonnementId]
            );
            
            if (abonnement.rows.length === 0) {
                throw new Error('Abonnement non trouvé');
            }
            
            // Mettre à jour le statut de l'abonnement
            await client.query(
                `UPDATE producteurs_premium 
                 SET statut = 'resilie',
                     date_fin = CURRENT_DATE,
                     modifie_le = CURRENT_TIMESTAMP
                 WHERE id = $1`,
                [abonnementId]
            );
            
            // Remettre le producteur en mode standard
            await client.query(
                `UPDATE producteurs 
                 SET type_compte = 'standard' 
                 WHERE id = $1`,
                [abonnement.rows[0].producteur_id]
            );
            
            await client.query('COMMIT');
            return true;
            
        } catch (erreur) {
            await client.query('ROLLBACK');
            console.error('❌ Erreur résiliation abonnement:', erreur);
            throw erreur;
        } finally {
            client.release();
        }
    }

    // Trouver un abonnement par producteur
    static async trouverParProducteur(producteurId) {
        const requete = `
            SELECT * FROM producteurs_premium 
            WHERE producteur_id = $1 AND statut = 'actif'
            ORDER BY date_debut DESC
            LIMIT 1
        `;
        const resultat = await pool.query(requete, [producteurId]);
        return resultat.rows[0];
    }

    // Lister tous les abonnements actifs
    static async listerActifs() {
        const requete = `
            SELECT pp.*, p.nom_complet, p.email, p.telephone
            FROM producteurs_premium pp
            JOIN producteurs p ON pp.producteur_id = p.id
            WHERE pp.statut = 'actif'
            ORDER BY pp.date_fin ASC
        `;
        const resultat = await pool.query(requete);
        return resultat.rows;
    }

    // Obtenir les statistiques des abonnements
    static async getStatistiques() {
        const requete = `
            SELECT 
                COUNT(*) FILTER (WHERE statut = 'actif') as abonnements_actifs,
                COUNT(*) FILTER (WHERE statut = 'expire') as abonnements_expires,
                COUNT(*) FILTER (WHERE statut = 'resilie') as abonnements_resilies,
                COALESCE(SUM(montant_abonnement) FILTER (WHERE statut = 'actif'), 0) as revenus_mensuels_estimes
            FROM producteurs_premium
        `;
        const resultat = await pool.query(requete);
        return resultat.rows[0];
    }
}

export default ProducteurPremium;