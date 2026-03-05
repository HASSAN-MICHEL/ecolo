// // controllers/GestionnaireAchatController.js
// import GestionnairePoint from '../models/GestionnairePoint.js';
// import AchatGestionnaire from '../models/AchatGestionnaire.js';
// import StockDechet from '../models/StockDechet.js';

// class GestionnaireAchatController {
//     // ✅ Créer un achat (vendeur non inscrit)
//     static async creerAchat(req, res) {
//         try {
//             const gestionnaireId = req.utilisateurId;
//             const { 
//                 typeDechet, 
//                 poids, 
//                 prixParKg, 
//                 nomVendeur, 
//                 telephoneVendeur, 
//                 recuUrl, 
//                 notes 
//             } = req.body;
            
//             // Récupérer le point de collecte du gestionnaire
//             const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
            
//             if (!gestionnaire || !gestionnaire.point_collecte_id) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Vous n\'êtes pas associé à un point de collecte'
//                 });
//             }
            
//             // Validations
//             if (!typeDechet) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Le type de déchet est requis'
//                 });
//             }
            
//             if (!poids || isNaN(parseFloat(poids)) || parseFloat(poids) <= 0) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Le poids doit être un nombre positif'
//                 });
//             }
            
//             if (!prixParKg || isNaN(parseFloat(prixParKg)) || parseFloat(prixParKg) <= 0) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Le prix par kg doit être un nombre positif'
//                 });
//             }
            
//             const achat = await GestionnairePoint.creerAchat(gestionnaireId, {
//                 pointDepotId: gestionnaire.point_collecte_id,
//                 typeDechet,
//                 poids: parseFloat(poids),
//                 prixParKg: parseFloat(prixParKg),
//                 nomVendeur,
//                 telephoneVendeur,
//                 recuUrl,
//                 notes
//             });
            
//             res.status(201).json({
//                 success: true,
//                 message: achat.message,
//                 achat: {
//                     id: achat.id,
//                     typeDechet: achat.type_dechet,
//                     poids: achat.poids,
//                     prixParKg: achat.prix_par_kg,
//                     total: achat.total,
//                     dateAchat: achat.date_achat
//                 }
//             });
            
//         } catch (erreur) {
//             console.error('❌ Erreur création achat:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la création de l\'achat',
//                 erreur: erreur.message
//             });
//         }
//     }
    
//     // ✅ Historique des achats
//     static async historiqueAchats(req, res) {
//         try {
//             const gestionnaireId = req.utilisateurId;
//             const { limite = 50, page = 1 } = req.query;
            
//             const offset = (page - 1) * limite;
            
//             const achats = await AchatGestionnaire.historiqueAchats(gestionnaireId, parseInt(limite), offset);
            
//             // Statistiques rapides
//             const stats = await AchatGestionnaire.statistiquesAchats(gestionnaireId);
            
//             res.json({
//                 success: true,
//                 achats,
//                 statistiques: stats,
//                 pagination: {
//                     page: parseInt(page),
//                     limite: parseInt(limite),
//                     total: achats.length // À améliorer avec COUNT(*)
//                 }
//             });
            
//         } catch (erreur) {
//             console.error('❌ Erreur récupération historique achats:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération de l\'historique'
//             });
//         }
//     }
    
//     // ✅ Obtenir les stocks actuels
//     static async stocks(req, res) {
//         try {
//             const gestionnaireId = req.utilisateurId;
            
//             const stocks = await GestionnairePoint.stocksDuPoint(gestionnaireId);
            
//             // Ajouter des alertes pour les stocks bas
//             const stocksAvecAlertes = stocks.map(stock => ({
//                 ...stock,
//                 alerte: stock.quantite_disponible < 50 ? 'Stock bas' : null,
//                 niveau: stock.quantite_disponible < 20 ? 'critique' : 
//                         stock.quantite_disponible < 50 ? 'attention' : 'normal'
//             }));
            
//             res.json({
//                 success: true,
//                 stocks: stocksAvecAlertes,
//                 total_types: stocks.length,
//                 poids_total: stocks.reduce((acc, s) => acc + parseFloat(s.quantite_disponible), 0)
//             });
            
//         } catch (erreur) {
//             console.error('❌ Erreur récupération stocks:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération des stocks'
//             });
//         }
//     }
    
//     // ✅ Ajuster manuellement un stock
//     static async ajusterStock(req, res) {
//         try {
//             const gestionnaireId = req.utilisateurId;
//             const { typeDechet, nouvelleQuantite, raison } = req.body;
            
//             if (!typeDechet) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Le type de déchet est requis'
//                 });
//             }
            
//             if (nouvelleQuantite === undefined || isNaN(parseFloat(nouvelleQuantite)) || parseFloat(nouvelleQuantite) < 0) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'La quantité doit être un nombre positif ou zéro'
//                 });
//             }
            
//             if (!raison || raison.trim() === '') {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Veuillez fournir une raison pour l\'ajustement'
//                 });
//             }
            
//             const stock = await GestionnairePoint.ajusterStock(
//                 gestionnaireId,
//                 typeDechet,
//                 parseFloat(nouvelleQuantite),
//                 raison
//             );
            
//             res.json({
//                 success: true,
//                 message: `Stock de ${typeDechet} ajusté à ${nouvelleQuantite} kg`,
//                 stock
//             });
            
//         } catch (erreur) {
//             console.error('❌ Erreur ajustement stock:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de l\'ajustement du stock'
//             });
//         }
//     }
    
//     // ✅ Statistiques détaillées des achats
//     static async statistiquesAchats(req, res) {
//         try {
//             const gestionnaireId = req.utilisateurId;
//             const { periode = '30 days' } = req.query;
            
//             const statsGlobales = await AchatGestionnaire.statistiquesAchats(gestionnaireId, periode);
//             const statsParType = await AchatGestionnaire.statistiquesParType(gestionnaireId, periode);
            
//             // Évolution journalière
//             const evolution = await pool.query(`
//                 SELECT 
//                     DATE(date_achat) as jour,
//                     COUNT(*) as nombre_achats,
//                     SUM(poids) as poids_total,
//                     SUM(total) as montant_total
//                 FROM achats_gestionnaires
//                 WHERE gestionnaire_id = $1
//                   AND date_achat >= NOW() - $2::INTERVAL
//                 GROUP BY DATE(date_achat)
//                 ORDER BY jour DESC
//             `, [gestionnaireId, periode]);
            
//             res.json({
//                 success: true,
//                 periode,
//                 global: statsGlobales,
//                 par_type_dechet: statsParType,
//                 evolution_journaliere: evolution.rows,
//                 resume: {
//                     poids_moyen_par_achat: statsGlobales?.poids_total_achete / statsGlobales?.nombre_achats || 0,
//                     montant_moyen_par_achat: statsGlobales?.montant_total_depense / statsGlobales?.nombre_achats || 0,
//                     jours_activite: statsGlobales?.jours_activite || 0
//                 }
//             });
            
//         } catch (erreur) {
//             console.error('❌ Erreur statistiques achats:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération des statistiques'
//             });
//         }
//     }
    
//     // ✅ Tableau de bord complet avec achats et stocks
//     static async tableauBordComplet(req, res) {
//         try {
//             const gestionnaireId = req.utilisateurId;
            
//             const dashboard = await GestionnairePoint.tableauBordComplet(gestionnaireId);
            
//             res.json({
//                 success: true,
//                 ...dashboard
//             });
            
//         } catch (erreur) {
//             console.error('❌ Erreur tableau bord complet:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération du tableau de bord'
//             });
//         }
//     }
    
//     // ✅ Obtenir un reçu d'achat (PDF à générer plus tard)
//     static async getRecuAchat(req, res) {
//         try {
//             const gestionnaireId = req.utilisateurId;
//             const { achatId } = req.params;
            
//             const requete = `
//                 SELECT a.*, gp.nom_complet as gestionnaire_nom, pdv.nom as point_depot_nom
//                 FROM achats_gestionnaires a
//                 JOIN gestionnaires_points gp ON a.gestionnaire_id = gp.id
//                 JOIN points_depot_volontaire pdv ON a.point_depot_id = pdv.id
//                 WHERE a.id = $1 AND a.gestionnaire_id = $2
//             `;
            
//             const resultat = await pool.query(requete, [achatId, gestionnaireId]);
            
//             if (resultat.rows.length === 0) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Achat non trouvé'
//                 });
//             }
            
//             res.json({
//                 success: true,
//                 recu: resultat.rows[0]
//             });
            
//         } catch (erreur) {
//             console.error('❌ Erreur récupération reçu:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération du reçu'
//             });
//         }
//     }
// }

// export default GestionnaireAchatController;


// controllers/GestionnaireAchatController.js
import GestionnairePoint from '../models/GestionnairePoint.js';
import AchatGestionnaire from '../models/AchatGestionnaire.js';
import StockDechet from '../models/StockDechet.js';
import { pool } from '../config/database.js';

class GestionnaireAchatController {
    // ✅ Créer un achat (vendeur non inscrit)
    static async creerAchat(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const { 
                typeDechet, 
                poids, 
                prixParKg, 
                nomVendeur, 
                telephoneVendeur, 
                recuUrl, 
                notes 
            } = req.body;
            
            console.log('📦 Données reçues:', { typeDechet, poids, prixParKg, nomVendeur });
            
            // Récupérer le point de collecte du gestionnaire
            const gestionnaire = await GestionnairePoint.trouverParId(gestionnaireId);
            
            if (!gestionnaire || !gestionnaire.point_collecte_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Vous n\'êtes pas associé à un point de collecte'
                });
            }
            
            // Validations
            if (!typeDechet) {
                return res.status(400).json({
                    success: false,
                    message: 'Le type de déchet est requis'
                });
            }
            
            if (!poids || isNaN(parseFloat(poids)) || parseFloat(poids) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Le poids doit être un nombre positif'
                });
            }
            
            if (!prixParKg || isNaN(parseFloat(prixParKg)) || parseFloat(prixParKg) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Le prix par kg doit être un nombre positif'
                });
            }
            
            // ✅ Utiliser la nouvelle méthode statique
            const achat = await GestionnairePoint.creerAchat(gestionnaireId, {
                pointDepotId: gestionnaire.point_collecte_id,
                typeDechet,
                poids: parseFloat(poids),
                prixParKg: parseFloat(prixParKg),
                nomVendeur,
                telephoneVendeur,
                recuUrl,
                notes
            });
            
            res.status(201).json({
                success: true,
                message: achat.message,
                achat: {
                    id: achat.id,
                    typeDechet: achat.type_dechet,
                    poids: achat.poids,
                    prixParKg: achat.prix_par_kg,
                    total: achat.total,
                    dateAchat: achat.date_achat
                }
            });
            
        } catch (erreur) {
            console.error('❌ Erreur création achat:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création de l\'achat',
                erreur: erreur.message
            });
        }
    }

    // ✅ Obtenir les stocks actuels
    static async stocks(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            
            // ✅ Utiliser la nouvelle méthode statique
            const stocks = await GestionnairePoint.stocksDuPoint(gestionnaireId);
            
            // Ajouter des alertes pour les stocks bas
            const stocksAvecAlertes = stocks.map(stock => ({
                ...stock,
                alerte: stock.quantite_disponible < 50 ? 'Stock bas' : null,
                niveau: stock.quantite_disponible < 20 ? 'critique' : 
                        stock.quantite_disponible < 50 ? 'attention' : 'normal'
            }));
            
            res.json({
                success: true,
                stocks: stocksAvecAlertes,
                total_types: stocks.length,
                poids_total: stocks.reduce((acc, s) => acc + parseFloat(s.quantite_disponible), 0)
            });
            
        } catch (erreur) {
            console.error('❌ Erreur récupération stocks:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des stocks'
            });
        }
    }

    // ✅ Historique des achats
    static async historiqueAchats(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const { limite = 50, page = 1 } = req.query;
            
            const offset = (page - 1) * limite;
            
            const achats = await GestionnairePoint.historiqueAchats(gestionnaireId, parseInt(limite), offset);
            
            // Statistiques rapides
            const stats = await AchatGestionnaire.statistiquesAchats(gestionnaireId);
            
            res.json({
                success: true,
                achats,
                statistiques: stats,
                pagination: {
                    page: parseInt(page),
                    limite: parseInt(limite),
                    total: achats.length
                }
            });
            
        } catch (erreur) {
            console.error('❌ Erreur récupération historique achats:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération de l\'historique'
            });
        }
    }

    // ✅ Ajuster manuellement un stock
    static async ajusterStock(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const { typeDechet, nouvelleQuantite, raison } = req.body;
            
            if (!typeDechet) {
                return res.status(400).json({
                    success: false,
                    message: 'Le type de déchet est requis'
                });
            }
            
            if (nouvelleQuantite === undefined || isNaN(parseFloat(nouvelleQuantite)) || parseFloat(nouvelleQuantite) < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'La quantité doit être un nombre positif ou zéro'
                });
            }
            
            if (!raison || raison.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Veuillez fournir une raison pour l\'ajustement'
                });
            }
            
            const stock = await GestionnairePoint.ajusterStock(
                gestionnaireId,
                typeDechet,
                parseFloat(nouvelleQuantite),
                raison
            );
            
            res.json({
                success: true,
                message: `Stock de ${typeDechet} ajusté à ${nouvelleQuantite} kg`,
                stock
            });
            
        } catch (erreur) {
            console.error('❌ Erreur ajustement stock:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'ajustement du stock'
            });
        }
    }

    // ✅ Statistiques détaillées des achats
    static async statistiquesAchats(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const { periode = '30 days' } = req.query;
            
            const statsGlobales = await AchatGestionnaire.statistiquesAchats(gestionnaireId, periode);
            const statsParType = await AchatGestionnaire.statistiquesParType(gestionnaireId, periode);
            
            // Évolution journalière
            const evolution = await pool.query(`
                SELECT 
                    DATE(date_achat) as jour,
                    COUNT(*) as nombre_achats,
                    SUM(poids) as poids_total,
                    SUM(total) as montant_total
                FROM achats_gestionnaires
                WHERE gestionnaire_id = $1
                  AND date_achat >= NOW() - $2::INTERVAL
                GROUP BY DATE(date_achat)
                ORDER BY jour DESC
            `, [gestionnaireId, periode]);
            
            res.json({
                success: true,
                periode,
                global: statsGlobales,
                par_type_dechet: statsParType,
                evolution_journaliere: evolution.rows,
                resume: {
                    poids_moyen_par_achat: statsGlobales?.poids_total_achete / statsGlobales?.nombre_achats || 0,
                    montant_moyen_par_achat: statsGlobales?.montant_total_depense / statsGlobales?.nombre_achats || 0,
                    jours_activite: statsGlobales?.jours_activite || 0
                }
            });
            
        } catch (erreur) {
            console.error('❌ Erreur statistiques achats:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des statistiques'
            });
        }
    }

       
    // ✅ Obtenir un reçu d'achat (PDF à générer plus tard)
    static async getRecuAchat(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            const { achatId } = req.params;
            
            const requete = `
                SELECT a.*, gp.nom_complet as gestionnaire_nom, pdv.nom as point_depot_nom
                FROM achats_gestionnaires a
                JOIN gestionnaires_points gp ON a.gestionnaire_id = gp.id
                JOIN points_depot_volontaire pdv ON a.point_depot_id = pdv.id
                WHERE a.id = $1 AND a.gestionnaire_id = $2
            `;
            
            const resultat = await pool.query(requete, [achatId, gestionnaireId]);
            
            if (resultat.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Achat non trouvé'
                });
            }
            
            res.json({
                success: true,
                recu: resultat.rows[0]
            });
            
        } catch (erreur) {
            console.error('❌ Erreur récupération reçu:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du reçu'
            });
        }
    }

     
    // ✅ Tableau de bord complet avec achats et stocks
    static async tableauBordComplet(req, res) {
        try {
            const gestionnaireId = req.utilisateurId;
            
            const dashboard = await GestionnairePoint.tableauBordComplet(gestionnaireId);
            
            res.json({
                success: true,
                ...dashboard
            });
            
        } catch (erreur) {
            console.error('❌ Erreur tableau bord complet:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du tableau de bord'
            });
        }
    }
}



export default GestionnaireAchatController;