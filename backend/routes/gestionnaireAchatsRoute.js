// routes/gestionnaireAchatRoutes.js
import express from 'express';
import GestionnaireAchatController from '../controllers/GestionnaireAchatController.js';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Toutes les routes sont protégées
router.use(AuthController.verifierToken);

// 📦 Gestion des achats de déchets
router.post('/achats', GestionnaireAchatController.creerAchat);
router.get('/achats', GestionnaireAchatController.historiqueAchats);
router.get('/achats/statistiques', GestionnaireAchatController.statistiquesAchats);
router.get('/achats/:achatId/recu', GestionnaireAchatController.getRecuAchat);

// 📊 Gestion des stocks
router.get('/stocks', GestionnaireAchatController.stocks);
router.put('/stocks/ajuster', GestionnaireAchatController.ajusterStock);

// 📈 Tableau de bord enrichi
router.get('/tableau-bord-complet', GestionnaireAchatController.tableauBordComplet);

export default router;