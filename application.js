// import express from 'express';
// import cors from 'cors';
// import pool from './backend/config/bb.js';
// import productRoutes from './backend/routes/productRoutes.js';
// import saleRoutes from './backend/routes/saleRoutes.js';
// import reportRoutes from './backend/routes/reportRoutes.js';
// import cashRoutes from './backend/routes/CahRoutes.js';
// import authRoute from './backend/routes/authRoute.js';
// import userRoute from './backend/routes/userRoutes.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const app = express();

// // Pour gérer les paths en ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configuration simple
// const PORT = process.env.PORT || 5000;
// const HOST = '0.0.0.0'; // Permet l'accès depuis le réseau

// // Middleware de base
// app.use(cors());
// app.use(express.json());

// // Servir les fichiers statiques
// app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
// app.use(express.static(path.join(__dirname, 'dist'))); // Frontend React

// // Routes API (votre backend existant)
// app.use('/api/products', productRoutes);
// app.use('/api/sales', saleRoutes);
// app.use('/api/cash', cashRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/auth', authRoute);
// app.use('/api/users', userRoute);

// // Toutes les autres routes vont vers le frontend React
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// // Gestion des erreurs
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// // Démarrer le serveur
// app.listen(PORT, HOST, () => {
//   console.log('🚀 Application lancée avec succès!');
//   console.log(`📍 Backend: http://localhost:${PORT}/api`);
//   console.log(`🌐 Frontend: http://localhost:${PORT}`);
//   console.log('📱 Pour accéder depuis un autre appareil:');
//   console.log(`   Utilisez l\'adresse: http://VOTRE_IP:${PORT}`);
//   console.log(`   Votre IP locale: ${getLocalIP()}`);
// });

// // Fonction simple pour obtenir l'IP locale
// function getLocalIP() {
//   const os = require('os');
//   const interfaces = os.networkInterfaces();
  
//   for (const interfaceName in interfaces) {
//     const addresses = interfaces[interfaceName];
//     for (const address of addresses) {
//       if (address.family === 'IPv4' && !address.internal) {
//         return address.address;
//       }
//     }
//   }
//   return 'localhost';
// }



import express from 'express';
import cors from 'cors';
import productRoutes from './backend/routes/productRoutes.js';
import saleRoutes from './backend/routes/saleRoutes.js';
import reportRoutes from './backend/routes/reportRoutes.js';
import cashRoutes from './backend/routes/CahRoutes.js';
import authRoute from './backend/routes/authRoute.js';
import userRoute from './backend/routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Import du script d'initialisation
import initDatabase from './backend/scripts/initDb.js';

const app = express();

// Pour gérer les paths en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration simple
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Middleware de base
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
app.use(express.static(path.join(__dirname, 'dist')));

// Routes API
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/cash', cashRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

// Route santé pour vérifier que l'API fonctionne
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Drink Manager API is running',
    timestamp: new Date().toISOString()
  });
});

// Toutes les autres routes vont vers le frontend React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Fonction pour démarrer le serveur
const startServer = async () => {
  try {
    // Initialiser la base de données avant de démarrer le serveur
    console.log('🚀 Initialisation de l\'application...');
    await initDatabase();
    
    // Démarrer le serveur
    app.listen(PORT, HOST, () => {
      console.log('\n🎉 Application lancée avec succès!');
      console.log('='.repeat(50));
      console.log(`📍 Backend API: http://localhost:${PORT}/api`);
      console.log(`🌐 Frontend: http://localhost:${PORT}`);
      console.log(`❤️  Santé API: http://localhost:${PORT}/api/health`);
      console.log('='.repeat(50));
      console.log('📱 Accès réseau:');
      console.log(`   http://${getLocalIP()}:${PORT}`);
      console.log('='.repeat(50));
      console.log('👤 Compte admin créé automatiquement:');
      console.log('   📧 Email: admin@drinkmanager.com');
      console.log('   🔑 Mot de passe: admin1234');
      console.log('='.repeat(50));
    });
    
  } catch (error) {
    console.error('❌ Erreur critique au démarrage:', error);
    process.exit(1);
  }
};

// Fonction simple pour obtenir l'IP locale
function getLocalIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    for (const address of addresses) {
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  return 'localhost';
}

// Démarrer l'application
startServer();