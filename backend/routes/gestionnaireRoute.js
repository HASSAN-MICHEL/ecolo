

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
router.get('/missions', GestionnaireController.missions);          
router.get('/missions/en-attente', GestionnaireController.missionsEnAttente);
router.get('/missions/validees', GestionnaireController.missionsValidees);
router.get('/missions/:missionId', GestionnaireController.missionDetails);
router.post('/missions/:missionId/valider', GestionnaireController.validerMission);

// Statistiques 
router.get('/statistiques/completes', GestionnaireController.statistiquesCompletes);
router.get('/statistiques/par-type-dechet', GestionnaireController.statistiquesParTypeDechet);
router.get('/statistiques/repartition-journaliere', GestionnaireController.repartitionJournaliere)

router.get('/mes-missions/validees', GestionnaireController.mesMissionsValidees);
router.get('/mon-historique', GestionnaireController.monHistorique);

// 💰 Attribution des crédits
router.post('/collecteurs/:collecteurId/missions/:missionId/credits', GestionnaireController.attribuerCredits);

// Voir les campagnes disponible pour alidation des missions :

router.get('/campagnes-disponibles', GestionnaireController.getCampagnesDisponibles);

// 🔐 Sécurité
router.put('/changer-mot-de-passe', GestionnaireController.modifierMotDePasse);
router.get('/profil', GestionnaireController.getProfil); // recuperer son profil



// Mettre à jour son propre profil (sans point de collecte car seul le superviseur peut modifier cela)
router.put('/profil', GestionnaireController.mettreAJourProfil);
export default router;