
import express from 'express';
import CollecteurController from '../controllers/CollecteurController.js';
import AuthController from '../controllers/authController.js';
import { validerInscriptionCollecteur } from '../middleware/validation.js';

const router = express.Router();

// Routes publiques
router.post('/inscription', validerInscriptionCollecteur, CollecteurController.inscription);
// Utiliser AuthController POUR LA CONNEXION
//router.post('/LOHION', AuthController.connecterCollecteur);  // CHANGEMENT CRITIQUE
router.post('/connexion', CollecteurController.connexion);  // GARDER LA LOGIQUE EXISTANTE POUR LE MOMENT

// Routes protégées
router.use(AuthController.verifierToken);

// Gestion des missions
router.get('/missions/disponibles', CollecteurController.missionsDisponibles);
router.get('/missions', CollecteurController.mesMissions);
router.post('/missions/:missionId/accepter', CollecteurController.accepterMission);
router.post('/missions/:missionId/demarrer', CollecteurController.demarrerCollecte);
router.post('/missions/:missionId/terminer', CollecteurController.terminerCollecte);
router.post('/missions/:missionId/depot', CollecteurController.choisirPointDepot);
router.post('/missions/:missionId/photos', CollecteurController.ajouterPhoto);

// Gains et tableau de bord
router.get('/gains', CollecteurController.mesGains);
router.get('/tableau-bord', CollecteurController.tableauBord);

// Profil
router.put('/profil', CollecteurController.modifierProfil);

// ROUTE DE TEST ABSOLUE - SANS AUCUNE LOGIQUE COMPLEXE
router.post('/test-direct', (req, res) => {
    console.log('✅ ROUTE TEST DIRECTE ATTEINTE');
    console.log('Body reçu:', req.body);
    res.json({ 
        success: true, 
        message: 'Route test directe OK',
        bodyRecu: req.body 
    });
});

export default router;




import express from 'express';
import GestionnaireController from '../controllers/GestionnaireController.js';
import AuthController from '../controllers/authController.js';
import { pool } from '../config/database.js';

const router = express.Router();

// ROUTE DE TEST - SANS AUTHENTIFICATION
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Route gestionnaire test OK',
        timestamp: new Date().toISOString()
    });
});

// ROUTE DE TEST POUR LA CONNEXION
router.post('/test-connexion', async (req, res) => {
    try {
        const { identifiant } = req.body;
        console.log('🧪 Test connexion - identifiant:', identifiant);
        
        const requete = 'SELECT id, email, nom_complet FROM gestionnaires_points WHERE email = $1';
        const resultat = await pool.query(requete, [identifiant]);
        
        res.json({
            success: true,
            existe: resultat.rows.length > 0,
            gestionnaire: resultat.rows[0] || null
        });
    } catch (erreur) {
        console.error('Erreur test connexion:', erreur);
        res.status(500).json({ success: false, erreur: erreur.message });
    }
});

// Connexion - Utiliser AuthController
router.post('/connexion', AuthController.connecterGestionnaire);  // DÉJÀ BON

// Routes protégées
router.use(AuthController.verifierToken);

// Gestion des missions
router.get('/missions/en-attente', GestionnaireController.missionsEnAttente);
router.post('/missions/:missionId/valider', GestionnaireController.validerMission);
router.put('/missions/:missionId/renseigner', GestionnaireController.renseignerMission);

// Attribution des crédits
router.post('/collecteurs/:collecteurId/missions/:missionId/credits', GestionnaireController.attribuerCredits);

// Tableau de bord
router.get('/tableau-bord', GestionnaireController.tableauBord);

// Sécurité
router.put('/changer-mot-de-passe', GestionnaireController.modifierMotDePasse);

export default router;




// COLLECTEUR :

// // import express from 'express';
// // import CollecteurController from '../controllers/collecteurController.js';
// // import AuthController from '../controllers/authController.js';
// // import { validerInscriptionCollecteur } from '../middleware/validation.js';

// // const router = express.Router();

// // // Routes publiques
// // router.post('/inscription', validerInscriptionCollecteur, CollecteurController.inscription);
// // router.post('/connexion', CollecteurController.connexion);

// // // Routes protégées
// // router.use(AuthController.verifierToken);

// // // Gestion des missions
// // router.get('/missions/disponibles', CollecteurController.missionsDisponibles);
// // router.get('/missions', CollecteurController.mesMissions);
// // router.post('/missions/:missionId/accepter', CollecteurController.accepterMission);
// // router.post('/missions/:missionId/demarrer', CollecteurController.demarrerCollecte);
// // router.post('/missions/:missionId/terminer', CollecteurController.terminerCollecte);
// // router.post('/missions/:missionId/depot', CollecteurController.choisirPointDepot);
// // router.post('/missions/:missionId/photos', CollecteurController.ajouterPhoto);

// // // Gains et tableau de bord
// // router.get('/gains', CollecteurController.mesGains);
// // router.get('/tableau-bord', CollecteurController.tableauBord);

// // // Profil
// // router.put('/profil', CollecteurController.modifierProfil);

// // export default router;


import express from 'express';
import CollecteurController from '../controllers/CollecteurController.js';
import AuthController from '../controllers/authController.js';
import { validerInscriptionCollecteur } from '../middleware/validation.js';

const router = express.Router();

// Routes publiques
router.post('/inscription', validerInscriptionCollecteur, CollecteurController.inscription);
// Utiliser AuthController POUR LA CONNEXION
router.post('/connexion', AuthController.connecterCollecteur);  // CHANGEMENT CRITIQUE

// Routes protégées
router.use(AuthController.verifierToken);

// Gestion des missions
router.get('/missions/disponibles', CollecteurController.missionsDisponibles);
router.get('/missions', CollecteurController.mesMissions);
router.post('/missions/:missionId/accepter', CollecteurController.accepterMission);
router.post('/missions/:missionId/demarrer', CollecteurController.demarrerCollecte);
router.post('/missions/:missionId/terminer', CollecteurController.terminerCollecte);
router.post('/missions/:missionId/depot', CollecteurController.choisirPointDepot);
router.post('/missions/:missionId/photos', CollecteurController.ajouterPhoto);

// Gains et tableau de bord
router.get('/gains', CollecteurController.mesGains);
router.get('/tableau-bord', CollecteurController.tableauBord);

// Profil
router.put('/profil', CollecteurController.modifierProfil);

// ROUTE DE TEST ABSOLUE - SANS AUCUNE LOGIQUE COMPLEXE
router.post('/test-direct', (req, res) => {
    console.log('✅ ROUTE TEST DIRECTE ATTEINTE');
    console.log('Body reçu:', req.body);
    res.json({ 
        success: true, 
        message: 'Route test directe OK',
        bodyRecu: req.body 
    });
});

export default router;


// // collecteurRoute.js - Vérifiez que c'est EXACTEMENT comme ça
// import express from 'express';
// import CollecteurController from '../controllers/CollecteurController.js';
// import AuthController from '../controllers/authController.js';
// import { validerInscriptionCollecteur } from '../middleware/validation.js';

// const router = express.Router();

// // ============================================
// // 1. D'ABORD les routes PUBLIQUES
// // ============================================
// console.log('🟢 Configuration des routes publiques collecteur...');

// router.post('/inscription', validerInscriptionCollecteur, CollecteurController.inscription);
// router.post('/connexion', CollecteurController.connexion);
// router.post('/LOHION', CollecteurController.connexion); // Pour compatibilité
// router.get('/test-public', (req, res) => {
//     res.json({ message: 'Route publique OK' });
// });

// // ============================================
// // 2. ENSUITE le middleware de vérification
// // ============================================
// console.log('🔒 Application du middleware de protection...');
// router.use(AuthController.verifierToken);

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