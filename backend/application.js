import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import cashRoutes from './routes/CahRoutes.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Pour gérer les paths en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration simple
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Permet l'accès depuis le réseau

// Middleware de base
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
app.use(express.static(path.join(__dirname, 'dist'))); // Frontend React

// Routes API (votre backend existant)
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/cash', cashRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

// Toutes les autres routes vont vers le frontend React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Démarrer le serveur
app.listen(PORT, HOST, () => {
  console.log('🚀 Application lancée avec succès!');
  console.log(`📍 Backend: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log('📱 Pour accéder depuis un autre appareil:');
  console.log(`   Utilisez l\'adresse: http://VOTRE_IP:${PORT}`);
  console.log(`   Votre IP locale: ${getLocalIP()}`);
});

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