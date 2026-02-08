import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

// Inscription
router.post('/inscription', AuthController.inscrire);

// Connexion
router.post('/connexion', AuthController.connecter);

// Réinitialisation de mot de passe
router.post('/demande-reinitialisation-mdp', AuthController.demanderReinitialisationMdp);
router.post('/reinitialiser-mdp', AuthController.reinitialiserMdp);

// Vérifier token (route test)
router.get('/verifier-token', AuthController.verifierToken, (req, res) => {
    res.json({ 
        message: 'Token valide',
        producteurId: req.producteurId 
    });
});

export default router;