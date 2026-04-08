import Notification from '../models/Notification.js';
import { pool } from '../config/database.js';


class NotificationController {
    // Récupérer les notifications de l'utilisateur connecté
    static async getMyNotifications(req, res) {
        try {
            const utilisateurId = req.utilisateurId;
            const type_utilisateur = req.utilisateurType;
            const { limit = 50, unreadOnly = false } = req.query;

            const notifications = await Notification.getForUser(
                utilisateurId, 
                type_utilisateur, 
                { 
                    limit: parseInt(limit), 
                    unreadOnly: unreadOnly === 'true' 
                }
            );

            // Compter les non lues
            const nonLues = await Notification.compterNonLues(utilisateurId, type_utilisateur);

            res.json({
                success: true,
                notifications,
                nonLues,
                total: notifications.length
            });
        } catch (erreur) {
            console.error('❌ Erreur récupération notifications:', erreur);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors de la récupération des notifications' 
            });
        }
    }

    // Marquer une notification comme lue
    static async marquerCommeLue(req, res) {
        try {
            const { id } = req.params;
            const utilisateurId = req.utilisateurId;

            const notification = await Notification.marquerCommeLue(id, utilisateurId);

            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification non trouvée'
                });
            }

            res.json({
                success: true,
                message: 'Notification marquée comme lue',
                notification
            });
        } catch (erreur) {
            console.error('❌ Erreur marquage notification:', erreur);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors du marquage de la notification' 
            });
        }
    }

    // Marquer toutes les notifications comme lues
    static async marquerToutesLues(req, res) {
        try {
            const utilisateurId = req.utilisateurId;
            const type_utilisateur = req.utilisateurType;

            const notifications = await Notification.marquerToutesLues(utilisateurId, type_utilisateur);

            res.json({
                success: true,
                message: 'Toutes les notifications ont été marquées comme lues',
                count: notifications.length
            });
        } catch (erreur) {
            console.error('❌ Erreur marquage toutes notifications:', erreur);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors du marquage des notifications' 
            });
        }
    }

    // Supprimer une notification
    static async supprimerNotification(req, res) {
        try {
            const { id } = req.params;
            const utilisateurId = req.utilisateurId;

            const notification = await Notification.supprimer(id, utilisateurId);

            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification non trouvée'
                });
            }

            res.json({
                success: true,
                message: 'Notification supprimée avec succès'
            });
        } catch (erreur) {
            console.error('❌ Erreur suppression notification:', erreur);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors de la suppression de la notification' 
            });
        }
    }

    // Compter les notifications non lues
    static async compterNonLues(req, res) {
        try {
            const utilisateurId = req.utilisateurId;
            const type_utilisateur = req.utilisateurType;

            const count = await Notification.compterNonLues(utilisateurId, type_utilisateur);

            res.json({
                success: true,
                count
            });
        } catch (erreur) {
            console.error('❌ Erreur comptage notifications:', erreur);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors du comptage des notifications' 
            });
        }
    }
}

export default NotificationController;