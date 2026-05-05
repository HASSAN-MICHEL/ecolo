
import bcrypt from 'bcrypt';
import Ong from '../models/Ong.js';
import Campagne from '../models/Campagne.js';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

class OngController {
    // Inscription
    static async inscription(req, res) {
        try {
            const {
                email, telephone, motDePasse, nomOng,
                numeroAgrement, domaineIntervention, nomResponsable,
                adresse, longitude, latitude, cguAcceptees
            } = req.body;

            const existant = await Ong.trouverParEmail(email);
            if (existant) {
                return res.status(400).json({
                    success: false,
                    message: 'Un compte avec cet email existe déjà'
                });
            }

            if (telephone) {
                const telExistant = await Ong.trouverParTelephone(telephone);
                if (telExistant) {
                    return res.status(400).json({
                        success: false,
                        message: 'Ce numéro de téléphone est déjà utilisé'
                    });
                }
            }

            if (!cguAcceptees) {
                return res.status(400).json({
                    success: false,
                    message: 'Vous devez accepter les CGU'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const motDePasseHash = await bcrypt.hash(motDePasse, salt);

            const photoLogoUrl = req.file ? `/uploads/logos/${req.file.filename}` : null;

            const ongData = {
                email,
                telephone,
                motDePasseHash,
                nomOng,
                numeroAgrement,
                domaineIntervention: domaineIntervention ? domaineIntervention.split(',').map(d => d.trim()) : [],
                nomResponsable,
                adresse,
                localisation_gps: latitude && longitude ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : null,
                photoLogoUrl,
                cguAcceptees
            };

            const nouvelleOng = await Ong.creer(ongData);

            res.status(201).json({
                success: true,
                message: 'Inscription réussie',
                ong: {
                    id: nouvelleOng.id,
                    email: nouvelleOng.email,
                    nomOng: nouvelleOng.nom_ong
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur inscription ONG:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'inscription',
                erreur: erreur.message
            });
        }
    }

    // Connexion
    static async connexion(req, res) {
        try {
            const { identifiant, motDePasse } = req.body;

            let ong = await Ong.trouverParEmail(identifiant);
            if (!ong && identifiant.includes('@')) {
                ong = await Ong.trouverParEmail(identifiant);
            } else if (!ong) {
                ong = await Ong.trouverParTelephone(identifiant);
            }

            if (!ong) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            const motDePasseValide = await bcrypt.compare(motDePasse, ong.mot_de_passe_hash);
            if (!motDePasseValide) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            if (!ong.est_actif) {
                return res.status(403).json({
                    success: false,
                    message: 'Compte désactivé'
                });
            }

            await Ong.mettreAJourConnexion(ong.id);

            const token = jwt.sign(
                { id: ong.id, email: ong.email, type: 'ong' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '7d' }
            );

            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                utilisateur: {
                    id: ong.id,
                    email: ong.email,
                    nomOng: ong.nom_ong,
                    type: 'ong'
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur connexion ONG:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion',
                erreur: erreur.message
            });
        }
    }



// static async consulterCampagnes(req, res) {
//     try {
//         const { statut, typeDechet } = req.query;

//         const filtres = {};
//         if (statut) filtres.statut = statut;
//         if (typeDechet) filtres.typeDechet = typeDechet;
        
//         const campagnes = await Campagne.rechercher(filtres);

//         // Formater les types_dechets pour qu'ils soient toujours des tableaux
//         const campagnesFormatees = campagnes.map(c => ({
//             ...c,
//             types_dechets: Array.isArray(c.types_dechets) ? c.types_dechets : 
//                            (c.types_dechets ? [c.types_dechets] : [])
//         }));

//         res.json({
//             success: true,
//             campagnes: campagnesFormatees
//         });
//     } catch (erreur) {
//         console.error('❌ Erreur consultation campagnes:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la consultation',
//             erreur: erreur.message
//         });
//     }
// }

//     // AJOUTÉ : Obtenir les détails d'une campagne spécifique
//     static async detailsCampagne(req, res) {
//         try {
//             const { campagneId } = req.params;
            
//             const campagne = await Campagne.trouverParId(campagneId);
            
//             if (!campagne) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Campagne non trouvée'
//                 });
//             }

//             res.json({
//                 success: true,
//                 campagne
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur détails campagne:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération',
//                 erreur: erreur.message
//             });
//         }
//     }


// Consultation des CAMPAGNES DE L'ONG (pas toutes)
static async consulterCampagnes(req, res) {
    try {
        const ongId = req.utilisateurId;
        const { statut, typeDechet } = req.query;

        const filtres = {};
        if (statut) filtres.statut = statut;
        if (typeDechet) filtres.typeDechet = typeDechet;
        
        // Utiliser trouverParOng au lieu de rechercher()
        const campagnes = await Campagne.trouverParOng(ongId, filtres);

        res.json({
            success: true,
            campagnes: campagnes
        });
    } catch (erreur) {
        console.error('❌ Erreur consultation campagnes ONG:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la consultation',
            erreur: erreur.message
        });
    }
}

// Détails d'une campagne avec vérification propriété
static async detailsCampagne(req, res) {
    try {
        const ongId = req.utilisateurId;
        const { campagneId } = req.params;
        
        // Vérifier que la campagne appartient bien à l'ONG
        const campagne = await Campagne.trouverParIdEtOng(campagneId, ongId);
        
        if (!campagne) {
            return res.status(404).json({
                success: false,
                message: 'Campagne non trouvée ou accès non autorisé'
            });
        }

        res.json({
            success: true,
            campagne
        });
    } catch (erreur) {
        console.error('❌ Erreur détails campagne:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération',
            erreur: erreur.message
        });
    }
}

// Tableau de bord complet avec données personnalisées
static async tableauBord(req, res) {
    try {
        const ongId = req.utilisateurId;
        
        // Récupérer les campagnes de l'ONG
        const campagnes = await Campagne.trouverParOng(ongId);
        
        let totalPoids = 0;
        let campagnesActives = 0;
        const poidsTypes = {};
        let totalPoints = 0;
        let totalCollecteurs = 0;
        
        for (const campagne of campagnes) {
            if (campagne.statut === 'active') campagnesActives++;
            
            // Poids total collecté
            const poidsCollecte = campagne.objectifs?.reduce((sum, obj) => 
                sum + (obj.poids_collecte_actuel || 0), 0) || 0;
            totalPoids += poidsCollecte;
            
            // Points de collecte
            if (campagne.points_couverts) {
                totalPoints += campagne.points_couverts.length;
            }
            
            // Agrégation par type de déchet
            if (campagne.objectifs) {
                campagne.objectifs.forEach(obj => {
                    const type = obj.type_dechet;
                    if (!poidsTypes[type]) poidsTypes[type] = 0;
                    poidsTypes[type] += obj.poids_collecte_actuel || 0;
                });
            }
        }
        
        // Évolution mensuelle des campagnes
        const evolutionMensuelle = await pool.query(`
            SELECT 
                DATE_TRUNC('month', created_at) as mois,
                COUNT(*) as nombre
            FROM campagnes
            WHERE ong_id = $1
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY mois DESC
            LIMIT 6
        `, [ongId]);
        
        // Impact environnemental
        const impact = {
            co2Evite: (totalPoids * 0.5).toFixed(1),
            arbresSauves: Math.floor(totalPoids / 100),
            energieEconomisee: (totalPoids * 2.5).toFixed(1),
            eauEconomisee: (totalPoids * 50).toFixed(1)
        };
        
        res.json({
            success: true,
            campagnes,
            statsGlobales: {
                totalCampagnes: campagnes.length,
                campagnesActives,
                poidsTotalCollecte: totalPoids,
                pointsCouverts: totalPoints,
                collecteursActifs: totalCollecteurs
            },
            poidsParType: poidsTypes,
            impact,
            evolutionMensuelle: evolutionMensuelle.rows.map(row => ({
                mois: new Date(row.mois).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
                nombre: parseInt(row.nombre)
            })).reverse()
        });
    } catch (erreur) {
        console.error('❌ Erreur tableau bord:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération',
            erreur: erreur.message
        });
    }
}

// Télécharger un rapport
static async telechargerRapport(req, res) {
    try {
        const ongId = req.utilisateurId;
        const { rapportId } = req.params;
        
        const resultat = await pool.query(`
            SELECT * FROM rapports_ong
            WHERE id = $1 AND ong_id = $2
        `, [rapportId, ongId]);
        
        if (resultat.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Rapport non trouvé'
            });
        }
        
        const rapport = resultat.rows[0];
        
        if (!rapport.fichier_url) {
            return res.status(404).json({
                success: false,
                message: 'Aucun fichier attaché à ce rapport'
            });
        }
        
        // Rediriger vers le fichier ou envoyer le contenu
        res.json({
            success: true,
            url: rapport.fichier_url,
            nom: rapport.titre
        });
    } catch (erreur) {
        console.error('❌ Erreur téléchargement rapport:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du téléchargement'
        });
    }
}

    //  CORRIGÉ : Indicateur
    static async consulterIndicateurs(req, res) {
        try {
            // Récupérer les statistiques globales
            const resultat = await pool.query(`
                SELECT 
                    COALESCE(SUM(s.poids_collecte), 0) as total_dechets_collectes,
                    COUNT(DISTINCT m.point_depot_id) as points_collecte_actifs,
                    COUNT(DISTINCT m.collecteur_id) as collecteurs_actifs,
                    COUNT(DISTINCT c.id) as campagnes_actives
                FROM campagnes c
                LEFT JOIN suivi_campagne s ON c.id = s.campagne_id
                LEFT JOIN missions m ON c.id = m.campagne_id AND m.statut = 'validee'
                WHERE c.statut = 'active'
            `);

            // Calculer l'impact environnemental estimé
            const stats = resultat.rows[0] || {
                total_dechets_collectes: 0,
                points_collecte_actifs: 0,
                collecteurs_actifs: 0,
                campagnes_actives: 0
            };

            const impact = {
                co2_evite: (stats.total_dechets_collectes * 0.5).toFixed(1),
                arbres_sauves: Math.floor(stats.total_dechets_collectes / 100),
                energie_economisee: (stats.total_dechets_collectes * 2.5).toFixed(1),
                eau_economisee: (stats.total_dechets_collectes * 50).toFixed(1)
            };

            // Zones couvertes
            const zones = await pool.query(`
                SELECT DISTINCT unnest(zones_intervention) as zone
                FROM campagnes
                WHERE statut = 'active'
                ORDER BY zone
            `);

            res.json({
                success: true,
                indicateurs: {
                    ...stats,
                    impact
                },
                zones: zones.rows.map(z => z.zone)
            });
        } catch (erreur) {
            console.error('❌ Erreur consultation indicateurs:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la consultation',
                erreur: erreur.message
            });
        }
    }

    // Dépôt de rapport/alerte
    static async deposerRapport(req, res) {
        try {
            const ongId = req.utilisateurId;
            const { titre, description, typeRapport, zoneConcernee, dateEvenement } = req.body;

            // Récupérer le nom de l'ONG
            const ong = await Ong.trouverParId(ongId);
            
            const fichierUrl = req.file ? `/uploads/rapports/${req.file.filename}` : null;

            const rapport = await Ong.deposerRapport(ongId, {
                titre,
                description,
                fichierUrl,
                typeRapport,
                zoneConcernee,
                dateEvenement
            });

            // Notifier les superviseurs
            await pool.query(`
                INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification)
                SELECT id, 'superviseur', 'Nouveau rapport ONG', 
                       $1 || ' a déposé un rapport: ' || $2, 'info'
                FROM superviseurs
                WHERE est_actif = true
            `, [ong.nom_ong, titre]);

            res.status(201).json({
                success: true,
                message: 'Rapport déposé avec succès',
                rapport
            });
        } catch (erreur) {
            console.error('❌ Erreur dépôt rapport:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du dépôt',
                erreur: erreur.message
            });
        }
    }

    // Mes rapports
    static async mesRapports(req, res) {
        try {
            const ongId = req.utilisateurId;
            const rapports = await Ong.getRapports(ongId);

            res.json({
                success: true,
                rapports
            });
        } catch (erreur) {
            console.error('❌ Erreur liste rapports:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération',
                erreur: erreur.message
            });
        }
    }

    // Détails d'un rapport
    static async detailsRapport(req, res) {
        try {
            const ongId = req.utilisateurId;
            const { rapportId } = req.params;

            const resultat = await pool.query(`
                SELECT * FROM rapports_ong
                WHERE id = $1 AND ong_id = $2
            `, [rapportId, ongId]);

            if (resultat.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Rapport non trouvé'
                });
            }

            res.json({
                success: true,
                rapport: resultat.rows[0]
            });
        } catch (erreur) {
            console.error('❌ Erreur détails rapport:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération',
                erreur: erreur.message
            });
        }
    }

    // Participer à une campagne (en tant qu'observateur)
    static async participerCampagne(req, res) {
        try {
            const ongId = req.utilisateurId;
            const { campagneId, objectifSpecifique } = req.body;

            // Vérifier si l'ONG participe déjà
            const existant = await pool.query(`
                SELECT * FROM promoteurs_campagne 
                WHERE campagne_id = $1 AND promoteur_id = $2 AND promoteur_type = 'ong'
            `, [campagneId, ongId]);

            if (existant.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Vous participez déjà à cette campagne'
                });
            }

            await Campagne.ajouterPromoteur(campagneId, ongId, 'ong', {
                objectifSpecifique
            });

            res.json({
                success: true,
                message: 'Participation enregistrée'
            });
        } catch (erreur) {
            console.error('❌ Erreur participation:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la participation',
                erreur: erreur.message
            });
        }
    }

    // Mes participations aux campagnes
    static async mesParticipations(req, res) {
        try {
            const ongId = req.utilisateurId;
            
            const resultat = await pool.query(`
                SELECT c.*, pc.objectif_specifique, pc.date_ajout
                FROM campagnes c
                JOIN promoteurs_campagne pc ON c.id = pc.campagne_id
                WHERE pc.promoteur_id = $1 AND pc.promoteur_type = 'ong'
                ORDER BY c.date_debut DESC
            `, [ongId]);

            res.json({
                success: true,
                participations: resultat.rows
            });
        } catch (erreur) {
            console.error('❌ Erreur liste participations:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération',
                erreur: erreur.message
            });
        }
    }

    // // Tableau de bord ONG
    // static async tableauBord(req, res) {
    //     try {
    //         const ongId = req.utilisateurId;
            
    //         // Statistiques de l'ONG
    //         const stats = await pool.query(`
    //             SELECT 
    //                 COUNT(DISTINCT id) as total_rapports,
    //                 COUNT(DISTINCT CASE WHEN type_rapport = 'alerte' THEN id END) as total_alertes,
    //                 MAX(cree_le) as dernier_rapport
    //             FROM rapports_ong
    //             WHERE ong_id = $1
    //         `, [ongId]);

    //         // Participations actives
    //         const participations = await pool.query(`
    //             SELECT c.*
    //             FROM campagnes c
    //             JOIN promoteurs_campagne pc ON c.id = pc.campagne_id
    //             WHERE pc.promoteur_id = $1 
    //               AND pc.promoteur_type = 'ong'
    //               AND c.statut = 'active'
    //             ORDER BY c.date_fin ASC
    //         `, [ongId]);

    //         // Indicateurs globaux
    //         const indicateurs = await pool.query(`
    //             SELECT 
    //                 COALESCE(SUM(s.poids_collecte), 0) as total_dechets_collectes,
    //                 COUNT(DISTINCT m.point_depot_id) as points_actifs,
    //                 COUNT(DISTINCT m.collecteur_id) as collecteurs_actifs
    //             FROM campagnes c
    //             LEFT JOIN suivi_campagne s ON c.id = s.campagne_id
    //             LEFT JOIN missions m ON c.id = m.campagne_id AND m.statut = 'validee'
    //             WHERE c.statut = 'active'
    //         `);

    //         res.json({
    //             success: true,
    //             statistiques: stats.rows[0] || { total_rapports: 0, total_alertes: 0, dernier_rapport: null },
    //             participationsActives: participations.rows,
    //             indicateursGlobaux: indicateurs.rows[0] || { total_dechets_collectes: 0, points_actifs: 0, collecteurs_actifs: 0 }
    //         });
    //     } catch (erreur) {
    //         console.error('❌ Erreur tableau bord:', erreur);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Erreur lors de la récupération',
    //             erreur: erreur.message
    //         });
    //     }
    // }

    // Profil
    static async getProfil(req, res) {
        try {
            const ongId = req.utilisateurId;
            const ong = await Ong.trouverParId(ongId);

            if (!ong) {
                return res.status(404).json({
                    success: false,
                    message: 'ONG non trouvée'
                });
            }

            delete ong.mot_de_passe_hash;

            res.json({
                success: true,
                ong
            });
        } catch (erreur) {
            console.error('❌ Erreur getProfil:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur'
            });
        }
    }

    // Mettre à jour le profil
    static async mettreAJourProfil(req, res) {
        try {
            const ongId = req.utilisateurId;
            const {
                nomOng,
                nomResponsable,
                telephone,
                adresse,
                domaineIntervention
            } = req.body;

            // Vérifier l'unicité du téléphone si modifié
            if (telephone) {
                const existant = await Ong.trouverParTelephone(telephone);
                if (existant && existant.id !== ongId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Ce téléphone est déjà utilisé'
                    });
                }
            }

            const donnees = {
                nomOng,
                nomResponsable,
                telephone,
                adresse,
                domaineIntervention: domaineIntervention ? domaineIntervention.split(',').map(d => d.trim()) : undefined
            };

            if (req.file) {
                donnees.photoLogoUrl = `/uploads/logos/${req.file.filename}`;
            }

            const ong = await Ong.mettreAJour(ongId, donnees);

            delete ong.mot_de_passe_hash;

            res.json({
                success: true,
                message: 'Profil mis à jour avec succès',
                ong
            });
        } catch (erreur) {
            console.error('❌ Erreur mise à jour profil:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour',
                erreur: erreur.message
            });
        }
    }
}

export default OngController;