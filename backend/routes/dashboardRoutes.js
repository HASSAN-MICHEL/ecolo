import express from 'express';
// import AuthController from '../controllers/AuthController.js';
import AuthController from '../controllers/AuthController.js'; // ✅ Correct (A majuscule)
import DashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(AuthController.verifierToken);

// Tableau de bord
router.get('/dashboard', DashboardController.obtenirDashboard);
router.get('/dashboard/notifications', DashboardController.obtenirNotifications);
router.get('/dashboard/historique', DashboardController.obtenirHistoriqueDashboard);

export default router;