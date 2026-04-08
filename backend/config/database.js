

// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configuration du pool de connexions MySQL
// const pool = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     port: parseInt(process.env.DB_PORT) || 3306,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     waitForConnections: true,
//     connectionLimit: 20,
//     queueLimit: 0,
//     enableKeepAlive: true,
//     keepAliveInitialDelay: 0
// });

// const testerConnexion = async () => {
//     try {
//         const connection = await pool.getConnection();
//         console.log('✅ Connexion réussie à la base de données MySQL');
//         console.log(`📊 Base: ${process.env.DB_NAME}`);
//         connection.release();
//         return true;
//     } catch (erreur) {
//         console.error('❌ Erreur de connexion à la base de données:', erreur);
//         throw erreur;
//     }
// };

// export { pool, testerConnexion };


import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {Pool} = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    max: 20 ,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
});

const testerConnexion = async () => {
    try{
        const client = await pool.connect();
        console.log(' Connection reussite à notre base de données');
        client.release();
    }catch(erreur){
        console.log('erreur de connection à notre base de données:' , erreur);
        process.exit(1);
    }
};

export {pool , testerConnexion}


