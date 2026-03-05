// import express from 'express';
// import CampagneController from '../controllers/CampagneController.js';
// import AuthController from '../controllers/authController.js';

// const router = express.Router();

// // Routes publiques (lecture seule)
// router.get('/', CampagneController.lister);
// router.get('/statistiques', CampagneController.statistiquesGlobales);
// router.get('/:id', CampagneController.obtenir);
// router.get('/:id/suivi', CampagneController.suivi);

// // Vérification token pour toutes les routes suivantes
// router.use(AuthController.verifierToken);

// // Routes pour superviseurs uniquement
// const verifierSuperviseur = (req, res, next) => {
//     if (req.utilisateurType !== 'superviseur') {
//         return res.status(403).json({ 
//             message: 'Accès réservé aux superviseurs' 
//         });
//     }
//     next();
// };

// // Création/modification de campagnes (superviseurs uniquement)
// router.post('/', verifierSuperviseur, CampagneController.creer);
// router.put('/:id', verifierSuperviseur, CampagneController.mettreAJour);

// // Gestion des promoteurs (avec vérification du type d'utilisateur)
// router.post('/:id/promoteurs', verifierSuperviseur, CampagneController.ajouterPromoteur);
// router.delete('/:id/promoteurs/:promoteurId/:promoteurType', verifierSuperviseur, CampagneController.retirerPromoteur);

// // Route interne pour ajouter du suivi (accessible à plusieurs types)
// const verifierAccesSuivi = (req, res, next) => {
//     const typesAutorises = ['superviseur', 'gestionnaire', 'collecteur'];
//     if (!typesAutorises.includes(req.utilisateurType)) {
//         return res.status(403).json({ 
//             message: `Accès réservé aux: ${typesAutorises.join(', ')}` 
//         });
//     }
//     next();
// };

// router.post('/suivi', verifierAccesSuivi, CampagneController.ajouterSuivi);

// export default router;


// routes/campagneRoute.js
import express from 'express';
import CampagneController from '../controllers/CampagneController.js';  
import AuthController from '../controllers/authController.js';

const router = express.Router();

// Routes publiques (lecture seule)
router.get('/', CampagneController.lister);
router.get('/statistiques', CampagneController.statistiquesGlobales);
router.get('/:id', CampagneController.details); // ← Changé de 'obtenir' à 'details' pour correspondre au contrôleur
router.get('/:id/suivi', CampagneController.suivi);

// Vérification token pour toutes les routes suivantes
router.use(AuthController.verifierToken);

// Routes pour superviseurs uniquement
const verifierSuperviseur = (req, res, next) => {
    if (req.utilisateurType !== 'superviseur' && req.utilisateurType !== 'admin') {
        return res.status(403).json({ 
            success: false,
            message: 'Accès réservé aux superviseurs' 
        });
    }
    next();
};

// Création/modification de campagnes (superviseurs uniquement)
router.post('/', verifierSuperviseur, CampagneController.creer);
router.put('/:id', verifierSuperviseur, CampagneController.mettreAJour);
router.patch('/:id/statut', verifierSuperviseur, CampagneController.changerStatut);

// Gestion des promoteurs (avec vérification du type d'utilisateur)
router.post('/:id/promoteurs', verifierSuperviseur, CampagneController.ajouterPromoteur);
router.delete('/:id/promoteurs/:promoteurId/:promoteurType', verifierSuperviseur, CampagneController.retirerPromoteur);

// Route pour exporter les rapports
router.get('/:id/exporter', verifierSuperviseur, CampagneController.exporter);

// Route interne pour ajouter du suivi (accessible à plusieurs types)
const verifierAccesSuivi = (req, res, next) => {
    const typesAutorises = ['superviseur', 'gestionnaire', 'collecteur'];
    if (!typesAutorises.includes(req.utilisateurType)) {
        return res.status(403).json({ 
            success: false,
            message: `Accès réservé aux: ${typesAutorises.join(', ')}` 
        });
    }
    next();
};

router.post('/suivi', verifierAccesSuivi, CampagneController.ajouterSuivi);

export default router;