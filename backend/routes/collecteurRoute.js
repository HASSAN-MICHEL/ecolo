
// // collecteurRoute.js - Vérifiez que c'est EXACTEMENT comme ça
// import express from 'express';
// import CollecteurController from '../controllers/collecteurController.js';
// import AuthController from '../controllers/AuthController.js';
// import { validerInscriptionCollecteur } from '../middleware/validation.js';

// const router = express.Router();


// console.log('🟢 Configuration des routes publiques collecteur...');

// router.post('/inscription', validerInscriptionCollecteur, CollecteurController.inscription);
// //router.post('/connexion', CollecteurController.connexion);

// router.get('/test-public', (req, res) => {
//     res.json({ message: 'Route publique OK' });
// });

// // ============================================
// // 2. ENSUITE le middleware de vérification
// // ============================================
// console.log('🔒 Application du middleware de protection...');
// //router.use(AuthController.verifierToken);

// // ============================================
// // 3. ENFIN les routes PROTÉGÉES
// // ============================================
// console.log('🔐 Configuration des routes protégées collecteur...');

// router.get('/missions/disponibles', CollecteurController.missionsDisponibles);
// router.get('/missions', CollecteurController.mesMissions);
// router.post('/missions/:missionId/accepter', CollecteurController.accepterMission);
// router.post('/missions/:missionId/demarrer', CollecteurController.demarrerCollecte);
// router.post('/missions/:missionId/terminer', CollecteurController.terminerCollecte);
// router.post('/missions/:missionId/depot', CollecteurController.choisirPointDepot);
// router.post('/missions/:missionId/photos', CollecteurController.ajouterPhoto);
// router.get('/gains', CollecteurController.mesGains);
// router.get('/tableau-bord', CollecteurController.tableauBord);
// router.put('/profil', CollecteurController.modifierProfil);

// export default router;


import express from 'express';
import CollecteurController from '../controllers/collecteurController.js';
import AuthController from '../controllers/AuthController.js';
import { validerInscriptionCollecteur } from '../middleware/validation.js';

const router = express.Router();

console.log('🟢 Configuration des routes publiques collecteur...');

// ✅ DÉCOMMENTE CETTE LIGNE
router.post('/connexion', CollecteurController.connexion);
router.post('/inscription', validerInscriptionCollecteur, CollecteurController.inscription);
router.get('/test-public', (req, res) => {
    res.json({ message: 'Route publique OK' });
});

// ============================================
// 2. ENSUITE le middleware de vérification
// ============================================
console.log('🔒 Application du middleware de protection...');
// ✅ DÉCOMMENTE CETTE LIGNE
router.use(AuthController.verifierToken);

// ============================================
// 3. ENFIN les routes PROTÉGÉES
// ============================================
console.log('🔐 Configuration des routes protégées collecteur...');

router.get('/missions/disponibles', CollecteurController.missionsDisponibles);
router.get('/missions', CollecteurController.mesMissions);
router.post('/missions/:missionId/accepter', CollecteurController.accepterMission);
router.post('/missions/:missionId/demarrer', CollecteurController.demarrerCollecte);
router.post('/missions/:missionId/terminer', CollecteurController.terminerCollecte);
router.post('/missions/:missionId/depot', CollecteurController.choisirPointDepot);
router.post('/missions/:missionId/photos', CollecteurController.ajouterPhoto);
router.get('/gains', CollecteurController.mesGains);
router.get('/tableau-bord', CollecteurController.tableauBord);
router.put('/profil', CollecteurController.modifierProfil);

export default router;