

// // routes/ongRoute.js
// import express from 'express';
// import OngController from '../controllers/OngController.js';
// import AuthController from '../controllers/authController.js';
// import { uploadLogo, uploadRapport } from '../middleware/uploads.js';   
// import AdminController  from '../controllers/AdminController.js';  

// const router = express.Router();

// // Routes publiques
// router.get('/' , AdminController.listerOngs);
// router.post('/inscription', uploadLogo, OngController.inscription);
// router.post('/connexion', OngController.connexion);

// // Vérification token pour toutes les routes suivantes
// router.use(AuthController.verifierToken);

// // Vérification spécifique pour les ONG
// const verifierOng = (req, res, next) => {
//     if (req.utilisateurType !== 'ong') {
//         return res.status(403).json({ 
//             success: false,
//             message: 'Accès réservé aux organisations non gouvernementales' 
//         });
//     }
//     next();
// };

// router.use(verifierOng);

// // Profil
// // // router.get('/profil', OngController.getProfil); // ← Ajouté
// // router.put('/profil', uploadLogo, OngController.mettreAJourProfil);

// // Consultation (lecture seule)
// router.get('/indicateurs', OngController.consulterIndicateurs);
// router.get('/campagnes', OngController.consulterCampagnes);
// // router.get('/campagnes/:campagneId', OngController.detailsCampagne); // ← Ajouté

// // Rapports
// router.post('/rapports', uploadRapport, OngController.deposerRapport);
// router.get('/rapports', OngController.mesRapports);
// // router.get('/rapports/:rapportId', OngController.detailsRapport); // ← Ajouté

// // Participations aux campagnes
// router.post('/campagnes/participer', OngController.participerCampagne);
// router.get('/participations', OngController.mesParticipations);

// // Tableau de bord
// router.get('/tableau-bord', OngController.tableauBord);

// export default router;


// routes/ongRoutes.js
import express from 'express';
import OngController from '../controllers/OngController.js';
import AuthController from '../controllers/AuthController.js';
import { uploadLogo, uploadRapport } from '../middleware/uploads.js';   

const router = express.Router();

// Routes publiques
router.post('/inscription', uploadLogo, OngController.inscription);
router.post('/connexion', OngController.connexion);

// Vérification token pour toutes les routes suivantes
router.use(AuthController.verifierToken);

// Vérification spécifique pour les ONG
const verifierOng = (req, res, next) => {
    if (req.utilisateurType !== 'ong') {
        return res.status(403).json({ 
            success: false,
            message: 'Accès réservé aux organisations non gouvernementales' 
        });
    }
    next();
};

router.use(verifierOng);

// Profil
router.get('/profil', OngController.getProfil);
router.put('/profil', uploadLogo, OngController.mettreAJourProfil);

// Consultation (lecture seule)
router.get('/indicateurs', OngController.consulterIndicateurs);
router.get('/campagnes', OngController.consulterCampagnes);
router.get('/campagnes/:campagneId', OngController.detailsCampagne);

// Rapports
router.post('/rapports', uploadRapport, OngController.deposerRapport);
router.get('/rapports', OngController.mesRapports);
router.get('/rapports/:rapportId', OngController.detailsRapport);

// Participations aux campagnes
router.post('/campagnes/participer', OngController.participerCampagne);
router.get('/participations', OngController.mesParticipations);

// Tableau de bord
router.get('/tableau-bord', OngController.tableauBord);

export default router;