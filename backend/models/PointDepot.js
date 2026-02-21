import { pool } from '../config/database.js';

class PointDepot {
    // Récupérer tous les points de collecte actifs
    static async getAll() {
        const requete = `
            SELECT id, nom, adresse, quartier, commune, 
                   types_dechets_acceptes, horaires_ouverture
            FROM points_depot_volontaire
            WHERE est_actif = true
            ORDER BY nom
        `;
        const resultat = await pool.query(requete);
        return resultat.rows;
    }

    // Récupérer un point de collecte par son ID
    static async getById(id) {
        const requete = `
            SELECT * FROM points_depot_volontaire WHERE id = $1
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    // Créer un nouveau point de collecte
    static async create(donnees) {
        const requete = `
            INSERT INTO points_depot_volontaire (
                nom, adresse, quartier, commune, 
                types_dechets_acceptes, horaires_ouverture,
                localisation_gps, est_actif
            ) VALUES ($1, $2, $3, $4, $5, $6, 
                ST_SetSRID(ST_MakePoint($7, $8), 4326)::geography, 
                COALESCE($9, true))
            RETURNING id, nom, adresse, quartier, commune
        `;
        
        const resultat = await pool.query(requete, [
            donnees.nom,
            donnees.adresse,
            donnees.quartier,
            donnees.commune,
            donnees.types_dechets_acceptes || [],
            donnees.horaires_ouverture || null,
            donnees.longitude || 0,
            donnees.latitude || 0,
            donnees.est_actif
        ]);
        
        return resultat.rows[0];
    }

    // Mettre à jour un point de collecte
    static async update(id, donnees) {
        const champs = [];
        const valeurs = [];
        let index = 1;

        if (donnees.nom) {
            champs.push(`nom = $${index++}`);
            valeurs.push(donnees.nom);
        }
        if (donnees.adresse) {
            champs.push(`adresse = $${index++}`);
            valeurs.push(donnees.adresse);
        }
        if (donnees.quartier) {
            champs.push(`quartier = $${index++}`);
            valeurs.push(donnees.quartier);
        }
        if (donnees.commune) {
            champs.push(`commune = $${index++}`);
            valeurs.push(donnees.commune);
        }
        if (donnees.types_dechets_acceptes) {
            champs.push(`types_dechets_acceptes = $${index++}`);
            valeurs.push(donnees.types_dechets_acceptes);
        }
        if (donnees.horaires_ouverture) {
            champs.push(`horaires_ouverture = $${index++}`);
            valeurs.push(donnees.horaires_ouverture);
        }
        if (donnees.est_actif !== undefined) {
            champs.push(`est_actif = $${index++}`);
            valeurs.push(donnees.est_actif);
        }
        if (donnees.longitude && donnees.latitude) {
            champs.push(`localisation_gps = ST_SetSRID(ST_MakePoint($${index++}, $${index++}), 4326)::geography`);
            valeurs.push(donnees.longitude, donnees.latitude);
        }

        valeurs.push(id);
        const requete = `
            UPDATE points_depot_volontaire 
            SET ${champs.join(', ')}
            WHERE id = $${index}
            RETURNING id, nom, adresse
        `;

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows[0];
    }

    // Supprimer (désactiver) un point de collecte
    static async delete(id) {
        const requete = `
            UPDATE points_depot_volontaire 
            SET est_actif = false 
            WHERE id = $1
            RETURNING id
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }
}

export default PointDepot;