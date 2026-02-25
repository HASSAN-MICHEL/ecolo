

import express from 'express';
import CollecteurController from '../controllers/CollecteurController.js';

import { uploadCollecteurFiles, processUploads } from '../middleware/uploadToSupabase.js';
import  AuthCollecteur  from '../controllers/AuthController.js';

const router = express.Router();

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