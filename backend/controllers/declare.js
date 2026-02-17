

import DeclarationDechets from '../models/DeclarationDechets.js';
import { pool } from '../config/database.js';

class DeclarationController {
    // Créer une déclaration de déchets
    static async creerDeclaration(req, res) {
        try {
            const producteurId = req.producteurId;
            const {
                typeDechet,
                quantite,
                unite,
                modeCollecte,
                dateSouhaitee,
                creneauHoraire,
                notes,
                typesDechets
            } = req.body;

            // Validation basique
            if (!typeDechet || !quantite || !unite || !modeCollecte) {
                return res.status(400).json({ 
                    message: 'Les champs typeDechet, quantite, unite et modeCollecte sont obligatoires' 
                });
            }

            // Vérifier les limites selon le type de producteur
            const requeteProducteur = `
                SELECT type_producteur FROM producteurs WHERE id = $1
            `;
            const resultProducteur = await pool.query(requeteProducteur, [producteurId]);
            
            if (!resultProducteur.rows[0]) {
                return res.status(404).json({ 
                    message: 'Producteur non trouvé' 
                });
            }

            const declarationData = {
                producteurId,
                typeDechet,
                quantite: parseFloat(quantite),
                unite,
                modeCollecte,
                dateSouhaitee: dateSouhaitee || null,
                creneauHoraire: creneauHoraire || null,
                notes: notes || null,
                typesDechets: typesDechets || []
            };

            const nouvelleDeclaration = await DeclarationDechets.creer(declarationData);

            res.status(201).json({
                message: 'Déclaration créée avec succès',
                declaration: nouvelleDeclaration
            });
        } catch (erreur) {
            console.error('Erreur création déclaration:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de la création de la déclaration',
                erreur: erreur.message 
            });
        }
    }

    // Obtenir toutes les déclarations d'un producteur
    static async obtenirDeclarations(req, res) {
        try {
            const producteurId = req.producteurId;
            const declarations = await DeclarationDechets.trouverParProducteur(producteurId);

            res.json({
                declarations,
                total: declarations.length
            });
        } catch (erreur) {
            console.error('Erreur récupération déclarations:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de la récupération des déclarations',
                erreur: erreur.message 
            });
        }
    }

    // Obtenir une déclaration spécifique
    static async obtenirDeclaration(req, res) {
        try {
            const { id } = req.params;
            const producteurId = req.producteurId;

            const declaration = await DeclarationDechets.trouverParId(id);

            if (!declaration) {
                return res.status(404).json({ 
                    message: 'Déclaration non trouvée' 
                });
            }

            // Vérifier que la déclaration appartient au producteur
            if (declaration.producteur_id !== producteurId) {
                return res.status(403).json({ 
                    message: 'Vous n\'avez pas accès à cette déclaration' 
                });
            }

            res.json({ declaration });
        } catch (erreur) {
            console.error('Erreur récupération déclaration:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de la récupération de la déclaration',
                erreur: erreur.message 
            });
        }
    }

    // Suivre une déclaration (statut + collecte associée)
    // static async suivreDeclaration(req, res) {
    //     try {
    //         const { id } = req.params;
    //         const producteurId = req.producteurId;

    //         // Obtenir la déclaration avec les détails de collecte
    //         const requete = `
    //             SELECT 
    //                 dd.*,
    //                 c.date_programmee,
    //                 c.heure_programmee,
    //                 c.date_reelle,
    //                 c.poids_reel,
    //                 c.statut as statut_collecte,
    //                 c.notes as notes_collecte,
    //                 c.terminee_le,
    //                 p.nom_complet,
    //                 p.telephone
    //             FROM declarations_dechets dd
    //             LEFT JOIN collectes c ON dd.id = c.declaration_id
    //             JOIN producteurs p ON dd.producteur_id = p.id
    //             WHERE dd.id = $1
    //         `;
    //         const resultat = await pool.query(requete, [id]);
    //         const declaration = resultat.rows[0];

    //         if (!declaration) {
    //             return res.status(404).json({ 
    //                 message: 'Déclaration non trouvée' 
    //             });
    //         }

    //         // Vérifier les permissions
    //         if (declaration.producteur_id !== producteurId) {
    //             return res.status(403).json({ 
    //                 message: 'Accès non autorisé' 
    //             });
    //         }

    //         // Utiliser les méthodes directement avec le nom de la classe
    //         res.json({ 
    //             declaration,
    //             suivre: {
    //                 etapeActuelle: DeclarationController.determinerEtape(declaration.statut),
    //                 prochaineAction: DeclarationController.getProchaineAction(declaration.statut),
    //                 estTerminee: declaration.statut === 'termine'
    //             }
    //         });
    //     } catch (erreur) {
    //         console.error('Erreur suivi déclaration:', erreur);
    //         res.status(500).json({ 
    //             message: 'Erreur lors du suivi de la déclaration',
    //             erreur: erreur.message 
    //         });
    //     }
    // }

    // Dans declarationController.js - méthode suivreDeclaration

static async suivreDeclaration(req, res) {
    try {
        const { id } = req.params;
        const producteurId = req.producteurId;

        // Obtenir la déclaration avec les détails de la mission (ex-collectes)
        const requete = `
            SELECT 
                dd.*,
                m.date_programmee,
                m.heure_programmee,
                m.date_debut_collecte as date_reelle,
                m.poids_depose as poids_reel,
                m.statut as statut_mission,
                m.notes_collecte as notes_collecte,
                m.date_validation as terminee_le,
                p.nom_complet,
                p.telephone,
                col.nom_complet as collecteur_nom,
                col.telephone as collecteur_telephone
            FROM declarations_dechets dd
            LEFT JOIN missions m ON dd.id = m.declaration_id
            LEFT JOIN collecteurs col ON m.collecteur_id = col.id
            JOIN producteurs p ON dd.producteur_id = p.id
            WHERE dd.id = $1
        `;
        
        const resultat = await pool.query(requete, [id]);
        const declaration = resultat.rows[0];

        if (!declaration) {
            return res.status(404).json({ 
                message: 'Déclaration non trouvée' 
            });
        }

        // Vérifier les permissions
        if (declaration.producteur_id !== producteurId) {
            return res.status(403).json({ 
                message: 'Accès non autorisé' 
            });
        }

        // Construire l'objet de suivi
        const suivre = {
            etapeActuelle: DeclarationController.determinerEtape(declaration.statut, declaration.statut_mission),
            prochaineAction: DeclarationController.getProchaineAction(declaration.statut, declaration.statut_mission),
            estTerminee: declaration.statut === 'termine' || declaration.statut_mission === 'validee',
            mission: declaration.statut_mission ? {
                statut: declaration.statut_mission,
                collecteur: declaration.collecteur_nom,
                collecteur_telephone: declaration.collecteur_telephone,
                date_programmee: declaration.date_programmee,
                poids: declaration.poids_reel,
                date_validation: declaration.terminee_le
            } : null
        };

        res.json({ 
            declaration,
            suivre
        });
    } catch (erreur) {
        console.error('Erreur suivi déclaration:', erreur);
        res.status(500).json({ 
            message: 'Erreur lors du suivi de la déclaration',
            erreur: erreur.message 
        });
    }
}

// Mettre à jour les méthodes utilitaires
static determinerEtape(statutDecla, statutMission) {
    if (statutMission) {
        const etapesMission = {
            'disponible': 'En attente de collecteur',
            'acceptee': 'Collecteur accepté',
            'en_cours': 'Collecte en cours',
            'deposee': 'Déposée au point de collecte',
            'validee': 'Validée',
            'refusee': 'Refusée',
            'annulee': 'Annulée'
        };
        return etapesMission[statutMission] || statutMission;
    }
    
    const etapes = {
        'en_attente': 'En attente d\'affectation',
        'affecte': 'Collecteur affecté',
        'programme': 'Collecte programmée',
        'termine': 'Collecte terminée',
        'annule': 'Annulée'
    };
    return etapes[statutDecla] || 'Statut inconnu';
}

static getProchaineAction(statutDecla, statutMission) {
    if (statutMission) {
        const actionsMission = {
            'disponible': 'En attente qu\'un collecteur accepte la mission',
            'acceptee': 'Le collecteur va bientôt démarrer la collecte',
            'en_cours': 'Collecte en cours...',
            'deposee': 'En attente de validation par le gestionnaire',
            'validee': 'Consultez vos points et gains',
            'refusee': 'Contactez le support pour plus d\'informations',
            'annulee': 'Créez une nouvelle déclaration'
        };
        return actionsMission[statutMission] || 'Action inconnue';
    }
    
    const actions = {
        'en_attente': 'Attente de l\'affectation d\'un collecteur',
        'affecte': 'Notification du créneau horaire à venir',
        'programme': 'Préparer vos déchets pour la collecte',
        'termine': 'Consulter vos points et historique',
        'annule': 'Créer une nouvelle déclaration si nécessaire'
    };
    return actions[statutDecla] || 'Action inconnue';
}

    // Obtenir l'historique des collectes
    static async obtenirHistorique(req, res) {
        try {
            const producteurId = req.producteurId;
            const { limite = 10 } = req.query;

            // Correction : utiliser la méthode du modèle ou faire une requête directe
            const requete = `
                SELECT 
                    dd.*,
                    c.date_reelle,
                    c.poids_reel,
                    c.points_attribues,
                    c.statut as statut_collecte
                FROM declarations_dechets dd
                LEFT JOIN collectes c ON dd.id = c.declaration_id
                WHERE dd.producteur_id = $1
                ORDER BY dd.cree_le DESC
                LIMIT $2
            `;
            
            const resultat = await pool.query(requete, [producteurId, parseInt(limite)]);
            const historique = resultat.rows;

            res.json({
                historique,
                total: historique.length
            });
        } catch (erreur) {
            console.error('Erreur récupération historique:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de la récupération de l\'historique',
                erreur: erreur.message 
            });
        }
    }

    // Obtenir les points de dépôt volontaire à proximité
    static async obtenirPointsDepot(req, res) {
        try {
            const { latitude, longitude, rayon = 5 } = req.query;

            if (!latitude || !longitude) {
                return res.status(400).json({ 
                    message: 'Les coordonnées GPS sont requises' 
                });
            }

            const requete = `
                SELECT 
                    id,
                    nom,
                    adresse,
                    quartier,
                    commune,
                    types_dechets_acceptes,
                    horaires_ouverture,
                    ST_Distance(localisation_gps, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as distance_metres
                FROM points_depot_volontaire
                WHERE est_actif = true
                AND ST_DWithin(
                    localisation_gps::geography,
                    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
                    $3 * 1000
                )
                ORDER BY distance_metres
                LIMIT 20
            `;

            const resultat = await pool.query(requete, [
                parseFloat(longitude),
                parseFloat(latitude),
                parseFloat(rayon)
            ]);

            res.json({
                points: resultat.rows,
                total: resultat.rows.length
            });
        } catch (erreur) {
            console.error('Erreur récupération points dépôt:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de la récupération des points de dépôt',
                erreur: erreur.message 
            });
        }
    }

    // Méthodes utilitaires
    static determinerEtape(statut) {
        const etapes = {
            'en_attente': 'En attente d\'affectation',
            'affecte': 'Collecteur affecté',
            'programme': 'Collecte programmée',
            'termine': 'Collecte terminée',
            'annule': 'Annulée'
        };
        return etapes[statut] || 'Statut inconnu';
    }

    
    static getProchaineAction(statut) {
        const actions = {
            'en_attente': 'Attente de l\'affectation d\'un collecteur',
            'affecte': 'Notification du créneau horaire à venir',
            'programme': 'Préparer vos déchets pour la collecte',
            'termine': 'Consulter vos points et historique',
            'annule': 'Créer une nouvelle déclaration si nécessaire'
        };
        return actions[statut] || 'Action inconnue';
    }
}

export default DeclarationController;







