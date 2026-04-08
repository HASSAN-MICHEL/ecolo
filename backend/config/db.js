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





// // // // Au dessus version pour le deploiement en local  et en dessous pour la production avec vercel

// import pkg from "pg";
// const { Pool } = pkg;

// console.log("🚀 Initialisation connexion Supabase (Vercel Ready)");

// // 🔥 OBLIGATOIRE : utiliser uniquement DATABASE_URL
// const connectionString = process.env.DATABASE_URL;

// if (!connectionString) {
//     console.error("❌ DATABASE_URL non définie dans Vercel !");
//     throw new Error("DATABASE_URL manquante");
// }

// console.log("📡 Utilisation DATABASE_URL :", connectionString.includes("supabase") ? "Supabase détecté" : "Autre DB");

// const pool = new Pool({
//     connectionString,
//     ssl: {
//         rejectUnauthorized: false, // OBLIGATOIRE pour Supabase
//     },
//     max: 5, // Important en serverless
//     idleTimeoutMillis: 10000,
//     connectionTimeoutMillis: 10000,
// });

// // Gestion erreurs globales
// pool.on("error", (err) => {
//     console.error("❌ Erreur Pool PostgreSQL:", err.message);
// });

// // Test connexion
// const testerConnexion = async () => {
//     try {
//         console.log("🔄 Test connexion DB...");
//         const client = await pool.connect();
//         const result = await client.query("SELECT NOW()");
//         console.log("✅ Connexion DB OK - Heure:", result.rows[0].now);
//         client.release();
//         return true;
//     } catch (error) {
//         console.error("❌ Erreur connexion DB:", error.message);
//         return false;
//     }
// };

// export { pool, testerConnexion };



import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du pool de connexions MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

const testerConnexion = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connexion réussie à la base de données MySQL');
        console.log(`📊 Base: ${process.env.DB_NAME}`);
        connection.release();
        return true;
    } catch (erreur) {
        console.error('❌ Erreur de connexion à la base de données:', erreur);
        throw erreur;
    }
};

export { pool, testerConnexion };