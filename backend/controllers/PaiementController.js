// // // controllers/PaiementController.js
// // import { pool } from '../config/database.js';
// // import ProducteurPremium from '../models/ProducteurPremium.js';

// // class PaiementController {
// //     // Générer le code USSD pour Orange Money
// //     static genererCodeOrange(montant, telephone) {
// //         const telephonePropre = telephone.replace(/[^0-9]/g, '');
// //         return `#150*1*1*${telephonePropre}*${montant}#`;
// //     }

// //     // Générer le code USSD pour MTN Mobile Money
// //     static genererCodeMTN(montant, telephone) {
// //         const telephonePropre = telephone.replace(/[^0-9]/g, '');
// //         return `*126*1*1*${telephonePropre}*${montant}#`;
// //     }

// //     // Simuler la vérification du paiement (à remplacer par un vrai webhook)
// //     static async verifierPaiement(req, res) {
// //         try {
// //             const { transactionId, statut, telephone, montant } = req.body;
            
// //             console.log(`💰 Vérification paiement: ${transactionId} - ${statut}`);

// //             if (statut === 'SUCCESS') {
// //                 // Récupérer la transaction en attente
// //                 const transaction = await pool.query(
// //                     `SELECT * FROM transactions_paiement 
// //                      WHERE id = $1 AND statut = 'en_attente'`,
// //                     [transactionId]
// //                 );

// //                 if (transaction.rows.length === 0) {
// //                     return res.status(404).json({
// //                         success: false,
// //                         message: 'Transaction non trouvée'
// //                     });
// //                 }

// //                 const tx = transaction.rows[0];

// //                 // Mettre à jour le statut de la transaction
// //                 await pool.query(
// //                     `UPDATE transactions_paiement 
// //                      SET statut = 'reussi', 
// //                          date_validation = CURRENT_TIMESTAMP 
// //                      WHERE id = $1`,
// //                     [transactionId]
// //                 );

// //                 // Créer l'abonnement premium
// //                 const abonnement = await ProducteurPremium.creerAbonnement({
// //                     producteurId: tx.producteur_id,
// //                     typeAbonnement: 'premium',
// //                     frequenceCollecte: 'mensuelle',
// //                     dateDebut: new Date(),
// //                     dateFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
// //                     montantAbonnement: tx.montant
// //                 });

// //                 // Ajouter une étoile au profil du producteur
// //                 await pool.query(
// //                     `UPDATE producteurs 
// //                      SET type_compte = 'premium',
// //                          modifie_le = CURRENT_TIMESTAMP
// //                      WHERE id = $1`,
// //                     [tx.producteur_id]
// //                 );

// //                 res.json({
// //                     success: true,
// //                     message: 'Paiement réussi et abonnement activé',
// //                     abonnement
// //                 });
// //             } else {
// //                 res.json({
// //                     success: false,
// //                     message: 'Paiement échoué'
// //                 });
// //             }
// //         } catch (erreur) {
// //             console.error('❌ Erreur vérification paiement:', erreur);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Erreur lors de la vérification du paiement'
// //             });
// //         }
// //     }

// //     // Initier un paiement pour abonnement premium
// //     static async initierPaiementAbonnement(req, res) {
// //         try {
// //             const producteurId = req.utilisateurId;
// //             const { operateur, montant, telephone } = req.body;

// //             console.log('📦 Données reçues:', { producteurId, operateur, montant, telephone });

// //             if (!operateur || !montant || montant <= 0 || !telephone) {
// //                 return res.status(400).json({
// //                     success: false,
// //                     message: 'Opérateur, montant valide et téléphone requis'
// //                 });
// //             }

// //             // Vérifier si le producteur a déjà un abonnement actif
// //             const abonnementExistant = await ProducteurPremium.trouverParProducteur(producteurId);
// //             if (abonnementExistant) {
// //                 return res.status(400).json({
// //                     success: false,
// //                     message: 'Vous avez déjà un abonnement actif'
// //                 });
// //             }

// //             // Créer une transaction en attente
// //             const transaction = await pool.query(
// //                 `INSERT INTO transactions_paiement (
// //                     producteur_id, operateur, montant, telephone, statut
// //                 ) VALUES ($1, $2, $3, $4, 'en_attente')
// //                 RETURNING id`,
// //                 [producteurId, operateur, montant, telephone]
// //             );

// //             // ✅ CORRECTION: Utiliser la classe directement (PaiementController.genererCodeOrange)
// //             // au lieu de this.genererCodeOrange
// //             let codeUSSD = '';
// //             if (operateur === 'ORANGE') {
// //                 codeUSSD = PaiementController.genererCodeOrange(montant, telephone);
// //             } else if (operateur === 'MTN') {
// //                 codeUSSD = PaiementController.genererCodeMTN(montant, telephone);
// //             } else {
// //                 return res.status(400).json({
// //                     success: false,
// //                     message: 'Opérateur non supporté'
// //                 });
// //             }

// //             console.log('✅ Transaction créée:', transaction.rows[0].id);
// //             console.log('📱 Code USSD généré:', codeUSSD);

// //             res.json({
// //                 success: true,
// //                 message: 'Transaction initiée',
// //                 transactionId: transaction.rows[0].id,
// //                 codeUSSD,
// //                 instructions: `Composez le ${codeUSSD} sur votre téléphone pour effectuer le paiement de ${montant} FCFA`
// //             });

// //         } catch (erreur) {
// //             console.error('❌ Erreur initiation paiement:', erreur);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Erreur lors de l\'initiation du paiement',
// //                 erreur: erreur.message
// //             });
// //         }
// //     }

// //     // Vérifier le statut d'une transaction
// //     static async verifierStatutTransaction(req, res) {
// //         try {
// //             const { transactionId } = req.params;
// //             const producteurId = req.utilisateurId;

// //             const transaction = await pool.query(
// //                 `SELECT * FROM transactions_paiement 
// //                  WHERE id = $1 AND producteur_id = $2`,
// //                 [transactionId, producteurId]
// //             );

// //             if (transaction.rows.length === 0) {
// //                 return res.status(404).json({
// //                     success: false,
// //                     message: 'Transaction non trouvée'
// //                 });
// //             }

// //             const tx = transaction.rows[0];
            
// //             // Si la transaction est réussie, vérifier si l'abonnement est actif
// //             let abonnement = null;
// //             if (tx.statut === 'reussi') {
// //                 abonnement = await ProducteurPremium.trouverParProducteur(producteurId);
// //             }

// //             res.json({
// //                 success: true,
// //                 transaction: {
// //                     id: tx.id,
// //                     operateur: tx.operateur,
// //                     montant: tx.montant,
// //                     statut: tx.statut,
// //                     dateCreation: tx.cree_le,
// //                     dateValidation: tx.date_validation
// //                 },
// //                 abonnement
// //             });

// //         } catch (erreur) {
// //             console.error('❌ Erreur vérification transaction:', erreur);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Erreur lors de la vérification'
// //             });
// //         }
// //     }

// //     // Historique des transactions
// //     static async historiqueTransactions(req, res) {
// //         try {
// //             const producteurId = req.utilisateurId;

// //             const transactions = await pool.query(
// //                 `SELECT * FROM transactions_paiement 
// //                  WHERE producteur_id = $1 
// //                  ORDER BY cree_le DESC`,
// //                 [producteurId]
// //             );

// //             res.json({
// //                 success: true,
// //                 transactions: transactions.rows
// //             });

// //         } catch (erreur) {
// //             console.error('❌ Erreur historique transactions:', erreur);
// //             res.status(500).json({
// //                 success: false,
// //                 message: 'Erreur lors de la récupération'
// //             });
// //         }
// //     }
// // }

// // export default PaiementController;


// // controllers/PaiementController.js
// import { pool } from '../config/database.js';
// import ProducteurPremium from '../models/ProducteurPremium.js';
// import { requestToPay } from "../services/mtnService.js";
// import { orangePayment } from "../services/orangeService.js";

// class PaiementController {
//     // Numéros de compte de l'entreprise
//     static NUMEROS = {
//         ORANGE: '656739704',
//         MTN: '677003287'
//     };

//     // Générer le code USSD pour Orange Money (vers le compte entreprise)
//     static genererCodeOrange(montant) {
//         // Format: #150*1*1*NUMERO_ENTREPRISE*MONTANT#
//         return `#150*1*1*${PaiementController.NUMEROS.ORANGE}*${montant}#`;
//     }

//     // Générer le code USSD pour MTN Mobile Money (vers le compte entreprise)
//     static genererCodeMTN(montant) {
//         // Format: *126*1*1*NUMERO_ENTREPRISE*MONTANT#
//         return `*126*1*1*${PaiementController.NUMEROS.MTN}*${montant}#`;
//     }

//     // Simuler la vérification du paiement (à remplacer par un vrai webhook)
//     static async verifierPaiement(req, res) {
//         try {
//             const { transactionId, statut, telephone, montant } = req.body;
            
//             console.log(`💰 Vérification paiement: ${transactionId} - ${statut}`);

//             if (statut === 'SUCCESS') {
//                 // Récupérer la transaction en attente
//                 const transaction = await pool.query(
//                     `SELECT * FROM transactions_paiement 
//                      WHERE id = $1 AND statut = 'en_attente'`,
//                     [transactionId]
//                 );

//                 if (transaction.rows.length === 0) {
//                     return res.status(404).json({
//                         success: false,
//                         message: 'Transaction non trouvée'
//                     });
//                 }

//                 const tx = transaction.rows[0];

//                 // Mettre à jour le statut de la transaction
//                 await pool.query(
//                     `UPDATE transactions_paiement 
//                      SET statut = 'reussi', 
//                          date_validation = CURRENT_TIMESTAMP 
//                      WHERE id = $1`,
//                     [transactionId]
//                 );

//                 // Créer l'abonnement premium
//                 const abonnement = await ProducteurPremium.creerAbonnement({
//                     producteurId: tx.producteur_id,
//                     typeAbonnement: 'premium',
//                     frequenceCollecte: 'mensuelle',
//                     dateDebut: new Date(),
//                     dateFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
//                     montantAbonnement: tx.montant
//                 });

//                 // Ajouter une étoile au profil du producteur
//                 await pool.query(
//                     `UPDATE producteurs 
//                      SET type_compte = 'premium',
//                          modifie_le = CURRENT_TIMESTAMP
//                      WHERE id = $1`,
//                     [tx.producteur_id]
//                 );

//                 res.json({
//                     success: true,
//                     message: 'Paiement réussi et abonnement activé',
//                     abonnement
//                 });
//             } else {
//                 res.json({
//                     success: false,
//                     message: 'Paiement échoué'
//                 });
//             }
//         } catch (erreur) {
//             console.error('❌ Erreur vérification paiement:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la vérification du paiement'
//             });
//         }
//     }
// static async initierPaiementAbonnement(req,res){

// try{

// const producteurId = req.utilisateurId;
// const {operateur,montant,telephone} = req.body;

// let transactionId;

// if(operateur === "MTN"){

// transactionId = await requestToPay(montant,telephone);

// }

// if(operateur === "ORANGE"){

// const paiement = await orangePayment(montant,telephone);
// transactionId = paiement.pay_token;

// }

// await pool.query(
// `INSERT INTO transactions_paiement
// (id,producteur_id,operateur,montant,telephone,statut)
// VALUES ($1,$2,$3,$4,$5,'en_attente')`,
// [transactionId,producteurId,operateur,montant,telephone]
// );

// res.json({
// success:true,
// transactionId,
// message:"Paiement initié. Confirmez sur votre téléphone."
// })

// }catch(error){

// console.error(error)

// res.status(500).json({
// success:false,
// message:"Erreur paiement"
// })

// }

// }

//     // Vérifier le statut d'une transaction
//     static async verifierStatutTransaction(req, res) {
//         try {
//             const { transactionId } = req.params;
//             const producteurId = req.utilisateurId;

//             const transaction = await pool.query(
//                 `SELECT * FROM transactions_paiement 
//                  WHERE id = $1 AND producteur_id = $2`,
//                 [transactionId, producteurId]
//             );

//             if (transaction.rows.length === 0) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Transaction non trouvée'
//                 });
//             }

//             const tx = transaction.rows[0];
            
//             // Si la transaction est réussie, vérifier si l'abonnement est actif
//             let abonnement = null;
//             if (tx.statut === 'reussi') {
//                 abonnement = await ProducteurPremium.trouverParProducteur(producteurId);
//             }

//             res.json({
//                 success: true,
//                 transaction: {
//                     id: tx.id,
//                     operateur: tx.operateur,
//                     montant: tx.montant,
//                     statut: tx.statut,
//                     dateCreation: tx.cree_le,
//                     dateValidation: tx.date_validation
//                 },
//                 abonnement
//             });

//         } catch (erreur) {
//             console.error('❌ Erreur vérification transaction:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la vérification'
//             });
//         }
//     }

//     // Historique des transactions
//     static async historiqueTransactions(req, res) {
//         try {
//             const producteurId = req.utilisateurId;

//             const transactions = await pool.query(
//                 `SELECT * FROM transactions_paiement 
//                  WHERE producteur_id = $1 
//                  ORDER BY cree_le DESC`,
//                 [producteurId]
//             );

//             res.json({
//                 success: true,
//                 transactions: transactions.rows
//             });

//         } catch (erreur) {
//             console.error('❌ Erreur historique transactions:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération'
//             });
//         }
//     }

//     static async webhookMTN(req,res){

// const {externalId,status} = req.body;

// if(status === "SUCCESSFUL"){

// await pool.query(`
// UPDATE transactions_paiement
// SET statut='reussi'
// WHERE id=$1
// `,[externalId])

// }

// res.sendStatus(200)

// }
// static async webhookOrange(req,res){

// const {order_id,status} = req.body;

// if(status === "SUCCESS"){

// await pool.query(`
// UPDATE transactions_paiement
// SET statut='reussi'
// WHERE id=$1
// `,[order_id])

// }

// res.sendStatus(200)

// }
// }

// export default PaiementController;