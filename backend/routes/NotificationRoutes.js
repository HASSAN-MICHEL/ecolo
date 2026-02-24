import express from 'express';
import NotificationController from '../controllers/NotificationController.js';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(AuthController.verifierToken);

// Récupérer les notifications de l'utilisateur connecté
router.get('/', NotificationController.getMyNotifications);

// Compter les notifications non lues
router.get('/non-lues', NotificationController.compterNonLues);

// Marquer toutes les notifications comme lues
router.put('/marquer-toutes-lues', NotificationController.marquerToutesLues);

// Marquer une notification comme lue
router.put('/:id/lire', NotificationController.marquerCommeLue);

// Supprimer une notification
router.delete('/:id', NotificationController.supprimerNotification);

export default router;