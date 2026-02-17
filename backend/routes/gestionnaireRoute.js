

// import express from 'express';
// import GestionnaireController from '../controllers/GestionnaireController.js';
// import AuthController from '../controllers/AuthController.js';

// const router = express.Router();

// // ============================================
// // 1. D'ABORD les routes PUBLIQUES
// // ============================================
// console.log('🟢 Routes publiques gestionnaire...');
// router.post('/connexion', GestionnaireController.connexion);

// // ============================================
// // 2. ENSUITE le middleware de protection
// // ============================================
// console.log('🔒 Application du middleware de protection...');
// router.use(AuthController.verifierToken);

// // ============================================
// // 3. ENFIN les routes PROTÉGÉES
// // ============================================
// console.log('🔐 Routes protégées gestionnaire...');

// // Gestion des missions
// router.get('/missions/en-attente', GestionnaireController.missionsEnAttente);
// router.post('/missions/:missionId/valider', GestionnaireController.validerMission);
// router.put('/missions/:missionId/renseigner', GestionnaireController.renseignerMission);

// // Attribution des crédits
// //router.post('/collecteurs/:collecteurId/missions/:missionId/credits', GestionnaireController.attribuerCredits);
// // Sécurité
// router.put('/changer-mot-de-passe', GestionnaireController.modifierMotDePasse);

// // 📊 Tableau de bord
// router.get('/tableau-bord', GestionnaireController.tableauBord);

// // 📋 Gestion des missions
// router.get('/missions', GestionnaireController.missions);                 // Toutes les missions avec filtre optionnel
// router.get('/missions/en-attente', GestionnaireController.missionsEnAttente);
// router.get('/missions/validees', GestionnaireController.missionsValidees);
// router.get('/missions/:missionId', GestionnaireController.missionDetails);
// router.post('/missions/:missionId/valider', GestionnaireController.validerMission);

// // 💰 Attribution des crédits
// router.post('/collecteurs/:collecteurId/missions/:missionId/credits', GestionnaireController.attribuerCredits);




// export default router; 



import express from 'express';
import GestionnaireController from '../controllers/GestionnaireController.js';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Routes publiques
router.post('/connexion', GestionnaireController.connexion);

// Routes protégées
router.use(AuthController.verifierToken);

// 📊 Tableau de bord
router.get('/tableau-bord', GestionnaireController.tableauBord);

// 📋 Gestion des missions
router.get('/missions', GestionnaireController.missions);                 // Toutes les missions avec filtre optionnel
router.get('/missions/en-attente', GestionnaireController.missionsEnAttente);
router.get('/missions/validees', GestionnaireController.missionsValidees);
router.get('/missions/:missionId', GestionnaireController.missionDetails);
router.post('/missions/:missionId/valider', GestionnaireController.validerMission);

// 💰 Attribution des crédits
router.post('/collecteurs/:collecteurId/missions/:missionId/credits', GestionnaireController.attribuerCredits);

// 🔐 Sécurité
router.put('/changer-mot-de-passe', GestionnaireController.modifierMotDePasse);

export default router;