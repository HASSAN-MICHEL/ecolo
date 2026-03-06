// import bcrypt from 'bcrypt';
// import Recycleur from '../models/Recycleur.js';

// import jwt from 'jsonwebtoken';
// import { pool } from '../config/database.js';

// class RecycleurController {
//     // Inscription
//     static async inscription(req, res) {
//         try {
//             const {
//                 email, telephone, motDePasse, nomEntreprise,
//                 nomResponsable, adresse, longitude, latitude,
//                 quartier, commune, numeroIdentite, cguAcceptees
//             } = req.body;

//             // Vérifications
//             const existant = await Recycleur.trouverParEmail(email);
//             if (existant) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Un compte avec cet email existe déjà'
//                 });
//             }

//             const telephoneExistant = await Recycleur.trouverParTelephone(telephone);
//             if (telephoneExistant) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Ce numéro de téléphone est déjà utilisé'
//                 });
//             }

//             if (!cguAcceptees) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Vous devez accepter les CGU'
//                 });
//             }

//             // Hasher le mot de passe
//             const salt = await bcrypt.genSalt(10);
//             const motDePasseHash = await bcrypt.hash(motDePasse, salt);

//             // Traiter les fichiers uploadés
//             const photoProfilUrl = req.files?.photoProfil ? 
//                 `/uploads/recycleurs/${req.files.photoProfil[0].filename}` : null;
//             const photoCniRectoUrl = req.files?.photoCniRecto ? 
//                 `/uploads/cnis/${req.files.photoCniRecto[0].filename}` : null;
//             const photoCniVersoUrl = req.files?.photoCniVerso ? 
//                 `/uploads/cnis/${req.files.photoCniVerso[0].filename}` : null;

//             const recycleurData = {
//                 email,
//                 telephone,
//                 motDePasseHash,
//                 nomEntreprise,
//                 nomResponsable,
//                 adresse,
//                 localisation_gps: latitude && longitude ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : null,
//                 quartier,
//                 commune,
//                 numeroIdentite,
//                 photoProfilUrl,
//                 photoCniRectoUrl,
//                 photoCniVersoUrl,
//                 cguAcceptees
//             };

//             const nouveauRecycleur = await Recycleur.creer(recycleurData);

//             res.status(201).json({
//                 success: true,
//                 message: 'Inscription réussie. En attente de validation.',
//                 recycleur: {
//                     id: nouveauRecycleur.id,
//                     email: nouveauRecycleur.email,
//                     nomEntreprise: nouveauRecycleur.nom_entreprise,
//                     statut: nouveauRecycleur.statut
//                 }
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur inscription recycleur:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de l\'inscription',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Connexion
//     static async connexion(req, res) {
//         try {
//             const { identifiant, motDePasse } = req.body;

//             let recycleur = await Recycleur.trouverParEmail(identifiant);
//             if (!recycleur) {
//                 recycleur = await Recycleur.trouverParTelephone(identifiant);
//             }

//             if (!recycleur) {
//                 return res.status(401).json({
//                     success: false,
//                     message: 'Identifiants incorrects'
//                 });
//             }

//             const motDePasseValide = await bcrypt.compare(motDePasse, recycleur.mot_de_passe_hash);
//             if (!motDePasseValide) {
//                 return res.status(401).json({
//                     success: false,
//                     message: 'Identifiants incorrects'
//                 });
//             }

//             if (recycleur.statut !== 'actif') {
//                 return res.status(403).json({
//                     success: false,
//                     message: 'Votre compte est en attente de validation ou a été suspendu'
//                 });
//             }

//             await Recycleur.mettreAJourConnexion(recycleur.id);

//             const token = jwt.sign(
//                 { id: recycleur.id, email: recycleur.email, type: 'recycleur' },
//                 process.env.JWT_SECRET,
//                 { expiresIn: process.env.JWT_EXPIRE || '7d' }
//             );

//             res.json({
//                 success: true,
//                 message: 'Connexion réussie',
//                 token,
//                 utilisateur: {
//                     id: recycleur.id,
//                     email: recycleur.email,
//                     telephone: recycleur.telephone,
//                     nomEntreprise: recycleur.nom_entreprise,
//                     nomResponsable: recycleur.nom_responsable,
//                     type: 'recycleur',
//                     statut: recycleur.statut
//                 }
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur connexion recycleur:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la connexion',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Consulter les stocks disponibles
//     static async consulterStocks(req, res) {
//         try {
//             const { typeDechet, commune } = req.query;

//             const stocks = await StockDechet.listerDisponibles({
//                 typeDechet,
//                 commune
//             });

//             res.json({
//                 success: true,
//                 stocks
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur consultation stocks:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la consultation',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Faire une demande d'enlèvement
//     static async demanderEnlevement(req, res) {
//         try {
//             const recycleurId = req.utilisateurId;
//             const { pointDepotId, typeDechet, quantite, dateSouhaitee, notes } = req.body;

//             // Vérifier le stock disponible
//             const stock = await StockDechet.trouverParPointEtType(pointDepotId, typeDechet);
//             if (!stock || stock.quantite_disponible < quantite) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Stock insuffisant pour cette demande'
//                 });
//             }

//             const demande = await DemandeEnlevement.creer({
//                 recycleurId,
//                 pointDepotId,
//                 typeDechet,
//                 quantite,
//                 dateSouhaitee,
//                 notes
//             });

//             // Créer une notification pour les superviseurs
//             await pool.query(`
//                 INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification)
//                 SELECT id, 'superviseur', 'Nouvelle demande d\'enlèvement', 
//                        $1 || ' a fait une demande d\'enlèvement', 'info'
//                 FROM superviseurs
//                 WHERE est_actif = true
//             `, [stock.nom_entreprise]);

//             res.status(201).json({
//                 success: true,
//                 message: 'Demande d\'enlèvement enregistrée',
//                 demande
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur demande enlèvement:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la demande',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Lister mes demandes d'enlèvement
//     static async mesDemandes(req, res) {
//         try {
//             const recycleurId = req.utilisateurId;
//             const { statut } = req.query;

//             const demandes = await DemandeEnlevement.listerParRecycleur(recycleurId, statut);

//             res.json({
//                 success: true,
//                 demandes
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur liste demandes:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Confirmer réception d'enlèvement
//     static async confirmerReception(req, res) {
//         try {
//             const recycleurId = req.utilisateurId;
//             const { demandeId } = req.params;
//             const { quantiteRecue, notes } = req.body;

//             const demande = await DemandeEnlevement.trouverParId(demandeId);
//             if (!demande || demande.recycleur_id !== recycleurId) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Demande non trouvée'
//                 });
//             }

//             if (demande.statut !== 'acceptee') {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Cette demande n\'est pas prête à être confirmée'
//                 });
//             }

//             await DemandeEnlevement.confirmerReception(demandeId, {
//                 quantiteRecue: quantiteRecue || demande.quantite_demandee,
//                 notes
//             });

//             // Mettre à jour le stock
//             await StockDechet.reduireStock(
//                 demande.point_depot_id,
//                 demande.type_dechet,
//                 quantiteRecue || demande.quantite_demandee
//             );

//             res.json({
//                 success: true,
//                 message: 'Réception confirmée avec succès'
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur confirmation:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la confirmation',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Déclarer des volumes recyclés
//     static async declarerRecyclage(req, res) {
//         try {
//             const recycleurId = req.utilisateurId;
//             const { demandeId, typeDechet, quantite, dateRecyclage, certificatUrl } = req.body;

//             const declaration = await DeclarationRecyclage.creer({
//                 recycleurId,
//                 demandeId,
//                 typeDechet,
//                 quantite,
//                 dateRecyclage,
//                 certificatUrl
//             });

//             res.status(201).json({
//                 success: true,
//                 message: 'Déclaration de recyclage enregistrée',
//                 declaration
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur déclaration recyclage:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la déclaration',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Mes déclarations de recyclage
//     static async mesDeclarations(req, res) {
//         try {
//             const recycleurId = req.utilisateurId;
//             const { statut } = req.query;

//             const declarations = await DeclarationRecyclage.listerParRecycleur(recycleurId, statut);

//             res.json({
//                 success: true,
//                 declarations
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur liste déclarations:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Obtenir le profil
//     static async monProfil(req, res) {
//         try {
//             const recycleurId = req.utilisateurId;
//             const recycleur = await Recycleur.trouverParId(recycleurId);

//             if (!recycleur) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Recycleur non trouvé'
//                 });
//             }

//             delete recycleur.mot_de_passe_hash;

//             res.json({
//                 success: true,
//                 recycleur
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur profil:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Mettre à jour le profil
//     static async mettreAJourProfil(req, res) {
//         try {
//             const recycleurId = req.utilisateurId;
//             const {
//                 nomEntreprise,
//                 nomResponsable,
//                 telephone,
//                 adresse,
//                 quartier,
//                 commune
//             } = req.body;

//             if (telephone) {
//                 const existant = await Recycleur.trouverParTelephone(telephone);
//                 if (existant && existant.id !== recycleurId) {
//                     return res.status(400).json({
//                         success: false,
//                         message: 'Ce téléphone est déjà utilisé'
//                     });
//                 }
//             }

//             const donnees = {
//                 nomEntreprise,
//                 nomResponsable,
//                 telephone,
//                 adresse,
//                 quartier,
//                 commune
//             };

//             const recycleur = await Recycleur.mettreAJour(recycleurId, donnees);

//             res.json({
//                 success: true,
//                 message: 'Profil mis à jour',
//                 recycleur
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur mise à jour:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la mise à jour',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Tableau de bord
//     static async tableauBord(req, res) {
//         try {
//             const recycleurId = req.utilisateurId;
//             const dashboard = await Recycleur.tableauBord(recycleurId);

//             // Dernières demandes
//             const dernieresDemandes = await DemandeEnlevement.listerParRecycleur(recycleurId, null, 5);
            
//             // Dernières déclarations
//             const dernieresDeclarations = await DeclarationRecyclage.listerParRecycleur(recycleurId, null, 5);

//             res.json({
//                 success: true,
//                 dashboard,
//                 dernieresDemandes,
//                 dernieresDeclarations
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur tableau bord:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération',
//                 erreur: erreur.message
//             });
//         }
//     }
// }

// export default RecycleurController;



// controllers/RecycleurController.js - Version complète

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Recycleur from '../models/Recycleur.js';
import DemandeEnlevement from '../models/DemandeEnlevement.js';
import DeclarationRecyclage from '../models/DeclarationRecyclage.js';
import StockDechet from '../models/StockDechet.js';
import { pool } from '../config/database.js';

class RecycleurController {
    // Inscription
    static async inscription(req, res) {
        try {
            const {
                email, telephone, motDePasse, nomEntreprise,
                nomResponsable, adresse, quartier, commune, 
                numeroIdentite, cguAcceptees
            } = req.body;

            // Vérifications
            const existant = await Recycleur.trouverParEmail(email);
            if (existant) {
                return res.status(400).json({
                    success: false,
                    message: 'Un compte avec cet email existe déjà'
                });
            }

            const telephoneExistant = await Recycleur.trouverParTelephone(telephone);
            if (telephoneExistant) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce numéro de téléphone est déjà utilisé'
                });
            }

            if (!cguAcceptees) {
                return res.status(400).json({
                    success: false,
                    message: 'Vous devez accepter les CGU'
                });
            }

            // Hasher le mot de passe
            const salt = await bcrypt.genSalt(10);
            const motDePasseHash = await bcrypt.hash(motDePasse, salt);

            // Traiter les fichiers uploadés
            const photoProfilUrl = req.files?.photoProfil ? 
                `/uploads/recycleurs/${req.files.photoProfil[0].filename}` : null;
            const photoCniRectoUrl = req.files?.photoCniRecto ? 
                `/uploads/cnis/${req.files.photoCniRecto[0].filename}` : null;
            const photoCniVersoUrl = req.files?.photoCniVerso ? 
                `/uploads/cnis/${req.files.photoCniVerso[0].filename}` : null;

            const nouveauRecycleur = await Recycleur.creer({
                email,
                telephone,
                motDePasseHash,
                nomEntreprise,
                nomResponsable,
                adresse,
                quartier,
                commune,
                numeroIdentite,
                photoProfilUrl,
                photoCniRectoUrl,
                photoCniVersoUrl,
                cguAcceptees,
                statut: 'en_attente',
                est_actif: false
            });

            res.status(201).json({
                success: true,
                message: 'Inscription réussie. En attente de validation.',
                recycleur: {
                    id: nouveauRecycleur.id,
                    email: nouveauRecycleur.email,
                    nomEntreprise: nouveauRecycleur.nom_entreprise,
                    statut: nouveauRecycleur.statut
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur inscription recycleur:', erreur);
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

            let recycleur = await Recycleur.trouverParEmail(identifiant);
            if (!recycleur) {
                recycleur = await Recycleur.trouverParTelephone(identifiant);
            }

            if (!recycleur) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            const motDePasseValide = await bcrypt.compare(motDePasse, recycleur.mot_de_passe_hash);
            if (!motDePasseValide) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            if (recycleur.statut !== 'actif') {
                return res.status(403).json({
                    success: false,
                    message: 'Votre compte est en attente de validation ou a été suspendu'
                });
            }

            await Recycleur.mettreAJourConnexion(recycleur.id);

            const token = jwt.sign(
                { id: recycleur.id, email: recycleur.email, type: 'recycleur' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '7d' }
            );

            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                utilisateur: {
                    id: recycleur.id,
                    email: recycleur.email,
                    telephone: recycleur.telephone,
                    nomEntreprise: recycleur.nom_entreprise,
                    nomResponsable: recycleur.nom_responsable,
                    type: 'recycleur',
                    statut: recycleur.statut
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur connexion recycleur:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion',
                erreur: erreur.message
            });
        }
    }

    // // ✅ Consulter les stocks disponibles
    // static async consulterStocks(req, res) {
    //     try {
    //         const { typeDechet, commune } = req.query;

    //         const stocks = await StockDechet.listerDisponibles({
    //             typeDechet,
    //             commune
    //         });

    //         // Grouper par point de dépôt pour faciliter la visualisation
    //         const stocksParPoint = stocks.reduce((acc, stock) => {
    //             if (!acc[stock.point_depot_id]) {
    //                 acc[stock.point_depot_id] = {
    //                     pointId: stock.point_depot_id,
    //                     pointNom: stock.point_nom,
    //                     commune: stock.commune,
    //                     quartier: stock.quartier,
    //                     adresse: stock.adresse,
    //                     stocks: []
    //                 };
    //             }
    //             acc[stock.point_depot_id].stocks.push({
    //                 typeDechet: stock.type_dechet,
    //                 quantite: stock.quantite_immediatement_disponible,
    //                 total: stock.quantite_disponible,
    //                 reserve: stock.quantite_reservee || 0,
    //                 prixEstime: stock.prix_estime
    //             });
    //             return acc;
    //         }, {});

    //         // Totaux par type de déchet
    //         const totauxParType = stocks.reduce((acc, stock) => {
    //             if (!acc[stock.type_dechet]) {
    //                 acc[stock.type_dechet] = 0;
    //             }
    //             acc[stock.type_dechet] += stock.quantite_immediatement_disponible;
    //             return acc;
    //         }, {});

    //         res.json({
    //             success: true,
    //             stocks: Object.values(stocksParPoint),
    //             totauxParType,
    //             totalGlobal: stocks.reduce((acc, s) => acc + s.quantite_immediatement_disponible, 0)
    //         });
    //     } catch (erreur) {
    //         console.error('❌ Erreur consultation stocks:', erreur);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Erreur lors de la consultation des stocks',
    //             erreur: erreur.message
    //         });
    //     }
    // }

    
static async consulterStocks(req, res) {
    try {
        const { typeDechet, commune, search } = req.query;
        
        console.log('🔍 Recherche stocks avec filtres:', { typeDechet, commune, search });
        
        // Construction de la requête SQL
        let requete = `
            SELECT 
                s.id,
                s.point_depot_id,
                pdv.nom as point_nom,
                pdv.commune,
                pdv.quartier,
                pdv.adresse,
                s.type_dechet,
                s.quantite_disponible,
                s.unite,
                s.dernier_mouvement,
                (s.quantite_disponible - COALESCE(s.quantite_reservee, 0)) as quantite_immediatement_disponible
            FROM stocks_dechets s
            JOIN points_depot_volontaire pdv ON s.point_depot_id = pdv.id
            WHERE s.quantite_disponible > 0
        `;
        
        const valeurs = [];
        let index = 1;
        
        if (typeDechet && typeDechet.trim() !== '') {
            requete += ` AND s.type_dechet = $${index}`;
            valeurs.push(typeDechet);
            index++;
        }
        
        if (commune && commune.trim() !== '') {
            requete += ` AND pdv.commune ILIKE $${index}`;
            valeurs.push(`%${commune}%`);
            index++;
        }
        
        if (search && search.trim() !== '') {
            requete += ` AND (pdv.nom ILIKE $${index} OR pdv.commune ILIKE $${index} OR pdv.quartier ILIKE $${index})`;
            valeurs.push(`%${search}%`);
            index++;
        }
        
        requete += ` ORDER BY pdv.nom, s.type_dechet`;
        
        console.log('📝 Requête SQL:', requete);
        console.log('📦 Paramètres:', valeurs);
        
        const resultat = await pool.query(requete, valeurs);
        console.log(`✅ ${resultat.rows.length} stocks trouvés`);
        
        // Calculer les totaux par type
        const totauxParType = {};
        let totalGlobal = 0;
        
        // Utiliser forEach au lieu de for...of pour éviter les problèmes de const
        resultat.rows.forEach(stock => {
            const quantite = parseFloat(stock.quantite_disponible) || 0;
            totalGlobal += quantite;
            
            if (!totauxParType[stock.type_dechet]) {
                totauxParType[stock.type_dechet] = 0;
            }
            totauxParType[stock.type_dechet] += quantite;
        });
        
        // Formater les totaux avec 2 décimales
        const totauxFormates = {};
        Object.keys(totauxParType).forEach(key => {
            totauxFormates[key] = totauxParType[key].toFixed(2);
        });
        
        res.json({
            success: true,
            stocks: resultat.rows,
            totauxParType: totauxFormates,
            totalGlobal: totalGlobal.toFixed(2)
        });
        
    } catch (erreur) {
        console.error('❌ Erreur consultation stocks:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la consultation des stocks',
            erreur: erreur.message
        });
    }
}

    // ✅ Faire une demande d'enlèvement
    static async demanderEnlevement(req, res) {
        try {
            const recycleurId = req.utilisateurId;
            const { pointDepotId, typeDechet, quantite, dateSouhaitee, notes } = req.body;

            // Validations
            if (!pointDepotId || !typeDechet || !quantite || quantite <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Tous les champs sont requis'
                });
            }

            // Vérifier le stock disponible
            const stock = await StockDechet.trouverParPointEtType(pointDepotId, typeDechet);
            const disponible = stock ? stock.quantite_disponible - (stock.quantite_reservee || 0) : 0;
            
            if (!stock || disponible < quantite) {
                return res.status(400).json({
                    success: false,
                    message: `Stock insuffisant. Disponible: ${disponible} kg`
                });
            }

            const demande = await DemandeEnlevement.creer({
                recycleurId,
                pointDepotId,
                typeDechet,
                quantite,
                dateSouhaitee: dateSouhaitee || new Date(),
                notes
            });

            res.status(201).json({
                success: true,
                message: 'Demande d\'enlèvement enregistrée avec succès',
                demande
            });
        } catch (erreur) {
            console.error('❌ Erreur demande enlèvement:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la demande',
                erreur: erreur.message
            });
        }
    }

    // ✅ Consulter mes demandes d'enlèvement
    static async mesDemandes(req, res) {
        try {
            const recycleurId = req.utilisateurId;
            const { statut } = req.query;

            const demandes = await DemandeEnlevement.listerParRecycleur(recycleurId, statut);

            res.json({
                success: true,
                demandes,
                total: demandes.length
            });
        } catch (erreur) {
            console.error('❌ Erreur liste demandes:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des demandes',
                erreur: erreur.message
            });
        }
    }

    // ✅ Confirmer réception d'enlèvement
    static async confirmerReception(req, res) {
        try {
            const recycleurId = req.utilisateurId;
            const { demandeId } = req.params;
            const { quantiteRecue, notes } = req.body;

            const demande = await DemandeEnlevement.trouverParId(demandeId);
            if (!demande || demande.recycleur_id !== recycleurId) {
                return res.status(404).json({
                    success: false,
                    message: 'Demande non trouvée'
                });
            }

            if (demande.statut !== 'validee') {
                return res.status(400).json({
                    success: false,
                    message: 'Cette demande n\'est pas prête à être confirmée'
                });
            }

            await DemandeEnlevement.marquerRealisee(
                demandeId, 
                quantiteRecue || demande.quantite_demandee
            );

            res.json({
                success: true,
                message: 'Réception confirmée avec succès'
            });
        } catch (erreur) {
            console.error('❌ Erreur confirmation:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la confirmation',
                erreur: erreur.message
            });
        }
    }

 // controllers/RecycleurController.js - Vérifiez cette méthode

// static async declarerRecyclage(req, res) {
//     try {
//         const recycleurId = req.utilisateurId;
//         // Regardez ce qui est reçu
//         console.log('📥 Données reçues:', req.body);
//         console.log('📁 Fichier reçu:', req.file);
        
//         const { demandeId, typeDechet, quantite, dateRecyclage } = req.body;
//         const certificatUrl = req.file ? `/uploads/recyclage/${req.file.filename}` : null;

//         // Validation
//         if (!typeDechet || !quantite || parseFloat(quantite) <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Type de déchet et quantité requis'
//             });
//         }

//         // ... suite du code
//     } catch (error) {
//         console.error('❌ Erreur:', error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// }


// // controllers/RecycleurController.js - Version avec logs détaillés

// static async declarerRecyclage(req, res) {
//     const client = await pool.connect();
    
//     try {
//         console.log('='.repeat(50));
//         console.log('📥 DÉBUT DÉCLARATION RECYCLAGE');
//         console.log('📥 req.utilisateurId:', req.utilisateurId);
//         console.log('📥 req.body:', req.body);
//         console.log('📥 req.file:', req.file);
        
//         const recycleurId = req.utilisateurId;
//         const { demandeId, typeDechet, quantite, dateRecyclage } = req.body;
//         const certificatUrl = req.file ? `/uploads/recyclage/${req.file.filename}` : null;

//         // Validations
//         if (!typeDechet) {
//             console.log('❌ Type de déchet manquant');
//             return res.status(400).json({
//                 success: false,
//                 message: 'Le type de déchet est requis'
//             });
//         }

//         if (!quantite) {
//             console.log('❌ Quantité manquante');
//             return res.status(400).json({
//                 success: false,
//                 message: 'La quantité est requise'
//             });
//         }

//         const quantiteValue = parseFloat(quantite);
//         if (isNaN(quantiteValue) || quantiteValue <= 0) {
//             console.log('❌ Quantité invalide:', quantite);
//             return res.status(400).json({
//                 success: false,
//                 message: 'La quantité doit être un nombre positif'
//             });
//         }

//         if (!dateRecyclage) {
//             console.log('❌ Date manquante');
//             return res.status(400).json({
//                 success: false,
//                 message: 'La date de recyclage est requise'
//             });
//         }

//         await client.query('BEGIN');

//         // Importer StockRecycleur
//         const StockRecycleur = (await import('../models/StockRecycleur.js')).default;

//         // Vérifier le stock disponible
//         const stocks = await StockRecycleur.getStocksRecycleur(recycleurId);
//         const stockDispo = stocks.find(s => s.type_dechet === typeDechet)?.quantite_disponible || 0;
        
//         console.log(`📊 Stock disponible pour ${typeDechet}: ${stockDispo} kg`);
//         console.log(`📊 Quantité demandée: ${quantiteValue} kg`);

//         if (stockDispo < quantiteValue) {
//             await client.query('ROLLBACK');
//             return res.status(400).json({
//                 success: false,
//                 message: `Stock insuffisant. Vous avez ${stockDispo.toFixed(2)} kg de ${typeDechet} disponibles`
//             });
//         }

//         // Créer la déclaration
//         console.log('📝 Création de la déclaration...');
//         const DeclarationRecyclage = (await import('../models/DeclarationRecyclage.js')).default;
        
//         const declaration = await DeclarationRecyclage.creer({
//             recycleurId,
//             demandeId,
//             typeDechet,
//             quantite: quantiteValue,
//             dateRecyclage: dateRecyclage || new Date(),
//             certificatUrl
//         });

//         console.log('✅ Déclaration créée:', declaration.id);

//         // Retirer du stock du recycleur
//         console.log('📝 Mise à jour du stock...');
//         const stockResult = await StockRecycleur.retirerPourRecyclage(
//             recycleurId,
//             typeDechet,
//             quantiteValue,
//             declaration.id
//         );

//         console.log('✅ Stock mis à jour:', stockResult);

//         await client.query('COMMIT');
//         console.log('✅ Transaction COMMIT réussie');

//         res.status(201).json({
//             success: true,
//             message: 'Déclaration de recyclage enregistrée avec succès',
//             declaration,
//             stock_restant: stockResult.stockApres.toFixed(2)
//         });

//     } catch (erreur) {
//         await client.query('ROLLBACK');
//         console.error('❌ Erreur déclaration recyclage:', erreur);
//         console.error('❌ Stack trace:', erreur.stack);
        
//         res.status(500).json({
//             success: false,
//             message: erreur.message || 'Erreur lors de la déclaration',
//             erreur: erreur.message
//         });
//     } finally {
//         client.release();
//         console.log('='.repeat(50));
//     }
// }

// controllers/RecycleurController.js - Version corrigée avec Supabase

static async declarerRecyclage(req, res) {
    const client = await pool.connect();
    
    try {
        console.log('='.repeat(50));
        console.log('📥 DÉBUT DÉCLARATION RECYCLAGE');
        console.log('📥 req.utilisateurId:', req.utilisateurId);
        console.log('📥 req.body:', req.body);
        console.log('📥 req.file:', req.file);
        console.log('📥 req.body.certificatUrl:', req.body.certificatUrl); // ← AJOUTÉ PAR UPLOADTOSUPABASE
        
        const recycleurId = req.utilisateurId;
        const { demandeId, typeDechet, quantite, dateRecyclage } = req.body;
        
        // ✅ CORRECTION: Utiliser l'URL de Supabase au lieu du chemin local
        const certificatUrl = req.body.certificatUrl || null;

        // Validations
        if (!typeDechet) {
            console.log('❌ Type de déchet manquant');
            return res.status(400).json({
                success: false,
                message: 'Le type de déchet est requis'
            });
        }

        if (!quantite) {
            console.log('❌ Quantité manquante');
            return res.status(400).json({
                success: false,
                message: 'La quantité est requise'
            });
        }

        const quantiteValue = parseFloat(quantite);
        if (isNaN(quantiteValue) || quantiteValue <= 0) {
            console.log('❌ Quantité invalide:', quantite);
            return res.status(400).json({
                success: false,
                message: 'La quantité doit être un nombre positif'
            });
        }

        if (!dateRecyclage) {
            console.log('❌ Date manquante');
            return res.status(400).json({
                success: false,
                message: 'La date de recyclage est requise'
            });
        }

        await client.query('BEGIN');

        // Importer StockRecycleur
        const StockRecycleur = (await import('../models/StockRecycleur.js')).default;

        // Vérifier le stock disponible
        const stocks = await StockRecycleur.getStocksRecycleur(recycleurId);
        const stockDispo = stocks.find(s => s.type_dechet === typeDechet)?.quantite_disponible || 0;
        
        console.log(`📊 Stock disponible pour ${typeDechet}: ${stockDispo} kg`);
        console.log(`📊 Quantité demandée: ${quantiteValue} kg`);

        if (stockDispo < quantiteValue) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: `Stock insuffisant. Vous avez ${stockDispo.toFixed(2)} kg de ${typeDechet} disponibles`
            });
        }

        // Créer la déclaration
        console.log('📝 Création de la déclaration...');
        const DeclarationRecyclage = (await import('../models/DeclarationRecyclage.js')).default;
        
        const declaration = await DeclarationRecyclage.creer({
            recycleurId,
            demandeId,
            typeDechet,
            quantite: quantiteValue,
            dateRecyclage: dateRecyclage || new Date(),
            certificatUrl  // ✅ Maintenant c'est l'URL Supabase
        });

        console.log('✅ Déclaration créée:', declaration.id);
        console.log('✅ Certificat URL stockée:', certificatUrl);

        // Retirer du stock du recycleur
        console.log('📝 Mise à jour du stock...');
        const stockResult = await StockRecycleur.retirerPourRecyclage(
            recycleurId,
            typeDechet,
            quantiteValue,
            declaration.id
        );

        console.log('✅ Stock mis à jour:', stockResult);

        await client.query('COMMIT');
        console.log('✅ Transaction COMMIT réussie');

        res.status(201).json({
            success: true,
            message: 'Déclaration de recyclage enregistrée avec succès',
            declaration: {
                ...declaration,
                certificat_url: certificatUrl  // Retourner l'URL pour vérification
            },
            stock_restant: stockResult.stockApres.toFixed(2)
        });

    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur déclaration recyclage:', erreur);
        console.error('❌ Stack trace:', erreur.stack);
        
        res.status(500).json({
            success: false,
            message: erreur.message || 'Erreur lors de la déclaration',
            erreur: erreur.message
        });
    } finally {
        client.release();
        console.log('='.repeat(50));
    }
}

// Nouvelle méthode pour voir le stock du recycleur
static async monStock(req, res) {
    try {
        const recycleurId = req.utilisateurId;
        const StockRecycleur = (await import('../models/StockRecycleur.js')).default;
        
        const stocks = await StockRecycleur.getStocksRecycleur(recycleurId);
        const historique = await StockRecycleur.getHistorique(recycleurId, 20);
        const stats = await StockRecycleur.getStatistiquesParType(recycleurId);
        
        res.json({
            success: true,
            stocks,
            historique,
            statistiques: stats,
            total_kg: stocks.reduce((acc, s) => acc + parseFloat(s.quantite_disponible), 0).toFixed(2)
        });
    } catch (erreur) {
        console.error('❌ Erreur monStock:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du stock',
            erreur: erreur.message
        });
    }
}

static async monStockPersonnel(req, res) {
    try {
        const recycleurId = req.utilisateurId;
        
        // Importer dynamiquement pour éviter les dépendances circulaires
        const StockRecycleur = (await import('../models/StockRecycleur.js')).default;
        
        const stocks = await StockRecycleur.getStocksRecycleur(recycleurId);
        const historique = await StockRecycleur.getHistorique(recycleurId, 20);
        const statistiques = await StockRecycleur.getStatistiquesParType(recycleurId);
        
        console.log(`📦 Stock du recycleur ${recycleurId}:`, stocks);
        
        res.json({
            success: true,
            stocks,
            historique,
            statistiques,
            total: stocks.reduce((acc, s) => acc + parseFloat(s.quantite_disponible), 0).toFixed(2)
        });
    } catch (erreur) {
        console.error('❌ Erreur monStock:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du stock',
            erreur: erreur.message
        });
    }
}
    // ✅ Consulter mes déclarations de recyclage
    static async mesDeclarations(req, res) {
        try {
            const recycleurId = req.utilisateurId;
            const { statut, annee } = req.query;

            let declarations;
            if (annee) {
                // Logique pour filtrer par année
                declarations = await DeclarationRecyclage.listerParRecycleur(recycleurId, statut);
            } else {
                declarations = await DeclarationRecyclage.listerParRecycleur(recycleurId, statut);
            }

            res.json({
                success: true,
                declarations,
                total: declarations.length
            });
        } catch (erreur) {
            console.error('❌ Erreur liste déclarations:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des déclarations',
                erreur: erreur.message
            });
        }
    }

    // ✅ Obtenir le profil
    static async monProfil(req, res) {
        try {
            const recycleurId = req.utilisateurId;
            const recycleur = await Recycleur.trouverParId(recycleurId);

            if (!recycleur) {
                return res.status(404).json({
                    success: false,
                    message: 'Recycleur non trouvé'
                });
            }

            delete recycleur.mot_de_passe_hash;

            res.json({
                success: true,
                recycleur
            });
        } catch (erreur) {
            console.error('❌ Erreur profil:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du profil',
                erreur: erreur.message
            });
        }
    }

    // ✅ Mettre à jour le profil
    static async mettreAJourProfil(req, res) {
        try {
            const recycleurId = req.utilisateurId;
            const {
                nomEntreprise,
                nomResponsable,
                telephone,
                adresse,
                quartier,
                commune
            } = req.body;

            // Vérifier l'unicité du téléphone si modifié
            if (telephone) {
                const existant = await Recycleur.trouverParTelephone(telephone);
                if (existant && existant.id !== recycleurId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Ce téléphone est déjà utilisé'
                    });
                }
            }

            const donnees = {
                nomEntreprise,
                nomResponsable,
                telephone,
                adresse,
                quartier,
                commune
            };

            // Ajouter les photos si uploadées
            if (req.files?.photoProfil) {
                donnees.photoProfilUrl = `/uploads/recycleurs/${req.files.photoProfil[0].filename}`;
            }

            const recycleur = await Recycleur.mettreAJour(recycleurId, donnees);

            delete recycleur.mot_de_passe_hash;

            res.json({
                success: true,
                message: 'Profil mis à jour avec succès',
                recycleur
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

    // // ✅ Tableau de bord complet
    // static async tableauBord(req, res) {
    //     try {
    //         const recycleurId = req.utilisateurId;

    //         // Récupérer toutes les stats en parallèle
    //         const [demandesStats, declarationsStats, demandesRecentes, declarationsRecentes] = await Promise.all([
    //             DemandeEnlevement.getStatistiques(recycleurId),
    //             DeclarationRecyclage.getStatistiques(recycleurId),
    //             DemandeEnlevement.listerParRecycleur(recycleurId, null, 5),
    //             DeclarationRecyclage.listerParRecycleur(recycleurId, null, 5)
    //         ]);

    //         // Statistiques annuelles
    //         const statsAnnuelles = await DeclarationRecyclage.getStatistiques(recycleurId);

    //         res.json({
    //             success: true,
    //             dashboard: {
    //                 demandes: demandesStats,
    //                 recyclage: declarationsStats,
    //                 statsAnnuelles
    //             },
    //             dernieresActivites: {
    //                 demandes: demandesRecentes,
    //                 declarations: declarationsRecentes
    //             }
    //         });
    //     } catch (erreur) {
    //         console.error('❌ Erreur tableau bord:', erreur);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Erreur lors de la récupération du tableau de bord',
    //             erreur: erreur.message
    //         });
    //     }
    // }

    // ✅ Obtenir les détails d'une demande spécifique
    static async detailsDemande(req, res) {
        try {
            const recycleurId = req.utilisateurId;
            const { demandeId } = req.params;

            const demande = await DemandeEnlevement.trouverParId(demandeId);
            
            if (!demande || demande.recycleur_id !== recycleurId) {
                return res.status(404).json({
                    success: false,
                    message: 'Demande non trouvée'
                });
            }

            // Récupérer les déclarations liées
            const declarations = await DeclarationRecyclage.listerParDemande(demandeId);

            res.json({
                success: true,
                demande,
                declarations
            });
        } catch (erreur) {
            console.error('❌ Erreur détails demande:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des détails',
                erreur: erreur.message
            });
        }
    }

//    

static async tableauBord(req, res) {
    try {
        const recycleurId = req.utilisateurId;

        // Importer StockRecycleur
        const StockRecycleur = (await import('../models/StockRecycleur.js')).default;

        // Récupérer toutes les stats en parallèle
        const [demandesStats, declarationsStats, demandesRecentes, declarationsRecentes, statsDemandes, monStock] = await Promise.all([
            DemandeEnlevement.getStatistiques(recycleurId),
            DeclarationRecyclage.getStatistiques(recycleurId),
            DemandeEnlevement.listerParRecycleur(recycleurId, null, 5),
            DeclarationRecyclage.listerParRecycleur(recycleurId, null, 5),
            Recycleur.getStatistiquesDemandes(recycleurId),
            StockRecycleur.getStocksRecycleur(recycleurId)  // ✅ AJOUTÉ
        ]);

        // Statistiques annuelles
        const statsAnnuelles = await DeclarationRecyclage.getStatistiques(recycleurId);

        // Calculer le total du stock personnel
        const totalStockPerso = monStock.reduce((acc, s) => acc + parseFloat(s.quantite_disponible), 0);

        res.json({
            success: true,
            dashboard: {
                demandes: demandesStats,
                recyclage: declarationsStats,
                statsAnnuelles,
                stockPerso: {
                    details: monStock,
                    total: totalStockPerso.toFixed(2)
                },
                // Statistiques détaillées des demandes
                statsDemandes: {
                    total: parseInt(statsDemandes?.total_demandes || 0),
                    enAttente: parseInt(statsDemandes?.demandes_en_attente || 0),
                    validees: parseInt(statsDemandes?.demandes_validees || 0),
                    refusees: parseInt(statsDemandes?.demandes_refusees || 0),
                    realisees: parseInt(statsDemandes?.demandes_realisees || 0),
                    kgValides: parseFloat(statsDemandes?.kg_valides || 0).toFixed(1),
                    kgRealises: parseFloat(statsDemandes?.kg_realises || 0).toFixed(1),
                    kgRecus: parseFloat(statsDemandes?.kg_reellement_recus || 0).toFixed(1)
                }
            },
            dernieresActivites: {
                demandes: demandesRecentes,
                declarations: declarationsRecentes
            }
        });
    } catch (erreur) {
        console.error('❌ Erreur tableau bord:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du tableau de bord',
            erreur: erreur.message
        });
    }
}
}

export default RecycleurController;
