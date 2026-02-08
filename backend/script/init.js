// backend/scripts/initDb.js
import User from '../models/user.js';
import pool from '../config/bb.js';

const initDatabase = async () => {
  try {
    console.log('🔍 Vérification de l\'utilisateur admin...');

    // Vérifier si l'utilisateur admin existe déjà
    const adminUser = await User.findByEmail('admin@drinkmanager.com');
    
    if (adminUser) {
      console.log('✅ Utilisateur admin déjà existant');
      return;
    }

    // Créer l'utilisateur admin
    const adminData = {
      name: 'Administrateur',
      email: 'admin@drinkmanager.com',
      password: 'admin1234',
      role: 'admin',
      is_active: true
    };

    const newAdmin = await User.create(adminData);
    console.log('✅ Utilisateur admin créé avec succès');
    console.log('📧 Email: admin@drinkmanager.com');
    console.log('🔑 Mot de passe: admin1234');
    console.log('👤 Rôle: Administrateur');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
    
    // Si la table n'existe pas, on l'affiche mais on ne bloque pas le démarrage
    if (error.message.includes('relation "users" does not exist')) {
      console.log('ℹ️ La table users n\'existe pas encore. Elle sera créée lors de la première utilisation.');
    }
  }
};

export default initDatabase;