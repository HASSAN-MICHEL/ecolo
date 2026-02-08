import express from "express";
import { getAll, getById, create, update, deleteReservation, checkAndUpdateChambreStatus , 
    getDailyRevenue , getMonthlyRevenue , getYearlyRevenue , getMonthlyEvolution , getMostBookedRoomTypes
 } from "../controllers/reservationController.js";  

const router = express.Router();

// Récupérer toutes les réservations
router.get("/", getAll);

// Récupérer une réservation par son ID
router.get("/:id", getById);

// Créer une nouvelle réservation
router.post("/", create);

// Mettre à jour une réservation existante
router.put("/:id", update);

// Supprimer une réservation
router.delete("/:id", deleteReservation);

// Vérifier et mettre à jour le statut des chambres et des réservations
router.post("/check-status", checkAndUpdateChambreStatus);
// Ajoutez ces nouvelles routes
router.get("/rapports/revenu-journalier/:date", getDailyRevenue);
router.get("/rapports/revenu-mensuel/:year/:month", getMonthlyRevenue);
router.get("/rapports/revenu-annuel/:year", getYearlyRevenue);
router.get("/rapports/evolution-mensuelle/:year", getMonthlyEvolution);
router.get("/statistiques/chambres-plus-reservees/:period/:year/:month?", getMostBookedRoomTypes);

export default router;

getMostBookedRoomTypes