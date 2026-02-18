

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Superviseur from '../models/Superviseur.js';
import Collecteur from '../models/Collecteur.js';
import GestionnairePoint from '../models/GestionnairePoint.js';
import Mission from '../models/Mission.js';
import { pool } from '../config/database.js';

class SuperviseurController {
    // ✅ CONNEXION - VERSION CORRIGÉE
    static async connexion(req, res) {
        console.log('🔑 ===== CONNEXION SUPERVISEUR =====');
        console.log('📝 Corps de la requête:', req.body);
        
        try {
            const { identifiant, motDePasse } = req.body;

            // Validation
            if (!identifiant || !motDePasse) {
                console.log('❌ Identifiant ou mot de passe manquant');
                return res.status(400).json({
                    success: false,
                    message: 'Identifiant et mot de passe requis'
                });
            }

            // Rechercher le superviseur par email
            console.log('🔍 Recherche superviseur avec email:', identifiant);
            const superviseur = await Superviseur.trouverParEmail(identifiant);

            if (!superviseur) {
                console.log('❌ Superviseur non trouvé');
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            console.log('✅ Superviseur trouvé:', superviseur.email);
            console.log('🔐 Vérification du mot de passe...');

            // Vérifier le mot de passe
            const motDePasseValide = await bcrypt.compare(motDePasse, superviseur.mot_de_passe_hash);
            
            if (!motDePasseValide) {
                console.log('❌ Mot de passe incorrect');
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            console.log('✅ Mot de passe valide');

            // Vérifier si le compte est actif
            if (!superviseur.est_actif) {
                console.log('❌ Compte désactivé');
                return res.status(403).json({
                    success: false,
                    message: 'Compte désactivé. Contactez l\'administration.'
                });
            }

            console.log('✅ Compte actif');

            // ✅ GÉNÉRER LE TOKEN JWT
            const token = jwt.sign(
                { 
                    id: superviseur.id, 
                    email: superviseur.email, 
                    type: 'superviseur' 
                },
                process.env.JWT_SECRET || 'votre_cle_secrete_super_securisee',
                { expiresIn: process.env.JWT_EXPIRE || '7d' }
            );

            console.log('✅ Token généré avec succès');

            // Mettre à jour la dernière connexion
            try {
                await Superviseur.update(superviseur.id, { derniere_connexion: new Date() });
            } catch (e) {
                console.log('⚠️ Erreur mise à jour connexion:', e.message);
            }

            // Réponse
            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                utilisateur: {
                    id: superviseur.id,
                    email: superviseur.email,
                    telephone: superviseur.telephone,
                    nomComplet: superviseur.nom_complet,
                    role: superviseur.role,
                    type: 'superviseur'
                }
            });

        } catch (erreur) {
            console.error('❌ Erreur connexion superviseur:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion',
                erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
            });
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