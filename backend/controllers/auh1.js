



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

            // Vérifier si l'utilisateur existe déjà dans toutes les tables
            const utilisateurExistant = await AuthController._verifierExistenceEmail(email);
            if (utilisateurExistant) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Un compte avec cet email existe déjà' 
                });
            }

            // Vérifier le téléphone
            const telephoneExistant = await AuthController._verifierExistenceTelephone(telephone);
            if (telephoneExistant) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Un compte avec ce numéro de téléphone existe déjà' 
                });
            }

            // Valider les CGU
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
            console.error('Erreur inscription producteur:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de l\'inscription',
                erreur: erreur.message 
            });
        }
    }
   
    // Inscription générique qui détecte le type d'utilisateur
    static async inscrire(req, res) {
     try {
        const { typeUtilisateur } = req.body;
        
        if (!typeUtilisateur) {
            return res.status(400).json({ 
                success: false,
                message: 'Le type d\'utilisateur est requis (producteur ou collecteur)' 
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
                    message: 'Type d\'utilisateur invalide. Utilisez "producteur" ou "collecteur"' 
                });
        }
      } catch (erreur) {
        console.error('Erreur inscription:', erreur);
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
                message: 'Inscription réussie. Votre compte est en attente de validation par un superviseur.',
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
            console.error('Erreur inscription collecteur:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de l\'inscription',
                erreur: erreur.message 
            });
        }
    }

    // Dans AuthController, ajoutez ces logs

static async connecterGestionnaire(req, res) {
    console.log('🔑 ===== CONNEXION GESTIONNAIRE =====');
    console.log('📝 Corps de la requête:', req.body);
    console.log('🔍 Identifiant reçu:', req.body.identifiant);
    
    // Appeler directement la méthode connecter avec le type forcé
    try {
        const { identifiant, motDePasse } = req.body;
        
        if (!identifiant || !motDePasse) {
            console.log('❌ Identifiant ou mot de passe manquant');
            return res.status(400).json({
                success: false,
                message: 'Identifiant et mot de passe requis'
            });
        }

        // Chercher UNIQUEMENT dans la table des gestionnaires
        console.log('🔍 Recherche du gestionnaire par email:', identifiant);
        let gestionnaire = await Gestionnaire.findByEmail(identifiant);
        
        if (!gestionnaire) {
            console.log('❌ Gestionnaire non trouvé par email');
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }

        console.log('✅ Gestionnaire trouvé:', gestionnaire.email);
        console.log('🔐 Vérification du mot de passe...');

        // Vérifier le mot de passe
        const motDePasseValide = await bcrypt.compare(motDePasse, gestionnaire.mot_de_passe_hash);
        if (!motDePasseValide) {
            console.log('❌ Mot de passe incorrect');
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }

        console.log('✅ Mot de passe valide');

        // Vérifier si le compte est actif
        if (!gestionnaire.est_actif) {
            console.log('❌ Compte désactivé');
            return res.status(403).json({
                success: false,
                message: 'Compte désactivé. Contactez l\'administration.'
            });
        }

        console.log('✅ Compte actif');

        // Générer le token
        const token = jwt.sign(
            { 
                id: gestionnaire.id, 
                email: gestionnaire.email, 
                type: 'gestionnaire' 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        console.log('✅ Token généré avec succès');

        // Mettre à jour la dernière connexion
        await Gestionnaire.update(gestionnaire.id, { derniere_connexion: new Date() });

        res.json({
            success: true,
            message: 'Connexion réussie',
            token,
            utilisateur: {
                id: gestionnaire.id,
                email: gestionnaire.email,
                telephone: gestionnaire.telephone,
                nomComplet: gestionnaire.nom_complet,
                type: 'gestionnaire',
                pointCollecteId: gestionnaire.point_collecte_id,
                pointCollecteNom: gestionnaire.point_collecte_nom,
                fonction: gestionnaire.fonction
            }
        });

    } catch (erreur) {
        console.error('❌ Erreur connexion gestionnaire:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion',
            erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
        });
    }
}

    
    // ============================================
    
    static async connecter(req, res) {
        try {
            const { identifiant, motDePasse } = req.body;

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

            // Générer le token JWT
            const token = AuthController._genererToken(
                utilisateur.id, 
                utilisateur.email, 
                type
            );

            // Préparer la réponse selon le type
            const reponseUtilisateur = AuthController._preparerDonneesUtilisateur(utilisateur, type);

            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                utilisateur: reponseUtilisateur
            });
        } catch (erreur) {
            console.error('Erreur connexion:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la connexion',
                erreur: erreur.message 
            });
        }
    }

    // Connexion spécifique pour producteurs (rétrocompatibilité)
    static async connecterProducteur(req, res) {
        return AuthController.connecter(req, res);
    }

    // Connexion spécifique pour collecteurs (rétrocompatibilité)
    static async connecterCollecteur(req, res) {
        return AuthController.connecter(req, res);
    }

    // Connexion spécifique pour gestionnaires (rétrocompatibilité)
    static async connecterGestionnaire(req, res) {
        return AuthController.connecter(req, res);
    }

    // Connexion spécifique pour superviseurs (rétrocompatibilité)
    static async connecterSuperviseur(req, res) {
        return AuthController.connecter(req, res);
    }

    // ============================================
    // RÉINITIALISATION DE MOT DE PASSE
    // ============================================
    
    static async demanderReinitialisationMdp(req, res) {
        try {
            const { email } = req.body;

            // Chercher l'utilisateur dans toutes les tables
            const resultat = await AuthController._trouverUtilisateurParIdentifiant(email);
            
            if (!resultat || !resultat.utilisateur) {
                // Pour des raisons de sécurité, on ne révèle pas si l'email existe
                return res.json({ 
                    success: true,
                    message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation' 
                });
            }

            const { utilisateur, type } = resultat;

            // Générer un token de réinitialisation
            const token = crypto.randomBytes(32).toString('hex');
            const expireLe = new Date();
            expireLe.setHours(expireLe.getHours() + 1); // Valide 1 heure

            // Sauvegarder le token dans la table unifiée
            const requete = `
                INSERT INTO tokens 
                (utilisateur_id, type_utilisateur, token, type_token, expire_le)
                VALUES ($1, $2, $3, 'reset_password', $4)
            `;
            await pool.query(requete, [utilisateur.id, type, token, expireLe]);

            // Générer le lien de réinitialisation
            const lienReinitialisation = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe?token=${token}`;
            
            // TODO: Envoyer un email avec le lien
            console.log(`🔐 Lien de réinitialisation pour ${email} (${type}): ${lienReinitialisation}`);

            res.json({ 
                success: true,
                message: 'Lien de réinitialisation envoyé avec succès'
                // Ne pas retourner le lien en production !
            });
        } catch (erreur) {
            console.error('Erreur demande réinitialisation:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la demande de réinitialisation',
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

            // Mettre à jour le mot de passe selon le type d'utilisateur
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
            console.error('Erreur réinitialisation:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la réinitialisation du mot de passe',
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

            // Marquer le token comme utilisé
            await pool.query(
                'UPDATE tokens SET utilise = true WHERE id = $1',
                [tokenValide.id]
            );

            res.json({ 
                success: true,
                message: 'Compte validé avec succès' 
            });
        } catch (erreur) {
            console.error('Erreur validation compte:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la validation du compte',
                erreur: erreur.message 
            });
        }
    }

    // ============================================
    // MIDDLEWARE DE VÉRIFICATION DE TOKEN
    // ============================================
    
    // Dans authController.js
 static verifierToken(req, res, next) {
    // 🔴 SOLUTION : IGNORER COMPLÈTEMENT LES ROUTES D'AUTHENTIFICATION
    const publicRoutes = [
        '/api/collecteurs/connexion',
        '/api/collecteurs/inscription',
        '/api/collecteurs/LOHION',
        '/api/collecteurs/test-public',
        '/api/gestionnaires/connexion',
        '/api/superviseurs/connexion'
    ];

    // Si c'est une route publique, passer au suivant SANS vérifier le token
    if (publicRoutes.includes(req.path) || publicRoutes.includes(req.originalUrl)) {
        console.log('🔓 Route publique - passage sans token:', req.path);
        return next();
    }

    // Pour les routes protégées, vérifier le token
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('❌ Token manquant pour route protégée:', req.path);
        return res.status(401).json({ 
            success: false,
            message: 'Token manquant' 
        });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.utilisateurId = decode.id;
        req.utilisateurEmail = decode.email;
        req.utilisateurType = decode.type;
        next();
    } catch (erreur) {
        return res.status(401).json({ 
            success: false,
            message: 'Token invalide' 
        });
    }
}

    // Middleware pour vérifier le type d'utilisateur
    static verifierTypeUtilisateur(typesAutorises) {
        return (req, res, next) => {
            if (!req.utilisateurType) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Type d\'utilisateur non spécifié' 
                });
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

    // Rafraîchir le token
    static async rafraichirToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Token de rafraîchissement requis' 
                });
            }

            const decode = jwt.verify(refreshToken, process.env.JWT_SECRET);
            
            const nouveauToken = AuthController._genererToken(
                decode.id,
                decode.email,
                decode.type
            );

            res.json({
                success: true,
                token: nouveauToken
            });
        } catch (erreur) {
            console.error('Erreur rafraîchissement token:', erreur);
            res.status(401).json({ 
                success: false,
                message: 'Token de rafraîchissement invalide' 
            });
        }
    }

    // Déconnexion
    static async deconnecter(req, res) {
        try {
            // Optionnel: Invalider le token côté serveur si vous utilisez une blacklist
            res.json({ 
                success: true,
                message: 'Déconnexion réussie' 
            });
        } catch (erreur) {
            console.error('Erreur déconnexion:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la déconnexion' 
            });
        }
    }

    // ============================================
    // MÉTHODES PRIVÉES UTILITAIRES
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
            Collecteur.findByEmail(email),
            Gestionnaire.findByEmail(email),
            Superviseur.findByEmail(email)
        ];

        const results = await Promise.all(queries);
        return results.some(result => result !== null && result !== undefined);
    }

    static async _verifierExistenceTelephone(telephone) {
        const queries = [
            Producteur.trouverParTelephone(telephone),
            Collecteur.findByTelephone(telephone)
        ];

        const results = await Promise.all(queries);
        return results.some(result => result !== null && result !== undefined);
    }

    static async _trouverUtilisateurParIdentifiant(identifiant) {
        // Chercher par email dans toutes les tables
        let utilisateur = await Producteur.trouverParEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'producteur' };

        utilisateur = await Collecteur.findByEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'collecteur' };

        utilisateur = await Gestionnaire.findByEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'gestionnaire' };

        utilisateur = await Superviseur.findByEmail(identifiant);
        if (utilisateur) return { utilisateur, type: 'superviseur' };

        // Chercher par téléphone
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
                    return { 
                        valide: false, 
                        message: 'Compte désactivé. Contactez l\'administration.' 
                    };
                }
                break;
            
            case 'collecteur':
                if (utilisateur.statut === 'en_attente') {
                    return { 
                        valide: false, 
                        message: 'Votre compte est en attente de validation par un superviseur.' 
                    };
                }
                if (utilisateur.statut === 'suspendu') {
                    return { 
                        valide: false, 
                        message: 'Votre compte a été suspendu. Contactez l\'administration.' 
                    };
                }
                if (utilisateur.statut !== 'actif') {
                    return { 
                        valide: false, 
                        message: 'Compte non actif.' 
                    };
                }
                break;
            
            case 'gestionnaire':
                if (!utilisateur.est_actif) {
                    return { 
                        valide: false, 
                        message: 'Compte désactivé. Contactez l\'administration.' 
                    };
                }
                break;
            
            case 'superviseur':
                if (!utilisateur.est_actif) {
                    return { 
                        valide: false, 
                        message: 'Compte désactivé.' 
                    };
                }
                break;
        }

        return { valide: true };
    }

    // static async _mettreAJourDerniereConnexion(id, type) {
    //     try {
    //         switch(type) {
    //             case 'producteur':
    //                 await Producteur.update(id, { derniere_connexion: new Date() });
    //                 break;
    //             case 'collecteur':
    //                 await Collecteur.update(id, { derniere_connexion: new Date() });
    //                 break;
    //             case 'gestionnaire':
    //                 await Gestionnaire.update(id, { derniere_connexion: new Date() });
    //                 break;
    //             case 'superviseur':
    //                 await Superviseur.update(id, { derniere_connexion: new Date() });
    //                 break;
    //         }
    //     } catch (erreur) {
    //         console.error('Erreur mise à jour dernière connexion:', erreur);
    //     }
    // }

     // Correction de la méthode _mettreAJourDerniereConnexion
static async _mettreAJourDerniereConnexion(id, type) {
    try {
        const date = new Date();
        
        switch(type) {
            case 'producteur':
                // Utiliser une requête SQL directe au lieu de Producteur.update
                await pool.query(
                    'UPDATE producteurs SET derniere_connexion = $1 WHERE id = $2',
                    [date, id]
                );
                break;
            case 'collecteur':
                await pool.query(
                    'UPDATE collecteurs SET derniere_connexion = $1 WHERE id = $2',
                    [date, id]
                );
                break;
            case 'gestionnaire':
                await pool.query(
                    'UPDATE gestionnaires_points SET derniere_connexion = $1 WHERE id = $2',
                    [date, id]
                );
                break;
            case 'superviseur':
                await pool.query(
                    'UPDATE superviseurs SET derniere_connexion = $1 WHERE id = $2',
                    [date, id]
                );
                break;
        }
    } catch (erreur) {
        console.error('Erreur mise à jour dernière connexion:', erreur);
    }
  }
    static async _mettreAJourMotDePasse(id, type, nouveauMotDePasseHash) {
        switch(type) {
            case 'producteur':
                await Productureur.reinitialiserMotDePasse(id, nouveauMotDePasseHash);
                break;
            case 'collecteur':
                await Collecteur.update(id, { mot_de_passe_hash: nouveauMotDePasseHash });
                break;
            case 'gestionnaire':
                await Gestionnaire.update(id, { mot_de_passe_hash: nouveauMotDePasseHash });
                break;
            case 'superviseur':
                await Superviseur.update(id, { mot_de_passe_hash: nouveauMotDePasseHash });
                break;
        }
    }

    // MÉTHODE DE CONNEXION COLLECTEUR SIMPLIFIÉE POUR TEST
static async connecterCollecteurSimple(req, res) {
    console.log('🔑 ===== CONNEXION COLLECTEUR SIMPLE =====');
    console.log('📝 Corps de la requête:', req.body);
    
    try {
        const { identifiant, motDePasse } = req.body;
        
        // Réponse simple pour voir si la route est atteinte
        res.json({
            success: true,
            message: 'Route de connexion collecteur atteinte',
            identifiantRecu: identifiant,
            motDePasseRecu: motDePasse ? '****' : 'non fourni'
        });
    } catch (erreur) {
        console.error('❌ Erreur:', erreur);
        res.status(500).json({ success: false, erreur: erreur.message });
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



