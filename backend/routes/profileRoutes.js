import express from 'express';
import AuthController from '../controllers/AuthController.js';
import ProfileController from '../controllers/profileController.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(AuthController.verifierToken);

// Routes de profil
router.get('/profil', ProfileController.obtenirProfil);
router.put('/profil', ProfileController.mettreAJourProfil);
router.post('/changer-mot-de-passe', ProfileController.changerMotDePasse);

export default router;