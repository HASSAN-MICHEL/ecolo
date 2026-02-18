
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testerConnexion } from './bakend/config/database.js';

// Import des routes
import authRoutes from './backend/routes/authRoute.js';
import declarationRoutes from './backend/routes/declarationRoute.js';
import dashboardRoutes from './backend/routes/dashboardRoutes.js';
import profileRoutes from './backend/routes/profileRoutes.js';
import collecteurRoutes from './backend/routes/collecteurRoute.js';
import gestionnaireRoutes from './backend/routes/gestionnaireRoute.js';
import superviseurRoutes from './backend/routes/superviseurRoute.js';
import { serveStatic } from './backend/middleware/uploads.js';

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
            superviseurs: '/api/superviseurs'
        }
    });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api', declarationRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', profileRoutes);
app.use('/api/collecteurs', collecteurRoutes);
app.use('/api/gestionnaires', gestionnaireRoutes);
app.use('/api/superviseurs', superviseurRoutes);

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