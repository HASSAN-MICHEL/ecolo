// controllers/ProducteurPremiumController.js
import ProducteurPremium from '../models/ProducteurPremium.js';
import { pool } from '../config/database.js';

class ProducteurPremiumController {
    // Souscrire à un abonnement premium
    static async souscrire(req, res) {
        try {
            const producteurId = req.utilisateurId;
            const { typeAbonnement, frequenceCollecte, montantAbonnement, dureeMois } = req.body;

            // Validations
            if (!montantAbonnement || montantAbonnement <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Le montant de l\'abonnement doit être positif'
                });
            }

            if (!dureeMois || dureeMois < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'La durée doit être d\'au moins 1 mois'
                });
            }

            // Calculer la date de fin
            const dateDebut = new Date();
            const dateFin = new Date();
            dateFin.setMonth(dateFin.getMonth() + parseInt(dureeMois));

            // Créer l'abonnement
            const abonnement = await ProducteurPremium.creerAbonnement({
                producteurId,
                typeAbonnement: typeAbonnement || 'premium',
                frequenceCollecte: frequenceCollecte || 'hebdomadaire',
                dateDebut,
                dateFin,
                montantAbonnement: parseFloat(montantAbonnement)
            });

            res.status(201).json({
                success: true,
                message: 'Abonnement premium souscrit avec succès',
                abonnement
            });

        } catch (erreur) {
            console.error('❌ Erreur souscription premium:', erreur);
            res.status(500).json({
                success: false,
                message: erreur.message || 'Erreur lors de la souscription'
            });
        }
    }

    // Renouveler un abonnement
    static async renouveler(req, res) {
        try {
            const { abonnementId } = req.params;
            const { montantAbonnement, dureeMois } = req.body;

            const abonnement = await ProducteurPremium.trouverParId(abonnementId);
            
            if (!abonnement) {
                return res.status(404).json({
                    success: false,
                    message: 'Abonnement non trouvé'
                });
            }

            // Calculer la nouvelle date de fin
            const nouvelleDateFin = new Date(abonnement.date_fin);
            nouvelleDateFin.setMonth(nouvelleDateFin.getMonth() + parseInt(dureeMois));

            const abonnementRenouvele = await ProducteurPremium.renouvelerAbonnement(
                abonnementId,
                nouvelleDateFin,
                parseFloat(montantAbonnement)
            );

            res.json({
                success: true,
                message: 'Abonnement renouvelé avec succès',
                abonnement: abonnementRenouvele
            });

        } catch (erreur) {
            console.error('❌ Erreur renouvellement:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du renouvellement'
            });
        }
    }

    // Résilier un abonnement
    static async resilier(req, res) {
        try {
            const { abonnementId } = req.params;

            await ProducteurPremium.resilierAbonnement(abonnementId);

            res.json({
                success: true,
                message: 'Abonnement résilié avec succès'
            });

        } catch (erreur) {
            console.error('❌ Erreur résiliation:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la résiliation'
            });
        }
    }

    // Voir mon abonnement
    static async monAbonnement(req, res) {
        try {
            const producteurId = req.utilisateurId;
            
            const abonnement = await ProducteurPremium.trouverParProducteur(producteurId);

            res.json({
                success: true,
                abonnement: abonnement || null
            });

        } catch (erreur) {
            console.error('❌ Erreur récupération abonnement:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération de l\'abonnement'
            });
        }
    }

    // Lister tous les abonnements (admin)
    static async listerAbonnements(req, res) {
        try {
            const abonnements = await ProducteurPremium.listerActifs();
            
            const stats = await ProducteurPremium.getStatistiques();

            res.json({
                success: true,
                abonnements,
                statistiques: stats
            });

        } catch (erreur) {
            console.error('❌ Erreur liste abonnements:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des abonnements'
            });
        }
    }
}

export default ProducteurPremiumController;