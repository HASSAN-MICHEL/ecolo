



import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import GestionnairePoint from '../models/GestionnairePoint.js';
import { pool } from '../config/database.js';
import AchatGestionnaire from '../models/AchatGestionnaire.js';
import StockDechet from '../models/StockDechet.js';



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


// Récupérer le profil du gestionnaire connecté
static async getProfil(req, res) {
    try {
        const gestionnaireId = req.utilisateurId;
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
            utilisateur: {
                id: gestionnaire.id,
                email: gestionnaire.email,
                telephone: gestionnaire.telephone,
                nomComplet: gestionnaire.nom_complet,
                pointCollecteId: gestionnaire.point_collecte_id,
                pointCollecteNom: gestionnaire.point_collecte_nom,
                fonction: gestionnaire.fonction,
                estActif: gestionnaire.est_actif,
                dateCreation: gestionnaire.cree_le,
                derniereConnexion: gestionnaire.derniere_connexion
            }
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération profil:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du profil'
        });
    }
}

// Mettre à jour son propre profil (sans point de collecte)
static async mettreAJourProfil(req, res) {
    try {
        const gestionnaireId = req.utilisateurId;
        const { nomComplet, telephone, fonction } = req.body;

        // Vérifier que le gestionnaire existe
        const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
        if (!gestionnaire) {
            return res.status(404).json({
                success: false,
                message: 'Gestionnaire non trouvé'
            });
        }

        // Vérifier l'unicité du téléphone si modifié
        if (telephone && telephone !== gestionnaire.telephone) {
            const existe = await pool.query(
                'SELECT id FROM gestionnaires_points WHERE telephone = $1 AND id != $2',
                [telephone, gestionnaireId]
            );
            if (existe.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce numéro de téléphone est déjà utilisé'
                });
            }
        }

        const donnees = {};
        if (nomComplet) donnees.nomComplet = nomComplet;
        if (telephone) donnees.telephone = telephone;
        if (fonction) donnees.fonction = fonction;

        const gestionnaireMaj = await GestionnairePoint.mettreAJourProfil(gestionnaireId, donnees);

        if (!gestionnaireMaj) {
            return res.status(400).json({
                success: false,
                message: 'Aucune donnée à mettre à jour'
            });
        }

        res.json({
            success: true,
            message: 'Profil mis à jour avec succès',
            utilisateur: gestionnaireMaj
        });
    } catch (erreur) {
        console.error('❌ Erreur mise à jour profil:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du profil',
            erreur: erreur.message
        });
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




// ✅ Tableau de bord avec stats globales + personnelles
static async tableauBord(req, res) {
    try {
        const gestionnaireId = req.utilisateurId;
        const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
        
        if (!gestionnaire || !gestionnaire.point_collecte_id) {
            return res.json({
                success: true,
                statistiques: {
                    en_attente: 0,
                    total_validees: 0,
                    poids_total_global: 0,
                    gains_distribues_global: 0
                },
                mes_statistiques: {
                    missions_validees: 0,
                    poids_total_valide: 0,
                    gains_distribues: 0
                },
                dernieresMissions: [],
                monHistorique: []
            });
        }

        // Stats globales + personnelles
        const dashboard = await GestionnairePoint.tableauBord(gestionnaireId);
        
        // Toutes les missions récentes du point
        const missionsRecentes = await GestionnairePoint.toutesMissionsDuPoint(gestionnaireId);
        
        // Mon historique personnel
        const monHistorique = await GestionnairePoint.monHistorique(gestionnaireId, 10);

        res.json({
            success: true,
            ...dashboard,
            dernieresMissions: missionsRecentes.slice(0, 10),
            monHistorique
        });
    } catch (erreur) {
        console.error('❌ Erreur tableau bord:', erreur);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération du tableau de bord' 
        });
    }
}

// ✅ Toutes les missions (globales) - À CONSERVER
static async missions(req, res) {
    try {
        const gestionnaireId = req.utilisateurId;
        const { statut } = req.query;
        
        const missions = await GestionnairePoint.toutesMissionsDuPoint(gestionnaireId, statut);

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

// ✅ MES missions validées (personnelles)
static async mesMissionsValidees(req, res) {
    try {
        const gestionnaireId = req.utilisateurId;
        const missions = await GestionnairePoint.mesMissionsValidees(gestionnaireId);

        res.json({
            success: true,
            missions,
            total: missions.length
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération mes missions validées:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}


// MISSION EN ATTENTE POUR CHAQUE gestionnaire celon les points de collecte qui lui sont associés
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

static async validerMission(req, res) {
    try {
        const { missionId } = req.params;
        const gestionnaireId = req.utilisateurId;
        // ✅ AJOUTER campagneId
        const { poidsDepose, prixParKg, qualiteDechets, validationNotes, campagneId } = req.body;

        console.log('📥 Données reçues:', { 
            missionId, 
            poidsDepose, 
            prixParKg, 
            qualiteDechets, 
            validationNotes, 
            campagneId  // ← Vérifier que c'est bien reçu
        });

        // Validation
        if (!poidsDepose || isNaN(parseFloat(poidsDepose)) || parseFloat(poidsDepose) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Le poids doit être un nombre positif'
            });
        }

        if (!prixParKg || isNaN(parseFloat(prixParKg)) || parseFloat(prixParKg) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Le prix par kilogramme doit être un nombre positif'
            });
        }

        // Calculer le montant total
        const montantTotal = parseFloat(poidsDepose) * parseFloat(prixParKg);

        // ✅ Passer campagneId à la méthode du modèle
        const mission = await GestionnairePoint.validerMission(
            missionId, 
            gestionnaireId, 
            { 
                poidsDepose: parseFloat(poidsDepose),
                prixParKg: parseFloat(prixParKg),
                montantTotal: montantTotal,
                qualiteDechets: qualiteDechets || 'conforme', 
                validationNotes,
                campagneId: campagneId || null  // ← AJOUTÉ
            }
        );

        res.json({
            success: true,
            message: `Mission validée avec succès. ${montantTotal} FCFA attribués au collecteur.`,
            mission: {
                ...mission,
                montantTotal,
                poidsDepose,
                prixParKg,
                campagneId  // ← Retourner pour confirmation
            }
        });
    } catch (erreur) {
        console.error('❌ Erreur validation mission:', erreur);
        res.status(500).json({
            success: false,
            message: erreur.message || 'Erreur lors de la validation'
        });
    }
}


    // ✅ Mon historique personnel
static async monHistorique(req, res) {
    try {
        const gestionnaireId = req.utilisateurId;
        const historique = await GestionnairePoint.monHistorique(gestionnaireId, 50);

        res.json({
            success: true,
            historique,
            total: historique.length
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération historique:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// ✅ Détails d'une mission (avec indication si validée par moi)
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

        // Ajouter un indicateur "validée par moi"
        mission.validee_par_moi = (mission.validee_par === gestionnaireId);

        res.json({
            success: true,
            mission
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération mission:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

    //  Attribuer des crédits bonus supplémentaires
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

    // controllers/GestionnaireController.js - Ajoutez ces méthodes

// ✅ Statistiques complètes du point
static async statistiquesCompletes(req, res) {
    try {
        const gestionnaireId = req.utilisateurId;
        const stats = await GestionnairePoint.statistiquesCompletes(gestionnaireId);
        
        res.json({
            success: true,
            ...stats
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération stats complètes:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// ✅ Statistiques par type de déchet
static async statistiquesParTypeDechet(req, res) {
    try {
        const gestionnaireId = req.utilisateurId;
        const stats = await GestionnairePoint.statistiquesParTypeDechet(gestionnaireId);
        
        // Calculer les totaux
        const total = stats.reduce((acc, item) => {
            acc.poids_total += parseFloat(item.poids_total_valide || 0);
            acc.missions_total += parseInt(item.nombre_total_missions || 0);
            return acc;
        }, { poids_total: 0, missions_total: 0 });
        
        res.json({
            success: true,
            stats,
            total: {
                poids: total.poids_total,
                missions: total.missions_total
            }
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération stats par type:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// ✅ Répartition journalière
static async repartitionJournaliere(req, res) {
    try {
        const gestionnaireId = req.utilisateurId;
        const { jours = 30 } = req.query;
        
        const repartition = await GestionnairePoint.repartitionJournaliere(gestionnaireId, jours);
        
        res.json({
            success: true,
            repartition,
            total_jours: repartition.length
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération répartition:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// controllers/GestionnaireController.js - Ajoutez cette méthode

static async getCampagnesDisponibles(req, res) {
    try {
        const gestionnaireId = req.utilisateurId;
        
        // Récupérer le point de collecte du gestionnaire
        const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
        
        if (!gestionnaire || !gestionnaire.point_collecte_id) {
            return res.json({
                success: true,
                campagnes: []
            });
        }
        
        const Campagne = (await import('../models/Campagne.js')).default;
        
        // Récupérer toutes les campagnes actives
        const campagnes = await Campagne.rechercher({ statut: 'active' });
        
        res.json({
            success: true,
            campagnes
        });
        
    } catch (erreur) {
        console.error('❌ Erreur getCampagnesDisponibles:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des campagnes',
            erreur: erreur.message
        });
    }
}
 
}

export default GestionnaireController;