

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

const frontendPath = path.join(__dirname, '../dort');

app.use(express.static(frontendPath));

// // SPA fallback (IMPORTANT React)
// app.get('*', (req, res) => {
//     res.sendFile(path.join(frontendPath, 'index.html'));
// });
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ 
            success: false, 
            message: `Route introuvable: ${req.path}` 
        });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});

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