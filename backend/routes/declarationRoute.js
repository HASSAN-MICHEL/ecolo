

import express from 'express';
import AuthController from '../controllers/AuthController.js';
import DeclarationController from '../controllers/declarationController.js';

const router = express.Router();

// Middleware de compatibilité
const compatibiliteProducteur = (req, res, next) => {
    // Si AuthController a mis utilisateurId, on le copie aussi dans producteurId
    if (req.utilisateurId && !req.producteurId) {
        req.producteurId = req.utilisateurId;
    }
    next();
};

// Toutes les routes nécessitent une authentification
router.use(AuthController.verifierToken);
router.use(compatibiliteProducteur); // Ajoute la compatibilité

// Déclarations de déchets
router.post('/declarations', DeclarationController.creerDeclaration);
router.get('/declarations', DeclarationController.obtenirDeclarations);
router.get('/declarations/:id', DeclarationController.obtenirDeclaration);
router.get('/declarations/:id/suivre', DeclarationController.suivreDeclaration);

router.post('/auth/declaration-annexe', DeclarationController.creerDeclarationAnnexe);

// Historique
router.get('/historique', DeclarationController.obtenirHistorique);

// Points de dépôt volontaire
router.get('/points-depot', DeclarationController.obtenirPointsDepot);

export default router;