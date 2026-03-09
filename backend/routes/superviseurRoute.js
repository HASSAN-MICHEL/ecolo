

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
import AdminController  from '../controllers/AdminController.js';  

const router = express.Router();



// Routes publiques
router.get('/ongs' , AdminController.listerOngs);
// Routes publiques
router.get('/sponsors' , AdminController.listerSponsors);

// ============================================
// 1. D'ABORD les routes PUBLIQUES
// ============================================
console.log('🟢 Routes publiques superviseur...');
router.post('/connexion', SuperviseurController.connexion);

console.log('🔒 Application du middleware de protection...');
router.use(AuthController.verifierToken);  

// ============================================
console.log('🔐 Routes protégées superviseur...');

router.get('/profil', SuperviseurController.getProfil);
router.put('/profil', SuperviseurController.modifierProfil);

// Gestion des collecteurs
router.get('/collecteurs/en-attente', SuperviseurController.collecteursEnAttente);
router.post('/collecteurs/:collecteurId/valider', SuperviseurController.validerCollecteur);
router.post('/collecteurs/:collecteurId/suspendre', SuperviseurController.suspendreCollecteur);
router.get('/collecteurs', SuperviseurController.getAllCollecteurs);
router.get('/collecteurs/en-attente', SuperviseurController.collecteursEnAttente);
router.get('/collecteurs/:collecteurId', SuperviseurController.getCollecteurDetails);
router.post('/collecteurs/:collecteurId/rejeter', SuperviseurController.rejeterCollecteur);


// Gestion des gestionnaires
router.get('/gestionnaires', SuperviseurController.gestionnaires);
router.post('/gestionnaires', SuperviseurController.creerGestionnaire);
router.put('/gestionnaires/:gestionnaireId', SuperviseurController.modifierGestionnaire);

router.put('/gestionnaires/:gestionnaireId', SuperviseurController.modifierGestionnaireComplet);

router.patch('/gestionnaires/:gestionnaireId/activer', SuperviseurController.activerGestionnaire);

// Gestion des missions
router.post('/missions', SuperviseurController.creerMission);
router.post('/missions/:missionId/attribuer/:collecteurId', SuperviseurController.attribuerMission);

// Statistiques
router.get('/statistiques', SuperviseurController.statistiques);

//géré les demandes des recycleur:


// Liste toutes les demandes
router.get('/demandes-recycleurs', SuperviseurController.getDemandesEnlevement);

// Demandes traitées par le superviseur connecté
router.get('/demandes-recycleurs/mes-traitements', SuperviseurController.mesDemandesTraitees);

// Statistiques des demandes
router.get('/demandes-recycleurs/statistiques', SuperviseurController.statistiquesDemandes);

// Détails d'une demande
router.get('/demandes-recycleurs/:demandeId', SuperviseurController.detailsDemande);

// Valider une demande
router.post('/demandes-recycleurs/:demandeId/valider', SuperviseurController.validerDemandeEnlevement);



router.get('/declarations-recyclage', SuperviseurController.getAllDeclarations);
router.put('/declarations-recyclage/:declarationId/valider', SuperviseurController.validerDeclaration);
export default router;