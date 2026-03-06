


// // routes/recycleurRoutes.js
// import express from 'express';
// import RecycleurController from '../controllers/RecycleurController.js';
// import { uploadRecycleurFiles , uploadCertificat } from '../middleware/uploads.js';
// import AuthController from '../controllers/AuthController.js';

// const router = express.Router();

// // Routes publiques
// router.post('/inscription', uploadRecycleurFiles, RecycleurController.inscription);
// router.post('/connexion', RecycleurController.connexion);

// // Vérification token pour toutes les routes suivantes
// router.use(AuthController.verifierToken);

// // Vérification spécifique pour les recycleurs
// const verifierRecycleur = (req, res, next) => {
//     if (req.utilisateurType !== 'recycleur') {
//         return res.status(403).json({ 
//             success: false,
//             message: 'Accès réservé aux recycleurs' 
//         });
//     }
//     next();
// };

// router.use(verifierRecycleur);

// // 📊 Tableau de bord
// router.get('/tableau-bord', RecycleurController.tableauBord);

// // 👤 Profil
// router.get('/profil', RecycleurController.monProfil);
// router.put('/profil', uploadRecycleurFiles, RecycleurController.mettreAJourProfil);

// // 📦 Stocks disponibles
// router.get('/stocks', RecycleurController.consulterStocks);

// // 📝 Demandes d'enlèvement
// router.post('/demandes', RecycleurController.demanderEnlevement);
// router.get('/demandes', RecycleurController.mesDemandes);
// router.get('/demandes/:demandeId', RecycleurController.detailsDemande);
// router.put('/demandes/:demandeId/confirmer', RecycleurController.confirmerReception);
// router.get('/mon-stock', RecycleurController.monStockPersonnel);
// router.get('/mon-stock/historique', RecycleurController.monStock);

// // ♻️ Déclarations de recyclage
// router.post('/declarations', uploadCertificat ,  RecycleurController.declarerRecyclage);
// router.get('/declarations', RecycleurController.mesDeclarations);

// export default router;

// routes/recycleurRoutes.js - CORRIGÉ
import express from 'express';
import RecycleurController from '../controllers/RecycleurController.js';
import {   uploadRecycleurFiles,   uploadCertificat,  uploadDeclarationsRecyclage  } from '../middleware/uploadToSupabase.js';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Routes publiques
router.post('/inscription', uploadRecycleurFiles, RecycleurController.inscription);
router.post('/connexion', RecycleurController.connexion);

// Vérification token pour toutes les routes suivantes
router.use(AuthController.verifierToken);

// Vérification spécifique pour les recycleurs
const verifierRecycleur = (req, res, next) => {
    if (req.utilisateurType !== 'recycleur') {
        return res.status(403).json({ 
            success: false,
            message: 'Accès réservé aux recycleurs' 
        });
    }
    next();
};

router.use(verifierRecycleur);

//  Tableau de bord
router.get('/tableau-bord', RecycleurController.tableauBord);

//  Profil
router.get('/profil', RecycleurController.monProfil);
router.put('/profil', uploadRecycleurFiles, RecycleurController.mettreAJourProfil);

//  Stocks disponibles
router.get('/stocks', RecycleurController.consulterStocks);

// Demandes d'enlèvement
router.post('/demandes', RecycleurController.demanderEnlevement);
router.get('/demandes', RecycleurController.mesDemandes);
router.get('/demandes/:demandeId', RecycleurController.detailsDemande);
router.put('/demandes/:demandeId/confirmer', RecycleurController.confirmerReception);
router.get('/mon-stock', RecycleurController.monStockPersonnel);
router.get('/mon-stock/historique', RecycleurController.monStock);

// Déclarations de recyclage
//  Utilisez soit uploadCertificat soit uploadDeclarationsRecyclage
router.post('/declarations', uploadCertificat, RecycleurController.declarerRecyclage);
// OU
// router.post('/declarations', uploadDeclarationsRecyclage, RecycleurController.declarerRecyclage);

router.get('/declarations', RecycleurController.mesDeclarations);

export default router;
