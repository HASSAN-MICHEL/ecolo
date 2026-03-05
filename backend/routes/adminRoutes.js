

// import express from 'express';
// import AdminController from '../controllers/AdminController.js';
// import AuthController from '../controllers/authController.js';
// import { uploadLogo } from '../middleware/uploads.js';
// import { uploadRecycleurFiles } from '../middleware/uploads.js';

// const router = express.Router();

// // Routes publiques
// router.post('/inscription', AdminController.creerAdmin);
// router.post('/connexion', AdminController.connexion);

// // Middleware de vérification de token
// router.use(AuthController.verifierToken);

// // Middleware de vérification du rôle admin
// const verifierRoleAdmin = (req, res, next) => {
//     if (req.utilisateurType !== 'admin') {
//         return res.status(403).json({ 
//             message: 'Accès réservé aux administrateurs' 
//         });
//     }
//     next();
// };

// router.use(verifierRoleAdmin);

// // ===== DASHBOARD & STATISTIQUES =====
// router.get('/tableau-bord', AdminController.tableauBord);
// router.get('/statistiques-avancees', AdminController.statistiquesAvancees);
// router.get('/historique', AdminController.historiqueComplet);

// // ===== GESTION DES SUPERVISEURS =====
// router.post('/superviseurs', AdminController.creerSuperviseur);


// // ===== GESTION DES RECYCLEURS =====
// router.post('/recycleurs', uploadRecycleurFiles, AdminController.creerRecycleur);
// router.get('/recycleurs', AdminController.listerRecycleurs);
// router.get('/recycleurs/:id', AdminController.detailsRecycleur);
// router.put('/recycleurs/:id', AdminController.modifierRecycleur);
// router.post('/recycleurs/:id/valider', AdminController.validerRecycleur);
// router.post('/recycleurs/:id/suspendre', AdminController.suspendreRecycleur);
// router.post('/recycleurs/:id/demande-suppression', AdminController.demanderSuppressionRecycleur);
// router.delete('/recycleurs/:id', AdminController.supprimerRecycleur);

// // ===== GESTION DES SPONSORS =====
// router.post('/sponsors', uploadLogo, AdminController.creerSponsor);


// // ===== GESTION DES ONG =====
// router.post('/ongs', uploadLogo, AdminController.creerOng);


// // ===== GESTION DES DEMANDES =====
// router.get('/demandes-suppression', AdminController.listerDemandesSuppression);
// router.put('/demandes-suppression/:demandeId', AdminController.traiterDemandeSuppression);

// // ===== GESTION DES PRODUCTEURS PREMIUM =====
// router.get('/producteurs-premium', AdminController.listerProducteursPremium);

// export default router;


import express from 'express';
import AdminController from '../controllers/AdminController.js';
import AuthController from '../controllers/AuthController.js';
import { uploadLogo } from '../middleware/uploads.js';
import { uploadRecycleurFiles } from '../middleware/uploads.js';
import CampagneController from '../controllers/CampagneController.js'; 
const router = express.Router();

// Routes publiques
router.post('/inscription', AdminController.creerAdmin);
router.post('/connexion', AdminController.connexion);

// Middleware de vérification de token
router.use(AuthController.verifierToken);

// Middleware de vérification du rôle admin
const verifierRoleAdmin = (req, res, next) => {
    if (req.utilisateurType !== 'admin') {
        return res.status(403).json({ 
            message: 'Accès réservé aux administrateurs' 
        });
    }
    next();
};

router.use(verifierRoleAdmin);

// ===== DASHBOARD & STATISTIQUES =====
router.get('/tableau-bord', AdminController.tableauBord);
router.get('/statistiques-avancees', AdminController.statistiquesAvancees);
router.get('/historique', AdminController.historiqueComplet);

// ===== GESTION DES SUPERVISEURS =====
router.post('/superviseurs', AdminController.creerSuperviseur);
router.get('/superviseurs', AdminController.listerSuperviseurs);
router.get('/superviseurs/:id', AdminController.detailsSuperviseur);
router.put('/superviseurs/:id', AdminController.modifierSuperviseur);
router.delete('/superviseurs/:id', AdminController.supprimerSuperviseur);

// ===== GESTION DES RECYCLEURS =====
router.post('/recycleurs', uploadRecycleurFiles, AdminController.creerRecycleur);
router.get('/recycleurs', AdminController.listerRecycleurs);
router.get('/recycleurs/:id', AdminController.detailsRecycleur);
router.put('/recycleurs/:id', uploadRecycleurFiles, AdminController.modifierRecycleur);
router.post('/recycleurs/:id/valider', AdminController.validerRecycleur);
router.post('/recycleurs/:id/suspendre', AdminController.suspendreRecycleur);
router.post('/recycleurs/:id/demande-suppression', AdminController.demanderSuppressionRecycleur);
router.delete('/recycleurs/:id', AdminController.supprimerRecycleurDirect);

// ===== GESTION DES SPONSORS =====
router.post('/sponsors', AdminController.creerSponsor);
router.get('/sponsors', AdminController.listerSponsors);
router.get('/sponsors/:id', AdminController.detailsSponsor);
router.put('/sponsors/:id', uploadLogo, AdminController.modifierSponsor);
router.delete('/sponsors/:id', AdminController.supprimerSponsor);
router.post('/sponsors/:id/activer', AdminController.activerSponsor);
router.post('/sponsors/:id/desactiver', AdminController.desactiverSponsor);

// ===== GESTION DES ONG =====
router.post('/ongs', AdminController.creerOng);
router.get('/ongs', AdminController.listerOngs);
router.get('/ongs/:id', AdminController.detailsOng);
router.put('/ongs/:id', uploadLogo, AdminController.modifierOng);
// router.delete('/ongs/:id', AdminController.supprimerOng);

// ===== GESTION DES CAMPAGNES =====
router.post('/campagnes', CampagneController.creer);
router.get('/campagness', CampagneController.lister);
router.get('/campagnes/:id', AdminController.detailsCampagne);
router.put('/campagnes/:id', AdminController.modifierCampagne);
//router.delete('/campagnes/:id', AdminController.supprimerCampagne);
router.post('/campagnes/:id/promoteurs', AdminController.ajouterPromoteurCampagne);
router.delete('/campagnes/:id/promoteurs/:promoteurId/:promoteurType', AdminController.retirerPromoteurCampagne);
router.post('/campagnes/:id/suivi', AdminController.ajouterSuiviCampagne);
router.get('/campagnes/:id/rapport', AdminController.rapportCampagne);
router.delete('/campagnes/:id', AdminController.supprimerCampagne);

// ===== GESTION DES DEMANDES =====
router.get('/demandes-suppression', AdminController.listerDemandesSuppression);
router.get('/demandes-suppression/:id', AdminController.detailsDemandeSuppression);
router.put('/demandes-suppression/:demandeId', AdminController.traiterDemandeSuppression);

// ===== GESTION DES PRODUCTEURS PREMIUM =====
router.get('/producteurs-premium', AdminController.listerProducteursPremium);
router.get('/producteurs-premium/:id', AdminController.detailsProducteurPremium);
router.post('/producteurs/:producteurId/convertir-premium', AdminController.convertirEnPremium);
router.post('/producteurs-premium/:id/resilier', AdminController.resilierAbonnement);

export default router;