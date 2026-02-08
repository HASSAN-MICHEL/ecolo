const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Build simplifié DRINK MANAGE...');

try {
  // 1. Build frontend
  console.log('📦 Build frontend...');
  execSync('npm run build', { stdio: 'inherit' });

  // 2. Commande pkg simple
  console.log('🖥️ Création .exe...');
  execSync('pkg server.js --target node18-win-x64 --output DRINK-MANAGE.exe', {
    stdio: 'inherit',
    cwd: __dirname
  });

  // 3. Vérification
  if (fs.existsSync('DRINK-MANAGE.exe')) {
    const size = (fs.statSync('DRINK-MANAGE.exe').size / 1024 / 1024).toFixed(1);
    console.log(`\n🎉 SUCCÈS! DRINK-MANAGE.exe créé (${size} MB)`);
    console.log('📍 Emplacement:', path.resolve('DRINK-MANAGE.exe'));
  } else {
    throw new Error('Fichier .exe non créé');
  }

} catch (error) {
  console.error('❌ ERREUR:', error.message);
}