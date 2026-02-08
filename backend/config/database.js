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

// Tester la connexion
const testerConnexion = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log(`✅ Connecté à PostgreSQL (${process.env.NODE_ENV})`);
    console.log(`   📊 Heure serveur: ${result.rows[0].now}`);
    
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

export { pool, testerConnexion };