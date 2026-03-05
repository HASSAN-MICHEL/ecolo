



// // controllers/CampagneController.js
// import Campagne from '../models/Campagne.js';
// import Sponsor from '../models/Sponsor.js';
// import ONG from '../models/ONG.js';
// import { pool } from '../config/database.js';

// class CampagneController {
//     // Créer une campagne
//     static async creer(req, res) {
//         try {
//             const createurId = req.utilisateurId;
//             const createurType = req.utilisateurType; // 'superviseur' ou 'admin'

//             const {
//                 nom,
//                 description,
//                 dateDebut,
//                 dateFin,
//                 typesDechets,
//                 zonesIntervention,
//                 poidsAttendue,
//                 prixParKg,
//                 promoteurs // Liste des promoteurs additionnels
//             } = req.body;

//             // Validations
//             if (!nom || !dateDebut || !dateFin || !typesDechets || !poidsAttendue || !prixParKg) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Tous les champs requis doivent être remplis'
//                 });
//             }

//             if (new Date(dateDebut) > new Date(dateFin)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'La date de début doit être antérieure à la date de fin'
//                 });
//             }

//             const campagne = await Campagne.creer({
//                 nom,
//                 description,
//                 dateDebut,
//                 dateFin,
//                 typesDechets,
//                 zonesIntervention,
//                 poidsAttendue,
//                 prixParKg,
//                 budgetTotal: poidsAttendue * prixParKg
//             }, createurId, createurType);

//             // Ajouter les promoteurs additionnels
//             if (promoteurs && Array.isArray(promoteurs)) {
//                 for (const promoteur of promoteurs) {
//                     await Campagne.ajouterPromoteur(
//                         campagne.id,
//                         promoteur.id,
//                         promoteur.type,
//                         promoteur.contribution
//                     );
//                 }
//             }

//             res.status(201).json({
//                 success: true,
//                 message: 'Campagne créée avec succès',
//                 campagne
//             });

//         } catch (erreur) {
//             console.error('❌ Erreur création campagne:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la création de la campagne',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Lister toutes les campagnes (admin/superviseur)
//     static async lister(req, res) {
//         try {
//             const filtres = {
//                 statut: req.query.statut,
//                 typeDechet: req.query.typeDechet,
//                 dateDebut: req.query.dateDebut,
//                 dateFin: req.query.dateFin,
//                 zone: req.query.zone
//             };

//             const campagnes = await Campagne.rechercher(filtres);

//             res.json({
//                 success: true,
//                 campagnes,
//                 total: campagnes.length
//             });

//         } catch (erreur) {
//             console.error('❌ Erreur liste campagnes:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération des campagnes',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Obtenir les détails d'une campagne
//     static async details(req, res) {
//         try {
//             const { campagneId } = req.params;

//             const campagne = await Campagne.trouverParId(campagneId);
            
//             if (!campagne) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Campagne non trouvée'
//                 });
//             }

//             const promoteurs = await Campagne.getPromoteurs(campagneId);
//             const stats = await Campagne.getStatistiques(campagneId);
//             const points = await Campagne.getDetailsParPoint(campagneId);
//             const evolution = await Campagne.getEvolutionJournaliere(campagneId);

//             res.json({
//                 success: true,
//                 campagne: {
//                     ...campagne,
//                     promoteurs,
//                     statistiques: stats,
//                     points_couverts: points,
//                     evolution
//                 }
//             });

//         } catch (erreur) {
//             console.error('❌ Erreur détails campagne:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération des détails',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Mettre à jour une campagne
//     static async mettreAJour(req, res) {
//         try {
//             const { campagneId } = req.params;
//             const donnees = req.body;

//             const campagne = await Campagne.mettreAJour(campagneId, donnees);

//             if (!campagne) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Campagne non trouvée'
//                 });
//             }

//             res.json({
//                 success: true,
//                 message: 'Campagne mise à jour avec succès',
//                 campagne
//             });

//         } catch (erreur) {
//             console.error('❌ Erreur mise à jour campagne:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la mise à jour',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Ajouter un promoteur à une campagne
//     static async ajouterPromoteur(req, res) {
//         try {
//             const { campagneId } = req.params;
//             const { promoteurId, promoteurType, contribution } = req.body;

//             const promoteur = await Campagne.ajouterPromoteur(
//                 campagneId,
//                 promoteurId,
//                 promoteurType,
//                 contribution
//             );

//             res.json({
//                 success: true,
//                 message: 'Promoteur ajouté avec succès',
//                 promoteur
//             });

//         } catch (erreur) {
//             console.error('❌ Erreur ajout promoteur:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de l\'ajout du promoteur',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Activer/Désactiver une campagne
//     static async changerStatut(req, res) {
//         try {
//             const { campagneId } = req.params;
//             const { statut } = req.body;

//             const statutsValides = ['planifiee', 'active', 'suspendue', 'terminee'];
//             if (!statutsValides.includes(statut)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Statut invalide'
//                 });
//             }

//             const campagne = await Campagne.mettreAJourStatut(campagneId, statut);

//             res.json({
//                 success: true,
//                 message: `Campagne ${statut === 'active' ? 'activée' : 'désactivée'} avec succès`,
//                 campagne
//             });

//         } catch (erreur) {
//             console.error('❌ Erreur changement statut:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors du changement de statut',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Ajouter un suivi (pour les missions)
//     static async ajouterSuivi(req, res) {
//         try {
//             const { campagneId } = req.params;
//             const { poidsCollecte, montantUtilise, pointDepotId } = req.body;

//             const suivi = await Campagne.ajouterSuivi(campagneId, {
//                 poidsCollecte,
//                 montantUtilise,
//                 pointsConcernes: pointDepotId ? 1 : 0,
//                 details: { point_depot_id: pointDepotId }
//             });

//             res.json({
//                 success: true,
//                 message: 'Suivi ajouté avec succès',
//                 suivi
//             });

//         } catch (erreur) {
//             console.error('❌ Erreur ajout suivi:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de l\'ajout du suivi',
//                 erreur: erreur.message
//             });
//         }
//     }

    
//     // Obtenir les statistiques globales des campagnes
//     static async statistiquesGlobales(req, res) {
//         try {
//             const resultat = await pool.query(`
//                 SELECT 
//                     COUNT(*) as total_campagnes,
//                     COUNT(*) FILTER (WHERE statut = 'planifiee') as planifiees,
//                     COUNT(*) FILTER (WHERE statut = 'active') as actives,
//                     COUNT(*) FILTER (WHERE statut = 'terminee') as terminees,
//                     COALESCE(SUM(poids_attendue), 0) as poids_total_attendu,
//                     COALESCE((
//                         SELECT SUM(poids_collecte) 
//                         FROM suivi_campagne
//                     ), 0) as poids_total_collecte,
//                     COALESCE(AVG(prix_par_kg), 0) as prix_moyen_kg
//                 FROM campagnes
//             `);

//             res.json({
//                 success: true,
//                 statistiques: resultat.rows[0]
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur stats globales:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Exporter les données d'une campagne (PDF/Excel)
//     static async exporter(req, res) {
//         try {
//             const { campagneId } = req.params;
//             const { format } = req.query; // 'pdf' ou 'excel'

//             const campagne = await Campagne.trouverParId(campagneId);
//             const stats = await Campagne.getStatistiques(campagneId);
//             const points = await Campagne.getDetailsParPoint(campagneId);
//             const evolution = await Campagne.getEvolutionJournaliere(campagneId);

//             // À implémenter selon le format demandé
//             // Pour l'instant, retourner les données JSON
//             res.json({
//                 success: true,
//                 data: {
//                     campagne,
//                     statistiques: stats,
//                     points,
//                     evolution
//                 }
//             });

//         } catch (erreur) {
//             console.error('❌ Erreur export:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de l\'export',
//                 erreur: erreur.message
//             });
//         }
//     }
// }

// export default CampagneController;



// controllers/CampagneController.js - Version complète

import Campagne from '../models/Campagne.js';
import { pool } from '../config/database.js';

class CampagneController {
    // Créer une campagne
    // static async creer(req, res) {
    //     try {
    //         const createurId = req.utilisateurId;
    //         const createurType = req.utilisateurType;

    //         const {
    //             nom,
    //             description,
    //             dateDebut,
    //             dateFin,
    //             typesDechets,
    //             zonesIntervention,
    //             poidsAttendue,
    //             prixParKg,
    //             promoteurs
    //         } = req.body;

    //         // Validations
    //         if (!nom || !dateDebut || !dateFin || !typesDechets || !poidsAttendue || !prixParKg) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Tous les champs requis doivent être remplis'
    //             });
    //         }

    //         if (new Date(dateDebut) > new Date(dateFin)) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'La date de début doit être antérieure à la date de fin'
    //             });
    //         }

    //         const campagne = await Campagne.creer({
    //             nom,
    //             description,
    //             dateDebut,
    //             dateFin,
    //             typesDechets,
    //             zonesIntervention,
    //             poidsAttendue,
    //             prixParKg,
    //             budgetTotal: poidsAttendue * prixParKg
    //         }, createurId, createurType);

    //         // Ajouter les promoteurs additionnels
    //         if (promoteurs && Array.isArray(promoteurs)) {
    //             for (const promoteur of promoteurs) {
    //                 await Campagne.ajouterPromoteur(
    //                     campagne.id,
    //                     promoteur.id,
    //                     promoteur.type,
    //                     promoteur.contribution
    //                 );
    //             }
    //         }

    //         res.status(201).json({
    //             success: true,
    //             message: 'Campagne créée avec succès',
    //             campagne
    //         });

    //     } catch (erreur) {
    //         console.error('❌ Erreur création campagne:', erreur);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Erreur lors de la création de la campagne',
    //             erreur: erreur.message
    //         });
    //     }
    // }

    static async creer(req, res) {
    try {
        const createurId = req.utilisateurId;
        const createurType = req.utilisateurType;

        const {
            nom,
            description,
            dateDebut,
            dateFin,
            objectifs,  // ← Remplacer typesDechets et prixParKg par objectifs
            zonesIntervention,
            promoteurs
        } = req.body;

        // Validations
        if (!nom || !dateDebut || !dateFin || !objectifs || objectifs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs requis doivent être remplis'
            });
        }

        if (new Date(dateDebut) > new Date(dateFin)) {
            return res.status(400).json({
                success: false,
                message: 'La date de début doit être antérieure à la date de fin'
            });
        }

        // Valider chaque objectif
        for (const obj of objectifs) {
            if (!obj.typeDechet || !obj.poidsAttendue || !obj.prixParKg) {
                return res.status(400).json({
                    success: false,
                    message: 'Chaque objectif doit avoir un type, un poids et un prix'
                });
            }
        }

        const campagne = await Campagne.creerAvecObjectifs({
            nom,
            description,
            dateDebut,
            dateFin,
            objectifs,
            zonesIntervention
        }, createurId, createurType);

        // Ajouter les promoteurs additionnels
        if (promoteurs && Array.isArray(promoteurs)) {
            for (const promoteur of promoteurs) {
                await Campagne.ajouterPromoteur(
                    campagne.id,
                    promoteur.id,
                    promoteur.type,
                    promoteur.contribution
                );
            }
        }

        res.status(201).json({
            success: true,
            message: 'Campagne créée avec succès',
            campagne
        });

    } catch (erreur) {
        console.error('❌ Erreur création campagne:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la campagne',
            erreur: erreur.message
        });
    }
}

    // Lister toutes les campagnes
    static async lister(req, res) {
        try {
            const filtres = {
                statut: req.query.statut,
                typeDechet: req.query.typeDechet,
                dateDebut: req.query.dateDebut,
                dateFin: req.query.dateFin,
                zone: req.query.zone
            };

            const campagnes = await Campagne.rechercher(filtres);

            // Ajouter le statut calculé pour chaque campagne
            const maintenant = new Date();
            const campagnesAvecStatut = campagnes.map(c => {
                let statutReel = c.statut;
                if (c.statut === 'active') {
                    if (new Date(c.date_fin) < maintenant) {
                        statutReel = 'terminee';
                    } else if (new Date(c.date_debut) > maintenant) {
                        statutReel = 'a_venir';
                    }
                }
                return {
                    ...c,
                    statut_reel: statutReel,
                    progression: c.poids_attendue ? 
                        Math.min(100, (c.poids_collecte_actuel / c.poids_attendue * 100)).toFixed(1) : 0
                };
            });

            res.json({
                success: true,
                campagnes: campagnesAvecStatut,
                total: campagnes.length
            });

        } catch (erreur) {
            console.error('❌ Erreur liste campagnes:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des campagnes',
                erreur: erreur.message
            });
        }
    }

    // Obtenir les détails d'une campagne
    static async details(req, res) {
        try {
            const { id } = req.params;

            const campagne = await Campagne.trouverParId(id);
            
            if (!campagne) {
                return res.status(404).json({
                    success: false,
                    message: 'Campagne non trouvée'
                });
            }

            const promoteurs = await Campagne.getPromoteurs(id);
            const stats = await Campagne.getStatistiques(id);
            const points = await Campagne.getDetailsParPoint(id);
            const evolution = await Campagne.getEvolutionJournaliere(id);

            // Calculer la progression
            const progression = campagne.poids_attendue ? 
                Math.min(100, (stats?.poids_total_collecte / campagne.poids_attendue * 100)).toFixed(1) : 0;

            res.json({
                success: true,
                campagne: {
                    ...campagne,
                    promoteurs,
                    statistiques: stats,
                    points_couverts: points,
                    evolution,
                    progression
                }
            });

        } catch (erreur) {
            console.error('❌ Erreur détails campagne:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des détails',
                erreur: erreur.message
            });
        }
    }

    // Obtenir le suivi d'une campagne
    static async suivi(req, res) {
        try {
            const { id } = req.params;

            const resultat = await pool.query(`
                SELECT 
                    date_suivi,
                    poids_collecte,
                    montant_utilise,
                    points_concernes,
                    details
                FROM suivi_campagne
                WHERE campagne_id = $1
                ORDER BY date_suivi DESC
            `, [id]);

            res.json({
                success: true,
                suivi: resultat.rows
            });

        } catch (erreur) {
            console.error('❌ Erreur récupération suivi:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du suivi',
                erreur: erreur.message
            });
        }
    }

    // Mettre à jour une campagne
    static async mettreAJour(req, res) {
        try {
            const { id } = req.params;
            const donnees = req.body;

            const campagne = await Campagne.mettreAJour(id, donnees);

            if (!campagne) {
                return res.status(404).json({
                    success: false,
                    message: 'Campagne non trouvée'
                });
            }

            res.json({
                success: true,
                message: 'Campagne mise à jour avec succès',
                campagne
            });

        } catch (erreur) {
            console.error('❌ Erreur mise à jour campagne:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour',
                erreur: erreur.message
            });
        }
    }

    // Changer le statut d'une campagne
    static async changerStatut(req, res) {
        try {
            const { id } = req.params;
            const { statut } = req.body;

            const statutsValides = ['planifiee', 'active', 'suspendue', 'terminee'];
            if (!statutsValides.includes(statut)) {
                return res.status(400).json({
                    success: false,
                    message: 'Statut invalide'
                });
            }

            const campagne = await Campagne.mettreAJourStatut(id, statut);

            res.json({
                success: true,
                message: `Campagne ${statut === 'active' ? 'activée' : 'mise à jour'} avec succès`,
                campagne
            });

        } catch (erreur) {
            console.error('❌ Erreur changement statut:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du changement de statut',
                erreur: erreur.message
            });
        }
    }

    // Ajouter un promoteur
    static async ajouterPromoteur(req, res) {
        try {
            const { id } = req.params;
            const { promoteurId, promoteurType, contribution } = req.body;

            const promoteur = await Campagne.ajouterPromoteur(
                id,
                promoteurId,
                promoteurType,
                contribution
            );

            res.json({
                success: true,
                message: 'Promoteur ajouté avec succès',
                promoteur
            });

        } catch (erreur) {
            console.error('❌ Erreur ajout promoteur:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'ajout du promoteur',
                erreur: erreur.message
            });
        }
    }

    // Retirer un promoteur
    static async retirerPromoteur(req, res) {
        try {
            const { id, promoteurId, promoteurType } = req.params;

            const resultat = await pool.query(`
                DELETE FROM promoteurs_campagne
                WHERE campagne_id = $1 AND promoteur_id = $2 AND promoteur_type = $3
                RETURNING *
            `, [id, promoteurId, promoteurType]);

            if (resultat.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Promoteur non trouvé'
                });
            }

            res.json({
                success: true,
                message: 'Promoteur retiré avec succès'
            });

        } catch (erreur) {
            console.error('❌ Erreur retrait promoteur:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du retrait du promoteur',
                erreur: erreur.message
            });
        }
    }

    // Ajouter un suivi
    static async ajouterSuivi(req, res) {
        try {
            const { campagneId, poidsCollecte, montantUtilise, pointDepotId } = req.body;

            if (!campagneId || !poidsCollecte) {
                return res.status(400).json({
                    success: false,
                    message: 'campagneId et poidsCollecte sont requis'
                });
            }

            const suivi = await Campagne.ajouterSuivi(campagneId, {
                poidsCollecte,
                montantUtilise: montantUtilise || 0,
                pointsConcernes: pointDepotId ? 1 : 0,
                details: pointDepotId ? { point_depot_id: pointDepotId } : {}
            });

            res.json({
                success: true,
                message: 'Suivi ajouté avec succès',
                suivi
            });

        } catch (erreur) {
            console.error('❌ Erreur ajout suivi:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'ajout du suivi',
                erreur: erreur.message
            });
        }
    }

    // Statistiques globales
    static async statistiquesGlobales(req, res) {
        try {
            const resultat = await pool.query(`
                SELECT 
                    COUNT(*) as total_campagnes,
                    COUNT(*) FILTER (WHERE statut = 'planifiee') as planifiees,
                    COUNT(*) FILTER (WHERE statut = 'active') as actives,
                    COUNT(*) FILTER (WHERE statut = 'terminee') as terminees,
                    COALESCE(SUM(poids_attendue), 0) as poids_total_attendu,
                    COALESCE((
                        SELECT SUM(poids_collecte) 
                        FROM suivi_campagne
                    ), 0) as poids_total_collecte,
                    COALESCE(AVG(prix_par_kg), 0) as prix_moyen_kg
                FROM campagnes
            `);

            // Calculer le taux de réalisation global
            const stats = resultat.rows[0];
            stats.taux_realisation_global = stats.poids_total_attendu > 0 ?
                ((stats.poids_total_collecte / stats.poids_total_attendu) * 100).toFixed(1) : 0;

            res.json({
                success: true,
                statistiques: stats
            });

        } catch (erreur) {
            console.error('❌ Erreur stats globales:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération',
                erreur: erreur.message
            });
        }
    }

    // Exporter les données d'une campagne
    static async exporter(req, res) {
        try {
            const { id } = req.params;
            const { format = 'json' } = req.query;

            const campagne = await Campagne.trouverParId(id);
            
            if (!campagne) {
                return res.status(404).json({
                    success: false,
                    message: 'Campagne non trouvée'
                });
            }

            const stats = await Campagne.getStatistiques(id);
            const points = await Campagne.getDetailsParPoint(id);
            const evolution = await Campagne.getEvolutionJournaliere(id);
            const promoteurs = await Campagne.getPromoteurs(id);

            const rapport = {
                campagne: {
                    id: campagne.id,
                    nom: campagne.nom,
                    description: campagne.description,
                    periode: `${new Date(campagne.date_debut).toLocaleDateString()} - ${new Date(campagne.date_fin).toLocaleDateString()}`,
                    objectif_kg: campagne.poids_attendue,
                    prix_kg: campagne.prix_par_kg,
                    budget_total: campagne.budget_total,
                    statut: campagne.statut
                },
                realisation: stats,
                points_collecte: points,
                evolution_journaliere: evolution,
                promoteurs: promoteurs,
                date_generation: new Date()
            };

            if (format === 'json') {
                res.json({
                    success: true,
                    rapport
                });
            } else if (format === 'pdf') {
                // À implémenter avec une bibliothèque PDF
                res.json({
                    success: true,
                    message: 'Format PDF à implémenter',
                    rapport
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Format non supporté'
                });
            }

        } catch (erreur) {
            console.error('❌ Erreur export:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'export',
                erreur: erreur.message
            });
        }
    }
}

export default CampagneController;