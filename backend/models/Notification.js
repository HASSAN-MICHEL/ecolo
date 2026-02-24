// import { pool } from '../config/database.js';

// class Notification {
//     /**
//      * Créer une nouvelle notification
//      * @param {Object} donnees - Données de la notification
//      * @returns {Object} Notification créée
//      */
//     static async creer(donnees) {
//         const requete = `
//             INSERT INTO notifications (
//                 utilisateur_id, 
//                 type_utilisateur, 
//                 titre, 
//                 message, 
//                 type_notification,
//                 reference_id,
//                 reference_type
//             ) VALUES ($1, $2, $3, $4, $5, $6, $7)
//             RETURNING *
//         `;

//         const valeurs = [
//             donnees.utilisateurId,
//             donnees.typeUtilisateur,
//             donnees.titre,
//             donnees.message,
//             donnees.typeNotification,
//             donnees.referenceId || null,
//             donnees.referenceType || null
//         ];

//         const resultat = await pool.query(requete, valeurs);
//         return resultat.rows[0];
//     }

//     /**
//      * Créer une notification pour un nouveau collecteur en attente
//      * @param {string} collecteurNom - Nom du collecteur
//      * @returns {Object} Notification créée
//      */
//     static async nouveauCollecteurEnAttente(collecteurNom) {
//         return await this.creer({
//             utilisateurId: await this.getSuperviseurId(),
//             typeUtilisateur: 'superviseur',
//             titre: 'Nouveau collecteur en attente',
//             message: `${collecteurNom} a fait une demande d'inscription et attend votre validation.`,
//             typeNotification: 'info'
//         });
//     }

//     /**
//      * Créer une notification pour un collecteur validé
//      * @param {string} collecteurId - ID du collecteur
//      * @returns {Object} Notification créée
//      */
//     static async collecteurValide(collecteurId) {
//         return await this.creer({
//             utilisateurId: collecteurId,
//             typeUtilisateur: 'collecteur',
//             titre: 'Compte validé ✅',
//             message: 'Félicitations ! Votre compte a été validé. Vous pouvez maintenant recevoir des missions de collecte.',
//             typeNotification: 'succes'
//         });
//     }

//     /**
//      * Créer une notification pour une nouvelle mission disponible
//      * @param {string} collecteurId - ID du collecteur
//      * @param {string} missionId - ID de la mission
//      * @param {Object} details - Détails de la mission
//      * @returns {Object} Notification créée
//      */
//     static async nouvelleMissionDisponible(collecteurId, missionId, details) {
//         return await this.creer({
//             utilisateurId: collecteurId,
//             typeUtilisateur: 'collecteur',
//             titre: '🚚 Nouvelle mission disponible',
//             message: `Une nouvelle mission de collecte est disponible dans votre zone. Type: ${details.typeDechet}, Quantité: ${details.quantite} ${details.unite}`,
//             typeNotification: 'nouvelle_mission',
//             referenceId: missionId,
//             referenceType: 'mission'
//         });
//     }

//     /**
//      * Créer une notification pour une mission acceptée
//      * @param {string} collecteurId - ID du collecteur
//      * @param {string} missionId - ID de la mission
//      * @returns {Object} Notification créée
//      */
//     static async missionAcceptee(collecteurId, missionId) {
//         return await this.creer({
//             utilisateurId: collecteurId,
//             typeUtilisateur: 'collecteur',
//             titre: '✅ Mission acceptée',
//             message: 'Vous avez accepté la mission. Rendez-vous chez le producteur pour la collecte.',
//             typeNotification: 'mission_acceptee',
//             referenceId: missionId,
//             referenceType: 'mission'
//         });
//     }

//     /**
//      * Créer une notification pour une mission terminée (en attente de validation)
//      * @param {string} gestionnaireId - ID du gestionnaire
//      * @param {string} missionId - ID de la mission
//      * @param {string} collecteurNom - Nom du collecteur
//      * @returns {Object} Notification créée
//      */
//     static async missionEnAttenteValidation(gestionnaireId, missionId, collecteurNom) {
//         return await this.creer({
//             utilisateurId: gestionnaireId,
//             typeUtilisateur: 'gestionnaire',
//             titre: '⚖️ Mission en attente de validation',
//             message: `Le collecteur ${collecteurNom} a déposé des déchets. Veuillez procéder à la pesée et validation.`,
//             typeNotification: 'info',
//             referenceId: missionId,
//             referenceType: 'mission'
//         });
//     }

//     /**
//      * Créer une notification pour une mission validée
//      * @param {string} collecteurId - ID du collecteur
//      * @param {string} missionId - ID de la mission
//      * @param {number} poids - Poids collecté
//      * @param {number} gains - Gains obtenus
//      * @returns {Object} Notification créée
//      */
//     static async missionValidee(collecteurId, missionId, poids, gains) {
//         return await this.creer({
//             utilisateurId: collecteurId,
//             typeUtilisateur: 'collecteur',
//             titre: '🎉 Mission validée !',
//             message: `Félicitations ! Votre collecte de ${poids} kg a été validée. Vous avez gagné ${gains} FCFA.`,
//             typeNotification: 'validation_collecte',
//             referenceId: missionId,
//             referenceType: 'mission'
//         });
//     }

//     /**
//      * Créer une notification pour un paiement reçu
//      * @param {string} collecteurId - ID du collecteur
//      * @param {number} montant - Montant reçu
//      * @param {string} gainId - ID du gain
//      * @returns {Object} Notification créée
//      */
//     static async paiementRecu(collecteurId, montant, gainId) {
//         return await this.creer({
//             utilisateurId: collecteurId,
//             typeUtilisateur: 'collecteur',
//             titre: '💰 Paiement reçu',
//             message: `Vous avez reçu un paiement de ${montant} FCFA pour vos collectes.`,
//             typeNotification: 'paiement_recu',
//             referenceId: gainId,
//             referenceType: 'gain'
//         });
//     }

//     /**
//      * Créer une notification pour un compte créé (gestionnaire)
//      * @param {string} gestionnaireId - ID du gestionnaire
//      * @param {string} creePar - Nom du superviseur
//      * @returns {Object} Notification créée
//      */
//     static async compteGestionnaireCree(gestionnaireId, creePar) {
//         return await this.creer({
//             utilisateurId: gestionnaireId,
//             typeUtilisateur: 'gestionnaire',
//             titre: '🔐 Compte créé',
//             message: `Votre compte gestionnaire a été créé par ${creePar}. Vous pouvez maintenant vous connecter.`,
//             typeNotification: 'succes'
//         });
//     }

//     /**
//      * Créer une notification pour un compte suspendu
//      * @param {string} utilisateurId - ID de l'utilisateur
//      * @param {string} typeUtilisateur - Type d'utilisateur
//      * @param {string} raison - Raison de la suspension
//      * @returns {Object} Notification créée
//      */
//     static async compteSuspendu(utilisateurId, typeUtilisateur, raison) {
//         return await this.creer({
//             utilisateurId: utilisateurId,
//             typeUtilisateur: typeUtilisateur,
//             titre: '⚠️ Compte suspendu',
//             message: `Votre compte a été suspendu. Raison: ${raison}. Contactez le support pour plus d'informations.`,
//             typeNotification: 'alerte'
//         });
//     }

//     /**
//      * Récupérer les notifications d'un utilisateur
//      * @param {string} utilisateurId - ID de l'utilisateur
//      * @param {string} typeUtilisateur - Type d'utilisateur
//      * @param {Object} options - Options de filtrage
//      * @returns {Array} Liste des notifications
//      */
//     static async getNotifications(utilisateurId, typeUtilisateur, options = {}) {
//         let requete = `
//             SELECT * FROM notifications 
//             WHERE utilisateur_id = $1 
//             AND type_utilisateur = $2
//         `;
        
//         const params = [utilisateurId, typeUtilisateur];
//         let paramIndex = 3;

//         if (options.nonLuesSeulement) {
//             requete += ` AND est_lue = false`;
//         }

//         if (options.type) {
//             requete += ` AND type_notification = $${paramIndex}`;
//             params.push(options.type);
//             paramIndex++;
//         }

//         requete += ` ORDER BY cree_le DESC`;

//         if (options.limite) {
//             requete += ` LIMIT $${paramIndex}`;
//             params.push(options.limite);
//         }

//         const resultat = await pool.query(requete, params);
//         return resultat.rows;
//     }

//     /**
//      * Marquer une notification comme lue
//      * @param {string} notificationId - ID de la notification
//      * @returns {Object} Notification mise à jour
//      */
//     static async marquerCommeLue(notificationId) {
//         const requete = `
//             UPDATE notifications 
//             SET est_lue = true 
//             WHERE id = $1
//             RETURNING *
//         `;
//         const resultat = await pool.query(requete, [notificationId]);
//         return resultat.rows[0];
//     }

//     /**
//      * Marquer toutes les notifications d'un utilisateur comme lues
//      * @param {string} utilisateurId - ID de l'utilisateur
//      * @param {string} typeUtilisateur - Type d'utilisateur
//      * @returns {number} Nombre de notifications mises à jour
//      */
//     static async toutMarquerCommeLu(utilisateurId, typeUtilisateur) {
//         const requete = `
//             UPDATE notifications 
//             SET est_lue = true 
//             WHERE utilisateur_id = $1 
//             AND type_utilisateur = $2 
//             AND est_lue = false
//             RETURNING id
//         `;
//         const resultat = await pool.query(requete, [utilisateurId, typeUtilisateur]);
//         return resultat.rowCount;
//     }

//     /**
//      * Compter les notifications non lues d'un utilisateur
//      * @param {string} utilisateurId - ID de l'utilisateur
//      * @param {string} typeUtilisateur - Type d'utilisateur
//      * @returns {number} Nombre de notifications non lues
//      */
//     static async compterNonLues(utilisateurId, typeUtilisateur) {
//         const requete = `
//             SELECT COUNT(*) as total 
//             FROM notifications 
//             WHERE utilisateur_id = $1 
//             AND type_utilisateur = $2 
//             AND est_lue = false
//         `;
//         const resultat = await pool.query(requete, [utilisateurId, typeUtilisateur]);
//         return parseInt(resultat.rows[0].total);
//     }

//     /**
//      * Supprimer les anciennes notifications (plus de 30 jours)
//      * @returns {number} Nombre de notifications supprimées
//      */
//     static async nettoyerAnciennes() {
//         const requete = `
//             DELETE FROM notifications 
//             WHERE cree_le < CURRENT_DATE - INTERVAL '30 days'
//             RETURNING id
//         `;
//         const resultat = await pool.query(requete);
//         return resultat.rowCount;
//     }

//     /**
//      * Récupérer l'ID du premier superviseur (utilitaire)
//      * @returns {string} ID du superviseur
//      */
//     static async getSuperviseurId() {
//         const requete = 'SELECT id FROM superviseurs LIMIT 1';
//         const resultat = await pool.query(requete);
//         return resultat.rows[0]?.id;
//     }

//     /**
//      * Envoyer une notification à tous les collecteurs d'une zone
//      * @param {Object} zone - Zone géographique
//      * @param {Object} notification - Données de la notification
//      * @returns {Array} Notifications créées
//      */
//     static async notifierZone(zone, notification) {
//         const requete = `
//             INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification, reference_id, reference_type)
//             SELECT id, 'collecteur', $1, $2, $3, $4, $5
//             FROM collecteurs
//             WHERE ST_Intersects(zone_intervention, ST_GeomFromGeoJSON($6))
//             AND statut = 'actif'
//             RETURNING *
//         `;

//         const resultat = await pool.query(requete, [
//             notification.titre,
//             notification.message,
//             notification.typeNotification,
//             notification.referenceId,
//             notification.referenceType,
//             JSON.stringify(zone)
//         ]);

//         return resultat.rows;
//     }

//     /**
//      * Formater une notification pour l'affichage
//      * @param {Object} notification - Notification brute
//      * @returns {Object} Notification formatée
//      */
//     static formater(notification) {
//         const maintenant = new Date();
//         const creeLe = new Date(notification.cree_le);
//         const diffMs = maintenant - creeLe;
//         const diffMins = Math.floor(diffMs / 60000);
//         const diffHours = Math.floor(diffMins / 60);
//         const diffDays = Math.floor(diffHours / 24);

//         let tempsEcoule;
//         if (diffDays > 0) {
//             tempsEcoule = `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
//         } else if (diffHours > 0) {
//             tempsEcoule = `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
//         } else if (diffMins > 0) {
//             tempsEcoule = `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
//         } else {
//             tempsEcoule = 'À l\'instant';
//         }

//         const icones = {
//             'info': 'ℹ️',
//             'succes': '✅',
//             'alerte': '⚠️',
//             'nouvelle_mission': '🚚',
//             'mission_acceptee': '👍',
//             'mission_terminee': '🏁',
//             'validation_collecte': '⚖️',
//             'paiement_recu': '💰',
//             'compte_valide': '🔓'
//         };

//         return {
//             ...notification,
//             tempsEcoule,
//             icone: icones[notification.type_notification] || '📋',
//             estRecent: diffHours < 24
//         };
//     }
// }

// export default Notification;




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