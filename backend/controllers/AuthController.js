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

   
    static async verifierToken(req, res, next) {
    // Routes publiques
    const publicRoutes = [
        '/api/collecteurs/connexion',
        '/api/collecteurs/inscription',
        '/api/gestionnaires/connexion',
        '/api/superviseurs/connexion',
        '/api/producteurs/connexion',
        '/api/producteurs/inscription',
         '/api/admin/connexion',  
        '/api/admin/inscription'
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
            } else if (req.originalUrl.includes('/api/admin/')) {
                req.utilisateurType = 'admin';
            } else {
                // Par défaut
                req.utilisateurType = 'producteur';
            }
            console.log(`⚠️ Type déduit de l'URL: ${req.utilisateurType}`);
        }
        
    if (req.utilisateurType === 'admin' && req.utilisateurId) {
            // Récupérer l'admin depuis la base de données pour avoir toutes ses infos
            const admin = await Admin.trouverParId(req.utilisateurId);
            if (admin) {
                req.admin = {
                    id: admin.id,
                    email: admin.email,
                    nomComplet: admin.nom_complet,
                    role: admin.role,
                    est_actif: admin.est_actif
                };
                console.log(`✅ Admin chargé dans req.admin: ${admin.email}`);
            }
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
            console.log(`📩 Demande de réinitialisation pour ${email}`);
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