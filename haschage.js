// // import bcrypt from 'bcrypt';

// // // Fonction pour hasher un mot de passe
// // async function hashPassword(password) {
// //     try {
// //         const saltRounds = 10; // niveau de sécurité (plus c'est élevé, plus c'est lent mais sécurisé)
        
// //         const hashedPassword = await bcrypt.hash(password, saltRounds);
        
// //         console.log("Mot de passe original :", password);
// //         console.log("Mot de passe hashé :", hashedPassword);

// //         return hashedPassword;
// //     } catch (error) {
// //         console.error("Erreur lors du hash :", error);
// //     }
// // }

// // // Exemple d'utilisation
// // const password = "asse123";
// // hashPassword(password);


// import bcrypt from 'bcrypt';

// class PasswordUtil {
//     // Hasher un mot de passe
//     static async hashPassword(password) {
//         if (!password) {
//             throw new Error('Le mot de passe est requis');
//         }
        
//         try {
//             const saltRounds = 10;
//             const hashedPassword = await bcrypt.hash(password, saltRounds);
//             console.log('✅ Hash généré (longueur:', hashedPassword.length, 'caractères)');
//             return hashedPassword;
//         } catch (error) {
//             console.error('❌ Erreur lors du hash:', error);
//             throw error;
//         }
//     }

//     // Vérifier un mot de passe
//     static async verifyPassword(plainPassword, hashedPassword) {
//         if (!plainPassword || !hashedPassword) {
//             throw new Error('Mot de passe et hash sont requis');
//         }
        
//         try {
//             const isValid = await bcrypt.compare(plainPassword, hashedPassword);
//             return isValid;
//         } catch (error) {
//             console.error('❌ Erreur lors de la vérification:', error);
//             throw error;
//         }
//     }
// }

// // Fonction principale pour tester
// async function main() {
//     try {
//         const password = "asse123";
        
//         console.log("=== HACHAGE DU MOT DE PASSE ===");
//         console.log("Mot de passe original :", password);
        
//         // Hacher le mot de passe
//         const hashedPassword = await PasswordUtil.hashPassword(password);
//         console.log("Mot de passe hashé (complet) :", hashedPassword);
//         console.log("Longueur du hash :", hashedPassword.length, "caractères");
        
//         console.log("\n=== VÉRIFICATION DU MOT DE PASSE ===");
        
//         // Vérifier avec le bon mot de passe
//         const isValid = await PasswordUtil.verifyPassword(password, hashedPassword);
//         console.log("Test avec le bon mot de passe :", isValid ? "✅ VALIDE" : "❌ INVALIDE");
        
//         // Vérifier avec un mauvais mot de passe
//         const isInvalid = await PasswordUtil.verifyPassword("wrong123", hashedPassword);
//         console.log("Test avec un mauvais mot de passe :", isInvalid ? "✅ VALIDE" : "❌ INVALIDE");
        
//         console.log("\n=== SQL POUR INSÉRER EN BASE ===");
//         console.log(`INSERT INTO admins (id, email, telephone, mot_de_passe_hash, nom_complet, role, est_actif, type_utilisateur) 
// VALUES (UUID(), 'admin@ecocollect.com', '771234567', '${hashedPassword}', 'Admin ECOCOLLECT', 'super_admin', 1, 'admin');`);
        
//     } catch (error) {
//         console.error("❌ Erreur :", error.message);
//     }
// }

// // Exécuter le programme
// main();

// export default PasswordUtil;

import bcrypt from 'bcrypt';

async function generateHashes() {
  const users = [
    { email: 'admin@ecocollect.com', password: 'password' },
    { email: 'superviseur@ecocollect.com', password: 'password' }
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    console.log(`UPDATE ... SET password='${hash}' WHERE email='${u.email}';`);
  }
}

generateHashes();



// INSERT INTO admins (id, email, mot_de_passe_hash, nom_complet, role, est_actif)
// VALUES (
//   uuid_generate_v4(),
//   'admin@ecocollect.cm',
//   '$2b$10$bC1WHt5ducWsFC1grrAjeuVJnPfKkwwJl70FlBDgKipLRK4RixjKq',
//   'Administrateur',
//   'admin',
//   true
// );