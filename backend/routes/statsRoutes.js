import express from 'express';
import Chambre from '../models/chambre.js';
import Order from '../models/orders.js';
import Reservation from '../models/reservation.js';
import VenteBoisson from '../models/venteboisson.js';

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const [
      availableRooms,
      restaurantOrders,
      todayReservations,
      barSales
    ] = await Promise.all([
      Chambre.getAll().then(chambres => chambres.filter(c => c.statut === 'disponible').length),
      Order.getCommandesRestaurant().then(orders => ({
        count: orders.filter(o => new Date(o.date_commande).toISOString().split('T')[0] === today).length,
        revenue: orders.filter(o => new Date(o.date_commande).toISOString().split('T')[0] === today)
                 .reduce((sum, o) => sum + o.montant_total, 0)
      })),
      Reservation.getAll().then(reservations => 
        reservations.filter(r => 
          new Date(r.date_debut).toISOString().split('T')[0] === today && 
          r.statut === 'confirmée'
        ).length
      ),
      VenteBoisson.getAll().then(sales => ({
        count: sales.filter(s => new Date(s.date_vente).toISOString().split('T')[0] === today).length,
        revenue: sales.filter(s => new Date(s.date_vente).toISOString().split('T')[0] === today)
                 .reduce((sum, s) => sum + s.montant_total, 0)
      }))
    ]);

    res.json({
      availableRooms,
      restaurantOrders: restaurantOrders.count,
      restaurantRevenue: restaurantOrders.revenue,
      todayReservations,
      barSales: barSales.count,
      barRevenue: barSales.revenue
    });
  } catch (error) {
    console.error("Erreur stats dashboard:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;





// import express from 'express';
// // import AuthController from '../controllers/AuthController.js';
// import ProfileController from '../controllers/profileController.js';
// import AuthController from '../controllers/AuthController.js';

// const router = express.Router();

// // Toutes les routes nécessitent une authentification
// router.use(AuthController.verifierToken);

// // Routes de profil
// router.get('/profil', ProfileController.obtenirProfil);
// router.put('/profil', ProfileController.mettreAJourProfil);
// router.post('/changer-mot-de-passe', ProfileController.changerMotDePasse);

// export default router;