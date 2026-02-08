import { executerMigrations } from './database.js';

async function main() {
  try {
    await executerMigrations();
    console.log('✅ Toutes les migrations ont été exécutées avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error.message);
    process.exit(1);
  }
}

main();