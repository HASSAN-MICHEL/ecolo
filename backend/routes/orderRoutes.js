import express from "express";
import { createOrder, getRestaurantOrders , getOrderStats , getTodayOrders  } from "../controllers/orderController.js"; // Assure-toi que le chemin est correct

const router = express.Router();

// Route POST pour créer une commande
router.post("/", createOrder); // Pour créer une nouvelle commande

// Route GET pour récupérer toutes les commandes de type 'restaurant'
router.get("/restaurant", getRestaurantOrders); // Pour récupérer toutes les commandes de type restaurant

// Route GET pour récupérer les statistiques des commandes
router.get("/stats", getOrderStats); // Pour récupérer les statistiques des commandes
// Route GET pour récupérer les commandes du jour
router.get("/today", getTodayOrders); // Pour récupérer les commandes du jour
export default router;
