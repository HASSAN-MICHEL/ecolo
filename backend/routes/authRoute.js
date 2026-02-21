import express from 'express';
import AuthController from '../controllers/AuthController.js';

 import ProdutionController from '../controllers/ProdutionController.js';

const router = express.Router();

// Inscription
router.post('/inscription', ProdutionController.inscrire);

// Connexion

router.post('/demande-reinitialisation-mdp', AuthController.demanderReinitialisationMdp);
router.post('/verifier-code-reinitialisation', AuthController.verifierCodeReinitialisation);
router.post('/reinitialiser-mdp-code', AuthController.reinitialiserMdpAvecCode);


router.post('/connexion', AuthController.connecterProducteur);
// Réinitialisation de mot de passe
//router.post('/demande-reinitialisation-mdp', AuthController.demanderReinitialisationMdp);
router.post('/reinitialiser-mdp', AuthController.reinitialiserMdp);

// Vérifier token (route test)
router.get('/verifier-token', AuthController.verifierToken, (req, res) => {
    res.json({ 
        message: 'Token valide',
        producteurId: req.producteurId 
    });
});

export default router;


// import express from 'express';
// import AuthController from '../controllers/authController.js';

// const router = express.Router();

// // Inscription - Utilisez les méthodes spécifiques ou ajoutez une méthode générique
// // Option 1: Utiliser les routes spécifiques
// router.post('/inscription/producteur', AuthController.inscrireProducteur);
// router.post('/inscription/collecteur', AuthController.inscrireCollecteur);

// // Option 2: Ou créez une route unique qui détecte le type d'utilisateur
// // router.post('/inscription', AuthController.inscrire);

// // Connexion (gère tous les types d'utilisateurs)
// router.post('/connexion', AuthController.connecter);

// // Réinitialisation de mot de passe
// router.post('/demande-reinitialisation-mdp', AuthController.demanderReinitialisationMdp);
// router.post('/reinitialiser-mdp', AuthController.reinitialiserMdp);

// // Vérifier token (route test)
// router.get('/verifier-token', AuthController.verifierToken, (req, res) => {
//     res.json({ 
//         success: true,
//         message: 'Token valide',
//         utilisateurId: req.utilisateurId,
//         utilisateurType: req.utilisateurType
//     });
// });

// // Route de rafraîchissement de token
// router.post('/rafraichir-token', AuthController.rafraichirToken);

// // Déconnexion
// router.post('/deconnexion', AuthController.deconnecter);

// export default router;



