// routes/producteurPremiumRoutes.js
import express from 'express';
import ProducteurPremiumController from '../controllers/ProducteurPremiumController.js';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(AuthController.verifierToken);

// Routes pour les producteurs
router.post('/souscrire', ProducteurPremiumController.souscrire);
router.get('/mon-abonnement', ProducteurPremiumController.monAbonnement);
router.put('/renouveler/:abonnementId', ProducteurPremiumController.renouveler);
router.delete('/resilier/:abonnementId', ProducteurPremiumController.resilier);

// Routes pour admin (à protéger avec middleware admin)
router.get('/admin/abonnements', ProducteurPremiumController.listerAbonnements);

export default router;