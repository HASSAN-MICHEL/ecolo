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
// import producteurpremiumRoutes from './routes/producteurpremiumRoutes.js';
// import collecteurRoutes from './routes/collecteurRoute.js';
// import gestionnaireRoutes from './routes/gestionnaireRoute.js';
// import superviseurRoutes from './routes/superviseurRoute.js';
// import PointDepotRoutes from './routes/PointDepotRoutes.js';
// import { serveStatic } from './middleware/upload.js';
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
// app.use('/api/producteur-premium', producteurpremiumRoutes);
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



import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { testerConnexion } from './config/database.js';

// Routes
import authRoutes from './routes/authRoute.js';
import declarationRoutes from './routes/declarationRoute.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import producteurpremiumRoutes from './routes/producteurpremiumRoutes.js';
import collecteurRoutes from './routes/collecteurRoute.js';
import gestionnaireRoutes from './routes/gestionnaireRoute.js';
import superviseurRoutes from './routes/superviseurRoute.js';
import PointDepotRoutes from './routes/PointDepotRoutes.js';
import NotificationRoutes from './routes/NotificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import sponsorRoutes from './routes/sponsorRoutes.js';
import campagneRoutes from './routes/campagneRoutes.js';
import ongRoutes from './routes/ongRoutes.js';
import RecycleurRoutes from './routes/recycleurRoutes.js';
import gestionnaireAchatsRoutes from './routes/gestionnaireAchatsRoute.js';

import { serveStatic } from './middleware/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Fix __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ==================== MIDDLEWARE ====================

// Sécurité
app.use(helmet());

// Logs
app.use(morgan('combined'));

// CORS (IMPORTANT VPS)
app.use(cors({
    origin: 'https://ecocollect.cm',
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Uploads statiques
serveStatic(app);


// ==================== API ====================

app.use('/api/notifications', NotificationRoutes);
app.use('/api/producteur-premium', producteurpremiumRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/campagnes', campagneRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/points-depot', PointDepotRoutes);
app.use('/api/recycleurs', RecycleurRoutes);

app.use('/api/collecteurs', collecteurRoutes);
app.use('/api/gestionnaires', gestionnaireRoutes);
app.use('/api/achatsGestionnaire', gestionnaireAchatsRoutes);
app.use('/api/superviseurs', superviseurRoutes);

app.use('/api/auth', authRoutes);
app.use('/api', declarationRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', profileRoutes);


// ==================== FRONTEND (React dist) ====================

const frontendPath = path.join(__dirname, '../dist');

app.use(express.static(frontendPath));

// SPA fallback (IMPORTANT React)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});


// ==================== ERREURS ====================

app.use((err, req, res, next) => {
    console.error('❌ Erreur globale:', err);

    res.status(err.status || 500).json({
        message: err.message || 'Erreur interne du serveur'
    });
});


// ==================== START ====================

const demarrerServeur = async () => {
    try {
        await testerConnexion();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Serveur lancé sur port ${PORT}`);
            console.log(`🌍 IP: 76.13.116.29`);
        });

    } catch (err) {
        console.error('❌ Erreur démarrage:', err);
        process.exit(1);
    }
};

demarrerServeur();

export default app;