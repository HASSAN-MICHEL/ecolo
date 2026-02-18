import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../config/database.js';

// Importer tous les modèles
import Producteur from '../models/Producteur.js';
import Collecteur from '../models/Collecteur.js';
import Gestionnaire from '../models/GestionnairePoint.js';
import Superviseur from '../models/Superviseur.js';

class AuthController {
    // ============================================
    // INSCRIPTIONS
    // ============================================
    
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

   
    
    // static verifierToken(req, res, next) {
    //     // Routes publiques (ne nécessitent pas de token)
    //     const publicRoutes = [
    //         '/api/collecteurs/connexion',
    //         '/api/collecteurs/inscription',
    //         '/api/collecteurs/LOHION',
    //         '/api/collecteurs/test-public',
    //         '/api/gestionnaires/connexion',
    //         '/api/superviseurs/connexion',
    //         '/api/producteurs/connexion',
    //         '/api/producteurs/inscription'
    //     ];

    //     // Vérifier si c'est une route publique
    //     if (publicRoutes.includes(req.path) || publicRoutes.includes(req.originalUrl)) {
    //         console.log('🔓 Route publique - accès autorisé:', req.path);
    //         return next();
    //     }

    //     // Récupérer le token
    //     const authHeader = req.headers.authorization;
        
    //     if (!authHeader) {
    //         console.log('❌ Token manquant - Header Authorization absent');
    //         return res.status(401).json({ 
    //             success: false,
    //             message: 'Token manquant',
    //             code: 'TOKEN_MISSING'
    //         });
    //     }

    //     // Vérifier le format
    //     const parts = authHeader.split(' ');
    //     if (parts.length !== 2 || parts[0] !== 'Bearer') {
    //         console.log('❌ Format de token invalide');
    //         return res.status(401).json({ 
    //             success: false,
    //             message: 'Format de token invalide. Utilisez: Bearer [token]',
    //             code: 'INVALID_FORMAT'
    //         });
    //     }

    //     const token = parts[1];

    //     try {
    //         // Vérifier et décoder le token
    //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
    //         // Ajouter les infos à la requête
    //         req.utilisateurId = decoded.id;
    //         req.utilisateurEmail = decoded.email;
    //         req.utilisateurType = decoded.type;
            
    //         console.log(`✅ Token valide - ${decoded.email} (${decoded.type})`);
            
    //         next();
    //     } catch (error) {
    //         if (error.name === 'TokenExpiredError') {
    //             return res.status(401).json({ 
    //                 success: false,
    //                 message: 'Token expiré',
    //                 code: 'TOKEN_EXPIRED'
    //             });
    //         }
            
    //         console.error('❌ Token invalide:', error.message);
    //         return res.status(401).json({ 
    //             success: false,
    //             message: 'Token invalide',
    //             code: 'INVALID_TOKEN'
    //         });
    //     }
    // }

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

    // Middleware pour vérifier le type d'utilisateur
    // static verifierTypeUtilisateur(typesAutorises) {
    //     return (req, res, next) => {
    //         if (!req.utilisateurType) {
    //             return res.status(401).json({ 
    //                 success: false,
    //                 message: 'Type d\'utilisateur non spécifié' 
    //             });
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

    // ============================================
    // RÉINITIALISATION DE MOT DE PASSE
    // ============================================
    
    static async demanderReinitialisationMdp(req, res) {
        try {
            const { email } = req.body;

            const resultat = await AuthController._trouverUtilisateurParIdentifiant(email);
            
            if (!resultat || !resultat.utilisateur) {
                return res.json({ 
                    success: true,
                    message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation' 
                });
            }

            const { utilisateur, type } = resultat;

            // Générer un token de réinitialisation
            const token = crypto.randomBytes(32).toString('hex');
            const expireLe = new Date();
            expireLe.setHours(expireLe.getHours() + 1);

            // Sauvegarder le token
            const requete = `
                INSERT INTO tokens 
                (utilisateur_id, type_utilisateur, token, type_token, expire_le)
                VALUES ($1, $2, $3, 'reset_password', $4)
            `;
            await pool.query(requete, [utilisateur.id, type, token, expireLe]);

            const lienReinitialisation = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe?token=${token}`;
            
            console.log(`🔐 Lien de réinitialisation: ${lienReinitialisation}`);

            res.json({ 
                success: true,
                message: 'Lien de réinitialisation envoyé avec succès'
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

    static async reinitialiserMdp(req, res) {
        try {
            const { token, nouveauMotDePasse } = req.body;

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

    // ============================================
    // MÉTHODES PRIVÉES
    // ============================================
    
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

        utilisateur = await Collecteur.findByEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'collecteur' };

        utilisateur = await Gestionnaire.findByEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'gestionnaire' };

        utilisateur = await Superviseur.findByEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'superviseur' };

        // Par téléphone
        utilisateur = await Producteur.trouverParTelephone(identifiant);
        if (utilisateur) return { utilisateur, type: 'producteur' };

        utilisateur = await Collecteur.findByTelephone(identifiant);
        if (utilisateur) return { utilisateur, type: 'collecteur' };

        return null;
    }

    static _verifierStatutUtilisateur(utilisateur, type) {
        switch(type) {
            case 'producteur':
                if (!utilisateur.est_actif) {
                    return { valide: false, message: 'Compte désactivé' };
                }
                break;
            
            case 'collecteur':
                if (utilisateur.statut === 'en_attente') {
                    return { valide: false, message: 'Compte en attente de validation' };
                }
                if (utilisateur.statut === 'suspendu') {
                    return { valide: false, message: 'Compte suspendu' };
                }
                if (utilisateur.statut !== 'actif') {
                    return { valide: false, message: 'Compte non actif' };
                }
                break;
            
            case 'gestionnaire':
            case 'superviseur':
                if (!utilisateur.est_actif) {
                    return { valide: false, message: 'Compte désactivé' };
                }
                break;
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
            
            default:
                return base;
        }
    }
}

export default AuthController;