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
// // Configuration
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(helmet()); // Sécurité
// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
//     credentials: true
// }));
// app.use(morgan('dev')); // Logging
// app.use(express.json()); // Parser JSON
// app.use(express.urlencoded({ extended: true }));

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
import { testerConnexion } from './config/database.js';

// Import des routes
import authRoutes from './routes/authRoute.js';
import declarationRoutes from './routes/declarationRoute.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL 
        ? process.env.FRONTEND_URL.split(',')
        : ['http://127.0.0.1:5500', 'http://localhost:3000'],
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de base
app.get('/', (req, res) => {
    res.json({
        message: 'API EcoCollect - Gestion des déchets',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        database: 'PostgreSQL + PostGIS',
        endpoints: {
            auth: '/api/auth',
            declarations: '/api/declarations',
            dashboard: '/api/dashboard',
            profile: '/api/profile'
        }
    });
});

// Health check pour CI/CD
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/declarations', declarationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);

// Route 404
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route non trouvée',
        path: req.originalUrl
    });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('Erreur globale:', err);
    
    res.status(err.status || 500).json({
        message: err.message || 'Erreur interne du serveur',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Démarrer le serveur
const demarrerServeur = async () => {
    try {
        // Tester la connexion à la base de données
        await testerConnexion();
        
        app.listen(PORT, () => {
            console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
            console.log(`📊 Environnement: ${process.env.NODE_ENV}`);
            console.log(`🔗 Base de données: ${process.env.DB_NAME || 'Neon.tech'}`);
            console.log(`🌐 CORS autorisé pour: ${process.env.FRONTEND_URL || 'http://127.0.0.1:5500'}`);
        });
    } catch (erreur) {
        console.error('❌ Impossible de démarrer le serveur:', erreur);
        process.exit(1);
    }
};

demarrerServeur();

export default app;