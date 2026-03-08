// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import dotenv from 'dotenv';
// import { testerConnexion } from './config/database.js';

// // Import des routes
// import authRoutes from './routes/authRoute.js';
// import declarationRoutes from './routes/declarationRoute.js';
// import dashboardRoutes from './routes/dashboardRoutes.js';
// import profileRoutes from './routes/profileRoutes.js';
// import collecteurRoutes from './routes/collecteurRoute.js';
// import gestionnaireRoutes from './routes/gestionnaireRoute.js';
// import superviseurRoutes from './routes/superviseurRoute.js';
// import PointDepotRoutes from './routes/PointDepotRoutes.js';
// import { serveStatic } from './middleware/uploads.js';
// import NotificationRoutes from './routes/NotificationRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
// import sponsorRoutes from './routes/sponsorRoutes.js';
// import campagneRoutes from './routes/campagneRoutes.js';
// import ongRoutes from './routes/ongRoutes.js';
// import RecycleurRoutes from './routes/recycleurRoutes.js';
// import gestionnaireAchatsRoutes from './routes/gestionnaireAchatsRoute.js';


// // Configuration
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(helmet()); // Sécurité

// app.use(morgan('dev')); // Logging
// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
//     credentials: true
// }));
// app.use(express.json()); // Parser JSON
// app.use(express.urlencoded({ extended: true }));

// serveStatic(app);

// // IMPORTANT: Augmenter la limite pour les requêtes JSON
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// // Routes de base
// app.get('/', (req, res) => {
//     res.json({
//         message: 'API EcoCollect - Gestion des déchets',
//         version: '1.0.0',
//         endpoints: {
//             auth: '/api/auth',
//             declarations: '/api/declarations'
//         }
//     });
// });


// // Routes API
// app.use('/api/notifications', NotificationRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/sponsors', sponsorRoutes);
// app.use('/api/campagnes', campagneRoutes);
// app.use('/api/ongs', ongRoutes);
// app.use('/api/points-depot', PointDepotRoutes);
// app.use('/api/recycleurs' , RecycleurRoutes);

// app.use('/api/collecteurs', collecteurRoutes);
// app.use('/api/gestionnaires', gestionnaireRoutes);
// app.use('/api/achatsGestionnaire' ,  gestionnaireAchatsRoutes );
// app.use('/api/superviseurs', superviseurRoutes);

// app.use('/api/auth', authRoutes);
// app.use('/api', declarationRoutes);
// app.use('/api' , dashboardRoutes);
// app.use('/api' , profileRoutes);


// // Route 404
// app.use('*', (req, res) => {
//     res.status(404).json({
//         message: 'Route non trouvée',
//         path: req.originalUrl
//     });
// });

// // Gestion des erreurs globales
// app.use((err, req, res, next) => {
//     console.error('Erreur globale:', err);
    
//     res.status(err.status || 500).json({
//         message: err.message || 'Erreur interne du serveur',
//         ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//     });
// });

// // Démarrer le serveur
// const demarrerServeur = async () => {
//     try {
//         // Tester la connexion à la base de données
//         await testerConnexion();
        
//         app.listen(PORT, () => {
//             console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
//             console.log(`📊 Environnement: ${process.env.NODE_ENV}`);
//             console.log(`🔗 Base de données: ${process.env.DB_NAME}`);
//         });
//     } catch (erreur) {
//         console.error('❌ Impossible de démarrer le serveur:', erreur);
//         process.exit(1);
//     }
// };

// demarrerServeur();

// export default app;


// // // ICI EN DESSOUS VERSION DEJA OPERATIONNEL POUR VERCEL EN PRODUCTION
// // import express from 'express';
// // import cors from 'cors';
// // import helmet from 'helmet';
// // import morgan from 'morgan';
// // import dotenv from 'dotenv';
// // import { testerConnexion } from './config/database.js';

// // // Import des routes
// // import authRoutes from './routes/authRoute.js';
// // import declarationRoutes from './routes/declarationRoute.js';
// // import dashboardRoutes from './routes/dashboardRoutes.js';
// // import profileRoutes from './routes/profileRoutes.js';
// // import collecteurRoutes from './routes/collecteurRoute.js';
// // import gestionnaireRoutes from './routes/gestionnaireRoute.js';
// // import superviseurRoutes from './routes/superviseurRoute.js';
// // import { serveStatic } from './middleware/uploads.js';
// // import pointDepotRoutes from './routes/PointDepotRoutes.js';

// // // Configuration
// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // // Middleware de base
// // app.use(helmet());

// // // Configuration CORS simplifiée (sans FRONTEND_URL pour l'instant)
// // app.use(cors({
// //     origin: '*', // À modifier plus tard quand tu auras le frontend
// //     credentials: true
// // }));

// // app.use(morgan('dev'));
// // app.use(express.json({ limit: '50mb' }));
// // app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // // Servir les fichiers statiques si nécessaire
// // serveStatic(app);

// // // Route de base
// // app.get('/', (req, res) => {
// //     res.json({
// //         message: 'API EcoCollect - Gestion des déchets',
// //         version: '1.0.0',
// //         status: 'online',
// //         environment: process.env.NODE_ENV || 'development',
// //         endpoints: {
// //             auth: '/api/auth',
// //             declarations: '/api/declarations',
// //             dashboard: '/api/dashboard',
// //             profile: '/api/profile',
// //             collecteurs: '/api/collecteurs',
// //             gestionnaires: '/api/gestionnaires',
// //             superviseurs: '/api/superviseurs'
// //         }
// //     });
// // });

// // // Routes API
// // app.use('/api/auth', authRoutes);
// // app.use('/api', declarationRoutes);
// // app.use('/api', dashboardRoutes);
// // app.use('/api', profileRoutes);
// // app.use('/api/collecteurs', collecteurRoutes);
// // app.use('/api/gestionnaires', gestionnaireRoutes);
// // app.use('/api/superviseurs', superviseurRoutes);
// // app.use('/api/points-depot', pointDepotRoutes);

// // // Route 404
// // app.use('*', (req, res) => {
// //     res.status(404).json({
// //         message: 'Route non trouvée',
// //         path: req.originalUrl
// //     });
// // });

// // // Gestion des erreurs globales
// // app.use((err, req, res, next) => {
// //     console.error('❌ Erreur globale:', err);
    
// //     const status = err.status || 500;
// //     const response = {
// //         message: err.message || 'Erreur interne du serveur'
// //     };
    
// //     // Ajouter le stack seulement en développement
// //     if (process.env.NODE_ENV === 'development') {
// //         response.stack = err.stack;
// //     }
    
// //     res.status(status).json(response);
// // });

// // // Démarrer le serveur UNIQUEMENT en local
// // // Pour Vercel, on n'écoute PAS sur un port (c'est géré par Vercel)
// // if (process.env.NODE_ENV !== 'production') {
// //     const demarrerServeur = async () => {
// //         try {
// //             await testerConnexion();
// //             app.listen(PORT, () => {
// //                 console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
// //                 console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
// //             });
// //         } catch (erreur) {
// //             console.error('❌ Impossible de démarrer le serveur:', erreur);
// //             process.exit(1);
// //         }
// //     };
    
// //     demarrerServeur();
// // } else {
// //     // En production (Vercel), on teste juste la connexion sans bloquer
// //     testerConnexion().then(() => {
// //         console.log('✅ API prête pour Vercel');
// //     });
// // }

// // // Export pour Vercel
// // export default app;





import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testerConnexion } from './config/database.js';

// Import des routes
import authRoutes from './routes/authRoute.js';

import declarationRoutes from './routes/declarationRoute.js';

import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import collecteurRoutes from './routes/collecteurRoute.js';
import gestionnaireRoutes from './routes/gestionnaireRoute.js';
import superviseurRoutes from './routes/superviseurRoute.js';
import PointDepotRoutes from './routes/PointDepotRoutes.js';
import { serveStatic } from './middleware/uploadToSupabase.js'; // Bien venue bade
import NotificationRoutes from './routes/NotificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sponsorRoutes from './routes/sponsorRoutes.js';
import campagneRoutes from './routes/campagneRoutes.js';
import ongRoutes from './routes/ongRoutes.js';
import RecycleurRoutes from './routes/recycleurRoutes.js';
import gestionnaireAchatsRoutes from './routes/gestionnaireAchatsRoute.js';
import producteurpremiumRoutes from './routes/producteurPremiumRoutes.js';


// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de base
app.use(helmet());

// Configuration CORS simplifiée (sans FRONTEND_URL pour l'instant)
app.use(cors({
    origin: '*', // À modifier plus tard quand tu auras le frontend
    credentials: true
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir les fichiers statiques si nécessaire
serveStatic(app);

// Route de base
app.get('/', (req, res) => {
    res.json({
        message: 'API EcoCollect - Gestion des déchets',
        version: '1.0.0',
        status: 'online',
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
            auth: '/api/auth',
            declarations: '/api/declarations',
            dashboard: '/api/dashboard',
            profile: '/api/profile',
            collecteurs: '/api/collecteurs',
            gestionnaires: '/api/gestionnaires',
            superviseurs: '/api/superviseurs',
            ong:'/api/ongs',
            sponsor: '/api/sponsors',
            recycleurs: '/api/recycleurs',
            admin:'/api/admin'
        }
    });
});

// Routes API
// Routes API
app.use('/api/notifications', NotificationRoutes);
app.use('/api/producteur-premium', producteurpremiumRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/campagnes', campagneRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/points-depot', PointDepotRoutes);
app.use('/api/recycleurs' , RecycleurRoutes);

app.use('/api/collecteurs', collecteurRoutes);
app.use('/api/gestionnaires', gestionnaireRoutes);
app.use('/api/achatsGestionnaire' ,  gestionnaireAchatsRoutes );
app.use('/api/superviseurs', superviseurRoutes);

app.use('/api/auth', authRoutes);
app.use('/api', declarationRoutes);
app.use('/api' , dashboardRoutes);
app.use('/api' , profileRoutes);

// Route 404
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route non trouvée',
        path: req.originalUrl
    });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('❌ Erreur globale:', err);
    
    const status = err.status || 500;
    const response = {
        message: err.message || 'Erreur interne du serveur'
    };
    
    // Ajouter le stack seulement en développement
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }
    
    res.status(status).json(response);
});

// Démarrer le serveur UNIQUEMENT en local
// Pour Vercel, on n'écoute PAS sur un port (c'est géré par Vercel)
if (process.env.NODE_ENV !== 'production') {
    const demarrerServeur = async () => {
        try {
            await testerConnexion();
            app.listen(PORT, () => {
                console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
                console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
            });
        } catch (erreur) {
            console.error('❌ Impossible de démarrer le serveur:', erreur);
            process.exit(1);
        }
    };
    
    demarrerServeur();
} else {
    // En production (Vercel), on teste juste la connexion sans bloquer
    testerConnexion().then(() => {
        console.log('✅ API prête pour Vercel');
    });
}

// Export pour Vercel
export default app;
