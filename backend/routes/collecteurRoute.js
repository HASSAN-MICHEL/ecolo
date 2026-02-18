

// import express from 'express';
// import CollecteurController from '../controllers/collecteurController.js';
// import AuthController from '../controllers/AuthController.js';
// import { validerInscriptionCollecteur } from '../middleware/validation.js';

// const router = express.Router();

// console.log('🟢 Configuration des routes publiques collecteur...');

// // ✅ DÉCOMMENTE CETTE LIGNE
// router.post('/connexion', CollecteurController.connexion);
// router.post('/inscription', validerInscriptionCollecteur, CollecteurController.inscription);
// router.get('/test-public', (req, res) => {
//     res.json({ message: 'Route publique OK' });
// });

// // ============================================
// // 2. ENSUITE le middleware de vérification
// // ============================================
// console.log('🔒 Application du middleware de protection...');
// // ✅ DÉCOMMENTE CETTE LIGNE
// router.use(AuthController.verifierToken);

// // ============================================
// // 3. ENFIN les routes PROTÉGÉES
// // ============================================
// console.log('🔐 Configuration des routes protégées collecteur...');


// router.get('/profil', CollecteurController.monProfil);
// router.put('/profil/infos', CollecteurController.mettreAJourInfosPersonnelles);
// router.put('/profil/mot-de-passe', CollecteurController.changerMotDePasse);



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
import CollecteurController from '../controllers/CollecteurController.js';
 import { uploadCollecteurFiles } from '../middleware/uploads.js';
import { uploadCollecteurFiles, processUploads } from '../middleware/uploadToSupabase.js';
import  AuthCollecteur  from '../controllers/AuthController.js';

const router = express.Router();

// Route d'inscription avec upload de fichiers
// router.post('/inscription', uploadCollecteurFiles, CollecteurController.inscription);

router.post('/inscription', 
    uploadCollecteurFiles,    // Multer en mémoire
    processUploads,           // Upload vers Supabase
    CollecteurController.inscription
);

// Connexion (pas d'upload)
router.post('/connexion', CollecteurController.connexion);

// Routes protégées
router.use(AuthCollecteur.verifierToken);

router.get('/profil', CollecteurController.monProfil);
router.put('/profil/infos', CollecteurController.mettreAJourInfosPersonnelles);
router.put('/profil/mot-de-passe', CollecteurController.changerMotDePasse);
router.get('/missions', CollecteurController.mesMissions);
router.get('/gains', CollecteurController.mesGains);
router.get('/tableau-bord', CollecteurController.tableauBord);
router.get('/missions/disponibles', CollecteurController.missionsDisponibles);
router.post('/missions/:missionId/accepter', CollecteurController.accepterMission);
router.post('/missions/:missionId/demarrer', CollecteurController.demarrerCollecte);
router.post('/missions/:missionId/terminer', CollecteurController.terminerCollecte);
router.post('/missions/:missionId/depot', CollecteurController.choisirPointDepot);
router.post('/missions/:missionId/photo', CollecteurController.ajouterPhoto);

export default router;