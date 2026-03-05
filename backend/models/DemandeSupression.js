import { pool } from '../config/database.js';

class DemandeSuppression {
    static async creer(donnees) {
        const requete = `
            INSERT INTO demandes_suppression (
                superviseur_id, type_entite, entite_id, raison, statut
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const resultat = await pool.query(requete, [
            donnees.superviseurId,
            donnees.typeEntite,
            donnees.entiteId,
            donnees.raison,
            donnees.statut || 'en_attente'
        ]);
        return resultat.rows[0];
    }

    static async lister(filtres = {}) {
        let requete = `
            SELECT d.*, s.nom_complet as superviseur_nom,
                   CASE 
                       WHEN d.type_entite = 'gestionnaire' THEN (SELECT nom_complet FROM gestionnaires_points WHERE id = d.entite_id::uuid)
                       WHEN d.type_entite = 'point_collecte' THEN (SELECT nom FROM points_depot_volontaire WHERE id = d.entite_id::uuid)
                       WHEN d.type_entite = 'promoteur' THEN (
                           SELECT COALESCE(s.nom_organisation, o.nom_ong)
                           FROM (
                               SELECT id, nom_organisation FROM sponsors WHERE id = d.entite_id::uuid
                               UNION ALL
                               SELECT id, nom_ong FROM ongs WHERE id = d.entite_id::uuid
                           ) s
                       )
                       ELSE 'Inconnu'
                   END as entite_nom
            FROM demandes_suppression d
            JOIN superviseurs s ON d.superviseur_id = s.id
            WHERE 1=1
        `;
        const valeurs = [];

        if (filtres.statut) {
            requete += ` AND d.statut = $${valeurs.length + 1}`;
            valeurs.push(filtres.statut);
        }
        if (filtres.superviseurId) {
            requete += ` AND d.superviseur_id = $${valeurs.length + 1}`;
            valeurs.push(filtres.superviseurId);
        }

        requete += ' ORDER BY d.cree_le DESC';
        
        const resultat = await pool.query(requete, valeurs);
        return resultat.rows;
    }

    static async trouverParId(id) {
        const requete = `
            SELECT d.*, s.nom_complet as superviseur_nom
            FROM demandes_suppression d
            JOIN superviseurs s ON d.superviseur_id = s.id
            WHERE d.id = $1
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    static async traiter(id, statut, traiteePar, notes) {
        const demande = await this.trouverParId(id);
        if (!demande) return null;

        // Si approuvée, supprimer l'entité
        if (statut === 'approuvee') {
            let table;
            switch(demande.type_entite) {
                case 'gestionnaire':
                    table = 'gestionnaires_points';
                    break;
                case 'point_collecte':
                    table = 'points_depot_volontaire';
                    break;
                case 'promoteur':
                    // Chercher dans sponsors et ongs
                    const sponsor = await pool.query('SELECT id FROM sponsors WHERE id = $1', [demande.entite_id]);
                    if (sponsor.rows.length > 0) {
                        table = 'sponsors';
                    } else {
                        table = 'ongs';
                    }
                    break;
                default:
                    throw new Error('Type d\'entité non supporté');
            }
            
            await pool.query(`DELETE FROM ${table} WHERE id = $1`, [demande.entite_id]);
        }

        const requete = `
            UPDATE demandes_suppression 
            SET statut = $1, traitee_par = $2, traitee_le = CURRENT_TIMESTAMP, notes_traitement = $3
            WHERE id = $4
            RETURNING *
        `;
        const resultat = await pool.query(requete, [statut, traiteePar, notes, id]);
        return resultat.rows[0];
    }

    static async getStats() {
        const requete = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE statut = 'en_attente') as en_attente,
                COUNT(*) FILTER (WHERE statut = 'approuvee') as approuvees,
                COUNT(*) FILTER (WHERE statut = 'rejetee') as rejetees
            FROM demandes_suppression
        `;
        const resultat = await pool.query(requete);
        return resultat.rows[0];
    }
}

export default DemandeSuppression;