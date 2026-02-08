// // import pg from 'pg';
// // import dotenv from 'dotenv';

// // dotenv.config();

// // const {Pool} = pg;

// // const pool = new Pool({
// //     host: process.env.DB_HOST,
// //     port: process.env.DB_PORT,
// //     database: process.env.DB_NAME,
// //     password: process.env.DB_PASSWORD,
// //     user: process.env.DB_USER,
// //     max: 20 ,
// //     idleTimeoutMillis: 30000,
// //     connectionTimeoutMillis: 20000,
// // });

// // const testerConnexion = async () => {
// //     try{
// //         const client = await pool.connect();
// //         console.log(' Connection reussite à notre base de données');
// //         client.release();
// //     }catch(erreur){
// //         console.log('erreur de connection à notre base de données:' , erreur);
// //         process.exit(1);
// //     }
// // };

// // export {pool , testerConnexion}



// import pg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const { Pool } = pg;

// // Configuration par environnement
// const getPoolConfig = () => {
//   // Priorité à l'URL de Neon.tech si disponible
//   if (process.env.NEON_DB_URL) {
//     console.log('📡 Utilisation de la base de données Neon.tech');
//     return {
//       connectionString: process.env.NEON_DB_URL,
//       ssl: {
//         rejectUnauthorized: false,
//         require: true,
//       },
//       max: 20,
//       idleTimeoutMillis: 30000,
//       connectionTimeoutMillis: 20000,
//     };
//   }

//   // Configuration locale pour développement
//   console.log('💻 Utilisation de la base de données locale');
//   return {
//     host: process.env.DB_HOST || 'localhost',
//     port: parseInt(process.env.DB_PORT) || 5432,
//     database: process.env.DB_NAME || 'ecocollect_db',
//     user: process.env.DB_USER || 'postgres',
//     password: process.env.DB_PASSWORD || '',
//     ssl: process.env.DB_SSL === 'true',
//     max: 20,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 20000,
//   };
// };

// const pool = new Pool(getPoolConfig());

// // Tester la connexion
// const testerConnexion = async () => {
//   let client;
//   try {
//     client = await pool.connect();
//     const result = await client.query('SELECT NOW()');
//     console.log(`✅ Connecté à PostgreSQL (${process.env.NODE_ENV})`);
//     console.log(`   📊 Heure serveur: ${result.rows[0].now}`);
    
//     // Vérifier si PostGIS est installé
//     try {
//       const postgisCheck = await client.query('SELECT PostGIS_Version()');
//       console.log(`   🗺️  PostGIS disponible: ${postgisCheck.rows[0].postgis_version}`);
//     } catch {
//       console.log('   ⚠️  PostGIS non disponible - installation requise');
//     }
    
//     client.release();
//   } catch (erreur) {
//     console.error('❌ Erreur de connexion à la base de données:', erreur.message);
//     console.log('   Vérifiez:');
//     console.log('   1. PostgreSQL est-il démarré ?');
//     console.log('   2. Les credentials sont-ils corrects ?');
//     console.log('   3. NEON_DB_URL est-elle configurée pour la production ?');
    
//     if (client) client.release();
//     process.exit(1);
//   }
// };

// export { pool, testerConnexion };


import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pg;

// Pour résoudre __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration par environnement
const getPoolConfig = () => {
  // Priorité à l'URL de Neon.tech si disponible
  if (process.env.NEON_DB_URL) {
    console.log('📡 Utilisation de la base de données Neon.tech');
    return {
      connectionString: process.env.NEON_DB_URL,
      ssl: {
        rejectUnauthorized: false,
        require: true,
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 20000,
    };
  }

  // Configuration locale pour développement
  console.log('💻 Utilisation de la base de données locale');
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'ecocollect_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
  };
};

const pool = new Pool(getPoolConfig());

// Fonction pour créer les tables depuis schema.sql
const creerTablesDepuisSchema = async () => {
  let client;
  try {
    client = await pool.connect();
    
    // Lire le fichier schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Exécution du schéma SQL pour créer les tables...');
    
    // Exécuter le schéma SQL
    await client.query(schemaSQL);
    console.log('✅ Tables créées avec succès !');
    
    client.release();
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error.message);
    if (client) client.release();
    throw error;
  }
};

// Fonction pour vérifier si les tables existent
const verifierTablesExistantes = async () => {
  let client;
  try {
    client = await pool.connect();
    
    // Vérifier si la table 'users' existe (table principale)
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const tablesExistent = result.rows[0].exists;
    
    client.release();
    return tablesExistent;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des tables:', error.message);
    if (client) client.release();
    return false;
  }
};

// Tester la connexion et créer les tables si nécessaire
const testerConnexion = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log(`✅ Connecté à PostgreSQL (${process.env.NODE_ENV})`);
    console.log(`   📊 Heure serveur: ${result.rows[0].now}`);
    
    // Vérifier si les tables existent
    const tablesExistent = await verifierTablesExistantes();
    
    if (!tablesExistent) {
      console.log('🔨 Création des tables...');
      await creerTablesDepuisSchema();
    } else {
      console.log('✅ Tables déjà existantes');
    }
    
    // Vérifier si PostGIS est installé
    try {
      const postgisCheck = await client.query('SELECT PostGIS_Version()');
      console.log(`   🗺️  PostGIS disponible: ${postgisCheck.rows[0].postgis_version}`);
    } catch {
      console.log('   ⚠️  PostGIS non disponible - installation requise');
    }
    
    client.release();
  } catch (erreur) {
    console.error('❌ Erreur de connexion à la base de données:', erreur.message);
    console.log('   Vérifiez:');
    console.log('   1. PostgreSQL est-il démarré ?');
    console.log('   2. Les credentials sont-ils corrects ?');
    console.log('   3. NEON_DB_URL est-elle configurée pour la production ?');
    
    if (client) client.release();
    process.exit(1);
  }
};

// Fonction pour les migrations (à appeler manuellement)
const executerMigrations = async () => {
  try {
    console.log('🚀 Démarrage des migrations...');
    await creerTablesDepuisSchema();
    console.log('✅ Migrations terminées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error.message);
    throw error;
  }
};

export { pool, testerConnexion, executerMigrations };