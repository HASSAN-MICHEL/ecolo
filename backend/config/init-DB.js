import User from '../models/user.js';

export async function initializeDefaultAdmin() {
  try {
    console.log('🔍 Vérification de l\'existence de l\'utilisateur admin par défaut...');
    
    const adminEmail = 'admin@exemple.com';
    const existingAdmin = await User.findByEmail(adminEmail);
    
    if (existingAdmin) {
      console.log('✅ Utilisateur admin existe déjà');
      return { success: true, message: 'Admin existe déjà' };
    }
    
    // Créer l'admin par défaut
    const adminData = {
      name: 'admin',
      email: adminEmail,
      password: 'admin2006',
      role: 'admin',
      is_active: true
    };
    
    const adminUser = await User.create(adminData);
    console.log('✅ Utilisateur admin créé avec succès');
    
    return { 
      success: true, 
      message: 'Admin créé avec succès',
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      }
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error.message);
    return { 
      success: false, 
      message: `Erreur: ${error.message}` 
    };
  }
}