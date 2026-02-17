// // import bcrypt from 'bcrypt';
// // import GestionnairePoint from '../models/GestionnairePoint.js';
// // import Mission from '../models/Mission.js';
// // import { pool } from '../config/database.js';

// // class GestionnaireController {
// //     // Connexion
// //     static async connexion(req, res) {
// //         try {
// //             const { identifiant, motDePasse } = req.body;

// //             let gestionnaire = await GestionnairePoint.trouverParEmail(identifiant);
            
// //             if (!gestionnaire) {
// //                 return res.status(401).json({
// //                     success: false,
// //                     message: 'Identifiants incorrects'
// //                 });
// //             }

// //             // Vérifier le mot de passe
// //             const motDePasseValide = await bcrypt.compare(motDePasse, gestionnaire.mot_de_passe_hash);
// //             if (!motDePasseValide) {
// //                 return res.status(401).json({
// //                     success: false,
// //                     message: 'Identifiants incorrects'
// //                 });
// //             }

// //             // Vérifier si le compte est actif
// //             if (!gestionnaire.est_actif) {
// //                 return res.status(403).json({
// //                     success: false,
// //                     message: 'Compte désactivé. Contactez un superviseur.'
// //                 });
// //             }

// //             // Générer token JWT
// //             const token = req.genererToken({
// //                 id: gestionnaire.id,
// //                 email: gestionnaire.email,
// //                 type: 'gestionnaire'
// //             });

// //             res.json({
// //                 success: true,
// //                 message: 'Connexion réussie',
// //                 token,
// //                 gestionnaire: {
// //                     id: gestionnaire.id,
// //                     email: gestionnaire.email,
// //                     telephone: gestionnaire.telephone,
// //                     nomComplet: gestionnaire.nom_complet,
// //                     pointCollecteId: gestionnaire.point_collecte_id,
// //                     pointCollecteNom: gestionnaire.point_collecte_nom,
// //                     fonction: gestionnaire.fonction
// //                 }
// //             });
// //         } catch (erreur) {
// //             console.error('Erreur connexion gestionnaire:', erreur);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Erreur lors de la connexion',
// //                 erreur: erreur.message
// //             });
// //         }
// //     }

// //     // Missions en attente de validation
// //     static async missionsEnAttente(req, res) {
// //         try {
// //             const gestionnaireId = req.utilisateurId;
// //             const missions = await GestionnairePoint.missionsEnAttente(gestionnaireId);

// //             res.json({
// //                 success: true,
// //                 missions
// //             });
// //         } catch (erreur) {
// //             console.error('Erreur récupération missions:', erreur);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Erreur lors de la récupération des missions',
// //                 erreur: erreur.message
// //             });
// //         }
// //     }

// //     // Valider une mission (pesée)
// //     static async validerMission(req, res) {
// //         try {
// //             const { missionId } = req.params;
// //             const gestionnaireId = req.utilisateurId;
// //             const { poidsDepose, qualiteDechets, notes } = req.body;

// //             const mission = await GestionnairePoint.validerMission(
// //                 missionId, 
// //                 gestionnaireId, 
// //                 { poidsDepose, qualiteDechets, notes }
// //             );

// //             res.json({
// //                 success: true,
// //                 message: 'Mission validée avec succès',
// //                 mission
// //             });
// //         } catch (erreur) {
// //             console.error('Erreur validation mission:', erreur);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Erreur lors de la validation de la mission',
// //                 erreur: erreur.message
// //             });
// //         }
// //     }

// //     // Renseigner les informations sur une mission
// //     static async renseignerMission(req, res) {
// //         try {
// //             const { missionId } = req.params;
// //             const gestionnaireId = req.utilisateurId;
// //             const donnees = req.body;

// //             // Mettre à jour les informations de la mission
// //             const requete = `
// //                 UPDATE missions 
// //                 SET poids_depose = COALESCE($1, poids_depose),
// //                     qualite_dechets = COALESCE($2, qualite_dechets),
// //                     validation_notes = COALESCE($3, validation_notes),
// //                     notes = COALESCE($4, notes)
// //                 WHERE id = $5
// //                 RETURNING *
// //             `;
            
// //             const resultat = await pool.query(requete, [
// //                 donnees.poidsDepose,
// //                 donnees.qualiteDechets,
// //                 donnees.validationNotes,
// //                 donnees.notes,
// //                 missionId
// //             ]);

// //             res.json({
// //                 success: true,
// //                 message: 'Informations de la mission mises à jour',
// //                 mission: resultat.rows[0]
// //             });
// //         } catch (erreur) {
// //             console.error('Erreur renseignement mission:', erreur);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Erreur lors de la mise à jour de la mission',
// //                 erreur: erreur.message
// //             });
// //         }
// //     }

// //     // Attribuer des crédits à un collecteur
// //     static async attribuerCredits(req, res) {
// //         try {
// //             const { collecteurId, missionId } = req.params;
// //             const { montant } = req.body;
// //             const gestionnaireId = req.utilisateurId;

// //             const gain = await GestionnairePoint.attribuerCredits(
// //                 collecteurId, 
// //                 missionId, 
// //                 montant, 
// //                 gestionnaireId
// //             );

// //             // Notification au collecteur
// //             await pool.query(
// //                 `INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification, reference_id, reference_type)
// //                  VALUES ($1, 'collecteur', 'Crédits attribués', 
// //                          'Vous avez reçu ' || $2 || ' FCFA pour votre collecte.',
// //                          'paiement_recu', $3, 'gain')`,
// //                 [collecteurId, montant, gain.id]
// //             );

// //             res.json({
// //                 success: true,
// //                 message: 'Crédits attribués avec succès',
// //                 gain
// //             });
// //         } catch (erreur) {
// //             console.error('Erreur attribution crédits:', erreur);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Erreur lors de l\'attribution des crédits',
// //                 erreur: erreur.message
// //             });
// //         }
// //     }

// //     // Tableau de bord
// //     static async tableauBord(req, res) {
// //         try {
// //             const gestionnaireId = req.utilisateurId;
// //             const dashboard = await GestionnairePoint.tableauBord(gestionnaireId);

// //             // Activités récentes
// //             const requeteActivites = `
// //                 SELECT m.id, m.statut, m.date_validation, 
// //                        c.nom_complet as collecteur_nom,
// //                        d.type_dechet, m.poids_depose
// //                 FROM missions m
// //                 JOIN declarations_dechets d ON m.declaration_id = d.id
// //                 JOIN collecteurs c ON m.collecteur_id = c.id
// //                 JOIN gestionnaires_points g ON g.id = $1
// //                 WHERE m.point_depot_id = g.point_collecte_id
// //                   AND m.date_validation IS NOT NULL
// //                 ORDER BY m.date_validation DESC
// //                 LIMIT 10
// //             `;
            
// //             const activites = await pool.query(requeteActivites, [gestionnaireId]);

// //             res.json({
// //                 success: true,
// //                 dashboard,
// //                 activitesRecentes: activites.rows
// //             });
// //         } catch (erreur) {
// //             console.error('Erreur tableau bord:', erreur);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Erreur lors de la récupération du tableau de bord',
// //                 erreur: erreur.message
// //             });
// //         }
// //     }

// //     // Modifier mot de passe
// //     static async modifierMotDePasse(req, res) {
// //         try {
// //             const gestionnaireId = req.utilisateurId;
// //             const { motDePasseActuel, nouveauMotDePasse } = req.body;

// //             // Vérifier le mot de passe actuel
// //             const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
// //             const motDePasseValide = await bcrypt.compare(motDePasseActuel, gestionnaire.mot_de_passe_hash);

// //             if (!motDePasseValide) {
// //                 return res.status(400).json({
// //                     success: false,
// //                     message: 'Mot de passe actuel incorrect'
// //                 });
// //             }

// //             // Hasher le nouveau mot de passe
// //             const salt = await bcrypt.genSalt(10);
// //             const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, salt);

// //             // Mettre à jour
// //             await pool.query(
// //                 'UPDATE gestionnaires_points SET mot_de_passe_hash = $1 WHERE id = $2',
// //                 [nouveauMotDePasseHash, gestionnaireId]
// //             );

// //             res.json({
// //                 success: true,
// //                 message: 'Mot de passe modifié avec succès'
// //             });
// //         } catch (erreur) {
// //             console.error('Erreur modification mot de passe:', erreur);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Erreur lors de la modification du mot de passe',
// //                 erreur: erreur.message
// //             });
// //         }
// //     }
// // }

// // export default GestionnaireController;



// import bcrypt from 'bcrypt';
// // import jwt from 'jsonwebtoken';
// import jwt from 'jsonwebtoken'; 
// import GestionnairePoint from '../models/GestionnairePoint.js';
// import Mission from '../models/Mission.js';
// import { pool } from '../config/database.js';

// class GestionnaireController {
//     // Connexion
//     // static async connexion(req, res) {
//     //     try {
//     //         const { identifiant, motDePasse } = req.body;

//     //         if (!identifiant || !motDePasse) {
//     //             return res.status(400).json({
//     //                 success: false,
//     //                 message: 'Identifiant et mot de passe requis'
//     //             });
//     //         }

//     //         let gestionnaire = await GestionnairePoint.trouverParEmail(identifiant);
            
//     //         if (!gestionnaire) {
//     //             return res.status(401).json({
//     //                 success: false,
//     //                 message: 'Identifiants incorrects'
//     //             });
//     //         }

//     //         // Vérifier le mot de passe
//     //         const motDePasseValide = await bcrypt.compare(motDePasse, gestionnaire.mot_de_passe_hash);
//     //         if (!motDePasseValide) {
//     //             return res.status(401).json({
//     //                 success: false,
//     //                 message: 'Identifiants incorrects'
//     //             });
//     //         }

//     //         // Vérifier si le compte est actif
//     //         if (!gestionnaire.est_actif) {
//     //             return res.status(403).json({
//     //                 success: false,
//     //                 message: 'Compte désactivé. Contactez un superviseur.'
//     //             });
//     //         }

//     //         // Générer token JWT directement avec jsonwebtoken
//     //         const token = jwt.sign(
//     //             { 
//     //                 id: gestionnaire.id, 
//     //                 email: gestionnaire.email, 
//     //                 type: 'gestionnaire' 
//     //             },
//     //             process.env.JWT_SECRET || 'votre_cle_secrete',
//     //             { expiresIn: process.env.JWT_EXPIRE || '7d' }
//     //         );

//     //         res.json({
//     //             success: true,
//     //             message: 'Connexion réussie',
//     //             token,
//     //             utilisateur: {
//     //                 id: gestionnaire.id,
//     //                 email: gestionnaire.email,
//     //                 telephone: gestionnaire.telephone,
//     //                 nomComplet: gestionnaire.nom_complet,
//     //                 type: 'gestionnaire',
//     //                 pointCollecteId: gestionnaire.point_collecte_id,
//     //                 pointCollecteNom: gestionnaire.point_collecte_nom,
//     //                 fonction: gestionnaire.fonction
//     //             }
//     //         });
//     //     } catch (erreur) {
//     //         console.error('Erreur connexion gestionnaire:', erreur);
//     //         res.status(500).json({
//     //             success: false,
//     //             message: 'Erreur lors de la connexion',
//     //             erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
//     //         });
//     //     }
//     // }

//     // Dans gestionnaireController.js - méthode connexion
// static async connexion(req, res) {
//     try {
//         const { identifiant, motDePasse } = req.body;

//         if (!identifiant || !motDePasse) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Identifiant et mot de passe requis'
//             });
//         }

//         let gestionnaire = await GestionnairePoint.trouverParEmail(identifiant);
        
//         if (!gestionnaire) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Identifiants incorrects'
//             });
//         }

//         // Vérifier le mot de passe
//         const motDePasseValide = await bcrypt.compare(motDePasse, gestionnaire.mot_de_passe_hash);
//         if (!motDePasseValide) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Identifiants incorrects'
//             });
//         }

//         // Vérifier si le compte est actif
//         if (!gestionnaire.est_actif) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Compte désactivé. Contactez un superviseur.'
//             });
//         }

//         // ✅ CORRECTION: Générer token JWT directement avec jwt.sign
//         const token = jwt.sign(
//             { 
//                 id: gestionnaire.id, 
//                 email: gestionnaire.email, 
//                 type: 'gestionnaire' 
//             },
//             process.env.JWT_SECRET || 'votre_cle_secrete',
//             { expiresIn: process.env.JWT_EXPIRE || '7d' }
//         );

//         res.json({
//             success: true,
//             message: 'Connexion réussie',
//             token,
//             utilisateur: {
//                 id: gestionnaire.id,
//                 email: gestionnaire.email,
//                 telephone: gestionnaire.telephone,
//                 nomComplet: gestionnaire.nom_complet,
//                 type: 'gestionnaire',
//                 pointCollecteId: gestionnaire.point_collecte_id,
//                 pointCollecteNom: gestionnaire.point_collecte_nom,
//                 fonction: gestionnaire.fonction
//             }
//         });
//     } catch (erreur) {
//         console.error('Erreur connexion gestionnaire:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la connexion',
//             erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
//         });
//     }
//  }

//     // Missions en attente de validation
//     static async missionsEnAttente(req, res) {
//         try {
//             const gestionnaireId = req.utilisateurId;
            
//             if (!gestionnaireId) {
//                 return res.status(401).json({
//                     success: false,
//                     message: 'Non authentifié'
//                 });
//             }

//             const missions = await GestionnairePoint.missionsEnAttente(gestionnaireId);

//             res.json({
//                 success: true,
//                 missions
//             });
//         } catch (erreur) {
//             console.error('Erreur récupération missions:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération des missions',
//                 erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
//             });
//         }
//     }

//     // Valider une mission (pesée)
//     static async validerMission(req, res) {
//         try {
//             const { missionId } = req.params;
//             const gestionnaireId = req.utilisateurId;
//             const { poidsDepose, qualiteDechets, notes } = req.body;

//             if (!poidsDepose || poidsDepose <= 0) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Le poids déposé est requis et doit être positif'
//                 });
//             }

//             const mission = await GestionnairePoint.validerMission(
//                 missionId, 
//                 gestionnaireId, 
//                 { poidsDepose, qualiteDechets, notes }
//             );

//             res.json({
//                 success: true,
//                 message: 'Mission validée avec succès',
//                 mission
//             });
//         } catch (erreur) {
//             console.error('Erreur validation mission:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la validation de la mission',
//                 erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
//             });
//         }
//     }

//     // Renseigner les informations sur une mission
//     static async renseignerMission(req, res) {
//         try {
//             const { missionId } = req.params;
//             const gestionnaireId = req.utilisateurId;
//             const donnees = req.body;

//             // Vérifier que la mission appartient bien au point de collecte du gestionnaire
//             const verification = await pool.query(`
//                 SELECT m.* FROM missions m
//                 JOIN gestionnaires_points g ON g.point_collecte_id = m.point_depot_id
//                 WHERE m.id = $1 AND g.id = $2
//             `, [missionId, gestionnaireId]);

//             if (verification.rows.length === 0) {
//                 return res.status(403).json({
//                     success: false,
//                     message: 'Vous n\'êtes pas autorisé à modifier cette mission'
//                 });
//             }

//             // Mettre à jour les informations de la mission
//             const requete = `
//                 UPDATE missions 
//                 SET poids_depose = COALESCE($1, poids_depose),
//                     qualite_dechets = COALESCE($2, qualite_dechets),
//                     validation_notes = COALESCE($3, validation_notes),
//                     notes = COALESCE($4, notes)
//                 WHERE id = $5
//                 RETURNING *
//             `;
            
//             const resultat = await pool.query(requete, [
//                 donnees.poidsDepose,
//                 donnees.qualiteDechets,
//                 donnees.validationNotes,
//                 donnees.notes,
//                 missionId
//             ]);

//             res.json({
//                 success: true,
//                 message: 'Informations de la mission mises à jour',
//                 mission: resultat.rows[0]
//             });
//         } catch (erreur) {
//             console.error('Erreur renseignement mission:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la mise à jour de la mission',
//                 erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
//             });
//         }
//     }

//     // Attribuer des crédits à un collecteur
//     static async attribuerCredits(req, res) {
//         try {
//             const { collecteurId, missionId } = req.params;
//             const { montant } = req.body;
//             const gestionnaireId = req.utilisateurId;

//             if (!montant || montant <= 0) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Le montant est requis et doit être positif'
//                 });
//             }

//             const gain = await GestionnairePoint.attribuerCredits(
//                 collecteurId, 
//                 missionId, 
//                 montant, 
//                 gestionnaireId
//             );

//             // Notification au collecteur
//             await pool.query(
//                 `INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification, reference_id, reference_type)
//                  VALUES ($1, 'collecteur', 'Crédits attribués', 
//                          $2 || ' FCFA ont été crédités sur votre compte.',
//                          'paiement_recu', $3, 'gain')`,
//                 [collecteurId, montant, gain.id]
//             );

//             res.json({
//                 success: true,
//                 message: 'Crédits attribués avec succès',
//                 gain
//             });
//         } catch (erreur) {
//             console.error('Erreur attribution crédits:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de l\'attribution des crédits',
//                 erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
//             });
//         }
//     }

//     // Tableau de bord
//     static async tableauBord(req, res) {
//         try {
//             const gestionnaireId = req.utilisateurId;
//             const dashboard = await GestionnairePoint.tableauBord(gestionnaireId);

//             // Activités récentes
//             const requeteActivites = `
//                 SELECT m.id, m.statut, m.date_validation, 
//                        c.nom_complet as collecteur_nom,
//                        d.type_dechet, m.poids_depose
//                 FROM missions m
//                 JOIN declarations_dechets d ON m.declaration_id = d.id
//                 JOIN collecteurs c ON m.collecteur_id = c.id
//                 JOIN gestionnaires_points g ON g.id = $1
//                 WHERE m.point_depot_id = g.point_collecte_id
//                   AND m.date_validation IS NOT NULL
//                 ORDER BY m.date_validation DESC
//                 LIMIT 10
//             `;
            
//             const activites = await pool.query(requeteActivites, [gestionnaireId]);

//             res.json({
//                 success: true,
//                 dashboard: dashboard || {
//                     total_receptions: 0,
//                     total_poids_recu: 0,
//                     receptions_aujourdhui: 0,
//                     poids_aujourdhui: 0
//                 },
//                 activitesRecentes: activites.rows
//             });
//         } catch (erreur) {
//             console.error('Erreur tableau bord:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération du tableau de bord',
//                 erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
//             });
//         }
//     }

//     // Modifier mot de passe
//     static async modifierMotDePasse(req, res) {
//         try {
//             const gestionnaireId = req.utilisateurId;
//             const { motDePasseActuel, nouveauMotDePasse } = req.body;

//             if (!motDePasseActuel || !nouveauMotDePasse) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Mot de passe actuel et nouveau mot de passe requis'
//                 });
//             }

//             // Vérifier le mot de passe actuel
//             const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
//             const motDePasseValide = await bcrypt.compare(motDePasseActuel, gestionnaire.mot_de_passe_hash);

//             if (!motDePasseValide) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Mot de passe actuel incorrect'
//                 });
//             }

//             // Hasher le nouveau mot de passe
//             const salt = await bcrypt.genSalt(10);
//             const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, salt);

//             // Mettre à jour
//             await pool.query(
//                 'UPDATE gestionnaires_points SET mot_de_passe_hash = $1 WHERE id = $2',
//                 [nouveauMotDePasseHash, gestionnaireId]
//             );

//             res.json({
//                 success: true,
//                 message: 'Mot de passe modifié avec succès'
//             });
//         } catch (erreur) {
//             console.error('Erreur modification mot de passe:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la modification du mot de passe',
//                 erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
//             });
//         }
//     }
// }

// export default GestionnaireController;


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import GestionnairePoint from '../models/GestionnairePoint.js';
import Mission from '../models/Mission.js';
import { pool } from '../config/database.js';

class GestionnaireController {
    // Connexion
    static async connexion(req, res) {
        try {
            const { identifiant, motDePasse } = req.body;

            if (!identifiant || !motDePasse) {
                return res.status(400).json({
                    success: false,
                    message: 'Identifiant et mot de passe requis'
                });
            }

            let gestionnaire = await GestionnairePoint.trouverParEmail(identifiant);
            
            if (!gestionnaire) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            // Vérifier le mot de passe
            const motDePasseValide = await bcrypt.compare(motDePasse, gestionnaire.mot_de_passe_hash);
            if (!motDePasseValide) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            // Vérifier si le compte est actif
            if (!gestionnaire.est_actif) {
                return res.status(403).json({
                    success: false,
                    message: 'Compte désactivé. Contactez un superviseur.'
                });
            }

            // Générer token JWT directement avec jsonwebtoken
            const token = jwt.sign(
                { 
                    id: gestionnaire.id, 
                    email: gestionnaire.email, 
                    type: 'gestionnaire' 
                },
                process.env.JWT_SECRET || 'votre_cle_secrete',
                { expiresIn: process.env.JWT_EXPIRE || '7d' }
            );

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
            console.error('Erreur connexion gestionnaire:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion',
                erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
            });
        }
    }

    // Missions en attente de validation
    static async missionsEnAttente(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            
            if (!gestionnaireId) {
                return res.status(401).json({
                    success: false,
                    message: 'Non authentifié'
                });
            }

            const missions = await GestionnairePoint.missionsEnAttente(gestionnaireId);

            res.json({
                success: true,
                missions
            });
        } catch (erreur) {
            console.error('Erreur récupération missions:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des missions',
                erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
            });
        }
    }

    // Valider une mission (pesée)
    // Valider une mission (pesée)
static async validerMission(req, res) {
    try {
        const { missionId } = req.params;
        const gestionnaireId = req.utilisateurId;
        const { poidsDepose, qualiteDechets, notes } = req.body;

        // ✅ Validation et conversion
        if (!poidsDepose || isNaN(parseFloat(poidsDepose)) || parseFloat(poidsDepose) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Le poids déposé est requis et doit être un nombre positif'
            });
        }

        const mission = await GestionnairePoint.validerMission(
            missionId, 
            gestionnaireId, 
            { 
                poidsDepose: parseFloat(poidsDepose), 
                qualiteDechets, 
                notes 
            }
        );

        res.json({
            success: true,
            message: 'Mission validée avec succès',
            mission
        });
    } catch (erreur) {
        console.error('❌ Erreur validation mission:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la validation de la mission',
            erreur: erreur.message
        });
    }
}

    // Renseigner les informations sur une mission
    static async renseignerMission(req, res) {
        try {
            const { missionId } = req.params;
            const gestionnaireId = req.utilisateurId;
            const donnees = req.body;

            // Vérifier que la mission appartient bien au point de collecte du gestionnaire
            const verification = await pool.query(`
                SELECT m.* FROM missions m
                JOIN gestionnaires_points g ON g.point_collecte_id = m.point_depot_id
                WHERE m.id = $1 AND g.id = $2
            `, [missionId, gestionnaireId]);

            if (verification.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Vous n\'êtes pas autorisé à modifier cette mission'
                });
            }

            // Mettre à jour les informations de la mission
            const requete = `
                UPDATE missions 
                SET poids_depose = COALESCE($1, poids_depose),
                    qualite_dechets = COALESCE($2, qualite_dechets),
                    validation_notes = COALESCE($3, validation_notes),
                    notes = COALESCE($4, notes)
                WHERE id = $5
                RETURNING *
            `;
            
            const resultat = await pool.query(requete, [
                donnees.poidsDepose,
                donnees.qualiteDechets,
                donnees.validationNotes,
                donnees.notes,
                missionId
            ]);

            res.json({
                success: true,
                message: 'Informations de la mission mises à jour',
                mission: resultat.rows[0]
            });
        } catch (erreur) {
            console.error('Erreur renseignement mission:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour de la mission',
                erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
            });
        }
    }

    // Attribuer des crédits à un collecteur
    static async attribuerCredits(req, res) {
        try {
            const { collecteurId, missionId } = req.params;
            const { montant } = req.body;
            const gestionnaireId = req.utilisateurId;

            if (!montant || montant <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Le montant est requis et doit être positif'
                });
            }

            const gain = await GestionnairePoint.attribuerCredits(
                collecteurId, 
                missionId, 
                montant, 
                gestionnaireId
            );

            // Notification au collecteur
            await pool.query(
                `INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification, reference_id, reference_type)
                 VALUES ($1, 'collecteur', 'Crédits attribués', 
                         $2 || ' FCFA ont été crédités sur votre compte.',
                         'paiement_recu', $3, 'gain')`,
                [collecteurId, montant, gain.id]
            );

            res.json({
                success: true,
                message: 'Crédits attribués avec succès',
                gain
            });
        } catch (erreur) {
            console.error('Erreur attribution crédits:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'attribution des crédits',
                erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
            });
        }
    }

    // Tableau de bord
    static async tableauBord(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const dashboard = await GestionnairePoint.tableauBord(gestionnaireId);

            // Activités récentes
            const requeteActivites = `
                SELECT m.id, m.statut, m.date_validation, 
                       c.nom_complet as collecteur_nom,
                       d.type_dechet, m.poids_depose
                FROM missions m
                JOIN declarations_dechets d ON m.declaration_id = d.id
                JOIN collecteurs c ON m.collecteur_id = c.id
                JOIN gestionnaires_points g ON g.id = $1
                WHERE m.point_depot_id = g.point_collecte_id
                  AND m.date_validation IS NOT NULL
                ORDER BY m.date_validation DESC
                LIMIT 10
            `;
            
            const activites = await pool.query(requeteActivites, [gestionnaireId]);

            res.json({
                success: true,
                dashboard: dashboard || {
                    total_receptions: 0,
                    total_poids_recu: 0,
                    receptions_aujourdhui: 0,
                    poids_aujourdhui: 0
                },
                activitesRecentes: activites.rows
            });
        } catch (erreur) {
            console.error('Erreur tableau bord:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du tableau de bord',
                erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
            });
        }
    }

    // Modifier mot de passe
    static async modifierMotDePasse(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const { motDePasseActuel, nouveauMotDePasse } = req.body;

            if (!motDePasseActuel || !nouveauMotDePasse) {
                return res.status(400).json({
                    success: false,
                    message: 'Mot de passe actuel et nouveau mot de passe requis'
                });
            }

            // Vérifier le mot de passe actuel
            const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
            const motDePasseValide = await bcrypt.compare(motDePasseActuel, gestionnaire.mot_de_passe_hash);

            if (!motDePasseValide) {
                return res.status(400).json({
                    success: false,
                    message: 'Mot de passe actuel incorrect'
                });
            }

            // Hasher le nouveau mot de passe
            const salt = await bcrypt.genSalt(10);
            const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, salt);

            // Mettre à jour
            await pool.query(
                'UPDATE gestionnaires_points SET mot_de_passe_hash = $1 WHERE id = $2',
                [nouveauMotDePasseHash, gestionnaireId]
            );

            res.json({
                success: true,
                message: 'Mot de passe modifié avec succès'
            });
        } catch (erreur) {
            console.error('Erreur modification mot de passe:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la modification du mot de passe',
                erreur: process.env.NODE_ENV === 'development' ? erreur.message : undefined
            });
        }
    }


    // ✅ Obtenir TOUTES les missions (avec filtre optionnel)
    static async missions(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const { statut } = req.query;
            
            const missions = await GestionnairePoint.missionsDuPoint(gestionnaireId, statut);

            res.json({
                success: true,
                missions,
                total: missions.length
            });
        } catch (erreur) {
            console.error('❌ Erreur récupération missions:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // ✅ Missions en attente (statut = 'deposee')
    static async missionsEnAttente(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const missions = await GestionnairePoint.missionsEnAttente(gestionnaireId);

            res.json({
                success: true,
                missions,
                total: missions.length
            });
        } catch (erreur) {
            console.error('❌ Erreur récupération missions en attente:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // ✅ Missions validées (historique)
    static async missionsValidees(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const missions = await GestionnairePoint.missionsValidees(gestionnaireId);

            res.json({
                success: true,
                missions,
                total: missions.length
            });
        } catch (erreur) {
            console.error('❌ Erreur récupération missions validées:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // ✅ Détails d'une mission
    static async missionDetails(req, res) {
        try {
            const { missionId } = req.params;
            const gestionnaireId = req.utilisateurId;

            const mission = await GestionnairePoint.missionDetails(missionId, gestionnaireId);

            if (!mission) {
                return res.status(404).json({
                    success: false,
                    message: 'Mission non trouvée'
                });
            }

            res.json({
                success: true,
                mission
            });
        } catch (erreur) {
            console.error('❌ Erreur récupération mission:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // ✅ Valider une mission
    static async validerMission(req, res) {
        try {
            const { missionId } = req.params;
            const gestionnaireId = req.utilisateurId;
            const { poidsDepose, qualiteDechets, validationNotes } = req.body;

            if (!poidsDepose || isNaN(parseFloat(poidsDepose)) || parseFloat(poidsDepose) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Le poids doit être un nombre positif'
                });
            }

            const mission = await GestionnairePoint.validerMission(
                missionId, 
                gestionnaireId, 
                { 
                    poidsDepose: parseFloat(poidsDepose), 
                    qualiteDechets, 
                    validationNotes 
                }
            );

            res.json({
                success: true,
                message: 'Mission validée avec succès',
                mission
            });
        } catch (erreur) {
            console.error('❌ Erreur validation mission:', erreur);
            res.status(500).json({
                success: false,
                message: erreur.message || 'Erreur lors de la validation'
            });
        }
    }

    // ✅ Attribuer des crédits bonus
    static async attribuerCredits(req, res) {
        try {
            const { collecteurId, missionId } = req.params;
            const { montant } = req.body;
            const gestionnaireId = req.utilisateurId;

            if (!montant || isNaN(parseFloat(montant)) || parseFloat(montant) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Le montant doit être un nombre positif'
                });
            }

            const gain = await GestionnairePoint.attribuerCredits(
                collecteurId,
                missionId,
                parseFloat(montant),
                gestionnaireId
            );

            res.json({
                success: true,
                message: 'Crédits attribués avec succès',
                gain
            });
        } catch (erreur) {
            console.error('❌ Erreur attribution crédits:', erreur);
            res.status(500).json({
                success: false,
                message: erreur.message || 'Erreur lors de l\'attribution'
            });
        }
    }

    // ✅ Tableau de bord
    static async tableauBord(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const dashboard = await GestionnairePoint.tableauBord(gestionnaireId);

            res.json({
                success: true,
                ...dashboard
            });
        } catch (erreur) {
            console.error('❌ Erreur tableau bord:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // ✅ Modifier mot de passe
    static async modifierMotDePasse(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const { motDePasseActuel, nouveauMotDePasse } = req.body;

            const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
            const valide = await bcrypt.compare(motDePasseActuel, gestionnaire.mot_de_passe_hash);

            if (!valide) {
                return res.status(400).json({
                    success: false,
                    message: 'Mot de passe actuel incorrect'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(nouveauMotDePasse, salt);

            await pool.query(
                'UPDATE gestionnaires_points SET mot_de_passe_hash = $1 WHERE id = $2',
                [hash, gestionnaireId]
            );

            res.json({
                success: true,
                message: 'Mot de passe modifié avec succès'
            });
        } catch (erreur) {
            console.error('❌ Erreur modification mot de passe:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }
}

export default GestionnaireController;




