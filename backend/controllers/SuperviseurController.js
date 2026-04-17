

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

    static async getDemandesEnlevement(req, res) {
    try {
        const { statut, recycleurId, pointDepotId } = req.query;

        const demandes = await Superviseur.getDemandesEnlevement({
            statut,
            recycleurId,
            pointDepotId
        });

        res.json({
            success: true,
            demandes,
            total: demandes.length
        });
    } catch (erreur) {
        console.error('❌ Erreur getDemandesEnlevement:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des demandes',
            erreur: erreur.message
        });
    }
}

// Récupérer les demandes traitées par le superviseur connecté
static async mesDemandesTraitees(req, res) {
    try {
        const superviseurId = req.utilisateurId;
        const { statut, dateDebut, dateFin } = req.query;

        const demandes = await Superviseur.getDemandesParSuperviseur(superviseurId, {
            statut,
            dateDebut,
            dateFin
        });

        // Statistiques personnelles
        const stats = await Superviseur.statistiquesDemandes(superviseurId);

        res.json({
            success: true,
            demandes,
            statistiques: stats,
            total: demandes.length
        });
    } catch (erreur) {
        console.error('❌ Erreur mesDemandesTraitees:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de vos demandes',
            erreur: erreur.message
        });
    }
}

// // Valider une demande
// static async validerDemandeEnlevement(req, res) {
//     try {
//         const { demandeId } = req.params;
//         const superviseurId = req.utilisateurId;

//         const resultat = await Superviseur.validerDemandeEnlevement(demandeId, superviseurId);

//         res.json({
//             success: true,
//             message: 'Demande validée avec succès',
//             demande: resultat
//         });
//     } catch (erreur) {
//         console.error('❌ Erreur validerDemandeEnlevement:', erreur);
//         res.status(500).json({
//             success: false,
//             message: erreur.message || 'Erreur lors de la validation',
//             erreur: erreur.message
//         });
//     }
// }

// controllers/SuperviseurController.js - Version corrigée

static async validerDemandeEnlevement(req, res) {
    const client = await pool.connect();
    
    try {
        const { demandeId } = req.params;
        const superviseurId = req.utilisateurId;

        // 1. D'abord, récupérer les informations de la demande
        const demandeInfo = await client.query(`
            SELECT recycleur_id, type_dechet, quantite_demandee 
            FROM demandes_enlevement 
            WHERE id = $1
        `, [demandeId]);

        if (demandeInfo.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Demande non trouvée'
            });
        }

        const { recycleur_id, type_dechet, quantite_demandee } = demandeInfo.rows[0];

        // 2. Valider la demande via le modèle
        const resultat = await Superviseur.validerDemandeEnlevement(demandeId, superviseurId);

        // 3. Ajouter au stock du recycleur
        const StockRecycleur = (await import('../models/StockRecycleur.js')).default;
        
        const stockResult = await StockRecycleur.ajouterDepuisDemande(
            demandeId,
            recycleur_id,           // ← Utiliser recycleur_id de la requête
            type_dechet,             // ← Utiliser type_dechet de la requête
            quantite_demandee        // ← Utiliser quantite_demandee de la requête
        );

        console.log('✅ Stock recycleur mis à jour:', stockResult);

        res.json({
            success: true,
            message: 'Demande validée avec succès',
            demande: resultat,
            stock: stockResult
        });

    } catch (erreur) {
        console.error('❌ Erreur validerDemandeEnlevement:', erreur);
        res.status(500).json({
            success: false,
            message: erreur.message || 'Erreur lors de la validation',
            erreur: erreur.message
        });
    } finally {
        client.release();
    }
}

// Refuser une demande
static async refuserDemandeEnlevement(req, res) {
    try {
        const { demandeId } = req.params;
        const superviseurId = req.utilisateurId;
        const { motif } = req.body;

        if (!motif) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir un motif de refus'
            });
        }

        const resultat = await Superviseur.refuserDemandeEnlevement(demandeId, superviseurId, motif);

        res.json({
            success: true,
            message: 'Demande refusée',
            demande: resultat
        });
    } catch (erreur) {
        console.error('❌ Erreur refuserDemandeEnlevement:', erreur);
        res.status(500).json({
            success: false,
            message: erreur.message || 'Erreur lors du refus',
            erreur: erreur.message
        });
    }
}


static async getAllDeclarations(req, res) {
    try {
        const { statut, recycleurId, dateDebut, dateFin } = req.query;

        let requete = `
            SELECT 
                dr.*,
                r.nom_entreprise as recycleur_nom,
                r.nom_responsable as recycleur_responsable,
                r.email as recycleur_email,
                r.telephone as recycleur_telephone,
                de.point_depot_id,
                pdv.nom as point_nom
            FROM declarations_recyclage dr
            JOIN recycleurs r ON dr.recycleur_id = r.id
            LEFT JOIN demandes_enlevement de ON dr.demande_enlevement_id = de.id
            LEFT JOIN points_depot_volontaire pdv ON de.point_depot_id = pdv.id
            WHERE 1=1
        `;
        
        const valeurs = [];
        let index = 1;

        if (statut) {
            requete += ` AND dr.statut = $${index}`;
            valeurs.push(statut);
            index++;
        }

        if (recycleurId) {
            requete += ` AND dr.recycleur_id = $${index}`;
            valeurs.push(recycleurId);
            index++;
        }

        if (dateDebut) {
            requete += ` AND dr.date_recyclage >= $${index}`;
            valeurs.push(dateDebut);
            index++;
        }

        if (dateFin) {
            requete += ` AND dr.date_recyclage <= $${index}`;
            valeurs.push(dateFin);
            index++;
        }

        requete += ` ORDER BY dr.date_recyclage DESC`;

        const resultat = await pool.query(requete, valeurs);
        
        // Statistiques globales
        const stats = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE statut = 'en_attente') as en_attente,
                COUNT(*) FILTER (WHERE statut = 'validee') as validees,
                COALESCE(SUM(quantite_recyclee), 0) as total_kg
            FROM declarations_recyclage
        `);

        res.json({
            success: true,
            declarations: resultat.rows,
            statistiques: stats.rows[0]
        });
    } catch (erreur) {
        console.error('❌ Erreur getAllDeclarations:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des déclarations',
            erreur: erreur.message
        });
    }
}

static async validerDeclaration(req, res) {
    try {
        const { declarationId } = req.params;
        const superviseurId = req.utilisateurId;

        const requete = `
            UPDATE declarations_recyclage 
            SET statut = 'validee',
                valide_par = $1,
                date_validation = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;

        const resultat = await pool.query(requete, [superviseurId, declarationId]);

        if (resultat.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Déclaration non trouvée'
            });
        }

        res.json({
            success: true,
            message: 'Déclaration validée avec succès',
            declaration: resultat.rows[0]
        });
    } catch (erreur) {
        console.error('❌ Erreur validerDeclaration:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la validation',
            erreur: erreur.message
        });
    }
}

// Statistiques globales des demandes
static async statistiquesDemandes(req, res) {
    try {
        const stats = await Superviseur.statistiquesDemandes();

        // Évolution par mois
        const evolution = await pool.query(`
            SELECT 
                DATE_TRUNC('month', cree_le) as mois,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE statut = 'validee') as validees,
                COUNT(*) FILTER (WHERE statut = 'refusee') as refusees,
                SUM(quantite_demandee) FILTER (WHERE statut = 'validee') as kg_valides
            FROM demandes_enlevement
            WHERE cree_le >= NOW() - INTERVAL '6 months'
            GROUP BY DATE_TRUNC('month', cree_le)
            ORDER BY mois DESC
        `);

        res.json({
            success: true,
            stats,
            evolution: evolution.rows
        });
    } catch (erreur) {
        console.error('❌ Erreur statistiquesDemandes:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques',
            erreur: erreur.message
        });
    }
}

// Récupérer les détails d'une demande
static async detailsDemande(req, res) {
    try {
        const { demandeId } = req.params;

        const demande = await pool.query(`
            SELECT 
                de.*,
                r.nom_entreprise as recycleur_nom,
                r.nom_responsable as recycleur_responsable,
                r.email as recycleur_email,
                r.telephone as recycleur_telephone,
                r.adresse as recycleur_adresse,
                pdv.nom as point_nom,
                pdv.commune as point_commune,
                pdv.quartier as point_quartier,
                pdv.adresse as point_adresse,
                s.nom_complet as valide_par_nom,
                s.email as valide_par_email
            FROM demandes_enlevement de
            JOIN recycleurs r ON de.recycleur_id = r.id
            JOIN points_depot_volontaire pdv ON de.point_depot_id = pdv.id
            LEFT JOIN superviseurs s ON de.valide_par = s.id
            WHERE de.id = $1
        `, [demandeId]);

        if (demande.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Demande non trouvée'
            });
        }

        res.json({
            success: true,
            demande: demande.rows[0]
        });
    } catch (erreur) {
        console.error('❌ Erreur detailsDemande:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des détails',
            erreur: erreur.message
        });
    }
}
}

export default SuperviseurController;