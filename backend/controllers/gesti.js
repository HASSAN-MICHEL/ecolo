



import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import GestionnairePoint from '../models/GestionnairePoint.js';
import { pool } from '../config/database.js';

class GestionnaireController {
    // Connexion
    static async connexion(req, res) {
        try {
            const { identifiant, motDePasse } = req.body;

            const gestionnaire = await GestionnairePoint.trouverParEmail(identifiant);

            if (!gestionnaire) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            const motDePasseValide = await bcrypt.compare(motDePasse, gestionnaire.mot_de_passe_hash);
            if (!motDePasseValide) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            if (!gestionnaire.est_actif) {
                return res.status(403).json({
                    success: false,
                    message: 'Compte désactivé'
                });
            }

            const token = jwt.sign(
                { id: gestionnaire.id, email: gestionnaire.email, type: 'gestionnaire' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '7d' }
            );

            // Mettre à jour la dernière connexion
            await GestionnairePoint.mettreAJour(gestionnaire.id, { derniere_connexion: new Date() });

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
                    pointCollecteNom: gestionnaire.point_collecte_nom
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur connexion:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // ✅ Obtenir TOUTES les missions (avec filtre optionnel)
    static async missions(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const { statut } = req.query;
            
            const missions = await GestionnairePoint.missionsDuPoint(gestionnaireId, statut);

            // Grouper par statut
            const grouped = {
                enAttente: missions.filter(m => m.statut === 'deposee'),
                validees: missions.filter(m => m.statut === 'validee'),
                autres: missions.filter(m => !['deposee', 'validee'].includes(m.statut))
            };

            res.json({
                success: true,
                missions,
                grouped,
                total: missions.length,
                stats: {
                    enAttente: grouped.enAttente.length,
                    validees: grouped.validees.length
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur récupération missions:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

//     // Dans GestionnaireController.missionsEnAttente
// static async missionsEnAttente(req, res) {
//     try {
//         const gestionnaireId = req.utilisateurId;
//         // Version simplifiée pour test
//         const missions = await pool.query(`
//             SELECT 
//                 m.id,
//                 m.statut,
//                 m.date_depot_point,
//                 d.type_dechet,
//                 d.quantite,
//                 d.unite,
//                 c.nom_complet as collecteur_nom
//             FROM missions m
//             JOIN declarations_dechets d ON m.declaration_id = d.id
//             JOIN collecteurs c ON m.collecteur_id = c.id
//             WHERE m.statut = 'deposee'
//             ORDER BY m.date_depot_point DESC
//         `);

//         res.json({
//             success: true,
//             missions: missions.rows,
//             total: missions.rows.length
//         });
//     } catch (erreur) {
//         console.error('❌ Erreur:', erreur);
//         res.status(500).json({ success: false, message: 'Erreur serveur' });
//     }
// }

    // Dans GestionnaireController.missionsEnAttente
static async missionsEnAttente(req, res) {
    try {
        const gestionnaireId = req.utilisateurId;
        
        // Récupérer le point de collecte associé au gestionnaire
        const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
        
        if (!gestionnaire || !gestionnaire.point_collecte_id) {
            return res.status(400).json({
                success: false,
                message: 'Gestionnaire non associé à un point de collecte'
            });
        }

        // Récupérer les missions déposées dans ce point de collecte
        const missions = await pool.query(`
            SELECT 
                m.id,
                m.statut,
                m.date_depot_point,
                d.type_dechet,
                d.quantite,
                d.unite,
                c.nom_complet as collecteur_nom,
                c.telephone as collecteur_telephone
            FROM missions m
            JOIN declarations_dechets d ON m.declaration_id = d.id
            JOIN collecteurs c ON m.collecteur_id = c.id
            WHERE m.statut = 'deposee'
              AND m.point_depot_id = $1
            ORDER BY m.date_depot_point DESC
        `, [gestionnaire.point_collecte_id]);

        res.json({
            success: true,
            missions: missions.rows,
            total: missions.rows.length
        });
    } catch (erreur) {
        console.error('❌ Erreur:', erreur);
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

    // ✅ Valider une mission (avec attribution automatique des gains)
    static async validerMission(req, res) {
        try {
            const { missionId } = req.params;
            const gestionnaireId = req.utilisateurId;
            const { poidsDepose, qualiteDechets, validationNotes } = req.body;

            // Validation
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
                    qualiteDechets: qualiteDechets || 'conforme', 
                    validationNotes 
                }
            );

            res.json({
                success: true,
                message: 'Mission validée avec succès. Les gains ont été automatiquement attribués au collecteur.',
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

    // ✅ Attribuer des crédits bonus supplémentaires
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
                message: 'Crédits bonus attribués avec succès',
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

    // ✅ Tableau de bord complet
    static async tableauBord(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const dashboard = await GestionnairePoint.tableauBord(gestionnaireId);

            // Récupérer aussi les missions récentes
            const missionsRecentes = await GestionnairePoint.missionsDuPoint(gestionnaireId);
            const dernieresMissions = missionsRecentes.slice(0, 10);

            res.json({
                success: true,
                ...dashboard,
                dernieresMissions
            });
        } catch (erreur) {
            console.error('❌ Erreur tableau bord:', erreur);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors de la récupération du tableau de bord' 
            });
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

            await GestionnairePoint.mettreAJour(gestionnaireId, { mot_de_passe_hash: hash });

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