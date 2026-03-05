import bcrypt from 'bcrypt';
import Sponsor from '../models/Sponsor.js';
import Campagne from '../models/Campagne.js';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

class SponsorController {
    // Inscription
    static async inscription(req, res) {
        try {
            const {
                email, telephone, motDePasse, nomOrganisation,
                typeOrganisation, nomResponsable, adresse,
                longitude, latitude, cguAcceptees
            } = req.body;

            const existant = await Sponsor.trouverParEmail(email);
            if (existant) {
                return res.status(400).json({
                    success: false,
                    message: 'Un compte avec cet email existe déjà'
                });
            }

            if (telephone) {
                const telExistant = await Sponsor.trouverParTelephone(telephone);
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

            const sponsorData = {
                email,
                telephone,
                motDePasseHash,
                nomOrganisation,
                typeOrganisation,
                nomResponsable,
                adresse,
                localisation_gps: latitude && longitude ? { lat: parseFloat(latitude), lng: parseFloat(longitude) } : null,
                photoLogoUrl,
                cguAcceptees
            };

            const nouveauSponsor = await Sponsor.creer(sponsorData);

            res.status(201).json({
                success: true,
                message: 'Inscription réussie',
                sponsor: {
                    id: nouveauSponsor.id,
                    email: nouveauSponsor.email,
                    nomOrganisation: nouveauSponsor.nom_organisation
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur inscription sponsor:', erreur);
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

            let sponsor = await Sponsor.trouverParEmail(identifiant);
            if (!sponsor && identifiant.includes('@')) {
                sponsor = await Sponsor.trouverParEmail(identifiant);
            } else if (!sponsor) {
                sponsor = await Sponsor.trouverParTelephone(identifiant);
            }

            if (!sponsor) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            const motDePasseValide = await bcrypt.compare(motDePasse, sponsor.mot_de_passe_hash);
            if (!motDePasseValide) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            if (!sponsor.est_actif) {
                return res.status(403).json({
                    success: false,
                    message: 'Compte désactivé'
                });
            }

            await Sponsor.mettreAJourConnexion(sponsor.id);

            const token = jwt.sign(
                { id: sponsor.id, email: sponsor.email, type: 'sponsor' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '7d' }
            );

            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                utilisateur: {
                    id: sponsor.id,
                    email: sponsor.email,
                    nomOrganisation: sponsor.nom_organisation,
                    type: 'sponsor'
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur connexion sponsor:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion',
                erreur: erreur.message
            });
        }
    }

    // Mes campagnes
    // static async mesCampagnes(req, res) {
    //     try {
    //         const sponsorId = req.utilisateurId;
    //         const campagnes = await Sponsor.obtenirCampagnes(sponsorId);

    //         // Ajouter le suivi pour chaque campagne
    //         for (let campagne of campagnes) {
    //             const suivi = await Campagne.getSuivi(campagne.id);
    //             campagne.suivi = suivi;
    //         }

    //         res.json({
    //             success: true,
    //             campagnes
    //         });
    //     } catch (erreur) {
    //         console.error('❌ Erreur récupération campagnes:', erreur);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Erreur lors de la récupération',
    //             erreur: erreur.message
    //         });
    //     }
    // }


    // controllers/SponsorController.js
static async mesCampagnes(req, res) {
    try {
        const sponsorId = req.utilisateurId;
        
        // Récupérer les campagnes où le sponsor est promoteur
        const campagnes = await pool.query(`
            SELECT 
                c.*,
                pc.contribution_financiere,
                COALESCE(sc.poids_collecte, 0) as poids_collecte_actuel,
                COALESCE(sc.montant_utilise, 0) as montant_utilise,
                c.poids_attendue - COALESCE(sc.poids_collecte, 0) as poids_restant,
                (
                    SELECT json_agg(json_build_object(
                        'type_dechet', o.type_dechet,
                        'poids_attendue', o.poids_attendue,
                        'prix_par_kg', o.prix_par_kg,
                        'poids_collecte_actuel', o.poids_collecte_actuel
                    ))
                    FROM campagne_objectifs o
                    WHERE o.campagne_id = c.id
                ) as objectifs
            FROM campagnes c
            JOIN promoteurs_campagne pc ON c.id = pc.campagne_id
            LEFT JOIN (
                SELECT 
                    campagne_id,
                    SUM(poids_collecte) as poids_collecte,
                    SUM(montant_utilise) as montant_utilise
                FROM suivi_campagne
                GROUP BY campagne_id
            ) sc ON c.id = sc.campagne_id
            WHERE pc.promoteur_id = $1 AND pc.promoteur_type = 'sponsor'
            ORDER BY c.date_debut DESC
        `, [sponsorId]);

        res.json({
            success: true,
            campagnes: campagnes.rows
        });

    } catch (erreur) {
        console.error('❌ Erreur mesCampagnes:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des campagnes',
            erreur: erreur.message
        });
    }
}
    // Détails d'une campagne spécifique
    static async detailsCampagne(req, res) {
        try {
            const sponsorId = req.utilisateurId;
            const { campagneId } = req.params;

            // Vérifier que le sponsor participe à cette campagne
            const verif = await pool.query(`
                SELECT * FROM promoteurs_campagne 
                WHERE campagne_id = $1 AND promoteur_id = $2 AND promoteur_type = 'sponsor'
            `, [campagneId, sponsorId]);

            if (verif.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Vous ne participez pas à cette campagne'
                });
            }

            const campagne = await Campagne.trouverParId(campagneId);
            const suivi = await Campagne.getSuivi(campagneId);
            const statistiques = await Campagne.statistiques(campagneId);
            const promoteurs = await Campagne.getPromoteurs(campagneId);

            res.json({
                success: true,
                campagne,
                suivi,
                statistiques,
                promoteurs
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

    // Rapport de campagne
    static async rapportCampagne(req, res) {
        try {
            const sponsorId = req.utilisateurId;
            const { campagneId } = req.params;
            const { format = 'json' } = req.query;

            // Vérifier l'accès
            const verif = await pool.query(`
                SELECT * FROM promoteurs_campagne 
                WHERE campagne_id = $1 AND promoteur_id = $2 AND promoteur_type = 'sponsor'
            `, [campagneId, sponsorId]);

            if (verif.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Accès non autorisé'
                });
            }

            const campagne = await Campagne.trouverParId(campagneId);
            const statistiques = await Campagne.statistiques(campagneId);

            // Détails par point de collecte
            const pointsDetails = await pool.query(`
                SELECT 
                    pdv.nom as point_nom,
                    pdv.commune,
                    pdv.quartier,
                    COALESCE(SUM(s.poids_collecte), 0) as poids_collecte,
                    COALESCE(SUM(s.montant_utilise), 0) as montant_utilise,
                    COUNT(DISTINCT s.date_suivi) as jours_actifs
                FROM suivi_campagne s
                JOIN points_depot_volontaire pdv ON s.details->>'point_id' = pdv.id::text
                WHERE s.campagne_id = $1
                GROUP BY pdv.id, pdv.nom, pdv.commune, pdv.quartier
                ORDER BY poids_collecte DESC
            `, [campagneId]);

            const rapport = {
                campagne: {
                    nom: campagne.nom,
                    periode: `${new Date(campagne.date_debut).toLocaleDateString()} - ${new Date(campagne.date_fin).toLocaleDateString()}`,
                    objectif: campagne.poids_attendue,
                    prix_kg: campagne.prix_par_kg,
                    budget: campagne.budget_total
                },
                realisation: statistiques,
                points: pointsDetails.rows,
                date_generation: new Date()
            };

            if (format === 'json') {
                res.json({
                    success: true,
                    rapport
                });
            } else {
                // Pour PDF/Excel, on pourrait générer ici
                res.json({
                    success: true,
                    message: 'Format non implémenté',
                    rapport
                });
            }
        } catch (erreur) {
            console.error('❌ Erreur rapport:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la génération',
                erreur: erreur.message
            });
        }
    }

    // Tableau de bord
    static async tableauBord(req, res) {
        try {
            const sponsorId = req.utilisateurId;
            const dashboard = await Sponsor.tableauBord(sponsorId);
            
            // Détail des campagnes actives
            const campagnesActives = await pool.query(`
                SELECT c.*, 
                       pc.contribution_financiere,
                       (SELECT COALESCE(SUM(poids_collecte), 0) 
                        FROM suivi_campagne sc 
                        WHERE sc.campagne_id = c.id) as poids_actuel,
                       c.poids_attendue - COALESCE((
                           SELECT SUM(poids_collecte) 
                           FROM suivi_campagne sc 
                           WHERE sc.campagne_id = c.id
                       ), 0) as reste_a_atteindre
                FROM campagnes c
                JOIN promoteurs_campagne pc ON c.id = pc.campagne_id
                WHERE pc.promoteur_id = $1 
                  AND pc.promoteur_type = 'sponsor'
                  AND c.statut = 'active'
                ORDER BY c.date_fin ASC
            `, [sponsorId]);

            // Évolution des 7 derniers jours
            const evolution = await pool.query(`
                SELECT 
                    date_suivi,
                    SUM(poids_collecte) as poids_total
                FROM suivi_campagne sc
                JOIN promoteurs_campagne pc ON sc.campagne_id = pc.campagne_id
                WHERE pc.promoteur_id = $1 
                  AND pc.promoteur_type = 'sponsor'
                  AND date_suivi >= CURRENT_DATE - INTERVAL '7 days'
                GROUP BY date_suivi
                ORDER BY date_suivi
            `, [sponsorId]);

            res.json({
                success: true,
                dashboard,
                campagnesActives: campagnesActives.rows,
                evolution: evolution.rows
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

    
    // Profil
    static async getProfil(req, res) {
        try {
            const sponsorId = req.utilisateurId;
            const sponsor = await Sponsor.trouverParId(sponsorId);

            if (!sponsor) {
                return res.status(404).json({
                    success: false,
                    message: 'Sponsors non trouvée'
                });
            }

            delete sponsor.mot_de_passe_hash;

            res.json({
                success: true,
                sponsor
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
            const sponsorId = req.utilisateurId;
            const {
                nomOrganisation,
                nomResponsable,
                telephone,
                adresse
            } = req.body;

            if (telephone) {
                const existant = await Sponsor.trouverParTelephone(telephone);
                if (existant && existant.id !== sponsorId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Ce téléphone est déjà utilisé'
                    });
                }
            }

            const donnees = {
                nomOrganisation,
                nomResponsable,
                telephone,
                adresse
            };

            if (req.file) {
                donnees.photoLogoUrl = `/uploads/logos/${req.file.filename}`;
            }

            const sponsor = await Sponsor.mettreAJour(sponsorId, donnees);

            res.json({
                success: true,
                message: 'Profil mis à jour',
                sponsor
            });
        } catch (erreur) {
            console.error('❌ Erreur mise à jour:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour',
                erreur: erreur.message
            });
        }
    }
}

export default SponsorController;