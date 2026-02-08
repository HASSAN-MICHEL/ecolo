

// import express from "express";
// import venteBoissonController from "../controllers/venteBoissonController.js";

// const router = express.Router();

// // // Routes existantes
//  router.get("/", venteBoissonController.getAll);
//  router.get("/:id", venteBoissonController.getById);
//  router.post("/", venteBoissonController.create);
// router.delete("/:id", venteBoissonController.delete);

// // //

// // // Routes pour les rapports
//  router.get("/rapports/journalier/:date", venteBoissonController.getDailyReport);
// router.get("/rapports/mensuel/:year/:month", venteBoissonController.getMonthlyReport);
//  router.get("/rapports/annuel/:year", venteBoissonController.getYearlyReport);

// // // Routes pour les statistiques
//  router.get("/statistiques/boissons-plus-vendues/:period/:year/:month?", venteBoissonController.getMostSold);
// router.get("/statistiques/evolution-ventes/:year", venteBoissonController.getSalesEvolution);
//  router.get("/statistiques/ventes-par-produit/:period/:year/:month?", venteBoissonController.getSalesByProduct);


//  export default router;


// routes/venteBoissonRoutes.js
import express from "express";
import venteBoissonController from "../controllers/venteBoissonController.js";
import { facture } from "../controllers/facturBois.js";

const router = express.Router();

router.get("/", venteBoissonController.getAll);
router.get("/:id", venteBoissonController.getById);
router.post("/", venteBoissonController.create);
router.delete("/:id", venteBoissonController.delete);
router.get("/facture/:id", facture);

router.get("/rapports/journalier/:date", venteBoissonController.getDetailedDailyReport);
router.get("/rapports/mensuel/:year/:month", venteBoissonController.getDetailedMonthlyReport);
router.get("/rapports/annuel/:year", venteBoissonController.getDetailedYearlyReport);

router.get("/statistiques/boissons-plus-vendues/:period/:year/:month?", venteBoissonController.getMostSold);
router.get("/statistiques/evolution-ventes/:year", venteBoissonController.getSalesEvolution);
router.get("/statistiques/ventes-par-produit/:period/:year/:month?", venteBoissonController.getSalesByProduct);
router.get("/statistiques/ventes-par-client/:year", venteBoissonController.getSalesByClient);
router.get("/statistiques/tendances-ventes", venteBoissonController.getSalesTrends);

router.get("/rapports/download/:type", venteBoissonController.downloadReportPDF);

export default router;