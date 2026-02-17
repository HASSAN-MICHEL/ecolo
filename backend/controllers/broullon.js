authController propre qui fonctionne pour les producteur : import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Producteur from '../models/Producteur.js';
import require from 'express';
import crypto from 'crypto';
import { pool } from '../config/database.js';

//class AuthController {
    // Inscription
    static async inscrire(req, res) {
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
            const producteurExiste = await Producteur.trouverParEmail(email);
            if (producteurExiste) {
                return res.status(400).json({ 
                    message: 'Un compte avec cet email existe déjà' 
                });
            }

            // Vérifier le téléphone
            const telephoneExiste = await Producteur.trouverParTelephone(telephone);
            if (telephoneExiste) {
                return res.status(400).json({ 
                    message: 'Un compte avec ce numéro de téléphone existe déjà' 
                });
            }

            // Valider les CGU
            if (!cguAcceptees) {
                return res.status(400).json({ 
                    message: 'Vous devez accepter les CGU' 
                });
            }

            // Hasher le mot de passe
            const salt = await bcrypt.genSalt(10);
            const motDePasseHash = await bcrypt.hash(motDePasse, salt);

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
            const token = jwt.sign(
                { id: nouveauProducteur.id, email: nouveauProducteur.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            res.status(201).json({
                message: 'Inscription réussie',
                token,
                producteur: {
                    id: nouveauProducteur.id,
                    email: nouveauProducteur.email,
                    telephone: nouveauProducteur.telephone,
                    typeProducteur: nouveauProducteur.type_producteur,
                    nomComplet: nouveauProducteur.nom_complet,
                    quartier: nouveauProducteur.quartier,
                    commune: nouveauProducteur.commune
                }
            });
        } catch (erreur) {
            console.error('Erreur inscription:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de l\'inscription',
                erreur: erreur.message 
            });
        }
    }

    // Connexion
    static async connecter(req, res) {
        try {
            const { identifiant, motDePasse } = req.body;

            // Trouver le producteur par email ou téléphone
            let producteur = await Producteur.trouverParEmail(identifiant);
            if (!producteur) {
                producteur = await Producteur.trouverParTelephone(identifiant);
            }

            if (!producteur) {
                return res.status(401).json({ 
                    message: 'Identifiants incorrects' 
                });
            }

            // Vérifier le mot de passe
            const motDePasseValide = await bcrypt.compare(motDePasse, producteur.mot_de_passe_hash);
            if (!motDePasseValide) {
                return res.status(401).json({ 
                    message: 'Identifiants incorrects' 
                });
            }

            // Vérifier si le compte est actif
            if (!producteur.est_actif) {
                return res.status(403).json({ 
                    message: 'Compte désactivé. Contactez l\'administration.' 
                });
            }

            // Générer le token JWT
            const token = jwt.sign(
                { id: producteur.id, email: producteur.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            res.json({
                message: 'Connexion réussie',
                token,
                producteur: {
                    id: producteur.id,
                    email: producteur.email,
                    telephone: producteur.telephone,
                    typeProducteur: producteur.type_producteur,
                    nomComplet: producteur.nom_complet,
                    points: producteur.points,
                    quartier: producteur.quartier,
                    commune: producteur.commune
                }
            });
        } catch (erreur) {
            console.error('Erreur connexion:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de la connexion',
                erreur: erreur.message 
            });
        }
    }

    // Demande de réinitialisation de mot de passe
    static async demanderReinitialisationMdp(req, res) {
        try {
            const { email } = req.body;

            const producteur = await Producteur.trouverParEmail(email);
            if (!producteur) {
                // Pour des raisons de sécurité, on ne révèle pas si l'email existe
                return res.json({ 
                    message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation' 
                });
            }

            // Générer un token de réinitialisation
            const token = crypto.randomBytes(32).toString('hex');
            const expireLe = new Date();
            expireLe.setHours(expireLe.getHours() + 1); // Valide 1 heure

            // Sauvegarder le token
            const requete = `
                INSERT INTO tokens_reinitialisation_mdp 
                (producteur_id, token, expire_le)
                VALUES ($1, $2, $3)
            `;
            await pool.query(requete, [producteur.id, token, expireLe]);

            // Ici, vous devriez envoyer un email avec le lien
            // Pour l'instant, on retourne le token (dans un environnement réel, envoyez un email)
            const lienReinitialisation = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe?token=${token}`;
            
            console.log(`Lien de réinitialisation pour ${email}: ${lienReinitialisation}`);

            res.json({ 
                message: 'Lien de réinitialisation généré avec succès',
                lien: lienReinitialisation // À supprimer en production
            });
        } catch (erreur) {
            console.error('Erreur demande réinitialisation:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de la demande de réinitialisation',
                erreur: erreur.message 
            });
        }
    }

    // Réinitialiser le mot de passe
    static async reinitialiserMdp(req, res) {
        try {
            const { token, nouveauMotDePasse } = req.body;

            // Vérifier le token
            const requeteToken = `
                SELECT * FROM tokens_reinitialisation_mdp 
                WHERE token = $1 AND utilise = false AND expire_le > NOW()
            `;
            const resultatToken = await pool.query(requeteToken, [token]);
            const tokenValide = resultatToken.rows[0];

            if (!tokenValide) {
                return res.status(400).json({ 
                    message: 'Token invalide ou expiré' 
                });
            }

            // Hasher le nouveau mot de passe
            const salt = await bcrypt.genSalt(10);
            const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, salt);

            // Mettre à jour le mot de passe
            await Producteur.reinitialiserMotDePasse(tokenValide.producteur_id, nouveauMotDePasseHash);

            // Marquer le token comme utilisé
            await pool.query(
                'UPDATE tokens_reinitialisation_mdp SET utilise = true WHERE id = $1',
                [tokenValide.id]
            );

            res.json({ 
                message: 'Mot de passe réinitialisé avec succès' 
            });
        } catch (erreur) {
            console.error('Erreur réinitialisation:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de la réinitialisation du mot de passe',
                erreur: erreur.message 
            });
        }
    }

    // Vérifier le token (pour le middleware)
    static verifierToken(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                message: 'Accès non autorisé. Token manquant.' 
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.producteurId = decode.id;
            req.producteurEmail = decode.email;
            next();
        } catch (erreur) {
            return res.status(401).json({ 
                message: 'Token invalide ou expiré' 
            });
        }
    }
}

// export default AuthController;



//superviseur :

import bcrypt from 'bcrypt';
import Superviseur from '../models/Superviseur.js';
import Collecteur from '../models/Collecteur.js';
import GestionnairePoint from '../models/GestionnairePoint.js';
import Mission from '../models/Mission.js';
import jwt from 'jsonwebtoken'; 
import { pool } from '../config/database.js';

class SuperviseurController {
    // Connexion
    // static async connexion(req, res) {
    //     try {
    //         const { identifiant, motDePasse } = req.body;

    //         const superviseur = await Superviseur.trouverParEmail(identifiant);

    //         if (!superviseur) {
    //             return res.status(401).json({
    //                 success: false,
    //                 message: 'Identifiants incorrects'
    //             });
    //         }

    //         // Vérifier le mot de passe
    //         const motDePasseValide = await bcrypt.compare(motDePasse, superviseur.mot_de_passe_hash);
    //         if (!motDePasseValide) {
    //             return res.status(401).json({
    //                 success: false,
    //                 message: 'Identifiants incorrects'
    //             });
    //         }

    //         // Générer token JWT
    //         const token = req.genererToken({
    //             id: superviseur.id,
    //             email: superviseur.email,
    //             type: 'superviseur'
    //         });

    //         res.json({
    //             success: true,
    //             message: 'Connexion réussie',
    //             token,
    //             superviseur: {
    //                 id: superviseur.id,
    //                 email: superviseur.email,
    //                 telephone: superviseur.telephone,
    //                 nomComplet: superviseur.nom_complet,
    //                 role: superviseur.role
    //             }
    //         });
    //     } catch (erreur) {
    //         console.error('Erreur connexion superviseur:', erreur);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Erreur lors de la connexion',
    //             erreur: erreur.message
    //         });
    //     }
    // }

     // Dans superviseurController.js - méthode connexion
//  static async connexion(req, res) {
//     try {
//         const { identifiant, motDePasse } = req.body;

//         const superviseur = await Superviseur.trouverParEmail(identifiant);

//         if (!superviseur) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Identifiants incorrects'
//             });
//         }

//         // Vérifier le mot de passe
//         const motDePasseValide = await bcrypt.compare(motDePasse, superviseur.mot_de_passe_hash);
//         if (!motDePasseValide) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Identifiants incorrects'
//             });
//         }

//         // ✅ CORRECTION: Générer token JWT directement avec jwt.sign
//         const token = jwt.sign(
//             { 
//                 id: superviseur.id, 
//                 email: superviseur.email, 
//                 type: 'superviseur' 
//             },
//             process.env.JWT_SECRET || 'votre_cle_secrete',
//             { expiresIn: process.env.JWT_EXPIRE || '7d' }
//         );

//         res.json({
//             success: true,
//             message: 'Connexion réussie',
//             token,
//             superviseur: {
//                 id: superviseur.id,
//                 email: superviseur.email,
//                 telephone: superviseur.telephone,
//                 nomComplet: superviseur.nom_complet,
//                 role: superviseur.role
//             }
//         });
//     } catch (erreur) {
//         console.error('Erreur connexion superviseur:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la connexion',
//             erreur: erreur.message
//         });
//     }
//  }

  // Dans votre méthode connexion du SuperviseurController
  static async connexion(req, res) {
    try {
        const { identifiant, motDePasse } = req.body;
        const superviseur = await Superviseur.trouverParEmail(identifiant);
        
        if (!superviseur) {
            return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
        }

        const motDePasseValide = await bcrypt.compare(motDePasse, superviseur.mot_de_passe_hash);
        if (!motDePasseValide) {
            return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
        }

        // Générer le token
        const token = jwt.sign(
            { id: superviseur.id, email: superviseur.email, type: 'superviseur' },
            process.env.JWT_SECRET || 'votre_cle_secrete',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        // ✅ Retourner le token dans la réponse
        res.json({
            success: true,
            message: 'Connexion réussie',
            token,  // Le token est ici
            superviseur: {
                id: superviseur.id,
                email: superviseur.email,
                nomComplet: superviseur.nom_complet,
                role: superviseur.role
            }
        });
    } catch (erreur) {
        console.error('Erreur connexion superviseur:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
 }
    // Liste des collecteurs en attente
    static async collecteursEnAttente(req, res) {
        try {
            const collecteurs = await Superviseur.collecteursEnAttente();

            res.json({
                success: true,
                collecteurs
            });
        } catch (erreur) {
            console.error('Erreur récupération collecteurs:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des collecteurs',
                erreur: erreur.message
            });
        }
    }

    // Valider un collecteur
    // static async validerCollecteur(req, res) {
    //     try {
    //         const { collecteurId } = req.params;
    //         const superviseurId = req.utilisateurId;
    //         const { notes } = req.body;

    //         const collecteur = await Superviseur.activerCollecteur(collecteurId, superviseurId, true);

    //         // Notification au collecteur
    //         await pool.query(
    //             `INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification)
    //              VALUES ($1, 'collecteur', 'Compte validé', 
    //                      'Félicitations! Votre compte a été validé. Vous pouvez maintenant recevoir des missions.',
    //                      'compte_valide')`,
    //             [collecteurId]
    //         );

    //         res.json({
    //             success: true,
    //             message: 'Collecteur validé avec succès',
    //             collecteur
    //         });
    //     } catch (erreur) {
    //         console.error('Erreur validation collecteur:', erreur);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Erreur lors de la validation du collecteur',
    //             erreur: erreur.message
    //         });
    //     }
    // }
  

    static async validerCollecteur(req, res) {
    try {
        const { collecteurId } = req.params;
        const superviseurId = req.utilisateurId;
        const { notes } = req.body;

        // ✅ Utiliser la méthode activerCollecteur du modèle Superviseur
        const collecteur = await Superviseur.activerCollecteur(collecteurId, superviseurId, notes);

        // Notification au collecteur
        await pool.query(
            `INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification)
             VALUES ($1, 'collecteur', 'Compte validé', 
                     'Félicitations! Votre compte a été validé. Vous pouvez maintenant recevoir des missions.',
                     'compte_valide')`,
            [collecteurId]
        );

        res.json({
            success: true,
            message: 'Collecteur validé avec succès',
            collecteur
        });
    } catch (erreur) {
        console.error('Erreur validation collecteur:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la validation du collecteur',
            erreur: erreur.message
        });
    }
  }

    // Suspendre un collecteur
    static async suspendreCollecteur(req, res) {
    try {
        const { collecteurId } = req.params;
        const { raison } = req.body;

        // ✅ Utiliser la méthode suspendreCollecteur du modèle Superviseur
        const collecteur = await Superviseur.suspendreCollecteur(collecteurId, raison);

        res.json({
            success: true,
            message: 'Collecteur suspendu',
            collecteur
        });
    } catch (erreur) {
        console.error('Erreur suspension collecteur:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suspension du collecteur',
            erreur: erreur.message
        });
    }
}


    // Créer un compte gestionnaire
    static async creerGestionnaire(req, res) {
        try {
            const superviseurId = req.utilisateurId;
            const {
                email, telephone, motDePasse, nomComplet,
                pointCollecteId, fonction
            } = req.body;

            // Vérifier si l'email existe déjà
            const existant = await GestionnairePoint.trouverParEmail(email);
            if (existant) {
                return res.status(400).json({
                    success: false,
                    message: 'Un compte avec cet email existe déjà'
                });
            }

            // Hasher le mot de passe
            const salt = await bcrypt.genSalt(10);
            const motDePasseHash = await bcrypt.hash(motDePasse, salt);

            const gestionnaireData = {
                email,
                telephone,
                motDePasseHash,
                nomComplet,
                pointCollecteId,
                fonction
            };

            const gestionnaire = await Superviseur.creerGestionnaire(gestionnaireData, superviseurId);

            res.status(201).json({
                success: true,
                message: 'Compte gestionnaire créé avec succès',
                gestionnaire
            });
        } catch (erreur) {
            console.error('Erreur création gestionnaire:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création du gestionnaire',
                erreur: erreur.message
            });
        }
    }

    // Modifier un gestionnaire
    static async modifierGestionnaire(req, res) {
        try {
            const { gestionnaireId } = req.params;
            const donnees = req.body;

            const gestionnaire = await Superviseur.modifierGestionnaire(gestionnaireId, donnees);

            res.json({
                success: true,
                message: 'Gestionnaire modifié avec succès',
                gestionnaire
            });
        } catch (erreur) {
            console.error('Erreur modification gestionnaire:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la modification du gestionnaire',
                erreur: erreur.message
            });
        }
    }

    // Liste des gestionnaires
    // static async gestionnaires(req, res) {
    //     try {
    //         const gestionnaires = await Superviseur.gestionnaires();

    //         res.json({
    //             success: true,
    //             gestionnaires
    //         });
    //     } catch (erreur) {
    //         console.error('Erreur récupération gestionnaires:', erreur);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Erreur lors de la récupération des gestionnaires',
    //             erreur: erreur.message
    //         });
    //     }
    // }

    static async gestionnaires(req, res) {
    try {
        // ✅ Utiliser la méthode gestionnaires du modèle Superviseur
        const gestionnaires = await Superviseur.gestionnaires();

        res.json({
            success: true,
            gestionnaires
        });
    } catch (erreur) {
        console.error('Erreur récupération gestionnaires:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des gestionnaires',
            erreur: erreur.message
        });
    }
 }

    // Attribuer une mission à un collecteur
    // static async attribuerMission(req, res) {
    //     try {
    //         const { missionId, collecteurId } = req.params;
    //         const superviseurId = req.utilisateurId;

    //         const mission = await Superviseur.attribuerMission(missionId, collecteurId, superviseurId);

    //         res.json({
    //             success: true,
    //             message: 'Mission attribuée avec succès',
    //             mission
    //         });
    //     } catch (erreur) {
    //         console.error('Erreur attribution mission:', erreur);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Erreur lors de l\'attribution de la mission',
    //             erreur: erreur.message
    //         });
    //     }
    // }


    static async attribuerMission(req, res) {
    try {
        const { missionId, collecteurId } = req.params;
        const superviseurId = req.utilisateurId;

        // ✅ Utiliser la méthode attribuerMission du modèle Superviseur
        const mission = await Superviseur.attribuerMission(missionId, collecteurId, superviseurId);

        res.json({
            success: true,
            message: 'Mission attribuée avec succès',
            mission
        });
    } catch (erreur) {
        console.error('Erreur attribution mission:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'attribution de la mission',
            erreur: erreur.message
        });
    }
}


    // Créer une mission manuellement
    static async creerMission(req, res) {
        try {
            const { declarationId } = req.body;

            const mission = await Mission.creerDepuisDeclaration(declarationId);

            res.status(201).json({
                success: true,
                message: 'Mission créée avec succès',
                mission
            });
        } catch (erreur) {
            console.error('Erreur création mission:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création de la mission',
                erreur: erreur.message
            });
        }
    }

    // Statistiques générales
    // static async statistiques(req, res) {
    //     try {
    //         const stats = await Superviseur.statistiques();

    //         // Évolution des 7 derniers jours
    //         const evolution = await pool.query(`
    //             SELECT 
    //                 DATE(date_validation) as jour,
    //                 COUNT(*) as missions_validees,
    //                 COALESCE(SUM(poids_depose), 0) as poids_total
    //             FROM missions
    //             WHERE date_validation >= CURRENT_DATE - INTERVAL '7 days'
    //             GROUP BY DATE(date_validation)
    //             ORDER BY jour DESC
    //         `);

    //         res.json({
    //             success: true,
    //             stats,
    //             evolution: evolution.rows
    //         });
    //     } catch (erreur) {
    //         console.error('Erreur statistiques:', erreur);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Erreur lors de la récupération des statistiques',
    //             erreur: erreur.message
    //         });
    //     }
    // }


// Dans statistiques
static async statistiques(req, res) {
    try {
        // ✅ Utiliser la méthode statistiques du modèle Superviseur
        const stats = await Superviseur.statistiques();

        // Évolution des 7 derniers jours
        const evolution = await pool.query(`
            SELECT 
                DATE(date_validation) as jour,
                COUNT(*) as missions_validees,
                COALESCE(SUM(poids_depose), 0) as poids_total
            FROM missions
            WHERE date_validation >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY DATE(date_validation)
            ORDER BY jour DESC
        `);

        res.json({
            success: true,
            stats,
            evolution: evolution.rows
        });
    } catch (erreur) {
        console.error('Erreur statistiques:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques',
            erreur: erreur.message
        });
    }
}
}

export default SuperviseurController;


