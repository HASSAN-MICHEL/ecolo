

// import express from 'express';
// import SuperviseurController from '../controllers/SuperviseurController.js';
// import AuthController from '../controllers/AuthController.js';

// const router = express.Router();

// // Connexion
// router.post('/connexion', SuperviseurController.connexion);

// // Routes protégées
// //router.use(AuthController.verifierToken);

// // Gestion des collecteurs
// router.get('/collecteurs/en-attente', SuperviseurController.collecteursEnAttente);
// router.post('/collecteurs/:collecteurId/valider', SuperviseurController.validerCollecteur);
// router.post('/collecteurs/:collecteurId/suspendre', SuperviseurController.suspendreCollecteur);

// // Gestion des gestionnaires
// router.get('/gestionnaires', SuperviseurController.gestionnaires);
// router.post('/gestionnaires', SuperviseurController.creerGestionnaire);
// router.put('/gestionnaires/:gestionnaireId', SuperviseurController.modifierGestionnaire);

// // Gestion des missions
// router.post('/missions', SuperviseurController.creerMission);
// router.post('/missions/:missionId/attribuer/:collecteurId', SuperviseurController.attribuerMission);

// // Statistiques
// router.get('/statistiques', SuperviseurController.statistiques);

// export default router;



import express from 'express';
import SuperviseurController from '../controllers/SuperviseurController.js';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// ============================================
// 1. D'ABORD les routes PUBLIQUES
// ============================================
console.log('🟢 Routes publiques superviseur...');
router.post('/connexion', SuperviseurController.connexion);
// Ajoute d'autres routes publiques si nécessaire

// ============================================
// 2. ENSUITE le middleware de protection
// ============================================
console.log('🔒 Application du middleware de protection...');
router.use(AuthController.verifierToken);  // ✅ Maintenant c'est APRÈS les routes publiques

// ============================================
// 3. ENFIN les routes PROTÉGÉES
// ============================================
console.log('🔐 Routes protégées superviseur...');

// Gestion des collecteurs
router.get('/collecteurs/en-attente', SuperviseurController.collecteursEnAttente);
router.post('/collecteurs/:collecteurId/valider', SuperviseurController.validerCollecteur);
router.post('/collecteurs/:collecteurId/suspendre', SuperviseurController.suspendreCollecteur);

// Gestion des gestionnaires
router.get('/gestionnaires', SuperviseurController.gestionnaires);
router.post('/gestionnaires', SuperviseurController.creerGestionnaire);
router.put('/gestionnaires/:gestionnaireId', SuperviseurController.modifierGestionnaire);

// Gestion des missions
router.post('/missions', SuperviseurController.creerMission);
router.post('/missions/:missionId/attribuer/:collecteurId', SuperviseurController.attribuerMission);

// Statistiques
router.get('/statistiques', SuperviseurController.statistiques);

export default router;