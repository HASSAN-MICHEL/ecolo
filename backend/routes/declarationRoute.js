import express from 'express';
import AuthController from '../controllers/authController.js';
import DeclarationController from '../controllers/declarationController.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(AuthController.verifierToken);

// Déclarations de déchets
router.post('/declarations', DeclarationController.creerDeclaration);
router.get('/declarations', DeclarationController.obtenirDeclarations);
router.get('/declarations/:id', DeclarationController.obtenirDeclaration);
router.get('/declarations/:id/suivre', DeclarationController.suivreDeclaration);

// Historique
router.get('/historique', DeclarationController.obtenirHistorique);

// Points de dépôt volontaire
router.get('/points-depot', DeclarationController.obtenirPointsDepot);

export default router;