import express from "express";
import cors from "cors"; 
import chambreRoutes from "./routes/chambreRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import boissonRoutes from "./routes/boissonRoutes.js";
import venteBoissonRoutes from "./routes/venteBoissonRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"; 
 // Import des nouvelles routes de tableau de bord
import userRoutes from "./routes/userRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import statsRoutes from "./routes/statsRoutes.js"; // Import des nouvelles routes de statistiques
import notificationController from "./controllers/notificationController.js"; // Pour les notifications

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes existantes
app.use("/api/chambres", chambreRoutes);
app.use("/api/restaurant/menu", menuRoutes);
app.use("/api/restaurant/order", orderRoutes); 
app.use("/api/vente-boissons", venteBoissonRoutes);
app.use("/api/boissons", boissonRoutes);
app.use("/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/reservations", reservationRoutes);

// Nouvelle route pour les statistiques
app.use("/api/stats", statsRoutes); // Toutes les routes de stats commencent par /api/stats

// Route pour vérifier et mettre à jour le statut des chambres
app.post("/api/reservations/check-status", async (req, res) => {
  try {
    await reservationController.checkAndUpdateChambreStatus();
    res.status(200).json({ message: "Statut des chambres et réservations mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut des chambres :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut des chambres", error: error.message });
  }
});

// Route pour récupérer les notifications (pour le frontend)
app.get("/api/notifications", (req, res) => {
  res.json(notificationController.getNotifications());
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

export default app;

