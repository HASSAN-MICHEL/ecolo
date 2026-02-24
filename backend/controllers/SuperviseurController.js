

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

// ✅ Récupérer les détails d'un gestionnaire spécifique
static async getGestionnaireDetails(req, res) {
    try {
        const { gestionnaireId } = req.params;
        
        const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
        
        if (!gestionnaire) {
            return res.status(404).json({
                success: false,
                message: 'Gestionnaire non trouvé'
            });
        }

        // Ne pas renvoyer le mot de passe
        delete gestionnaire.mot_de_passe_hash;

        res.json({
            success: true,
            gestionnaire: {
                id: gestionnaire.id,
                email: gestionnaire.email,
                telephone: gestionnaire.telephone,
                nomComplet: gestionnaire.nom_complet,
                pointCollecteId: gestionnaire.point_collecte_id,
                pointCollecteNom: gestionnaire.point_collecte_nom,
                fonction: gestionnaire.fonction,
                estActif: gestionnaire.est_actif,
                creePar: gestionnaire.cree_par,
                dateCreation: gestionnaire.cree_le,
                derniereConnexion: gestionnaire.derniere_connexion
            }
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération détails gestionnaire:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des détails'
        });
    }
}

// // ✅ Modifier un gestionnaire (TOUT, y compris point de collecte)
// static async modifierGestionnaireComplet(req, res) {
//     try {
//         const { gestionnaireId } = req.params;
//         const superviseurId = req.utilisateurId;
//         const { 
//             email, 
//             telephone, 
//             nomComplet, 
//             pointCollecteId, 
//             fonction, 
//             estActif 
//         } = req.body;

//         // Vérifier que le gestionnaire existe
//         const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
//         if (!gestionnaire) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Gestionnaire non trouvé'
//             });
//         }

//         // Vérifier l'unicité de l'email si modifié
//         if (email && email !== gestionnaire.email) {
//             const emailExiste = await GestionnairePoint.trouverParEmail(email);
//             if (emailExiste) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Cet email est déjà utilisé'
//                 });
//             }
//         }

//         // Vérifier l'unicité du téléphone si modifié
//         if (telephone && telephone !== gestionnaire.telephone) {
//             const telExiste = await pool.query(
//                 'SELECT id FROM gestionnaires_points WHERE telephone = $1 AND id != $2',
//                 [telephone, gestionnaireId]
//             );
//             if (telExiste.rows.length > 0) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Ce numéro de téléphone est déjà utilisé'
//                 });
//             }
//         }

//         const donnees = {};
//         if (email) donnees.email = email;
//         if (telephone) donnees.telephone = telephone;
//         if (nomComplet) donnees.nomComplet = nomComplet;
//         if (pointCollecteId !== undefined) donnees.pointCollecteId = pointCollecteId;
//         if (fonction) donnees.fonction = fonction;
//         if (estActif !== undefined) donnees.estActif = estActif;

//         const gestionnaireMaj = await GestionnairePoint.mettreAJourComplet(
//             gestionnaireId, 
//             donnees, 
//             superviseurId
//         );

//         if (!gestionnaireMaj) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Aucune donnée à mettre à jour'
//             });
//         }

//         // Récupérer le nom du point de collecte pour la réponse
//         const pointCollecte = pointCollecteId ? 
//             await pool.query('SELECT nom FROM points_depot_volontaire WHERE id = $1', [pointCollecteId]) : null;

//         res.json({
//             success: true,
//             message: 'Gestionnaire modifié avec succès',
//             gestionnaire: {
//                 ...gestionnaireMaj,
//                 pointCollecteNom: pointCollecte?.rows[0]?.nom || gestionnaire.point_collecte_nom
//             }
//         });
//     } catch (erreur) {
//         console.error('❌ Erreur modification gestionnaire:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la modification du gestionnaire',
//             erreur: erreur.message
//         });
//     }
// }

// ✅ Activer/Désactiver un gestionnaire
static async activerGestionnaire(req, res) {
    try {
        const { gestionnaireId } = req.params;
        const { estActif } = req.body;

        if (estActif === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Le statut est requis (true/false)'
            });
        }

        const gestionnaire = await GestionnairePoint.mettreAJour(gestionnaireId, { estActif });

        if (!gestionnaire) {
            return res.status(404).json({
                success: false,
                message: 'Gestionnaire non trouvé'
            });
        }

        res.json({
            success: true,
            message: `Gestionnaire ${estActif ? 'activé' : 'désactivé'} avec succès`,
            gestionnaire
        });
    } catch (erreur) {
        console.error('❌ Erreur activation gestionnaire:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'activation du gestionnaire'
        });
    }
}

  static async getProfil(req, res) {
        try {
            const superviseurId = req.utilisateurId;
            const superviseur = await Superviseur.trouverParId(superviseurId);

            if (!superviseur) {
                return res.status(404).json({
                    success: false,
                    message: 'Superviseur non trouvé'
                });
            }

            delete superviseur.mot_de_passe_hash;

            res.json({
                success: true,
                superviseur
            });
        } catch (erreur) {
            console.error('❌ Erreur getProfil:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    static async modifierProfil(req, res) {
        try {
            const superviseurId = req.utilisateurId;
            const { nomComplet, telephone } = req.body;

            const superviseur = await Superviseur.mettreAJour(superviseurId, { nomComplet, telephone });

            res.json({
                success: true,
                message: 'Profil mis à jour avec succès',
                superviseur
            });
        } catch (erreur) {
            console.error('❌ Erreur modifierProfil:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    static async changerMotDePasse(req, res) {
        try {
            const superviseurId = req.utilisateurId;
            const { motDePasseActuel, nouveauMotDePasse } = req.body;

            const superviseur = await Superviseur.trouverParId(superviseurId);
            const valide = await bcrypt.compare(motDePasseActuel, superviseur.mot_de_passe_hash);

            if (!valide) {
                return res.status(400).json({
                    success: false,
                    message: 'Mot de passe actuel incorrect'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(nouveauMotDePasse, salt);

            await Superviseur.mettreAJour(superviseurId, { mot_de_passe_hash: hash });

            res.json({
                success: true,
                message: 'Mot de passe modifié avec succès'
            });
        } catch (erreur) {
            console.error('❌ Erreur changerMotDePasse:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // ========== COLLECTEURS ==========
    static async getAllCollecteurs(req, res) {
        try {
            const collecteurs = await pool.query(`
                SELECT id, email, telephone, nom_complet, type_collecteur,
                       zone_intervention_nom, statut, est_actif, photo_profil_url,
                       points_total, gains_total, cree_le
                FROM collecteurs
                ORDER BY cree_le DESC
            `);

            res.json({
                success: true,
                collecteurs: collecteurs.rows
            });
        } catch (erreur) {
            console.error('❌ Erreur getAllCollecteurs:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    static async getCollecteurDetails(req, res) {
        try {
            const { collecteurId } = req.params;

            const collecteur = await pool.query(`
                SELECT * FROM collecteurs WHERE id = $1
            `, [collecteurId]);

            if (collecteur.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Collecteur non trouvé'
                });
            }

            res.json({
                success: true,
                collecteur: collecteur.rows[0]
            });
        } catch (erreur) {
            console.error('❌ Erreur getCollecteurDetails:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    static async rejeterCollecteur(req, res) {
        try {
            const { collecteurId } = req.params;
            const { notes } = req.body;

            await pool.query(`
                UPDATE collecteurs 
                SET statut = 'rejete', notes_validation = $1
                WHERE id = $2
            `, [notes, collecteurId]);

            res.json({
                success: true,
                message: 'Collecteur rejeté avec succès'
            });
        } catch (erreur) {
            console.error('❌ Erreur rejeterCollecteur:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // ========== GESTIONNAIRES ==========
    static async getGestionnaireDetails(req, res) {
        try {
            const { gestionnaireId } = req.params;

            const gestionnaire = await pool.query(`
                SELECT g.*, p.nom as point_collecte_nom
                FROM gestionnaires_points g
                LEFT JOIN points_depot_volontaire p ON g.point_collecte_id = p.id
                WHERE g.id = $1
            `, [gestionnaireId]);

            if (gestionnaire.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Gestionnaire non trouvé'
                });
            }

            res.json({
                success: true,
                gestionnaire: gestionnaire.rows[0]
            });
        } catch (erreur) {
            console.error('❌ Erreur getGestionnaireDetails:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    static async modifierGestionnaireComplet(req, res) {
        try {
            const { gestionnaireId } = req.params;
            const { email, telephone, nomComplet, pointCollecteId, fonction, estActif } = req.body;

            // Vérifier que le gestionnaire existe
            const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
            if (!gestionnaire) {
                return res.status(404).json({
                    success: false,
                    message: 'Gestionnaire non trouvé'
                });
            }

            const donnees = {};
            if (email) donnees.email = email;
            if (telephone) donnees.telephone = telephone;
            if (nomComplet) donnees.nomComplet = nomComplet;
            if (pointCollecteId !== undefined) donnees.pointCollecteId = pointCollecteId;
            if (fonction) donnees.fonction = fonction;
            if (estActif !== undefined) donnees.estActif = estActif;

            const gestionnaireMaj = await GestionnairePoint.mettreAJour(gestionnaireId, donnees);

            res.json({
                success: true,
                message: 'Gestionnaire modifié avec succès',
                gestionnaire: gestionnaireMaj
            });
        } catch (erreur) {
            console.error('❌ Erreur modifierGestionnaireComplet:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la modification',
                erreur: erreur.message
            });
        }
    }

    // ========== MISSIONS ==========
    static async missionsDisponibles(req, res) {
        try {
            const missions = await pool.query(`
                SELECT m.*, d.type_dechet, d.quantite, d.unite,
                       p.nom_complet as producteur_nom, p.adresse
                FROM missions m
                JOIN declarations_dechets d ON m.declaration_id = d.id
                JOIN producteurs p ON d.producteur_id = p.id
                WHERE m.statut = 'disponible'
                ORDER BY m.cree_le DESC
            `);

            res.json({
                success: true,
                missions: missions.rows
            });
        } catch (erreur) {
            console.error('❌ Erreur missionsDisponibles:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // ========== STATISTIQUES ==========
    static async evolutionHebdomadaire(req, res) {
        try {
            const { jours = 7 } = req.query;

            const evolution = await pool.query(`
                SELECT 
                    DATE(date_validation) as jour,
                    COUNT(*) as missions_validees,
                    COALESCE(SUM(poids_depose), 0) as poids_total
                FROM missions
                WHERE statut = 'validee'
                  AND date_validation >= NOW() - ($1 || ' days')::INTERVAL
                GROUP BY DATE(date_validation)
                ORDER BY jour DESC
            `, [jours]);

            res.json({
                success: true,
                evolution: evolution.rows
            });
        } catch (erreur) {
            console.error('❌ Erreur evolutionHebdomadaire:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }
}

export default SuperviseurController;