

// routes/sponsorRoute.js
import express from 'express';
import SponsorController from '../controllers/SponsorController.js';
import { uploadLogo } from '../middleware/uploads.js';
import AuthController from '../controllers/AuthController.js';
import AdminController  from '../controllers/AdminController.js';  

const router = express.Router();

// Routes publiques
router.get('/' , AdminController.listerSponsors);
router.post('/inscription', uploadLogo, SponsorController.inscription);
router.post('/connexion', SponsorController.connexion);

// Vérification token pour toutes les routes suivantes
router.use(AuthController.verifierToken);

// Vérification spécifique pour les sponsors
const verifierSponsor = (req, res, next) => {
    if (req.utilisateurType !== 'sponsor') {
        return res.status(403).json({ 
            success: false,
            message: 'Accès réservé aux sponsors' 
        });
    }
    next();
};

router.use(verifierSponsor);

// Profil
// router.get('/profil', SponsorController.getProfil); // ← Ajouté
router.put('/profil', uploadLogo, SponsorController.mettreAJourProfil);
router.get('/profil', SponsorController.getProfil);

// Campagnes (lecture seule)
router.get('/campagnes', SponsorController.mesCampagnes);
router.get('/campagnes/:campagneId', SponsorController.detailsCampagne);
router.get('/campagnes/:campagneId/rapport', SponsorController.rapportCampagne);
// router.get('/campagnes/:campagneId/export', SponsorController.exporterRapport); // ← Ajouté

// Tableau de bord
router.get('/tableau-bord', SponsorController.tableauBord);

export default router;