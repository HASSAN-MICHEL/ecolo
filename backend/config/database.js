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


import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Détection de l'environnement
const isProduction = process.env.NODE_ENV === 'production';

// Configuration intelligente
let poolConfig;

if (isProduction && process.env.DATABASE_URL) {
    // PRODUCTION avec DATABASE_URL (Vercel/Render)
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Requis pour Supabase
        },
        max: 10,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 5000,
    };
    console.log('🔧 Configuration PRODUCTION avec DATABASE_URL');
} else {
    // LOCAL ou production sans DATABASE_URL
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
}

const pool = new Pool(poolConfig);

const testerConnexion = async () => {
    let client;
    try {
        client = await pool.connect();
        console.log('✅ Connexion réussie à la base de données');
        client.release();
        return true;
    } catch (erreur) {
        console.error('❌ Erreur de connexion à la base de données:', erreur.message);
        // En production, on ne veut pas planter le serveur pour une erreur de connexion
        if (!isProduction) {
            process.exit(1);
        }
        return false;
    }
};

export { pool, testerConnexion };