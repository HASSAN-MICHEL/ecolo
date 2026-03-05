// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
// import { pool } from '../config/database.js';

// // Importer tous les modèles
// import Producteur from '../models/Producteur.js';
// import Collecteur from '../models/Collecteur.js';
// import Gestionnaire from '../models/GestionnairePoint.js';
// import Superviseur from '../models/Superviseur.js';

// class AuthController {
//     // ============================================
//     // INSCRIPTIONS
//     // ============================================
    
//     // Inscription producteur
//     static async inscrireProducteur(req, res) {
//         try {
//             const { 
//                 email, 
//                 telephone, 
//                 motDePasse, 
//                 typeProducteur, 
//                 nomComplet, 
//                 adresse, 
//                 longitude, 
//                 latitude, 
//                 quartier, 
//                 commune,
//                 cguAcceptees 
//             } = req.body;

//             // Vérifier si l'utilisateur existe déjà
//             const utilisateurExistant = await AuthController._verifierExistenceEmail(email);
//             if (utilisateurExistant) {
//                 return res.status(400).json({ 
//                     success: false,
//                     message: 'Un compte avec cet email existe déjà' 
//                 });
//             }

//             const telephoneExistant = await AuthController._verifierExistenceTelephone(telephone);
//             if (telephoneExistant) {
//                 return res.status(400).json({ 
//                     success: false,
//                     message: 'Un compte avec ce numéro de téléphone existe déjà' 
//                 });
//             }

//             if (!cguAcceptees) {
//                 return res.status(400).json({ 
//                     success: false,
//                     message: 'Vous devez accepter les CGU' 
//                 });
//             }

//             // Hasher le mot de passe
//             const motDePasseHash = await bcrypt.hash(motDePasse, 10);

//             // Créer le producteur
//             const producteurData = {
//                 email,
//                 telephone,
//                 motDePasseHash,
//                 typeProducteur,
//                 nomComplet,
//                 adresse,
//                 longitude: parseFloat(longitude),
//                 latitude: parseFloat(latitude),
//                 quartier,
//                 commune,
//                 cguAcceptees
//             };

//             const nouveauProducteur = await Producteur.creer(producteurData);

//             // Générer le token JWT
//             const token = AuthController._genererToken(
//                 nouveauProducteur.id, 
//                 nouveauProducteur.email, 
//                 'producteur'
//             );

//             res.status(201).json({
//                 success: true,
//                 message: 'Inscription réussie',
//                 token,
//                 utilisateur: {
//                     id: nouveauProducteur.id,
//                     email: nouveauProducteur.email,
//                     telephone: nouveauProducteur.telephone,
//                     type: 'producteur',
//                     role: nouveauProducteur.type_producteur,
//                     nomComplet: nouveauProducteur.nom_complet,
//                     quartier: nouveauProducteur.quartier,
//                     commune: nouveauProducteur.commune,
//                     points: nouveauProducteur.points || 0
//                 }
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur inscription producteur:', erreur);
//             res.status(500).json({ 
//                 success: false,
//                 message: 'Erreur lors de l\'inscription',
//                 erreur: erreur.message 
//             });
//         }
//     }

//     // Inscription collecteur
//     static async inscrireCollecteur(req, res) {
//         try {
//             const { 
//                 email, 
//                 telephone, 
//                 motDePasse, 
//                 nomComplet, 
//                 typeCollecteur,
//                 numeroIdentite,
//                 zoneInterventionNom,
//                 quartiersHabituels,
//                 communesIntervention,
//                 cguAcceptees 
//             } = req.body;

//             // Vérifications
//             const utilisateurExistant = await AuthController._verifierExistenceEmail(email);
//             if (utilisateurExistant) {
//                 return res.status(400).json({ 
//                     success: false,
//                     message: 'Un compte avec cet email existe déjà' 
//                 });
//             }

//             const telephoneExistant = await AuthController._verifierExistenceTelephone(telephone);
//             if (telephoneExistant) {
//                 return res.status(400).json({ 
//                     success: false,
//                     message: 'Un compte avec ce numéro de téléphone existe déjà' 
//                 });
//             }

//             if (!cguAcceptees) {
//                 return res.status(400).json({ 
//                     success: false,
//                     message: 'Vous devez accepter les CGU' 
//                 });
//             }

//             // Hasher le mot de passe
//             const motDePasseHash = await bcrypt.hash(motDePasse, 10);

//             // Créer le collecteur
//             const collecteurData = {
//                 email,
//                 telephone,
//                 motDePasseHash,
//                 nomComplet,
//                 typeCollecteur,
//                 numeroIdentite,
//                 zoneInterventionNom,
//                 quartiersHabituels,
//                 communesIntervention,
//                 cguAcceptees
//             };

//             const nouveauCollecteur = await Collecteur.create(collecteurData);

//             res.status(201).json({
//                 success: true,
//                 message: 'Inscription réussie. Votre compte est en attente de validation.',
//                 utilisateur: {
//                     id: nouveauCollecteur.id,
//                     email: nouveauCollecteur.email,
//                     telephone: nouveauCollecteur.telephone,
//                     type: 'collecteur',
//                     nomComplet: nouveauCollecteur.nom_complet,
//                     statut: nouveauCollecteur.statut
//                 }
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur inscription collecteur:', erreur);
//             res.status(500).json({ 
//                 success: false,
//                 message: 'Erreur lors de l\'inscription',
//                 erreur: erreur.message 
//             });
//         }
//     }

//     // Inscription générique
//     static async inscrire(req, res) {
//         try {
//             const { typeUtilisateur } = req.body;
            
//             if (!typeUtilisateur) {
//                 return res.status(400).json({ 
//                     success: false,
//                     message: 'Le type d\'utilisateur est requis (producteur/collecteur)' 
//                 });
//             }

//             switch(typeUtilisateur) {
//                 case 'producteur':
//                     return await AuthController.inscrireProducteur(req, res);
//                 case 'collecteur':
//                     return await AuthController.inscrireCollecteur(req, res);
//                 default:
//                     return res.status(400).json({ 
//                         success: false,
//                         message: 'Type d\'utilisateur invalide' 
//                     });
//             }
//         } catch (erreur) {
//             console.error('❌ Erreur inscription:', erreur);
//             res.status(500).json({ 
//                 success: false,
//                 message: 'Erreur lors de l\'inscription',
//                 erreur: erreur.message 
//             });
//         }
//     }

//     // ============================================
//     // CONNEXIONS
//     // ============================================
    
//     // Connexion unifiée
//     static async connecter(req, res) {
//         try {
//             const { identifiant, motDePasse } = req.body;

//             if (!identifiant || !motDePasse) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Identifiant et mot de passe requis'
//                 });
//             }

//             // Chercher l'utilisateur dans toutes les tables
//             const resultat = await AuthController._trouverUtilisateurParIdentifiant(identifiant);
            
//             if (!resultat || !resultat.utilisateur) {
//                 return res.status(401).json({ 
//                     success: false,
//                     message: 'Identifiants incorrects' 
//                 });
//             }

//             const { utilisateur, type } = resultat;

//             // Vérifier le mot de passe
//             const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.mot_de_passe_hash);
//             if (!motDePasseValide) {
//                 return res.status(401).json({ 
//                     success: false,
//                     message: 'Identifiants incorrects' 
//                 });
//             }

//             // Vérifications spécifiques selon le type
//             const verificationStatut = AuthController._verifierStatutUtilisateur(utilisateur, type);
//             if (!verificationStatut.valide) {
//                 return res.status(403).json({ 
//                     success: false,
//                     message: verificationStatut.message 
//                 });
//             }

//             // Mettre à jour la dernière connexion
//             await AuthController._mettreAJourDerniereConnexion(utilisateur.id, type);

//             // Générer le token
//             const token = AuthController._genererToken(
//                 utilisateur.id, 
//                 utilisateur.email, 
//                 type
//             );

//             // Préparer la réponse
//             const reponseUtilisateur = AuthController._preparerDonneesUtilisateur(utilisateur, type);

//             res.json({
//                 success: true,
//                 message: 'Connexion réussie',
//                 token,
//                 utilisateur: reponseUtilisateur
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur connexion:', erreur);
//             res.status(500).json({ 
//                 success: false,
//                 message: 'Erreur lors de la connexion',
//                 erreur: erreur.message 
//             });
//         }
//     }

//     // Connexions spécifiques (rétrocompatibilité)
//     static async connecterProducteur(req, res) {
//         return AuthController.connecter(req, res);
//     }

//     static async connecterCollecteur(req, res) {
//         return AuthController.connecter(req, res);
//     }

//     static async connecterGestionnaire(req, res) {
//         return AuthController.connecter(req, res);
//     }

//     static async connecterSuperviseur(req, res) {
//         return AuthController.connecter(req, res);
//     }

   
    
//     // static verifierToken(req, res, next) {
//     //     // Routes publiques (ne nécessitent pas de token)
//     //     const publicRoutes = [
//     //         '/api/collecteurs/connexion',
//     //         '/api/collecteurs/inscription',
//     //         '/api/collecteurs/LOHION',
//     //         '/api/collecteurs/test-public',
//     //         '/api/gestionnaires/connexion',
//     //         '/api/superviseurs/connexion',
//     //         '/api/producteurs/connexion',
//     //         '/api/producteurs/inscription'
//     //     ];

//     //     // Vérifier si c'est une route publique
//     //     if (publicRoutes.includes(req.path) || publicRoutes.includes(req.originalUrl)) {
//     //         console.log('🔓 Route publique - accès autorisé:', req.path);
//     //         return next();
//     //     }

//     //     // Récupérer le token
//     //     const authHeader = req.headers.authorization;
        
//     //     if (!authHeader) {
//     //         console.log('❌ Token manquant - Header Authorization absent');
//     //         return res.status(401).json({ 
//     //             success: false,
//     //             message: 'Token manquant',
//     //             code: 'TOKEN_MISSING'
//     //         });
//     //     }

//     //     // Vérifier le format
//     //     const parts = authHeader.split(' ');
//     //     if (parts.length !== 2 || parts[0] !== 'Bearer') {
//     //         console.log('❌ Format de token invalide');
//     //         return res.status(401).json({ 
//     //             success: false,
//     //             message: 'Format de token invalide. Utilisez: Bearer [token]',
//     //             code: 'INVALID_FORMAT'
//     //         });
//     //     }

//     //     const token = parts[1];

//     //     try {
//     //         // Vérifier et décoder le token
//     //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
//     //         // Ajouter les infos à la requête
//     //         req.utilisateurId = decoded.id;
//     //         req.utilisateurEmail = decoded.email;
//     //         req.utilisateurType = decoded.type;
            
//     //         console.log(`✅ Token valide - ${decoded.email} (${decoded.type})`);
            
//     //         next();
//     //     } catch (error) {
//     //         if (error.name === 'TokenExpiredError') {
//     //             return res.status(401).json({ 
//     //                 success: false,
//     //                 message: 'Token expiré',
//     //                 code: 'TOKEN_EXPIRED'
//     //             });
//     //         }
            
//     //         console.error('❌ Token invalide:', error.message);
//     //         return res.status(401).json({ 
//     //             success: false,
//     //             message: 'Token invalide',
//     //             code: 'INVALID_TOKEN'
//     //         });
//     //     }
//     // }

//     static verifierToken(req, res, next) {
//     // Routes publiques
//     const publicRoutes = [
//         '/api/collecteurs/connexion',
//         '/api/collecteurs/inscription',
//         '/api/gestionnaires/connexion',
//         '/api/superviseurs/connexion',
//         '/api/producteurs/connexion',
//         '/api/producteurs/inscription'
//     ];

//     if (publicRoutes.includes(req.path) || publicRoutes.includes(req.originalUrl)) {
//         console.log('🔓 Route publique:', req.path);
//         return next();
//     }

//     const authHeader = req.headers.authorization;
    
//     if (!authHeader) {
//         return res.status(401).json({ 
//             success: false,
//             message: 'Token manquant'
//         });
//     }

//     const parts = authHeader.split(' ');
//     if (parts.length !== 2 || parts[0] !== 'Bearer') {
//         return res.status(401).json({ 
//             success: false,
//             message: 'Format de token invalide'
//         });
//     }

//     const token = parts[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         // ✅ Gestion des deux formats de token
//         req.utilisateurId = decoded.id || decoded.userId;
//         req.utilisateurEmail = decoded.email;
        
//         // Si le token a un type, on l'utilise
//         if (decoded.type) {
//             req.utilisateurType = decoded.type;
//         } else {
//             // Sinon, on détermine le type à partir de l'URL ou de la base de données
//             if (req.originalUrl.includes('/api/producteurs/')) {
//                 req.utilisateurType = 'producteur';
//             } else if (req.originalUrl.includes('/api/collecteurs/')) {
//                 req.utilisateurType = 'collecteur';
//             } else if (req.originalUrl.includes('/api/gestionnaires/')) {
//                 req.utilisateurType = 'gestionnaire';
//             } else if (req.originalUrl.includes('/api/superviseurs/')) {
//                 req.utilisateurType = 'superviseur';
//             } else {
//                 // Par défaut
//                 req.utilisateurType = 'producteur';
//             }
//             console.log(`⚠️ Type déduit de l'URL: ${req.utilisateurType}`);
//         }
        
//         console.log(`✅ Token valide - ${req.utilisateurEmail} (${req.utilisateurType})`);
//         next();
        
//     } catch (error) {
//         console.error('❌ Token invalide:', error.message);
//         return res.status(401).json({ 
//             success: false,
//             message: 'Token invalide ou expiré'
//         });
//     }
// }

//     // Middleware pour vérifier le type d'utilisateur
//     // static verifierTypeUtilisateur(typesAutorises) {
//     //     return (req, res, next) => {
//     //         if (!req.utilisateurType) {
//     //             return res.status(401).json({ 
//     //                 success: false,
//     //                 message: 'Type d\'utilisateur non spécifié' 
//     //             });
//     //         }

//     //         if (!typesAutorises.includes(req.utilisateurType)) {
//     //             return res.status(403).json({ 
//     //                 success: false,
//     //                 message: 'Accès non autorisé pour ce type d\'utilisateur' 
//     //             });
//     //         }

//     //         next();
//     //     };
//     // }

//     static verifierTypeUtilisateur(typesAutorises) {
//     return (req, res, next) => {
//         if (!req.utilisateurType) {
//             // Si pas de type, on considère que c'est un producteur par défaut
//             req.utilisateurType = 'producteur';
//         }

//         if (!typesAutorises.includes(req.utilisateurType)) {
//             return res.status(403).json({ 
//                 success: false,
//                 message: 'Accès non autorisé pour ce type d\'utilisateur' 
//             });
//         }

//         next();
//     };
// }

//     // ============================================
//     // RÉINITIALISATION DE MOT DE PASSE
//     // ============================================
    
//     static async demanderReinitialisationMdp(req, res) {
//         try {
//             const { email } = req.body;

//             const resultat = await AuthController._trouverUtilisateurParIdentifiant(email);
            
//             if (!resultat || !resultat.utilisateur) {
//                 return res.json({ 
//                     success: true,
//                     message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation' 
//                 });
//             }

//             const { utilisateur, type } = resultat;

//             // Générer un token de réinitialisation
//             const token = crypto.randomBytes(32).toString('hex');
//             const expireLe = new Date();
//             expireLe.setHours(expireLe.getHours() + 1);

//             // Sauvegarder le token
//             const requete = `
//                 INSERT INTO tokens 
//                 (utilisateur_id, type_utilisateur, token, type_token, expire_le)
//                 VALUES ($1, $2, $3, 'reset_password', $4)
//             `;
//             await pool.query(requete, [utilisateur.id, type, token, expireLe]);

//             const lienReinitialisation = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe?token=${token}`;
            
//             console.log(`🔐 Lien de réinitialisation: ${lienReinitialisation}`);

//             res.json({ 
//                 success: true,
//                 message: 'Lien de réinitialisation envoyé avec succès'
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur demande réinitialisation:', erreur);
//             res.status(500).json({ 
//                 success: false,
//                 message: 'Erreur lors de la demande',
//                 erreur: erreur.message 
//             });
//         }
//     }

//     static async reinitialiserMdp(req, res) {
//         try {
//             const { token, nouveauMotDePasse } = req.body;

//             // Vérifier le token
//             const requeteToken = `
//                 SELECT * FROM tokens 
//                 WHERE token = $1 
//                 AND type_token = 'reset_password'
//                 AND utilise = false 
//                 AND expire_le > NOW()
//             `;
//             const resultatToken = await pool.query(requeteToken, [token]);
//             const tokenValide = resultatToken.rows[0];

//             if (!tokenValide) {
//                 return res.status(400).json({ 
//                     success: false,
//                     message: 'Token invalide ou expiré' 
//                 });
//             }

//             // Hasher le nouveau mot de passe
//             const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, 10);

//             // Mettre à jour le mot de passe
//             await AuthController._mettreAJourMotDePasse(
//                 tokenValide.utilisateur_id,
//                 tokenValide.type_utilisateur,
//                 nouveauMotDePasseHash
//             );

//             // Marquer le token comme utilisé
//             await pool.query(
//                 'UPDATE tokens SET utilise = true WHERE id = $1',
//                 [tokenValide.id]
//             );

//             res.json({ 
//                 success: true,
//                 message: 'Mot de passe réinitialisé avec succès' 
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur réinitialisation:', erreur);
//             res.status(500).json({ 
//                 success: false,
//                 message: 'Erreur lors de la réinitialisation',
//                 erreur: erreur.message 
//             });
//         }
//     }

//     // ============================================
//     // VALIDATION DE COMPTE
//     // ============================================
    
//     static async validerCompte(req, res) {
//         try {
//             const { token } = req.params;

//             const requeteToken = `
//                 SELECT * FROM tokens 
//                 WHERE token = $1 
//                 AND type_token = 'validation_compte'
//                 AND utilise = false 
//                 AND expire_le > NOW()
//             `;
//             const resultatToken = await pool.query(requeteToken, [token]);
//             const tokenValide = resultatToken.rows[0];

//             if (!tokenValide) {
//                 return res.status(400).json({ 
//                     success: false,
//                     message: 'Token de validation invalide ou expiré' 
//                 });
//             }

//             // Activer le compte selon le type
//             if (tokenValide.type_utilisateur === 'collecteur') {
//                 await Collecteur.update(tokenValide.utilisateur_id, { 
//                     est_actif: true,
//                     statut: 'actif'
//                 });
//             } else if (tokenValide.type_utilisateur === 'producteur') {
//                 await Producteur.update(tokenValide.utilisateur_id, { 
//                     est_actif: true 
//                 });
//             }

//             await pool.query(
//                 'UPDATE tokens SET utilise = true WHERE id = $1',
//                 [tokenValide.id]
//             );

//             res.json({ 
//                 success: true,
//                 message: 'Compte validé avec succès' 
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur validation compte:', erreur);
//             res.status(500).json({ 
//                 success: false,
//                 message: 'Erreur lors de la validation',
//                 erreur: erreur.message 
//             });
//         }
//     }

//     // ============================================
//     // MÉTHODES PRIVÉES
//     // ============================================
    
//     static _genererToken(id, email, type) {
//         return jwt.sign(
//             { id, email, type },
//             process.env.JWT_SECRET,
//             { expiresIn: process.env.JWT_EXPIRE || '7d' }
//         );
//     }

//     static async _verifierExistenceEmail(email) {
//         const queries = [
//             Producteur.trouverParEmail(email),
//             Collecteur.trouverParEmail(email),
//             Gestionnaire.trouverParEmail(email),
//             Superviseur.trouverParEmail(email)
//         ];

//         const results = await Promise.all(queries);
//         return results.some(result => result !== null);
//     }

//     static async _verifierExistenceTelephone(telephone) {
//         const queries = [
//             Producteur.trouverParTelephone(telephone),
//             Collecteur.findByTelephone(telephone)
//         ];

//         const results = await Promise.all(queries);
//         return results.some(result => result !== null);
//     }

//     static async _trouverUtilisateurParIdentifiant(identifiant) {
//         // Par email
//         let utilisateur = await Producteur.trouverParEmail(identifiant);
//         if (utilisateur) return { utilisateur, type: 'producteur' };

//         utilisateur = await Collecteur.findByEmail(identifiant);
//         if (utilisateur) return { utilisateur, type: 'collecteur' };

//         utilisateur = await Gestionnaire.findByEmail(identifiant);
//         if (utilisateur) return { utilisateur, type: 'gestionnaire' };

//         utilisateur = await Superviseur.findByEmail(identifiant);
//         if (utilisateur) return { utilisateur, type: 'superviseur' };

//         // Par téléphone
//         utilisateur = await Producteur.trouverParTelephone(identifiant);
//         if (utilisateur) return { utilisateur, type: 'producteur' };

//         utilisateur = await Collecteur.findByTelephone(identifiant);
//         if (utilisateur) return { utilisateur, type: 'collecteur' };

//         return null;
//     }

//     static _verifierStatutUtilisateur(utilisateur, type) {
//         switch(type) {
//             case 'producteur':
//                 if (!utilisateur.est_actif) {
//                     return { valide: false, message: 'Compte désactivé' };
//                 }
//                 break;
            
//             case 'collecteur':
//                 if (utilisateur.statut === 'en_attente') {
//                     return { valide: false, message: 'Compte en attente de validation' };
//                 }
//                 if (utilisateur.statut === 'suspendu') {
//                     return { valide: false, message: 'Compte suspendu' };
//                 }
//                 if (utilisateur.statut !== 'actif') {
//                     return { valide: false, message: 'Compte non actif' };
//                 }
//                 break;
            
//             case 'gestionnaire':
//             case 'superviseur':
//                 if (!utilisateur.est_actif) {
//                     return { valide: false, message: 'Compte désactivé' };
//                 }
//                 break;
//         }

//         return { valide: true };
//     }

//     static async _mettreAJourDerniereConnexion(id, type) {
//         try {
//             const date = new Date();
//             let table;
            
//             switch(type) {
//                 case 'producteur':
//                     table = 'producteurs';
//                     break;
//                 case 'collecteur':
//                     table = 'collecteurs';
//                     break;
//                 case 'gestionnaire':
//                     table = 'gestionnaires_points';
//                     break;
//                 case 'superviseur':
//                     table = 'superviseurs';
//                     break;
//                 default:
//                     return;
//             }
            
//             await pool.query(
//                 `UPDATE ${table} SET derniere_connexion = $1 WHERE id = $2`,
//                 [date, id]
//             );
//         } catch (erreur) {
//             console.error('⚠️ Erreur mise à jour connexion:', erreur);
//         }
//     }

//     static async _mettreAJourMotDePasse(id, type, nouveauMotDePasseHash) {
//         switch(type) {
//             case 'producteur':
//                 await pool.query(
//                     'UPDATE producteurs SET mot_de_passe_hash = $1 WHERE id = $2',
//                     [nouveauMotDePasseHash, id]
//                 );
//                 break;
//             case 'collecteur':
//                 await pool.query(
//                     'UPDATE collecteurs SET mot_de_passe_hash = $1 WHERE id = $2',
//                     [nouveauMotDePasseHash, id]
//                 );
//                 break;
//             case 'gestionnaire':
//                 await pool.query(
//                     'UPDATE gestionnaires_points SET mot_de_passe_hash = $1 WHERE id = $2',
//                     [nouveauMotDePasseHash, id]
//                 );
//                 break;
//             case 'superviseur':
//                 await pool.query(
//                     'UPDATE superviseurs SET mot_de_passe_hash = $1 WHERE id = $2',
//                     [nouveauMotDePasseHash, id]
//                 );
//                 break;
//         }
//     }

//     static _preparerDonneesUtilisateur(utilisateur, type) {
//         const base = {
//             id: utilisateur.id,
//             email: utilisateur.email,
//             telephone: utilisateur.telephone,
//             type: type,
//             nomComplet: utilisateur.nom_complet
//         };

//         switch(type) {
//             case 'producteur':
//                 return {
//                     ...base,
//                     typeProducteur: utilisateur.type_producteur,
//                     points: utilisateur.points || 0,
//                     quartier: utilisateur.quartier,
//                     commune: utilisateur.commune
//                 };
            
//             case 'collecteur':
//                 return {
//                     ...base,
//                     typeCollecteur: utilisateur.type_collecteur,
//                     statut: utilisateur.statut,
//                     zoneIntervention: utilisateur.zone_intervention_nom,
//                     pointsTotal: utilisateur.points_total || 0,
//                     gainsTotal: utilisateur.gains_total || 0
//                 };
            
//             case 'gestionnaire':
//                 return {
//                     ...base,
//                     pointCollecteId: utilisateur.point_collecte_id,
//                     fonction: utilisateur.fonction
//                 };
            
//             case 'superviseur':
//                 return {
//                     ...base,
//                     role: utilisateur.role
//                 };
            
//             default:
//                 return base;
//         }
//     }
// }

// export default AuthController;




import bcrypt from 'bcrypt';
import Collecteur from '../models/Collecteur.js';
import Mission from '../models/Mission.js';
import jwt from 'jsonwebtoken';
import Notification from '../models/Notification.js';
import { pool } from '../config/database.js';



// // Nouvelle méthode pour mettre à jour les infos personnelles
// static async mettreAJourInfosPersonnelles(req, res) {
//     try {
//         const collecteurId = req.utilisateurId;
//         const {
//             nomComplet,
//             telephone,
//             numeroIdentite,
//             zoneInterventionNom,
//             quartiersHabituels,
//             communesIntervention,
//             zoneIntervention,
//             photoProfilUrl,
//             photoCniRectoUrl,
//             photoCniVersoUrl
//         } = req.body;

//         // Vérifier si le téléphone est déjà utilisé par un autre collecteur
//         if (telephone) {
//             const collecteurExistant = await Collecteur.trouverParTelephone(telephone);
//             if (collecteurExistant && collecteurExistant.id !== collecteurId) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Ce numéro de téléphone est déjà utilisé'
//                 });
//             }
//         }

//         const donnees = {
//             nomComplet,
//             telephone,
//             numeroIdentite,
//             zoneInterventionNom,
//             quartiersHabituels,
//             communesIntervention,
//             zoneIntervention,
//             photoProfilUrl,
//             photoCniRectoUrl,
//             photoCniVersoUrl
//         };

//         const collecteur = await Collecteur.mettreAJourInfosPersonnelles(collecteurId, donnees);

//         if (!collecteur) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Aucune donnée à mettre à jour'
//             });
//         }

//         res.json({
//             success: true,
//             message: 'Informations personnelles mises à jour avec succès',
//             collecteur
//         });
//     } catch (erreur) {
//         console.error('Erreur mise à jour infos personnelles:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la mise à jour des informations',
//             erreur: erreur.message
//         });
//     }
// }

// // Nouvelle méthode pour changer le mot de passe
// static async changerMotDePasse(req, res) {
//     try {
//         const collecteurId = req.utilisateurId;
//         const { ancienMotDePasse, nouveauMotDePasse } = req.body;

//         // Vérifier l'ancien mot de passe
//         const ancienHash = await Collecteur.verifierMotDePasse(collecteurId);
//         const motDePasseValide = await bcrypt.compare(ancienMotDePasse, ancienHash);

//         if (!motDePasseValide) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Ancien mot de passe incorrect'
//             });
//         }

//         // Hasher le nouveau mot de passe
//         const salt = await bcrypt.genSalt(10);
//         const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, salt);

//         // Mettre à jour
//         await Collecteur.changerMotDePasse(collecteurId, nouveauMotDePasseHash);

//         res.json({
//             success: true,
//             message: 'Mot de passe modifié avec succès'
//         });
//     } catch (erreur) {
//         console.error('Erreur changement mot de passe:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors du changement de mot de passe',
//             erreur: erreur.message
//         });
//     }
// }


class CollecteurController {
    // Inscription d'un collecteur avec upload de fichiers
    static async inscription(req, res) {
        try {
            // Les fichiers sont dans req.files
            const files = req.files || {};
            
            // Construire les URLs des fichiers uploadés
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            
            const photoProfilUrl = files.photoProfil ? 
                `${baseUrl}/uploads/profils/${files.photoProfil[0].filename}` : null;
            
            const photoCniRectoUrl = files.photoCniRecto ? 
                `${baseUrl}/uploads/cnis/${files.photoCniRecto[0].filename}` : null;
            
            const photoCniVersoUrl = files.photoCniVerso ? 
                `${baseUrl}/uploads/cnis/${files.photoCniVerso[0].filename}` : null;

            // Récupérer les données du formulaire (stringifiées)
            const {
                email, telephone, motDePasse, nomComplet,
                typeCollecteur, numeroIdentite, zoneInterventionNom,
                quartiersHabituels, communesIntervention, cguAcceptees
            } = req.body;

            // Vérifications
            if (!email || !telephone || !motDePasse || !nomComplet || !typeCollecteur || !zoneInterventionNom) {
                return res.status(400).json({
                    success: false,
                    message: 'Tous les champs obligatoires doivent être remplis'
                });
            }

            // Vérifier les photos CNI
            if (!photoCniRectoUrl || !photoCniVersoUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'Les photos recto et verso de la CNI sont requises'
                });
            }

            // Vérifier si l'email existe déjà
            const collecteurExistant = await Collecteur.trouverParEmail(email);
            if (collecteurExistant) {
                // Nettoyer les fichiers uploadés si erreur
                CollecteurController.cleanupUploadedFiles(files);
                return res.status(400).json({
                    success: false,
                    message: 'Un compte avec cet email existe déjà'
                });
            }

            // Vérifier le téléphone
            const telephoneExistant = await Collecteur.trouverParTelephone(telephone);
            if (telephoneExistant) {
                CollecteurController.cleanupUploadedFiles(files);
                return res.status(400).json({
                    success: false,
                    message: 'Un compte avec ce numéro existe déjà'
                });
            }

            // Hasher le mot de passe
            const salt = await bcrypt.genSalt(10);
            const motDePasseHash = await bcrypt.hash(motDePasse, salt);

            // Traiter les tableaux
            const quartiersArray = quartiersHabituels ? 
                quartiersHabituels.split(',').map(q => q.trim()).filter(q => q) : [];
            
            const communesArray = communesIntervention ? 
                communesIntervention.split(',').map(c => c.trim()).filter(c => c) : [];

            // Créer le collecteur avec les URLs des photos
            const collecteurData = {
                email,
                telephone,
                motDePasseHash,
                nomComplet,
                typeCollecteur,
                numeroIdentite: numeroIdentite || null,
                zoneIntervention: {
                    type: "Polygon",
                    coordinates: [[
                        [2.3522, 48.8566],
                        [2.3622, 48.8566],
                        [2.3622, 48.8666],
                        [2.3522, 48.8666],
                        [2.3522, 48.8566]
                    ]]
                },
                zoneInterventionNom,
                quartiersHabituels: quartiersArray,
                communesIntervention: communesArray,
                photoProfilUrl,
                photoCniRectoUrl,
                photoCniVersoUrl,
                cguAcceptees: cguAcceptees === 'true' || cguAcceptees === true
            };

            const nouveauCollecteur = await Collecteur.creer(collecteurData);

            // Créer une notification pour le superviseur
            await pool.query(
                `INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification)
                 VALUES ((SELECT id FROM superviseurs LIMIT 1), 'superviseur', 
                         'Nouveau collecteur en attente', 
                         $1 || ' demande à rejoindre la plateforme. Documents CNI fournis.',
                         'info')`,
                [nomComplet]
            );

            res.status(201).json({
                success: true,
                message: 'Inscription réussie. En attente de validation par un superviseur.',
                collecteur: {
                    id: nouveauCollecteur.id,
                    email: nouveauCollecteur.email,
                    nomComplet: nouveauCollecteur.nom_complet,
                    statut: nouveauCollecteur.statut
                }
            });

        } catch (erreur) {
            console.error('❌ Erreur inscription collecteur:', erreur);
            
            // Nettoyer les fichiers uploadés en cas d'erreur
            if (req.files) {
                CollecteurController.cleanupUploadedFiles(req.files);
            }
            
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'inscription',
                erreur: erreur.message
            });
        }
    }

    // Helper pour nettoyer les fichiers uploadés en cas d'erreur
    static cleanupUploadedFiles(files) {
        if (!files) return;
        
        Object.values(files).forEach(fileArray => {
            fileArray.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                    console.log(`🧹 Fichier supprimé: ${file.path}`);
                } catch (err) {
                    console.error('❌ Erreur lors de la suppression du fichier:', err);
                }
            });
        });
    }

    // Connexion
    static async connexion(req, res) {
        try {
            const { identifiant, motDePasse } = req.body;

            let collecteur = await Collecteur.trouverParEmail(identifiant);
            if (!collecteur) {
                collecteur = await Collecteur.trouverParTelephone(identifiant);
            }

            if (!collecteur) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            const motDePasseValide = await bcrypt.compare(motDePasse, collecteur.mot_de_passe_hash);
            if (!motDePasseValide) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            if (collecteur.statut !== 'actif') {
                return res.status(403).json({
                    success: false,
                    message: 'Votre compte est en attente de validation ou a été suspendu'
                });
            }

            await Collecteur.mettreAJourConnexion(collecteur.id);

            const token = jwt.sign(
                { 
                    id: collecteur.id, 
                    email: collecteur.email, 
                    type: 'collecteur' 
                },
                process.env.JWT_SECRET || 'votre_cle_secrete',
                { expiresIn: process.env.JWT_EXPIRE || '7d' }
            );

            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                collecteur: {
                    id: collecteur.id,
                    email: collecteur.email,
                    telephone: collecteur.telephone,
                    nomComplet: collecteur.nom_complet,
                    typeCollecteur: collecteur.type_collecteur,
                    statut: collecteur.statut,
                    points: collecteur.points_total,
                    gains: collecteur.gains_total,
                    photoProfilUrl: collecteur.photo_profil_url
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur connexion:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion',
                erreur: erreur.message
            });
        }
    }

    // Obtenir le profil complet
    static async monProfil(req, res) {
        try {
            const collecteurId = req.utilisateurId;
            const collecteur = await Collecteur.trouverParId(collecteurId);

            if (!collecteur) {
                return res.status(404).json({
                    success: false,
                    message: 'Collecteur non trouvé'
                });
            }

            delete collecteur.mot_de_passe_hash;

            res.json({
                success: true,
                collecteur
            });
        } catch (erreur) {
            console.error('❌ Erreur profil:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du profil',
                erreur: erreur.message
            });
        }
    }

    // Mettre à jour les infos personnelles
    static async mettreAJourInfosPersonnelles(req, res) {
        try {
            const collecteurId = req.utilisateurId;
            const {
                nomComplet,
                telephone,
                numeroIdentite,
                zoneInterventionNom,
                quartiersHabituels,
                communesIntervention,
                zoneIntervention
            } = req.body;

            // Vérifier téléphone unique
            if (telephone) {
                const collecteurExistant = await Collecteur.trouverParTelephone(telephone);
                if (collecteurExistant && collecteurExistant.id !== collecteurId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Ce numéro de téléphone est déjà utilisé'
                    });
                }
            }

            const donnees = {
                nomComplet,
                telephone,
                numeroIdentite,
                zoneInterventionNom,
                quartiersHabituels: quartiersHabituels ? 
                    quartiersHabituels.split(',').map(q => q.trim()).filter(q => q) : undefined,
                communesIntervention: communesIntervention ? 
                    communesIntervention.split(',').map(c => c.trim()).filter(c => c) : undefined,
                zoneIntervention
            };

            const collecteur = await Collecteur.mettreAJourInfosPersonnelles(collecteurId, donnees);

            if (!collecteur) {
                return res.status(400).json({
                    success: false,
                    message: 'Aucune donnée à mettre à jour'
                });
            }

            res.json({
                success: true,
                message: 'Informations personnelles mises à jour avec succès',
                collecteur
            });
        } catch (erreur) {
            console.error('❌ Erreur mise à jour:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour',
                erreur: erreur.message
            });
        }
    }

    // Changer mot de passe
    static async changerMotDePasse(req, res) {
        try {
            const collecteurId = req.utilisateurId;
            const { ancienMotDePasse, nouveauMotDePasse } = req.body;

            const ancienHash = await Collecteur.verifierMotDePasse(collecteurId);
            const motDePasseValide = await bcrypt.compare(ancienMotDePasse, ancienHash);

            if (!motDePasseValide) {
                return res.status(401).json({
                    success: false,
                    message: 'Ancien mot de passe incorrect'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, salt);

            await Collecteur.changerMotDePasse(collecteurId, nouveauMotDePasseHash);

            res.json({
                success: true,
                message: 'Mot de passe modifié avec succès'
            });
        } catch (erreur) {
            console.error('❌ Erreur changement mot de passe:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du changement de mot de passe',
                erreur: erreur.message
            });
        }
    }

 
// Méthode pour obtenir le profil complet
 static async monProfil(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        const collecteur = await Collecteur.trouverParId(collecteurId);

        if (!collecteur) {
            return res.status(404).json({
                success: false,
                message: 'Collecteur non trouvé'
            });
        }

        // Ne pas renvoyer les informations sensibles
        delete collecteur.mot_de_passe_hash;

        res.json({
            success: true,
            collecteur
        });
    } catch (erreur) {
        console.error('Erreur récupération profil:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du profil',
            erreur: erreur.message
        });
    }
}

    // Connexion
   // Dans collecteurController.js - méthode connexion
 static async connexion(req, res) {
    try {
        const { identifiant, motDePasse } = req.body;

        let collecteur = await Collecteur.trouverParEmail(identifiant);
        if (!collecteur) {
            collecteur = await Collecteur.trouverParTelephone(identifiant);
        }

        if (!collecteur) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }

        // Vérifier le mot de passe
        const motDePasseValide = await bcrypt.compare(motDePasse, collecteur.mot_de_passe_hash);
        if (!motDePasseValide) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }

        // Vérifier le statut
        if (collecteur.statut !== 'actif') {
            return res.status(403).json({
                success: false,
                message: 'Votre compte est en attente de validation ou a été suspendu'
            });
        }

        // Mettre à jour la connexion
        await Collecteur.mettreAJourConnexion(collecteur.id);

        // ✅ CORRECTION: Générer token JWT directement avec jwt.sign
        const token = jwt.sign(
            { 
                id: collecteur.id, 
                email: collecteur.email, 
                type: 'collecteur' 
            },
            process.env.JWT_SECRET || 'votre_cle_secrete',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            success: true,
            message: 'Connexion réussie',
            token,
            collecteur: {
                id: collecteur.id,
                email: collecteur.email,
                telephone: collecteur.telephone,
                nomComplet: collecteur.nom_complet,
                typeCollecteur: collecteur.type_collecteur,
                statut: collecteur.statut,
                points: collecteur.points_total,
                gains: collecteur.gains_total
            }
        });
    } catch (erreur) {
        console.error('Erreur connexion collecteur:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion',
            erreur: erreur.message
        });
    }
  }

    // Obtenir les missions disponibles
    static async missionsDisponibles(req, res) {
        try {
            const collecteurId = req.utilisateurId;
            const missions = await Mission.disponiblesPourCollecteur(collecteurId);

            res.json({
                success: true,
                missions
            });
        } catch (erreur) {
            console.error('Erreur récupération missions:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des missions',
                erreur: erreur.message
            });
        }
    }

    // Accepter une mission
    static async accepterMission(req, res) {
        try {
            const { missionId } = req.params;
            const collecteurId = req.utilisateurId;

            // Vérifier si le collecteur a déjà une mission en cours
            const missionsEnCours = await Mission.obtenirParCollecteur(collecteurId, 'en_cours');
            if (missionsEnCours.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Vous avez déjà une mission en cours'
                });
            }

            const mission = await Mission.attribuer(missionId, collecteurId);

            res.json({
                success: true,
                message: 'Mission acceptée avec succès',
                mission
            });
        } catch (erreur) {
            console.error('Erreur acceptation mission:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'acceptation de la mission',
                erreur: erreur.message
            });
        }
    }

    // Démarrer une collecte
    static async demarrerCollecte(req, res) {
        try {
            const { missionId } = req.params;
            const collecteurId = req.utilisateurId;

            const mission = await Mission.demarrerCollecte(missionId, collecteurId);

            res.json({
                success: true,
                message: 'Collecte démarrée',
                mission
            });
        } catch (erreur) {
            console.error('Erreur démarrage collecte:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du démarrage de la collecte',
                erreur: erreur.message
            });
        }
    }

    // Terminer une collecte (avant dépôt)
    static async terminerCollecte(req, res) {
        try {
            const { missionId } = req.params;
            const collecteurId = req.utilisateurId;
            const { photoPreuveUrl, codeConfirmation, notes, conformiteTri } = req.body;

            const mission = await Mission.terminerCollecte(missionId, collecteurId, {
                photoPreuveUrl,
                codeConfirmation,
                notes,
                conformiteTri
            });

            res.json({
                success: true,
                message: 'Collecte terminée. En attente de dépôt au point de collecte.',
                mission
            });
        } catch (erreur) {
            console.error('Erreur fin collecte:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la fin de la collecte',
                erreur: erreur.message
            });
        }
    }

    // Choisir point de dépôt
    static async choisirPointDepot(req, res) {
        try {
            const { missionId } = req.params;
            const { pointDepotId } = req.body;
            const collecteurId = req.utilisateurId;

            const mission = await Mission.deposerAuPoint(missionId, collecteurId, pointDepotId);

            res.json({
                success: true,
                message: 'Point de dépôt sélectionné',
                mission
            });
        } catch (erreur) {
            console.error('Erreur choix point dépôt:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du choix du point de dépôt',
                erreur: erreur.message
            });
        }
    }

    // Ajouter une photo preuve
    static async ajouterPhoto(req, res) {
        try {
            const { missionId } = req.params;
            const collecteurId = req.utilisateurId;
            const { url, type } = req.body;

            const photo = await Mission.ajouterPhoto(missionId, collecteurId, url, type);

            res.json({
                success: true,
                message: 'Photo ajoutée avec succès',
                photo
            });
        } catch (erreur) {
            console.error('Erreur ajout photo:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'ajout de la photo',
                erreur: erreur.message
            });
        }
    }

    // Modifier le profil
    static async modifierProfil(req, res) {
        try {
            const collecteurId = req.utilisateurId;
            const donnees = req.body;

            const collecteur = await Collecteur.mettreAJour(collecteurId, donnees);

            res.json({
                success: true,
                message: 'Profil mis à jour avec succès',
                collecteur
            });
        } catch (erreur) {
            console.error('Erreur modification profil:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la modification du profil',
                erreur: erreur.message
            });
        }
    }

    // ✅ Obtenir mes missions avec détails
static async mesMissions(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        const { statut } = req.query;

        const missions = await Collecteur.missionsAvecDetails(collecteurId, statut);

        // Grouper par statut pour faciliter l'affichage
        const grouped = {
            enCours: missions.filter(m => m.statut === 'en_cours'),
            acceptees: missions.filter(m => m.statut === 'acceptee'),
            deposees: missions.filter(m => m.statut === 'deposee'),
            validees: missions.filter(m => m.statut === 'validee'),
            autres: missions.filter(m => !['en_cours', 'acceptee', 'deposee', 'validee'].includes(m.statut))
        };

        res.json({
            success: true,
            missions,
            grouped,
            total: missions.length
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération missions:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// ✅ Obtenir mes gains avec détails
static async mesGains(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        
        const gains = await Collecteur.gainsAvecDetails(collecteurId);
        const statistiques = await Collecteur.statistiquesGains(collecteurId);

        // Grouper par type
        const grouped = {
            collecte: gains.filter(g => g.type_gain === 'collecte'),
            bonus: gains.filter(g => g.type_gain === 'bonus')
        };

        res.json({
            success: true,
            gains,
            grouped,
            statistiques,
            total: gains.length
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération gains:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// ✅ Tableau de bord amélioré
static async tableauBord(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        
        const dashboard = await Collecteur.tableauBord(collecteurId);
        const missions = await Collecteur.missionsAvecDetails(collecteurId);
        const statistiquesGains = await Collecteur.statistiquesGains(collecteurId);

        // Compter par statut
        const compteurs = {
            disponibles: missions.filter(m => m.statut === 'disponible').length,
            acceptees: missions.filter(m => m.statut === 'acceptee').length,
            enCours: missions.filter(m => m.statut === 'en_cours').length,
            deposees: missions.filter(m => m.statut === 'deposee').length,
            validees: missions.filter(m => m.statut === 'validee').length
        };

        // Dernière mission
        const derniereMission = missions
            .filter(m => m.statut === 'validee')
            .sort((a, b) => new Date(b.date_validation) - new Date(a.date_validation))[0];

        res.json({
            success: true,
            dashboard,
            compteurs,
            derniereMission,
            statistiquesGains,
            missionEnCours: missions.find(m => m.statut === 'en_cours') || null
        });
    } catch (erreur) {
        console.error('❌ Erreur tableau bord:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// ✅ Obtenir mes missions (version améliorée)
static async mesMissions(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        const { statut } = req.query;

        const missions = await Collecteur.missionsAvecDetails(collecteurId, statut);

        // Grouper par statut pour faciliter l'affichage
        const grouped = {
            enCours: missions.filter(m => m.statut === 'en_cours'),
            acceptees: missions.filter(m => m.statut === 'acceptee'),
            deposees: missions.filter(m => m.statut === 'deposee'),
            validees: missions.filter(m => m.statut === 'validee'),
            autres: missions.filter(m => !['en_cours', 'acceptee', 'deposee', 'validee'].includes(m.statut))
        };

        res.json({
            success: true,
            missions,
            grouped,
            total: missions.length
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération missions:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// ✅ Obtenir mes gains (version améliorée)
static async mesGains(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        
        const gains = await Collecteur.gainsAvecDetails(collecteurId);
        const statistiques = await Collecteur.statistiquesGains(collecteurId);

        // Grouper par type
        const grouped = {
            collecte: gains.filter(g => g.type_gain === 'collecte'),
            bonus: gains.filter(g => g.type_gain === 'bonus')
        };

        // Calcul des totaux
        const totalCollecte = grouped.collecte.reduce((sum, g) => sum + parseFloat(g.montant), 0);
        const totalBonus = grouped.bonus.reduce((sum, g) => sum + parseFloat(g.montant), 0);

        res.json({
            success: true,
            gains,
            grouped,
            statistiques,
            totals: {
                collecte: totalCollecte,
                bonus: totalBonus,
                global: totalCollecte + totalBonus
            },
            total: gains.length
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération gains:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}


// Tableau de bord 
static async tableauBord(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        
        const dashboard = await Collecteur.tableauBord(collecteurId);
        
        // Récupérer la mission en cours
        const missionEnCours = await pool.query(`
            SELECT m.*, 
                   d.type_dechet, d.quantite, d.unite,
                   p.nom_complet as producteur_nom,
                   p.adresse as producteur_adresse,
                   p.telephone as producteur_telephone
            FROM missions m
            JOIN declarations_dechets d ON m.declaration_id = d.id
            JOIN producteurs p ON d.producteur_id = p.id
            WHERE m.collecteur_id = $1 AND m.statut = 'en_cours'
            LIMIT 1
        `, [collecteurId]);

        res.json({
            success: true,
            dashboard: dashboard.statistiques || {},
            gains: dashboard.gains || {},
            historique: dashboard.historique || [],
            missionEnCours: missionEnCours.rows[0] || null
        });
        
    } catch (erreur) {
        console.error('❌ Erreur tableau bord:', erreur);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération du tableau de bord' 
        });
    }
}


static async mesGains(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        
        const gains = await Collecteur.gainsAvecDetails(collecteurId);
        
        // Statistiques
        const totalCollecte = gains
            .filter(g => g.type_gain === 'collecte')
            .reduce((sum, g) => sum + parseFloat(g.montant), 0);
            
        const totalBonus = gains
            .filter(g => g.type_gain === 'bonus')
            .reduce((sum, g) => sum + parseFloat(g.montant), 0);
            
        const totalValide = gains
            .filter(g => g.statut === 'valide')
            .reduce((sum, g) => sum + parseFloat(g.montant), 0);

        res.json({
            success: true,
            gains,
            resume: {
                total: totalValide,
                collecte: totalCollecte,
                bonus: totalBonus,
                enAttente: gains.filter(g => g.statut === 'en_attente').length
            }
        });
        
    } catch (erreur) {
        console.error('❌ Erreur récupération gains:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

}

export default CollecteurController;



// 28/02/2026 :


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../config/database.js';

// Importer tous les modèles
import Producteur from '../models/Producteur.js';
import Collecteur from '../models/Collecteur.js';
import Gestionnaire from '../models/GestionnairePoint.js';
import Superviseur from '../models/Superviseur.js';
import Recycleur from '../models/Recycleur.js';
import Sponsor from '../models/Sponsor.js';
import Ong from '../models/Ong.js';
import Admin from '../models/Admin.js';
import EmailService from '../services/EmailService.js';

class AuthController {
    
    
    // Inscription producteur
    static async inscrireProducteur(req, res) {
        try {
            const { 
                email, 
                telephone, 
                motDePasse, 
                typeProducteur, 
                nomComplet, 
                adresse, 
                longitude, 
                latitude, 
                quartier, 
                commune,
                cguAcceptees 
            } = req.body;

            // Vérifier si l'utilisateur existe déjà
            const utilisateurExistant = await AuthController._verifierExistenceEmail(email);
            if (utilisateurExistant) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Un compte avec cet email existe déjà' 
                });
            }

            const telephoneExistant = await AuthController._verifierExistenceTelephone(telephone);
            if (telephoneExistant) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Un compte avec ce numéro de téléphone existe déjà' 
                });
            }

            if (!cguAcceptees) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Vous devez accepter les CGU' 
                });
            }

            // Hasher le mot de passe
            const motDePasseHash = await bcrypt.hash(motDePasse, 10);

            // Créer le producteur
            const producteurData = {
                email,
                telephone,
                motDePasseHash,
                typeProducteur,
                nomComplet,
                adresse,
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude),
                quartier,
                commune,
                cguAcceptees
            };

            const nouveauProducteur = await Producteur.creer(producteurData);

            // Générer le token JWT
            const token = AuthController._genererToken(
                nouveauProducteur.id, 
                nouveauProducteur.email, 
                'producteur'
            );

            res.status(201).json({
                success: true,
                message: 'Inscription réussie',
                token,
                utilisateur: {
                    id: nouveauProducteur.id,
                    email: nouveauProducteur.email,
                    telephone: nouveauProducteur.telephone,
                    type: 'producteur',
                    role: nouveauProducteur.type_producteur,
                    nomComplet: nouveauProducteur.nom_complet,
                    quartier: nouveauProducteur.quartier,
                    commune: nouveauProducteur.commune,
                    points: nouveauProducteur.points || 0
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur inscription producteur:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de l\'inscription',
                erreur: erreur.message 
            });
        }
    }

    // Inscription collecteur
    static async inscrireCollecteur(req, res) {
        try {
            const { 
                email, 
                telephone, 
                motDePasse, 
                nomComplet, 
                typeCollecteur,
                numeroIdentite,
                zoneInterventionNom,
                quartiersHabituels,
                communesIntervention,
                cguAcceptees 
            } = req.body;

            // Vérifications
            const utilisateurExistant = await AuthController._verifierExistenceEmail(email);
            if (utilisateurExistant) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Un compte avec cet email existe déjà' 
                });
            }

            const telephoneExistant = await AuthController._verifierExistenceTelephone(telephone);
            if (telephoneExistant) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Un compte avec ce numéro de téléphone existe déjà' 
                });
            }

            if (!cguAcceptees) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Vous devez accepter les CGU' 
                });
            }

            // Hasher le mot de passe
            const motDePasseHash = await bcrypt.hash(motDePasse, 10);

            // Créer le collecteur
            const collecteurData = {
                email,
                telephone,
                motDePasseHash,
                nomComplet,
                typeCollecteur,
                numeroIdentite,
                zoneInterventionNom,
                quartiersHabituels,
                communesIntervention,
                cguAcceptees
            };

            const nouveauCollecteur = await Collecteur.create(collecteurData);

            res.status(201).json({
                success: true,
                message: 'Inscription réussie. Votre compte est en attente de validation.',
                utilisateur: {
                    id: nouveauCollecteur.id,
                    email: nouveauCollecteur.email,
                    telephone: nouveauCollecteur.telephone,
                    type: 'collecteur',
                    nomComplet: nouveauCollecteur.nom_complet,
                    statut: nouveauCollecteur.statut
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur inscription collecteur:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de l\'inscription',
                erreur: erreur.message 
            });
        }
    }

    // Inscription générique
    static async inscrire(req, res) {
        try {
            const { typeUtilisateur } = req.body;
            
            if (!typeUtilisateur) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Le type d\'utilisateur est requis (producteur/collecteur)' 
                });
            }

            switch(typeUtilisateur) {
                case 'producteur':
                    return await AuthController.inscrireProducteur(req, res);
                case 'collecteur':
                    return await AuthController.inscrireCollecteur(req, res);
                default:
                    return res.status(400).json({ 
                        success: false,
                        message: 'Type d\'utilisateur invalide' 
                    });
            }
        } catch (erreur) {
            console.error('❌ Erreur inscription:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de l\'inscription',
                erreur: erreur.message 
            });
        }
    }

    // ============================================
    // CONNEXIONS
    // ============================================
    
    // Connexion unifiée
    static async connecter(req, res) {
        try {
            const { identifiant, motDePasse } = req.body;

            if (!identifiant || !motDePasse) {
                return res.status(400).json({
                    success: false,
                    message: 'Identifiant et mot de passe requis'
                });
            }

            // Chercher l'utilisateur dans toutes les tables
            const resultat = await AuthController._trouverUtilisateurParIdentifiant(identifiant);
            
            if (!resultat || !resultat.utilisateur) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Identifiants incorrects' 
                });
            }

            const { utilisateur, type } = resultat;

            // Vérifier le mot de passe
            const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.mot_de_passe_hash);
            if (!motDePasseValide) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Identifiants incorrects' 
                });
            }

            // Vérifications spécifiques selon le type
            const verificationStatut = AuthController._verifierStatutUtilisateur(utilisateur, type);
            if (!verificationStatut.valide) {
                return res.status(403).json({ 
                    success: false,
                    message: verificationStatut.message 
                });
            }

            // Mettre à jour la dernière connexion
            await AuthController._mettreAJourDerniereConnexion(utilisateur.id, type);

            // Générer le token
            const token = AuthController._genererToken(
                utilisateur.id, 
                utilisateur.email, 
                type
            );

            // Préparer la réponse
            const reponseUtilisateur = AuthController._preparerDonneesUtilisateur(utilisateur, type);

            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                utilisateur: reponseUtilisateur
            });
        } catch (erreur) {
            console.error('❌ Erreur connexion:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la connexion',
                erreur: erreur.message 
            });
        }
    }

    // Connexions spécifiques (rétrocompatibilité)
    static async connecterProducteur(req, res) {
        return AuthController.connecter(req, res);
    }

    static async connecterCollecteur(req, res) {
        return AuthController.connecter(req, res);
    }

    static async connecterGestionnaire(req, res) {
        return AuthController.connecter(req, res);
    }

    static async connecterSuperviseur(req, res) {
        return AuthController.connecter(req, res);
    }

   
    static verifierToken(req, res, next) {
    // Routes publiques
    const publicRoutes = [
        '/api/collecteurs/connexion',
        '/api/collecteurs/inscription',
        '/api/gestionnaires/connexion',
        '/api/superviseurs/connexion',
        '/api/producteurs/connexion',
        '/api/producteurs/inscription'
    ];

    if (publicRoutes.includes(req.path) || publicRoutes.includes(req.originalUrl)) {
        console.log('🔓 Route publique:', req.path);
        return next();
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ 
            success: false,
            message: 'Token manquant'
        });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ 
            success: false,
            message: 'Format de token invalide'
        });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // ✅ Gestion des deux formats de token
        req.utilisateurId = decoded.id || decoded.userId;
        req.utilisateurEmail = decoded.email;
        
        // Si le token a un type, on l'utilise
        if (decoded.type) {
            req.utilisateurType = decoded.type;
        } else {
            // Sinon, on détermine le type à partir de l'URL ou de la base de données
            if (req.originalUrl.includes('/api/producteurs/')) {
                req.utilisateurType = 'producteur';
            } else if (req.originalUrl.includes('/api/collecteurs/')) {
                req.utilisateurType = 'collecteur';
            } else if (req.originalUrl.includes('/api/gestionnaires/')) {
                req.utilisateurType = 'gestionnaire';
            } else if (req.originalUrl.includes('/api/superviseurs/')) {
                req.utilisateurType = 'superviseur';
            } else {
                // Par défaut
                req.utilisateurType = 'producteur';
            }
            console.log(`⚠️ Type déduit de l'URL: ${req.utilisateurType}`);
        }
        
        console.log(`✅ Token valide - ${req.utilisateurEmail} (${req.utilisateurType})`);
        next();
        
    } catch (error) {
        console.error('❌ Token invalide:', error.message);
        return res.status(401).json({ 
            success: false,
            message: 'Token invalide ou expiré'
        });
    }
}


    static verifierTypeUtilisateur(typesAutorises) {
    return (req, res, next) => {
        if (!req.utilisateurType) {
            // Si pas de type, on considère que c'est un producteur par défaut
            req.utilisateurType = 'producteur';
        }

        if (!typesAutorises.includes(req.utilisateurType)) {
            return res.status(403).json({ 
                success: false,
                message: 'Accès non autorisé pour ce type d\'utilisateur' 
            });
        }

        next();
    };
}

    static async reinitialiserMdp(req, res) {
        try {            const { token, nouveauMotDePasse } = req.body;

            // Vérifier le token
            const requeteToken = `
                SELECT * FROM tokens 
                WHERE token = $1 
                AND type_token = 'reset_password'
                AND utilise = false 
                AND expire_le > NOW()
            `;
            const resultatToken = await pool.query(requeteToken, [token]);
            const tokenValide = resultatToken.rows[0];

            if (!tokenValide) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Token invalide ou expiré' 
                });
            }

            // Hasher le nouveau mot de passe
            const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, 10);

            // Mettre à jour le mot de passe
            await AuthController._mettreAJourMotDePasse(
                tokenValide.utilisateur_id,
                tokenValide.type_utilisateur,
                nouveauMotDePasseHash
            );

            // Marquer le token comme utilisé
            await pool.query(
                'UPDATE tokens SET utilise = true WHERE id = $1',
                [tokenValide.id]
            );

            res.json({ 
                success: true,
                message: 'Mot de passe réinitialisé avec succès' 
            });
        } catch (erreur) {
            console.error('❌ Erreur réinitialisation:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la réinitialisation',
                erreur: erreur.message 
            });
        }
    }

    // ============================================
    // VALIDATION DE COMPTE
    // ============================================
    
    static async validerCompte(req, res) {
        try {
            const { token } = req.params;

            const requeteToken = `
                SELECT * FROM tokens 
                WHERE token = $1 
                AND type_token = 'validation_compte'
                AND utilise = false 
                AND expire_le > NOW()
            `;
            const resultatToken = await pool.query(requeteToken, [token]);
            const tokenValide = resultatToken.rows[0];

            if (!tokenValide) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Token de validation invalide ou expiré' 
                });
            }

            // Activer le compte selon le type
            if (tokenValide.type_utilisateur === 'collecteur') {
                await Collecteur.update(tokenValide.utilisateur_id, { 
                    est_actif: true,
                    statut: 'actif'
                });
            } else if (tokenValide.type_utilisateur === 'producteur') {
                await Producteur.update(tokenValide.utilisateur_id, { 
                    est_actif: true 
                });
            }

            await pool.query(
                'UPDATE tokens SET utilise = true WHERE id = $1',
                [tokenValide.id]
            );

            res.json({ 
                success: true,
                message: 'Compte validé avec succès' 
            });
        } catch (erreur) {
            console.error('❌ Erreur validation compte:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la validation',
                erreur: erreur.message 
            });
        }
    }

   
    
    static _genererToken(id, email, type) {
        return jwt.sign(
            { id, email, type },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
    }

    static async _verifierExistenceEmail(email) {
        const queries = [
            Producteur.trouverParEmail(email),
            Collecteur.trouverParEmail(email),
            Gestionnaire.trouverParEmail(email),
            Superviseur.trouverParEmail(email)
        ];

        const results = await Promise.all(queries);
        return results.some(result => result !== null);
    }

    static async _verifierExistenceTelephone(telephone) {
        const queries = [
            Producteur.trouverParTelephone(telephone),
            Collecteur.findByTelephone(telephone)
        ];

        const results = await Promise.all(queries);
        return results.some(result => result !== null);
    }


    // static async _trouverUtilisateurParIdentifiant(identifiant) {
    //     // Par email
    //     let utilisateur = await Producteur.trouverParEmail(identifiant);
    //     if (utilisateur) return { utilisateur, type: 'producteur' };

    //     utilisateur = await Collecteur.trouverParEmail(identifiant);
    //     if (utilisateur) return { utilisateur, type: 'collecteur' };

    //     utilisateur = await Gestionnaire.trouverParEmail(identifiant);
    //     if (utilisateur) return { utilisateur, type: 'gestionnaire' };

    //     utilisateur = await Superviseur.trouverParEmail(identifiant);
    //     if (utilisateur) return { utilisateur, type: 'superviseur' };

    //     // Par téléphone
    //     utilisateur = await Producteur.trouverParTelephone(identifiant);
    //     if (utilisateur) return { utilisateur, type: 'producteur' };

    //     return null;
    // }

    
    static async _trouverUtilisateurParIdentifiant(identifiant) {
        // Par email
        let utilisateur = await Producteur.trouverParEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'producteur' };

        utilisateur = await Collecteur.trouverParEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'collecteur' };

        utilisateur = await Gestionnaire.trouverParEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'gestionnaire' };

        utilisateur = await Superviseur.trouverParEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'superviseur' };

         utilisateur = await Recycleur.trouverParEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'recycleur' };

        utilisateur = await Sponsor.trouverParEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'sponsor' };

       utilisateur = await Ong.trouverParEmail(identifiant);
       if (utilisateur) return { utilisateur, type: 'ong' };

       utilisateur = await Admin.trouverParEmail(identifiant);
      if (utilisateur) return { utilisateur, type: 'admin' };

    // Par téléphone
      utilisateur = await Recycleur.trouverParTelephone(identifiant);
      if (utilisateur) return { utilisateur, type: 'recycleur' };

      utilisateur = await Sponsor.trouverParTelephone(identifiant);
      if (utilisateur) return { utilisateur, type: 'sponsor' };

      utilisateur = await Ong.trouverParTelephone(identifiant);
      if (utilisateur) return { utilisateur, type: 'ong' };

        // Par téléphone
        utilisateur = await Producteur.trouverParTelephone(identifiant);
        if (utilisateur) return { utilisateur, type: 'producteur' };

        return null;
    }


    // static _verifierStatutUtilisateur(utilisateur, type) {
    //     switch(type) {
    //         case 'producteur':
    //             if (!utilisateur.est_actif) {
    //                 return { valide: false, message: 'Compte désactivé' };
    //             }
    //             break;
            
    //         case 'collecteur':
    //             if (utilisateur.statut === 'en_attente') {
    //                 return { valide: false, message: 'Compte en attente de validation' };
    //             }
    //             if (utilisateur.statut === 'suspendu') {
    //                 return { valide: false, message: 'Compte suspendu' };
    //             }
    //             if (utilisateur.statut !== 'actif') {
    //                 return { valide: false, message: 'Compte non actif' };
    //             }
    //             break;
            
    //         case 'gestionnaire':
    //         case 'superviseur':
    //             if (!utilisateur.est_actif) {
    //                 return { valide: false, message: 'Compte désactivé' };
    //             }
    //             break;
    //     }

    //     return { valide: true };
    // }


static _verifierStatutUtilisateur(utilisateur, type) {
    // Vérification générique pour tous les types
    if (!utilisateur) {
        return { valide: false, message: 'Utilisateur inexistant' };
    }

    switch(type) {
        // ===== PRODUCTEURS =====
        case 'producteur':
            if (utilisateur.est_actif === false) {
                return { valide: false, message: 'Compte producteur désactivé' };
            }
            break;

        // ===== COLLECTEURS =====
        case 'collecteur':
            if (utilisateur.statut === 'en_attente') {
                return { valide: false, message: 'Compte collecteur en attente de validation' };
            }
            if (utilisateur.statut === 'suspendu') {
                return { valide: false, message: 'Compte collecteur suspendu' };
            }
            if (utilisateur.statut === 'rejete') {
                return { valide: false, message: 'Compte collecteur rejeté' };
            }
            if (utilisateur.statut !== 'actif') {
                return { valide: false, message: 'Compte collecteur non actif' };
            }
            if (utilisateur.est_actif === false) {
                return { valide: false, message: 'Compte collecteur désactivé' };
            }
            break;

        // ===== GESTIONNAIRES =====
        case 'gestionnaire':
            if (utilisateur.est_actif === false) {
                return { valide: false, message: 'Compte gestionnaire désactivé' };
            }
            // Vérifier si le point de collecte est actif
            if (utilisateur.point_collecte_id) {
                // Optionnel: vérifier le statut du point de collecte
            }
            break;

        // ===== SUPERVISEURS =====
        case 'superviseur':
            if (utilisateur.est_actif === false) {
                return { valide: false, message: 'Compte superviseur désactivé' };
            }
            break;

        // ===== RECYCLEURS =====
        case 'recycleur':
            if (utilisateur.statut === 'en_attente') {
                return { valide: false, message: 'Compte recycleur en attente de validation' };
            }
            if (utilisateur.statut === 'suspendu') {
                return { valide: false, message: 'Compte recycleur suspendu' };
            }
            if (utilisateur.statut === 'rejete') {
                return { valide: false, message: 'Compte recycleur rejeté' };
            }
            if (utilisateur.statut !== 'actif') {
                return { valide: false, message: 'Compte recycleur non actif' };
            }
            if (utilisateur.est_actif === false) {
                return { valide: false, message: 'Compte recycleur désactivé' };
            }
            break;

        // ===== SPONSORS =====
        case 'sponsor':
            if (utilisateur.est_actif === false) {
                return { valide: false, message: 'Compte sponsor désactivé' };
            }
            if (utilisateur.statut && utilisateur.statut === 'suspendu') {
                return { valide: false, message: 'Compte sponsor suspendu' };
            }
            break;

        // ===== ONG =====
        case 'ong':
            if (utilisateur.est_actif === false) {
                return { valide: false, message: 'Compte ONG désactivé' };
            }
            if (utilisateur.statut && utilisateur.statut === 'suspendu') {
                return { valide: false, message: 'Compte ONG suspendu' };
            }
            break;

        // ===== ADMINS =====
        case 'admin':
            if (utilisateur.est_actif === false) {
                return { valide: false, message: 'Compte administrateur désactivé' };
            }
            break;

        // ===== TYPE INCONNU =====
        default:
            console.warn(`⚠️ Type d'utilisateur inconnu: ${type}`);
            return { valide: false, message: 'Type de compte non reconnu' };
    }

    return { valide: true };
}

    // static async _mettreAJourDerniereConnexion(id, type) {
    //     try {
    //         const date = new Date();
    //         let table;
            
    //         switch(type) {
    //             case 'producteur':
    //                 table = 'producteurs';
    //                 break;
    //             case 'collecteur':
    //                 table = 'collecteurs';
    //                 break;
    //             case 'gestionnaire':
    //                 table = 'gestionnaires_points';
    //                 break;
    //             case 'superviseur':
    //                 table = 'superviseurs';
    //                 break;
    //             default:
    //                 return;
    //         }
            
    //         await pool.query(
    //             `UPDATE ${table} SET derniere_connexion = $1 WHERE id = $2`,
    //             [date, id]
    //         );
    //     } catch (erreur) {
    //         console.error('⚠️ Erreur mise à jour connexion:', erreur);
    //     }
    // }


    
    static async _mettreAJourDerniereConnexion(id, type) {
        try {
            const date = new Date();
            let table;
            
            switch(type) {
                case 'producteur':
                    table = 'producteurs';
                    break;
                case 'collecteur':
                    table = 'collecteurs';
                    break;
                case 'gestionnaire':
                    table = 'gestionnaires_points';
                    break;
                case 'superviseur':
                    table = 'superviseurs';
                    break;
                 case 'recycleur':
                table = 'recycleurs';
                break;
            case 'sponsor':
                table = 'sponsors';
                break;
            case 'ong':
                table = 'ongs';
                break;
            case 'admin':
                table = 'admins';
                break;
                default:
                    return;
            }
            
            await pool.query(
                `UPDATE ${table} SET derniere_connexion = $1 WHERE id = $2`,
                [date, id]
            );
        } catch (erreur) {
            console.error('⚠️ Erreur mise à jour connexion:', erreur);
        }
    }


    // static async _mettreAJourMotDePasse(id, type, nouveauMotDePasseHash) {
    //     switch(type) {
    //         case 'producteur':
    //             await pool.query(
    //                 'UPDATE producteurs SET mot_de_passe_hash = $1 WHERE id = $2',
    //                 [nouveauMotDePasseHash, id]
    //             );
    //             break;
    //         case 'collecteur':
    //             await pool.query(
    //                 'UPDATE collecteurs SET mot_de_passe_hash = $1 WHERE id = $2',
    //                 [nouveauMotDePasseHash, id]
    //             );
    //             break;
    //         case 'gestionnaire':
    //             await pool.query(
    //                 'UPDATE gestionnaires_points SET mot_de_passe_hash = $1 WHERE id = $2',
    //                 [nouveauMotDePasseHash, id]
    //             );
    //             break;
    //         case 'superviseur':
    //             await pool.query(
    //                 'UPDATE superviseurs SET mot_de_passe_hash = $1 WHERE id = $2',
    //                 [nouveauMotDePasseHash, id]
    //             );
    //             break;
    //     }
    // }

    
    static async _mettreAJourMotDePasse(id, type, nouveauMotDePasseHash) {
        switch(type) {
            case 'producteur':
                await pool.query(
                    'UPDATE producteurs SET mot_de_passe_hash = $1 WHERE id = $2',
                    [nouveauMotDePasseHash, id]
                );
                break;
            case 'collecteur':
                await pool.query(
                    'UPDATE collecteurs SET mot_de_passe_hash = $1 WHERE id = $2',
                    [nouveauMotDePasseHash, id]
                );
                break;
            case 'gestionnaire':
                await pool.query(
                    'UPDATE gestionnaires_points SET mot_de_passe_hash = $1 WHERE id = $2',
                    [nouveauMotDePasseHash, id]
                );
                break;
            case 'superviseur':
                await pool.query(
                    'UPDATE superviseurs SET mot_de_passe_hash = $1 WHERE id = $2',
                    [nouveauMotDePasseHash, id]
                );
                break;
             case 'recycleur':
            await pool.query(
                'UPDATE recycleurs SET mot_de_passe_hash = $1 WHERE id = $2',
                [nouveauMotDePasseHash, id]
            );
            break;
        case 'sponsor':
            await pool.query(
                'UPDATE sponsors SET mot_de_passe_hash = $1 WHERE id = $2',
                [nouveauMotDePasseHash, id]
            );
            break;
        case 'ong':
            await pool.query(
                'UPDATE ongs SET mot_de_passe_hash = $1 WHERE id = $2',
                [nouveauMotDePasseHash, id]
            );
            break;
        case 'admin':
            await pool.query(
                'UPDATE admins SET mot_de_passe_hash = $1 WHERE id = $2',
                [nouveauMotDePasseHash, id]
            );
            break;
    
        }
    }



// Générer un code aléatoire à 6 chiffres
static _genererCode6Chiffres() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}



// ✅ NOUVELLE VERSION - Demander réinitialisation par CODE
static async demanderReinitialisationMdp(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email requis'
            });
        }

        // Chercher l'utilisateur par email
        const resultat = await AuthController._trouverUtilisateurParIdentifiant(email);
        
        if (!resultat || !resultat.utilisateur) {
            // Pour des raisons de sécurité, on renvoie le même message
            return res.json({ 
                success: true,
                message: 'Si un compte existe avec cet email, vous recevrez un code de réinitialisation'
            });
        }

        const { utilisateur, type } = resultat;

        // Vérifier les demandes récentes (anti-spam)
        const checkRecent = await pool.query(`
            SELECT COUNT(*) FROM codes_reinitialisation 
            WHERE email = $1 
            AND cree_le > NOW() - INTERVAL '5 minutes'
        `, [email]);

        if (parseInt(checkRecent.rows[0].count) >= 3) {
            return res.status(429).json({
                success: false,
                message: 'Trop de demandes. Veuillez attendre quelques minutes.'
            });
        }

        // Générer un code à 6 chiffres
        const code = AuthController._genererCode6Chiffres();
        const expireLe = new Date();
        expireLe.setMinutes(expireLe.getMinutes() + 15); // Valable 15 minutes

        // Sauvegarder le code en base de données
        await pool.query(`
            INSERT INTO codes_reinitialisation 
            (utilisateur_id, type_utilisateur, code, email, expire_le)
            VALUES ($1, $2, $3, $4, $5)
        `, [utilisateur.id, type, code, email, expireLe]);

        // ✅ CORRECTION ICI : Utiliser la méthode d'envoi réel
        const emailEnvoye = await EmailService.envoyerCodeReinitialisation(
            email, 
            code, 
            utilisateur.nom_complet
        );

        if (!emailEnvoye) {
            // En cas d'échec, on peut toujours afficher le code dans la console
            console.log('\n' + '='.repeat(50));
            console.log('⚠️ ÉCHEC ENVOI EMAIL - CODE À UTILISER');
            console.log('📧 À:', email);
            console.log('🔐 Code:', code);
            console.log('='.repeat(50) + '\n');
            
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'envoi du code. Veuillez réessayer.'
            });
        }

        res.json({ 
            success: true,
            message: 'Code de réinitialisation envoyé avec succès'
        });

    } catch (erreur) {
        console.error('❌ Erreur demande réinitialisation:', erreur);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la demande',
            erreur: erreur.message 
        });
    }
}

// ✅ NOUVELLE VERSION - Vérifier le code
static async verifierCodeReinitialisation(req, res) {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: 'Email et code requis'
            });
        }

        // Vérifier le code
        const resultat = await pool.query(`
            SELECT * FROM codes_reinitialisation 
            WHERE email = $1 
            AND code = $2
            AND utilise = false 
            AND expire_le > NOW()
            ORDER BY cree_le DESC
            LIMIT 1
        `, [email, code]);

        if (resultat.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Code invalide ou expiré'
            });
        }

        const codeData = resultat.rows[0];

        // Incrémenter les tentatives
        await pool.query(`
            UPDATE codes_reinitialisation 
            SET tentatives = tentatives + 1 
            WHERE id = $1
        `, [codeData.id]);

        res.json({
            success: true,
            message: 'Code valide',
            token: codeData.id // On renvoie l'ID du code comme token temporaire
        });

    } catch (erreur) {
        console.error('❌ Erreur vérification code:', erreur);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la vérification',
            erreur: erreur.message 
        });
    }
}

//  Réinitialiser le mot de passe avec le code
static async reinitialiserMdpAvecCode(req, res) {
    try {
        const { email, code, nouveauMotDePasse } = req.body;

        if (!email || !code || !nouveauMotDePasse) {
            return res.status(400).json({
                success: false,
                message: 'Email, code et nouveau mot de passe requis'
            });
        }

        if (nouveauMotDePasse.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Le mot de passe doit contenir au moins 6 caractères'
            });
        }

        // Vérifier le code
        const resultat = await pool.query(`
            SELECT * FROM codes_reinitialisation 
            WHERE email = $1 
            AND code = $2
            AND utilise = false 
            AND expire_le > NOW()
            ORDER BY cree_le DESC
            LIMIT 1
        `, [email, code]);

        if (resultat.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Code invalide ou expiré'
            });
        }

        const codeData = resultat.rows[0];

        // Hasher le nouveau mot de passe
        const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, 10);

        // Mettre à jour le mot de passe
        await AuthController._mettreAJourMotDePasse(
            codeData.utilisateur_id,
            codeData.type_utilisateur,
            nouveauMotDePasseHash
        );

        // Marquer le code comme utilisé
        await pool.query(`
            UPDATE codes_reinitialisation 
            SET utilise = true 
            WHERE id = $1
        `, [codeData.id]);

        // Supprimer tous les anciens codes pour cet utilisateur
        await pool.query(`
            DELETE FROM codes_reinitialisation 
            WHERE email = $1 AND utilise = false
        `, [email]);

        res.json({ 
            success: true,
            message: 'Mot de passe réinitialisé avec succès' 
        });

    } catch (erreur) {
        console.error('❌ Erreur réinitialisation:', erreur);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la réinitialisation',
            erreur: erreur.message 
        });
    }
}

    // static _preparerDonneesUtilisateur(utilisateur, type) {
    //     const base = {
    //         id: utilisateur.id,
    //         email: utilisateur.email,
    //         telephone: utilisateur.telephone,
    //         type: type,
    //         nomComplet: utilisateur.nom_complet
    //     };

    //     switch(type) {
    //         case 'producteur':
    //             return {
    //                 ...base,
    //                 typeProducteur: utilisateur.type_producteur,
    //                 points: utilisateur.points || 0,
    //                 quartier: utilisateur.quartier,
    //                 commune: utilisateur.commune
    //             };
            
    //         case 'collecteur':
    //             return {
    //                 ...base,
    //                 typeCollecteur: utilisateur.type_collecteur,
    //                 statut: utilisateur.statut,
    //                 zoneIntervention: utilisateur.zone_intervention_nom,
    //                 pointsTotal: utilisateur.points_total || 0,
    //                 gainsTotal: utilisateur.gains_total || 0
    //             };
            
    //         case 'gestionnaire':
    //             return {
    //                 ...base,
    //                 pointCollecteId: utilisateur.point_collecte_id,
    //                 fonction: utilisateur.fonction
    //             };
            
    //         case 'superviseur':
    //             return {
    //                 ...base,
    //                 role: utilisateur.role
    //             };
            
    //         default:
    //             return base;
    //     }
    // }

    
    static _preparerDonneesUtilisateur(utilisateur, type) {
        const base = {
            id: utilisateur.id,
            email: utilisateur.email,
            telephone: utilisateur.telephone,
            type: type,
            nomComplet: utilisateur.nom_complet
        };

        switch(type) {
            case 'producteur':
                return {
                    ...base,
                    typeProducteur: utilisateur.type_producteur,
                    points: utilisateur.points || 0,
                    quartier: utilisateur.quartier,
                    commune: utilisateur.commune
                };
            
            case 'collecteur':
                return {
                    ...base,
                    typeCollecteur: utilisateur.type_collecteur,
                    statut: utilisateur.statut,
                    zoneIntervention: utilisateur.zone_intervention_nom,
                    pointsTotal: utilisateur.points_total || 0,
                    gainsTotal: utilisateur.gains_total || 0
                };
            
            case 'gestionnaire':
                return {
                    ...base,
                    pointCollecteId: utilisateur.point_collecte_id,
                    fonction: utilisateur.fonction
                };
            
            case 'superviseur':
                return {
                    ...base,
                    role: utilisateur.role
                };
            case 'recycleur':
                return {
                    ...base,
                    role: utilisateur.role,
                    };
            case 'sponsor':
                return {
                    ...base,
                    role: utilisateur.role,
                    };
            case 'ong':
                return {
                    ...base,
                    role: utilisateur.role,
                    };
            case 'admin':
                return {
                    ...base,
                    role: utilisateur.role,
                    };

            default:
                return base;
        }
    }
}

export default AuthController;