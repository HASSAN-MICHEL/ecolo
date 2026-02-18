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


// database.js - Configuration complète pour Supabase + Vercel
import pkg from 'pg';
const { Pool } = pkg;

const isProduction = process.env.NODE_ENV === 'production';

console.log('🚀 Initialisation de la connexion DB');
console.log('📊 Environnement:', isProduction ? 'PRODUCTION' : 'DÉVELOPPEMENT');
console.log('📡 DATABASE_URL définie:', !!process.env.DATABASE_URL);
console.log('🔑 SUPABASE_URL définie:', !!process.env.SUPABASE_URL);

let poolConfig;

// Configuration pour Vercel (production)
if (isProduction) {
    // OPTION 1: Utiliser DATABASE_URL si disponible (recommandé)
    if (process.env.DATABASE_URL) {
        poolConfig = {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false // Essentiel pour Supabase
            },
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        };
        console.log('🔧 Configuration PRODUCTION avec DATABASE_URL');
    } 
    // OPTION 2: Configuration manuelle avec variables d'environnement
    else {
        poolConfig = {
            host: process.env.SUPABASE_DB_HOST || 'db.cyjgsbdchsarsyrobbal.supabase.co',
            port: parseInt(process.env.SUPABASE_DB_PORT || '5432'),
            database: process.env.SUPABASE_DB_NAME || 'postgres',
            user: process.env.SUPABASE_DB_USER || 'postgres',
            password: process.env.SUPABASE_DB_PASSWORD || '',
            ssl: {
                rejectUnauthorized: false
            },
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        };
        console.log('🔧 Configuration PRODUCTION manuelle');
    }
} 
// Configuration pour développement local
else {
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
    console.log('💻 Configuration DÉVELOPPEMENT LOCAL');
}

// Log sécurisé de la configuration (sans le mot de passe)
console.log('📋 Configuration DB:', {
    host: poolConfig.host || (poolConfig.connectionString ? 'Utilise connectionString' : 'N/A'),
    port: poolConfig.port || 'via connectionString',
    database: poolConfig.database || 'via connectionString',
    user: poolConfig.user || 'via connectionString',
    ssl: !!poolConfig.ssl,
    max: poolConfig.max
});

const pool = new Pool(poolConfig);

// Gestionnaire d'erreurs de la pool
pool.on('error', (err, client) => {
    console.error('❌ Erreur inattendue sur la pool:', err.message);
});

// Fonction de test de connexion améliorée
const testerConnexion = async () => {
    let client;
    try {
        console.log('🔄 Test de connexion à la base de données...');
        
        // Tentative de connexion avec timeout
        const connectPromise = pool.connect();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout de connexion')), 15000)
        );
        
        client = await Promise.race([connectPromise, timeoutPromise]);
        
        console.log('✅ Connexion établie, test de requête...');
        
        // Tester une requête simple
        const result = await client.query('SELECT NOW() as time, current_database() as db, current_user as user');
        
        console.log('✅ Requête réussie:');
        console.log('   ⏰ Heure DB:', result.rows[0].time);
        console.log('   📚 Base:', result.rows[0].db);
        console.log('   👤 Utilisateur:', result.rows[0].user);
        
        client.release();
        console.log('✅ Connexion à la base de données opérationnelle');
        return true;
        
    } catch (erreur) {
        console.error('❌ Erreur de connexion à la base de données:', erreur.message);
        
        // Diagnostic détaillé
        if (erreur.message.includes('ENOTFOUND')) {
            console.error('💡 Problème DNS - Vérifiez le hostname');
        } else if (erreur.message.includes('ECONNREFUSED')) {
            console.error('💡 Connexion refusée - Vérifiez le port et si Supabase est accessible');
        } else if (erreur.message.includes('timeout')) {
            console.error('💡 Timeout - Le serveur ne répond pas');
        } else if (erreur.message.includes('password')) {
            console.error('💡 Erreur d\'authentification - Vérifiez le mot de passe');
        } else if (erreur.message.includes('SSL')) {
            console.error('💡 Erreur SSL - Vérifiez la configuration SSL');
        }
        
        if (client) {
            try { client.release(); } catch (e) {}
        }
        
        // En développement, on peut vouloir arrêter l'application
        if (!isProduction) {
            console.error('❌ Arrêt en développement dû à une erreur DB');
            process.exit(1);
        }
        
        return false;
    }
};

// Exporter aussi les informations Supabase pour d'autres usages
const supabaseConfig = {
    url: process.env.SUPABASE_URL || 'https://cyjgsbdchsarsyrobbal.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || ''
};

export { pool, testerConnexion, supabaseConfig };