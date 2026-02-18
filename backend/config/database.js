// import pg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const {Pool} = pg;

// const pool = new Pool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     user: process.env.DB_USER,
//     max: 20 ,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 20000,
// });

// const testerConnexion = async () => {
//     try{
//         const client = await pool.connect();
//         console.log(' Connection reussite à notre base de données');
//         client.release();
//     }catch(erreur){
//         console.log('erreur de connection à notre base de données:' , erreur);
//         process.exit(1);
//     }
// };

// export {pool , testerConnexion}


// import pg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const { Pool } = pg;

// // Détection de l'environnement
// const isProduction = process.env.NODE_ENV === 'production';

// // Configuration intelligente
// let poolConfig;

// if (isProduction && process.env.DATABASE_URL) {
//     // PRODUCTION avec DATABASE_URL (Vercel/Render)
//     poolConfig = {
//         connectionString: process.env.DATABASE_URL,
//         ssl: {
//             rejectUnauthorized: false // Requis pour Supabase
//         },
//         max: 10,
//         idleTimeoutMillis: 10000,
//         connectionTimeoutMillis: 5000,
//     };
//     console.log('🔧 Configuration PRODUCTION avec DATABASE_URL');
// } else {
//     // LOCAL ou production sans DATABASE_URL
//     poolConfig = {
//         host: process.env.DB_HOST || 'localhost',
//         port: parseInt(process.env.DB_PORT || '5432'),
//         database: process.env.DB_NAME || 'ecocollect_db',
//         user: process.env.DB_USER || 'postgres',
//         password: process.env.DB_PASSWORD || '',
//         max: 20,
//         idleTimeoutMillis: 30000,
//         connectionTimeoutMillis: 20000,
//         ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
//     };
//     console.log('💻 Configuration LOCALE');
// }

// const pool = new Pool(poolConfig);

// const testerConnexion = async () => {
//     let client;
//     try {
//         client = await pool.connect();
//         console.log('✅ Connexion réussie à la base de données');
//         client.release();
//         return true;
//     } catch (erreur) {
//         console.error('❌ Erreur de connexion à la base de données:', erreur.message);
//         // En production, on ne veut pas planter le serveur pour une erreur de connexion
//         if (!isProduction) {
//             process.exit(1);
//         }
//         return false;
//     }
// };

// export { pool, testerConnexion };


// database.js - Version améliorée avec logs
import pkg from 'pg';
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production';

console.log('🚀 Initialisation de la connexion DB');
console.log('📊 Environnement:', isProduction ? 'PRODUCTION' : 'DÉVELOPPEMENT');
console.log('📡 DATABASE_URL définie:', !!process.env.DATABASE_URL);

let poolConfig;

if (process.env.DATABASE_URL) {
    // Utiliser DATABASE_URL en priorité (production ou développement)
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false  // Nécessaire pour Supabase
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,  // Réduit pour timeout plus rapide
    };
    
    // Extraire et logger l'hôte pour débogage
    try {
        const url = new URL(process.env.DATABASE_URL);
        console.log('🔗 Hôte:', url.hostname);
        console.log('🔌 Port:', url.port || 5432);
        console.log('📚 Base de données:', url.pathname.substring(1));
    } catch (e) {
        console.error('❌ Erreur parsing DATABASE_URL:', e.message);
    }
    
    console.log('🔧 Configuration PRODUCTION avec DATABASE_URL');
} else {
    // LOCAL sans DATABASE_URL
    poolConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'ecocollect_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 20000,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    };
    
    console.log('💻 Configuration LOCALE');
    console.log('📌 Hôte local:', poolConfig.host);
    console.log('📌 Base locale:', poolConfig.database);
}

const pool = new Pool(poolConfig);

// Gestionnaire d'erreurs de la pool
pool.on('error', (err, client) => {
    console.error('❌ Erreur inattendue sur la pool:', err.message);
});

const testerConnexion = async () => {
    let client;
    try {
        console.log('🔄 Test de connexion à la base de données...');
        client = await pool.connect();
        console.log('✅ Connexion réussie à la base de données');
        
        // Tester une requête simple
        const result = await client.query('SELECT NOW() as time');
        console.log('⏰ Heure serveur DB:', result.rows[0].time);
        
        client.release();
        return true;
    } catch (erreur) {
        console.error('❌ Erreur de connexion à la base de données:', erreur.message);
        console.error('📋 Configuration utilisée:', {
            aConnectionString: !!poolConfig.connectionString,
            host: poolConfig.host,
            database: poolConfig.database,
            user: poolConfig.user
        });
        
        if (client) {
            try { client.release(); } catch (e) {}
        }
        
        // En production, on ne veut pas planter le serveur pour une erreur de connexion
        if (!isProduction) {
            process.exit(1);
        }
        return false;
    }
};

// Exécuter le test de connexion au démarrage
testerConnexion().then(success => {
    if (success) {
        console.log('🚀 Base de données prête');
    } else {
        console.warn('⚠️ La base de données n\'est pas accessible');
    }
});

export { pool, testerConnexion };