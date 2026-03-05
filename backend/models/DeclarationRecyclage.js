// models/DeclarationRecyclage.js
import { pool } from '../config/database.js';

class DeclarationRecyclage {
    // Créer une déclaration de recyclage
    static async creer(donnees) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            const requete = `
                INSERT INTO declarations_recyclage (
                    recycleur_id,
                    demande_enlevement_id,
                    type_dechet,
                    quantite_recyclee,
                    date_recyclage,
                    certificat_url,
                    statut
                ) VALUES ($1, $2, $3, $4, $5, $6, 'en_attente')
                RETURNING *
            `;
            
            const valeurs = [
                donnees.recycleurId,
                donnees.demandeId || null,
                donnees.typeDechet,
                donnees.quantite,
                donnees.dateRecyclage || new Date(),
                donnees.certificatUrl || null
            ];
            
            const resultat = await client.query(requete, valeurs);
            const declaration = resultat.rows[0];
            
            // Si liée à une demande, la marquer comme réalisée
            if (donnees.demandeId) {
                await client.query(`
                    UPDATE demandes_enlevement 
                    SET statut = 'realisee',
                        quantite_reelle = $1,
                        date_realisation = CURRENT_TIMESTAMP
                    WHERE id = $2
                `, [donnees.quantite, donnees.demandeId]);
            }
            
            await client.query('COMMIT');
            return declaration;
            
        } catch (erreur) {
            await client.query('ROLLBACK');
            console.error('❌ Erreur dans creer declaration:', erreur);
            throw erreur;
        } finally {
            client.release();
        }
    }

    // Valider une déclaration (par superviseur)
    static async valider(id, superviseurId) {
        const requete = `
            UPDATE declarations_recyclage 
            SET statut = 'validee',
                valide_par = $1,
                date_validation = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        const resultat = await pool.query(requete, [superviseurId, id]);
        return resultat.rows[0];
    }

    // Lister les déclarations d'un recycleur
    static async listerParRecycleur(recycleurId, statut = null, limite = null) {
        let requete = `
            SELECT dr.*, 
                   de.point_depot_id,
                   pdv.nom as point_nom
            FROM declarations_recyclage dr
            LEFT JOIN demandes_enlevement de ON dr.demande_enlevement_id = de.id
            LEFT JOIN points_depot_volontaire pdv ON de.point_depot_id = pdv.id
            WHERE dr.recycleur_id = $1
        `;
        const valeurs = [recycleurId];
        let index = 2;

        if (statut) {
            requete += ` AND dr.statut = $${index++}`;
            valeurs.push(statut);
        }

        requete += ` ORDER BY dr.date_recyclage DESC`;

        if (limite) {
            requete += ` LIMIT $${index}`;
            valeurs.push(limite);
        }

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows;
    }

    // Obtenir les statistiques de recyclage
    static async getStatistiques(recycleurId, annee = null) {
        let requete = `
            SELECT 
                COUNT(*) as total_declarations,
                COALESCE(SUM(quantite_recyclee), 0) as total_kg_recycles,
                COUNT(*) FILTER (WHERE statut = 'validee') as declarations_validees,
                COUNT(*) FILTER (WHERE statut = 'en_attente') as declarations_en_attente,
                EXTRACT(YEAR FROM date_recyclage) as annee
            FROM declarations_recyclage
            WHERE recycleur_id = $1
        `;
        const valeurs = [recycleurId];

        if (annee) {
            requete += ` AND EXTRACT(YEAR FROM date_recyclage) = $2`;
            valeurs.push(annee);
        }

        requete += ` GROUP BY EXTRACT(YEAR FROM date_recyclage) ORDER BY annee DESC`;

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows;
    }
}

export default DeclarationRecyclage;