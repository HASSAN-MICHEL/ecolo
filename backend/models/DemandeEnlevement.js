
import { pool } from '../config/database.js';

class DemandeEnlevement {
    // Créer une demande d'enlèvement
   
    
    // models/DemandeEnlevement.js - Version corrigée

static async creer(donnees) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Vérifier le stock disponible avec arrondi
        const stockCheck = await client.query(`
            SELECT quantite_disponible 
            FROM stocks_dechets 
            WHERE point_depot_id = $1 AND type_dechet = $2
            FOR UPDATE
        `, [donnees.pointDepotId, donnees.typeDechet]);
        
        if (!stockCheck.rows[0]) {
            throw new Error('Stock non trouvé pour ce point et type de déchet');
        }
        
        const stockDisponible = parseFloat(stockCheck.rows[0].quantite_disponible);
        const quantiteDemandee = parseFloat(donnees.quantite);
        
        // Arrondir à 2 décimales pour éviter les problèmes de flottants
        const stockArrondi = Math.round(stockDisponible * 100) / 100;
        const quantiteArrondie = Math.round(quantiteDemandee * 100) / 100;
        
        console.log(`📊 Vérification stock: ${stockArrondi} kg disponible, ${quantiteArrondie} kg demandé`);
        
        if (stockArrondi < quantiteArrondie) {
            throw new Error(`Stock insuffisant. Disponible: ${stockArrondi} kg, Demandé: ${quantiteArrondie} kg`);
        }
        
        // Créer la demande
        const requete = `
            INSERT INTO demandes_enlevement (
                recycleur_id,
                point_depot_id,
                type_dechet,
                quantite_demandee,
                date_souhaitee,
                notes,
                statut
            ) VALUES ($1, $2, $3, $4, $5, $6, 'en_attente')
            RETURNING *
        `;
        
        const valeurs = [
            donnees.recycleurId,
            donnees.pointDepotId,
            donnees.typeDechet,
            quantiteArrondie, // Utiliser la valeur arrondie
            donnees.dateSouhaitee,
            donnees.notes || null
        ];
        
        const resultat = await client.query(requete, valeurs);
        const demande = resultat.rows[0];
        
        // Mettre à jour le stock (réserver la quantité)
        await client.query(`
            UPDATE stocks_dechets 
            SET quantite_reservee = COALESCE(quantite_reservee, 0) + $1
            WHERE point_depot_id = $2 AND type_dechet = $3
        `, [quantiteArrondie, donnees.pointDepotId, donnees.typeDechet]);
        
        await client.query('COMMIT');
        return demande;
        
    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur dans creer demande:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}

    // Valider une demande (par superviseur)
    static async valider(id, superviseurId) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Récupérer la demande
            const demande = await client.query(`
                SELECT * FROM demandes_enlevement WHERE id = $1
            `, [id]);
            
            if (demande.rows.length === 0) {
                throw new Error('Demande non trouvée');
            }
            
            // Valider la demande
            const resultat = await client.query(`
                UPDATE demandes_enlevement 
                SET statut = 'validee',
                    valide_par = $1,
                    date_validation = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *
            `, [superviseurId, id]);
            
            // Transformer la réservation en consommation réelle
            await client.query(`
                UPDATE stocks_dechets 
                SET quantite_disponible = quantite_disponible - $1,
                    quantite_reservee = quantite_reservee - $1
                WHERE point_depot_id = $2 AND type_dechet = $3
            `, [
                demande.rows[0].quantite_demandee,
                demande.rows[0].point_depot_id,
                demande.rows[0].type_dechet
            ]);
            
            await client.query('COMMIT');
            return resultat.rows[0];
            
        } catch (erreur) {
            await client.query('ROLLBACK');
            console.error('❌ Erreur dans valider demande:', erreur);
            throw erreur;
        } finally {
            client.release();
        }
    }

    // Marquer comme réalisée (après enlèvement)
    static async marquerRealisee(id, quantiteReelle) {
        const requete = `
            UPDATE demandes_enlevement 
            SET statut = 'realisee',
                quantite_reelle = $1,
                date_realisation = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        const resultat = await pool.query(requete, [quantiteReelle, id]);
        return resultat.rows[0];
    }

    // Refuser une demande
    static async refuser(id, superviseurId, motif) {
        const requete = `
            UPDATE demandes_enlevement 
            SET statut = 'refusee',
                valide_par = $1,
                notes = COALESCE(notes, '') || '\nMotif refus: ' || $2
            WHERE id = $3
            RETURNING *
        `;
        const resultat = await pool.query(requete, [superviseurId, motif, id]);
        return resultat.rows[0];
    }

    // Lister les demandes d'un recycleur
    static async listerParRecycleur(recycleurId, statut = null, limite = null) {
        let requete = `
            SELECT de.*, 
                   pdv.nom as point_nom,
                   pdv.commune,
                   pdv.quartier,
                   pdv.adresse
            FROM demandes_enlevement de
            JOIN points_depot_volontaire pdv ON de.point_depot_id = pdv.id
            WHERE de.recycleur_id = $1
        `;
        const valeurs = [recycleurId];
        let index = 2;

        if (statut) {
            requete += ` AND de.statut = $${index++}`;
            valeurs.push(statut);
        }

        requete += ` ORDER BY de.cree_le DESC`;

        if (limite) {
            requete += ` LIMIT $${index}`;
            valeurs.push(limite);
        }

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows;
    }

    // Lister toutes les demandes (pour superviseur)
    static async listerTous(filtres = {}) {
        let requete = `
            SELECT de.*, 
                   pdv.nom as point_nom,
                   pdv.commune,
                   r.nom_entreprise as recycleur_nom,
                   r.email as recycleur_email
            FROM demandes_enlevement de
            JOIN points_depot_volontaire pdv ON de.point_depot_id = pdv.id
            JOIN recycleurs r ON de.recycleur_id = r.id
            WHERE 1=1
        `;
        const valeurs = [];
        let index = 1;

        if (filtres.statut) {
            requete += ` AND de.statut = $${index++}`;
            valeurs.push(filtres.statut);
        }

        if (filtres.pointDepotId) {
            requete += ` AND de.point_depot_id = $${index++}`;
            valeurs.push(filtres.pointDepotId);
        }

        requete += ` ORDER BY de.cree_le DESC`;

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows;
    }

    // Obtenir les statistiques des demandes
    static async getStatistiques(recycleurId) {
        const requete = `
            SELECT 
                COUNT(*) as total_demandes,
                COUNT(*) FILTER (WHERE statut = 'en_attente') as demandes_en_attente,
                COUNT(*) FILTER (WHERE statut = 'validee') as demandes_validees,
                COUNT(*) FILTER (WHERE statut = 'realisee') as demandes_realisees,
                COUNT(*) FILTER (WHERE statut = 'refusee') as demandes_refusees,
                COALESCE(SUM(quantite_demandee), 0) as total_kg_demandes,
                COALESCE(SUM(quantite_reelle), 0) as total_kg_realises
            FROM demandes_enlevement
            WHERE recycleur_id = $1
        `;
        const resultat = await pool.query(requete, [recycleurId]);
        return resultat.rows[0];
    }
}

export default DemandeEnlevement;