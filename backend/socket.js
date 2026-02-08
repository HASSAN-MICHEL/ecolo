

// import express from 'express';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Import des routes
// import productRoutes from './routes/productRoutes.js';
// import saleRoutes from './routes/saleRoutes.js';
// import reportRoutes from './routes/reportRoutes.js';
// import cashRoutes from './routes/CahRoutes.js';
// import authRoute from './routes/authRoute.js';
// import userRoute from './routes/userRoutes.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Configuration pour Electron vs Web
// const isElectron = process.env.ELECTRON_APP === 'true';

// app.use(cors());
// app.use(express.json());

// // Servir les fichiers statiques
// app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// // Routes API
// app.use('/api/products', productRoutes);
// app.use('/api/sales', saleRoutes);
// app.use('/api/cash', cashRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/auth', authRoute);
// app.use('/api/users', userRoute);

// // Route de santé
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     message: 'Serveur fonctionnel',
//     mode: isElectron ? 'Electron' : 'Web'
//   });
// });

// // Servir le frontend React
// app.use(express.static(path.join(__dirname, "dist")));

// // Route fallback pour SPA
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, "dist/index.html"));
// });

// // Démarrer le serveur
// const PORT = 5000;
// const HOST = isElectron ? 'localhost' : '0.0.0.0';

// app.listen(PORT, HOST, () => {
//   console.log(`🚀 Serveur backend démarré sur http://${HOST}:${PORT}`);
  
//   if (!isElectron) {
//     console.log(`🌐 Application accessible sur: http://localhost:${PORT}`);
//     console.log(`📱 Réseau local: http://192.168.52.216:${PORT}`);
//   }
// });

// export default app;








// // // import express from 'express';
// // // import cors from 'cors';
// // // import path from 'path';
// // // import { fileURLToPath } from 'url';

// // // // Import des routes
// // // import productRoutes from './routes/productRoutes.js';
// // // import saleRoutes from './routes/saleRoutes.js';
// // // import reportRoutes from './routes/reportRoutes.js';
// // // import cashRoutes from './routes/CahRoutes.js';
// // // import authRoute from './routes/authRoute.js';
// // // import userRoute from './routes/userRoutes.js';

// // // const __filename = fileURLToPath(import.meta.url);
// // // const __dirname = path.dirname(__filename);

// // // const app = express();

// // // // Configuration pour Electron vs Web
// // // const isElectron = process.env.ELECTRON_APP === 'true';

// // // app.use(cors());
// // // app.use(express.json());

// // // // Servir les fichiers statiques
// // // app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// // // // Routes API
// // // app.use('/api/products', productRoutes);
// // // app.use('/api/sales', saleRoutes);
// // // app.use('/api/cash', cashRoutes);
// // // app.use('/api/reports', reportRoutes);
// // // app.use('/api/auth', authRoute);
// // // app.use('/api/users', userRoute);

// // // // Route de santé
// // // app.get('/api/health', (req, res) => {
// // //   res.json({ 
// // //     status: 'OK', 
// // //     message: 'Serveur fonctionnel',
// // //     mode: isElectron ? 'Electron' : 'Web'
// // //   });
// // // });

// // // // Servir le frontend React
// // // app.use(express.static(path.join(__dirname, "../dist")));

// // // // Route fallback pour SPA
// // // app.get('*', (req, res) => {
// // //   res.sendFile(path.join(__dirname, "../dist/index.html"))  ;
// // // });

// // // // Démarrer le serveur
// // // const PORT = 5000;
// // // const HOST = isElectron ? 'localhost' : '0.0.0.0';

// // // app.listen(PORT, HOST, () => {
// // //   console.log(`🚀 Serveur backend démarré sur http://${HOST}:${PORT}`);
  
// // //   if (!isElectron) {
// // //     console.log(`🌐 Application accessible sur: http://localhost:${PORT}`);
// // //     console.log(`📱 Réseau local: http://192.168.52.216:${PORT}`);
// // //   }
// // // });

// // // export default app;




// // import express from 'express';
// // import cors from 'cors';
// // import path from 'path';
// // import { fileURLToPath } from 'url';

// // // Import des routes
// // import productRoutes from './routes/productRoutes.js';
// // import saleRoutes from './routes/saleRoutes.js';
// // import reportRoutes from './routes/reportRoutes.js';
// // import cashRoutes from './routes/CahRoutes.js';
// // import authRoute from './routes/authRoute.js';
// // import userRoute from './routes/userRoutes.js';

// // // Import de l'initialisation admin
// // import { initializeDefaultAdmin } from './config/init-DB.js';

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // const app = express();

// // // Configuration pour Electron vs Web
// // const isElectron = process.env.ELECTRON_APP === 'true';

// // app.use(cors());
// // app.use(express.json());

// // // Servir les fichiers statiques
// // app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// // // Routes API
// // app.use('/api/products', productRoutes);
// // app.use('/api/sales', saleRoutes);
// // app.use('/api/cash', cashRoutes);
// // app.use('/api/reports', reportRoutes);
// // app.use('/api/auth', authRoute);
// // app.use('/api/users', userRoute);

// // // Route de santé
// // app.get('/api/health', (req, res) => {
// //   res.json({ 
// //     status: 'OK', 
// //     message: 'Serveur fonctionnel',
// //     mode: isElectron ? 'Electron' : 'Web'
// //   });
// // });

// // // Route pour vérifier/initialiser l'admin (optionnel)
// // app.get('/api/init-admin', async (req, res) => {
// //   try {
// //     const result = await initializeDefaultAdmin();
// //     res.json(result);
// //   } catch (error) {
// //     res.status(500).json({ 
// //       success: false, 
// //       message: error.message 
// //     });
// //   }
// // });

// // // Servir le frontend React
// // app.use(express.static(path.join(__dirname, "../dist")));



// // // Démarrer le serveur avec initialisation admin
// // const PORT = 5000;
// // const HOST = isElectron ? 'localhost' : '0.0.0.0';

// // async function startServer() {
// //   try {
// //     // Initialiser l'admin par défaut au démarrage
// //     console.log('🚀 Démarrage du serveur...');
// //     await initializeDefaultAdmin();
    
// //     app.listen(PORT, HOST, () => {
// //       console.log(`🚀 Serveur backend démarré sur http://${HOST}:${PORT}`);
// //       console.log('👤 Utilisateur admin par défaut prêt');
// //       console.log('   Email: admin@exemple.com');
// //       console.log('   Mot de passe: admin2006');
      
// //       if (!isElectron) {
// //         console.log(`🌐 Application accessible sur: http://localhost:${PORT}`);
// //         console.log(`📱 Réseau local: http://192.168.52.216:${PORT}`);
// //       }
// //     });
    
// //   } catch (error) {
// //     console.error('❌ Erreur critique au démarrage:', error);
// //     process.exit(1);
// //   }
// // }

// // startServer();

// // export default app;



// import express from 'express';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Import des routes
// import productRoutes from './routes/productRoutes.js';
// import saleRoutes from './routes/saleRoutes.js';
// import reportRoutes from './routes/reportRoutes.js';
// import cashRoutes from './routes/CahRoutes.js';
// import authRoute from './routes/authRoute.js';
// import userRoute from './routes/userRoutes.js';

// // Import de l'initialisation admin
// import { initializeDefaultAdmin } from './config/init-DB.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Configuration pour Electron vs Web
// const isElectron = process.env.ELECTRON_APP === 'true';

// app.use(cors());
// app.use(express.json());

// // Servir les fichiers statiques
// app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// // Routes API
// app.use('/api/products', productRoutes);
// app.use('/api/sales', saleRoutes);
// app.use('/api/cash', cashRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/auth', authRoute);
// app.use('/api/users', userRoute);

// // Route de santé
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     message: 'Serveur fonctionnel',
//     mode: isElectron ? 'Electron' : 'Web',
//     timestamp: new Date().toISOString()
//   });
// });

// // Route pour vérifier/initialiser l'admin (optionnel)
// app.get('/api/init-admin', async (req, res) => {
//   try {
//     const result = await initializeDefaultAdmin();
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// });

// // Servir le frontend React
// app.use(express.static(path.join(__dirname, "../dist")));

// // Gestion des routes non trouvées pour SPA
// app.get('', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

// // Démarrer le serveur avec initialisation admin
// const PORT = 5000;
// const HOST = isElectron ? 'localhost' : '0.0.0.0';

// // Empêcher le double démarrage
// if (!global.serverStarted) {
//   global.serverStarted = true;
  
//   async function startServer() {
//     try {
//       // Initialiser l'admin par défaut au démarrage
//       console.log('🚀 Démarrage du serveur...');
//       console.log(`Mode: ${isElectron ? 'Electron' : 'Web'}`);
      
//       await initializeDefaultAdmin();
      
//       app.listen(PORT, HOST, () => {
//         console.log(`✅ Serveur backend démarré sur http://${HOST}:${PORT}`);
//         console.log('👤 Utilisateur admin par défaut prêt');
//         console.log('   Email: admin@exemple.com');
//         console.log('   Mot de passe: admin2006');
        
//         if (!isElectron) {
//           console.log(`🌐 Application accessible sur: http://localhost:${PORT}`);
//         }
//       });
      
//     } catch (error) {
//       console.error('❌ Erreur critique au démarrage:', error);
//       process.exit(1);
//     }
//   }

//   startServer();
// } else {
//   console.log('ℹ️ Serveur déjà démarré');
// }

// export default app;



// import express from 'express';
// import cors from 'cors';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Import des routes
// import productRoutes from './routes/productRoutes.js';
// import saleRoutes from './routes/saleRoutes.js';
// import reportRoutes from './routes/reportRoutes.js';
// import cashRoutes from './routes/CahRoutes.js';
// import authRoute from './routes/authRoute.js';
// import userRoute from './routes/userRoutes.js';

// // Import de l'initialisation admin
// import { initializeDefaultAdmin } from './config/init-DB.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Configuration pour Electron vs Web
// const isElectron = process.env.ELECTRON_APP === 'true';

// // Middleware pour logs des requêtes
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   next();
// });

// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Servir les fichiers statiques
// app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// // Routes API
// app.use('/api/products', productRoutes);
// app.use('/api/sales', saleRoutes);
// app.use('/api/cash', cashRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/auth', authRoute);
// app.use('/api/users', userRoute);

// // Route de santé améliorée
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     message: 'Serveur fonctionnel',
//     mode: isElectron ? 'Electron' : 'Web',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime()
//   });
// });

// // Route pour vérifier/initialiser l'admin
// app.get('/api/init-admin', async (req, res) => {
//   try {
//     const result = await initializeDefaultAdmin();
//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// });

// // Servir le frontend React
// app.use(express.static(path.join(__dirname, "../dist")));

// // Gestion des routes non trouvées pour SPA
// app.get('/', (req, res) => {
//   if (req.path.startsWith('/api/')) {
//     res.status(404).json({ error: 'Route API non trouvée' });
//   } else {
//     res.sendFile(path.join(__dirname, '../dist/index.html'));
//   }
// });

// // Démarrer le serveur
// const PORT = 5000;
// const HOST = isElectron ? 'localhost' : '0.0.0.0';

// // Empêcher le double démarrage avec une méthode plus fiable
// const serverKey = `drink-manage-server-${PORT}`;
// if (!global[serverKey]) {
//   global[serverKey] = true;
  
//   async function startServer() {
//     try {
//       console.log('🚀 Démarrage du serveur DRINK MANAGE...');
//       console.log(`📁 Répertoire: ${__dirname}`);
//       console.log(`🔧 Mode: ${isElectron ? 'Electron' : 'Web'}`);
//       console.log(`🌐 Port: ${PORT}`);
      
//       // Initialiser l'admin par défaut
//       console.log('👤 Initialisation admin...');
//       await initializeDefaultAdmin();
      
//       app.listen(PORT, HOST, () => {
//         console.log(`✅ Serveur backend démarré sur http://${HOST}:${PORT}`);
//         console.log('📊 Routes API disponibles:');
//         console.log('   - /api/health (statut serveur)');
//         console.log('   - /api/products (gestion produits)');
//         console.log('   - /api/sales (gestion ventes)');
//         console.log('   - /api/auth (authentification)');
//         console.log('👤 Compte admin par défaut:');
//         console.log('   Email: admin@exemple.com');
//         console.log('   Mot de passe: admin2006');
        
//         if (isElectron) {
//           console.log('🔗 Prêt pour la connexion Electron...');
//         } else {
//           console.log(`🌐 Application web: http://localhost:${PORT}`);
//         }
//       });
      
//     } catch (error) {
//       console.error('❌ Erreur critique au démarrage:', error);
//       process.exit(1);
//     }
//   }

//   startServer();
// } else {
//   console.log('ℹ️ Serveur déjà démarré - évitement du double démarrage');
// }

// export default app;



import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import des routes
import productRoutes from './routes/productRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import cashRoutes from './routes/CahRoutes.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoutes.js';
import clientRoute from './routes/clientRoutes.js';

// Import de l'initialisation admin
import { initializeDefaultAdmin } from './config/init-DB.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuration pour Electron vs Web
const isElectron = process.env.ELECTRON_APP === 'true';

console.log('🚀 Initialisation du serveur DRINK MANAGE...');
console.log(`📁 Répertoire: ${__dirname}`);
console.log(`🔧 Mode: ${isElectron ? 'Electron' : 'Web'}`);

// Middleware pour logs des requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));

// Routes API
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/cash', cashRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/client' clientRoute);

// Route de santé améliorée
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Serveur fonctionnel',
    mode: isElectron ? 'Electron' : 'Web',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route pour vérifier/initialiser l'admin
app.get('/api/init-admin', async (req, res) => {
  try {
    const result = await initializeDefaultAdmin();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Servir le frontend React
app.use(express.static(path.join(__dirname, "../dist")));

// Gestion des routes non trouvées pour SPA
app.get('/', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Route API non trouvée' });
  } else {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
});

// Démarrer le serveur
const PORT = 5000;
const HOST = isElectron ? 'localhost' : '0.0.0.0';

// Gestion de la terminaison propre
process.on('SIGTERM', () => {
  console.log('🛑 Signal SIGTERM reçu - arrêt propre du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Signal SIGINT reçu - arrêt propre du serveur...');
  process.exit(0);
});

// Empêcher la fermeture immédiate due aux erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('💥 Erreur non capturée:', error);
  // Ne pas quitter le processus pour les erreurs non critiques
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Rejet non géré:', reason);
  // Ne pas quitter le processus
});

// Démarrer le serveur
async function startServer() {
  try {
    console.log('👤 Initialisation de la base de données...');
    await initializeDefaultAdmin();
    
    app.listen(PORT, HOST, () => {
      console.log(`✅ Serveur backend démarré sur http://${HOST}:${PORT}`);
      console.log('📊 Routes API disponibles:');
      console.log('   - /api/health (statut serveur)');
      console.log('   - /api/products (gestion produits)');
      console.log('   - /api/sales (gestion ventes)');
      console.log('   - /api/auth (authentification)');
      console.log('👤 Compte admin par défaut:');
      console.log('   Email: admin@exemple.com');
      console.log('   Mot de passe: admin2006');
      
      if (isElectron) {
        console.log('🔗 Prêt pour la connexion Electron...');
      } else {
        console.log(`🌐 Application web: http://localhost:${PORT}`);
      }
      
      // Message de confirmation pour Electron
      console.log('🎯 Serveur pleinement opérationnel et en attente de connexions');
    });
    
  } catch (error) {
    console.error('❌ Erreur critique au démarrage:', error);
    // Attendre avant de quitter pour permettre la journalisation
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
}

// Démarrer le serveur immédiatement
startServer();

export default app;