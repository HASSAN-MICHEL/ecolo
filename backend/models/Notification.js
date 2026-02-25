

import { pool } from '../config/database.js';

class Notification {
    // Créer une notification
    static async creer(notificationData) {
        const requete = `
            INSERT INTO notifications (
                utilisateur_id, 
                type_utilisateur, 
                titre, 
                message, 
                type_notification,
                reference_id,
                reference_type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        
        const valeurs = [
            notificationData.utilisateur_id,
            notificationData.type_utilisateur,
            notificationData.titre,
            notificationData.message,
            notificationData.type_notification || 'info',
            notificationData.reference_id || null,
            notificationData.reference_type || null
        ];

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows[0];
    }

    // Récupérer les notifications d'un utilisateur
    static async getForUser(utilisateurId, type_utilisateur, options = {}) {
        let requete = `
            SELECT * FROM notifications 
            WHERE utilisateur_id = $1 AND type_utilisateur = $2
        `;
        
        const params = [utilisateurId, type_utilisateur];
        
        if (options.unreadOnly) {
            requete += ` AND est_lue = false`;
        }
        
        requete += ` ORDER BY cree_le DESC`;
        
        if (options.limit) {
            requete += ` LIMIT $3`;
            params.push(options.limit);
        }
        
        const resultat = await pool.query(requete, params);
        return resultat.rows;
    }

    // Marquer une notification comme lue
    static async marquerCommeLue(id, utilisateurId) {
        const requete = `
            UPDATE notifications 
            SET est_lue = true 
            WHERE id = $1 AND utilisateur_id = $2
            RETURNING *
        `;
        const resultat = await pool.query(requete, [id, utilisateurId]);
        return resultat.rows[0];
    }

    // Marquer toutes les notifications comme lues
    static async marquerToutesLues(utilisateurId, type_utilisateur) {
        const requete = `
            UPDATE notifications 
            SET est_lue = true 
            WHERE utilisateur_id = $1 AND type_utilisateur = $2 AND est_lue = false
            RETURNING *
        `;
        const resultat = await pool.query(requete, [utilisateurId, type_utilisateur]);
        return resultat.rows;
    }

    // Compter les notifications non lues
    static async compterNonLues(utilisateurId, type_utilisateur) {
        const requete = `
            SELECT COUNT(*) as count 
            FROM notifications 
            WHERE utilisateur_id = $1 AND type_utilisateur = $2 AND est_lue = false
        `;
        const resultat = await pool.query(requete, [utilisateurId, type_utilisateur]);
        return parseInt(resultat.rows[0].count);
    }

    // Supprimer une notification
    static async supprimer(id, utilisateurId) {
        const requete = `
            DELETE FROM notifications 
            WHERE id = $1 AND utilisateur_id = $2
            RETURNING id
        `;
        const resultat = await pool.query(requete, [id, utilisateurId]);
        return resultat.rows[0];
    }

    // Nettoyer les anciennes notifications (plus de 30 jours)
    static async nettoyerAnciennes() {
        const requete = `
            DELETE FROM notifications 
            WHERE cree_le < NOW() - INTERVAL '30 days'
            RETURNING id
        `;
        const resultat = await pool.query(requete);
        return resultat.rowCount;
    }
}

export default Notification;