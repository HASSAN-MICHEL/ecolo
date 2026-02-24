
import { pool } from '../config/database.js';

class GestionnairePoint {
    // Créer un nouveau gestionnaire (par superviseur)
    static async creer(donnees, creePar) {
        const requete = `
            INSERT INTO gestionnaires_points (
                email, telephone, mot_de_passe_hash, nom_complet,
                point_collecte_id, fonction, cree_par
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, email, telephone, nom_complet, point_collecte_id, fonction, cree_le
        `;
        
        const valeurs = [
            donnees.email,
            donnees.telephone,
            donnees.motDePasseHash,
            donnees.nomComplet,
            donnees.pointCollecteId,
            donnees.fonction || 'Gestionnaire',
            creePar
        ];
        
        const resultat = await pool.query(requete, valeurs);
        return resultat.rows[0];
    }

    // Trouver par email
    static async trouverParEmail(email) {
        const requete = `
            SELECT g.*, p.nom as point_collecte_nom 
            FROM gestionnaires_points g
            LEFT JOIN points_depot_volontaire p ON g.point_collecte_id = p.id
            WHERE g.email = $1
        `;
        const resultat = await pool.query(requete, [email]);
        return resultat.rows[0];
    }

    // Trouver par ID
    static async trouverParId(id) {
        const requete = `
            SELECT g.*, p.nom as point_collecte_nom,
                   p.adresse as point_collecte_adresse,
                   p.types_dechets_acceptes
            FROM gestionnaires_points g
            LEFT JOIN points_depot_volontaire p ON g.point_collecte_id = p.id
            WHERE g.id = $1
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    // ✅ Obtenir TOUTES les missions du point de collecte
    static async missionsDuPoint(gestionnaireId, statut = null) {
        let requete = `
            SELECT 
                m.id,
                m.statut,
                m.date_disponibilite,
                m.date_acceptation,
                m.date_depot_point,
                m.date_validation,
                m.poids_depose,
                m.qualite_dechets,
                m.validation_notes,
                m.points_attribues,
                m.gains_attribues,
                d.id as declaration_id,
                d.type_dechet,
                d.quantite,
                d.unite,
                p.id as producteur_id,
                p.nom_complet as producteur_nom,
                p.telephone as producteur_telephone,
                p.adresse as producteur_adresse,
                c.id as collecteur_id,
                c.nom_complet as collecteur_nom,
                c.telephone as collecteur_telephone,
                gc.id as gain_id,
                gc.montant as gain_montant,
                gc.statut as gain_statut,
                gc.type_gain,
                gc.date_validation as gain_date,
                pdv.nom as point_depot_nom
            FROM missions m
            JOIN declarations_dechets d ON m.declaration_id = d.id
            JOIN producteurs p ON d.producteur_id = p.id
            LEFT JOIN collecteurs c ON m.collecteur_id = c.id
            LEFT JOIN gains_collecteurs gc ON m.id = gc.mission_id
            JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
            JOIN gestionnaires_points g ON g.id = $1
            WHERE pdv.id = g.point_collecte_id
        `;
        
        const params = [gestionnaireId];
        let paramIndex = 2;
        
        if (statut && statut !== 'tous') {
            requete += ` AND m.statut = $${paramIndex}`;
            params.push(statut);
        }
        
        requete += ` ORDER BY 
            CASE 
                WHEN m.statut = 'deposee' THEN 1
                WHEN m.statut = 'validee' THEN 2
                ELSE 3
            END,
            m.date_depot_point DESC NULLS LAST,
            m.date_validation DESC NULLS LAST
        `;
        
        const resultat = await pool.query(requete, params);
        return resultat.rows;
    }

    // ✅ Missions en attente de validation (statut = 'deposee')
    static async missionsEnAttente(gestionnaireId) {
        return this.missionsDuPoint(gestionnaireId, 'deposee');
    }

    // ✅ Missions validées (historique)
    static async missionsValidees(gestionnaireId) {
        return this.missionsDuPoint(gestionnaireId, 'validee');
    }

    // ✅ Obtenir une mission spécifique avec tous ses détails
    static async missionDetails(missionId, gestionnaireId) {
        const requete = `
            SELECT 
                m.*,
                d.type_dechet,
                d.quantite,
                d.unite,
                p.nom_complet as producteur_nom,
                p.telephone as producteur_telephone,
                p.adresse as producteur_adresse,
                c.id as collecteur_id,
                c.nom_complet as collecteur_nom,
                c.telephone as collecteur_telephone,
                c.points_total as collecteur_points,
                c.gains_total as collecteur_gains,
                gc.id as gain_id,
                gc.montant as gain_montant,
                gc.statut as gain_statut,
                gc.type_gain,
                gc.date_validation as gain_date,
                pdv.nom as point_depot_nom,
                pdv.adresse as point_depot_adresse
            FROM missions m
            JOIN declarations_dechets d ON m.declaration_id = d.id
            JOIN producteurs p ON d.producteur_id = p.id
            LEFT JOIN collecteurs c ON m.collecteur_id = c.id
            LEFT JOIN gains_collecteurs gc ON m.id = gc.mission_id
            JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
            JOIN gestionnaires_points g ON g.id = $2
            WHERE m.id = $1 AND pdv.id = g.point_collecte_id
        `;
        
        const resultat = await pool.query(requete, [missionId, gestionnaireId]);
        return resultat.rows[0];
    }



// models/GestionnairePoint.js - Méthode validerMission avec prix personnalisé
static async validerMission(missionId, gestionnaireId, data) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Récupérer les détails de la mission
        const missionCheck = await client.query(`
            SELECT m.*, d.type_dechet, d.quantite, c.id as collecteur_id,
                   c.nom_complet as collecteur_nom
            FROM missions m
            JOIN declarations_dechets d ON m.declaration_id = d.id
            JOIN collecteurs c ON m.collecteur_id = c.id
            WHERE m.id = $1
        `, [missionId]);
        
        if (missionCheck.rows.length === 0) {
            throw new Error('Mission non trouvée');
        }
        
        const mission = missionCheck.rows[0];
        
        if (mission.statut !== 'deposee') {
            throw new Error('Cette mission n\'est pas en attente de validation');
        }
        
        // ✅ Utiliser le prix fourni par le gestionnaire
        const poidsDepose = data.poidsDepose;
        const prixParKg = data.prixParKg; // PRIX PERSONNALISÉ
        const montantTotal = data.montantTotal; // DÉJÀ CALCULÉ
        
        console.log(`💰 Calcul des crédits: ${poidsDepose} kg × ${prixParKg} FCFA = ${montantTotal} FCFA`);
        
        // ✅ 1. Mettre à jour la mission
        await client.query(`
            UPDATE missions 
            SET statut = 'validee',
                poids_depose = $1,
                date_validation = NOW(),
                validation_notes = $2,
                validee_par = $3,
                gains_attribues = $4  -- AJOUTER LE MONTANT DANS LA MISSION
            WHERE id = $5
        `, [
            poidsDepose, 
            data.validationNotes || null, 
            gestionnaireId, 
            montantTotal,
            missionId
        ]);
        
        // ✅ 2. Attribuer les crédits au collecteur avec le montant calculé
        const gainResult = await client.query(`
            INSERT INTO gains_collecteurs (
                collecteur_id, 
                mission_id, 
                montant, 
                type_gain, 
                statut,
                date_validation
            ) VALUES ($1, $2, $3, 'collecte', 'valide', CURRENT_TIMESTAMP)
            RETURNING *
        `, [mission.collecteur_id, missionId, montantTotal]);
        
        // ✅ 3. Mettre à jour le total des gains du collecteur
        await client.query(`
            UPDATE collecteurs 
            SET gains_total = COALESCE(gains_total, 0) + $1
            WHERE id = $2
        `, [montantTotal, mission.collecteur_id]);
        
        // ✅ 4. Notification au collecteur
        await client.query(`
            INSERT INTO notifications (
                utilisateur_id, 
                type_utilisateur, 
                titre, 
                message, 
                type_notification,
                reference_id,
                reference_type
            ) VALUES ($1, 'collecteur', $2, $3, 'gain_recu', $4, 'gain')
        `, [
            mission.collecteur_id,
            'Mission validée',
            `Votre mission a été validée. Vous avez reçu ${montantTotal} FCFA pour ${poidsDepose} kg à ${prixParKg} FCFA/kg.`,
            gainResult.rows[0].id
        ]);
        
        await client.query('COMMIT');
        
        return { 
            id: missionId, 
            poidsDepose,
            prixParKg,
            montantTotal,
            collecteurId: mission.collecteur_id,
            collecteurNom: mission.collecteur_nom,
            valideePar: gestionnaireId
        };
        
    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur dans validerMission:', erreur);
        throw erreur;
    } finally {
        client.release();
    } ; 

      await client.query(`
        INSERT INTO notifications (
            utilisateur_id, 
            type_utilisateur, 
            titre, 
            message, 
            type_notification,
            reference_id,
            reference_type
        ) VALUES ($1, 'collecteur', $2, $3, 'validation_collecte', $4, 'mission')
    `, [
        mission.collecteur_id,
        'Mission validée ✓',
        `Votre mission a été validée par le gestionnaire. Vous avez gagné ${gainsAttribues} FCFA.`,
        missionId
    ]);

}
    // }

    // ✅ Attribuer des crédits supplémentaires (bonus) - VERSION CORRIGÉE
static async attribuerCredits(collecteurId, missionId, montant, gestionnaireId) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Vérifier que la mission existe et est validée
        const verification = await client.query(`
            SELECT m.* FROM missions m
            WHERE m.id = $1 
              AND m.statut = 'validee'
        `, [missionId]);

        if (verification.rows.length === 0) {
            throw new Error('Mission non trouvée ou non validée');
        }

        // Vérifier que le collecteur existe
        const collecteurCheck = await client.query(`
            SELECT * FROM collecteurs WHERE id = $1
        `, [collecteurId]);

        if (collecteurCheck.rows.length === 0) {
            throw new Error('Collecteur non trouvé');
        }

        // Créer le gain bonus
        const requeteGain = `
            INSERT INTO gains_collecteurs (
                collecteur_id, 
                mission_id, 
                montant, 
                type_gain, 
                statut,
                date_validation
            ) VALUES ($1, $2, $3, 'bonus', 'valide', CURRENT_TIMESTAMP)
            RETURNING *
        `;
        
        const resultatGain = await client.query(requeteGain, [
            collecteurId,
            missionId,
            montant
        ]);

        // Mettre à jour le total des gains du collecteur
        await client.query(`
            UPDATE collecteurs 
            SET gains_total = COALESCE(gains_total, 0) + $1
            WHERE id = $2
        `, [montant, collecteurId]);

        // Notification au collecteur
        await client.query(`
            INSERT INTO notifications (
                utilisateur_id, 
                type_utilisateur, 
                titre, 
                message, 
                type_notification,
                reference_id,
                reference_type
            ) VALUES ($1, 'collecteur', $2, $3, 'paiement_recu', $4, 'gain')
        `, [
            collecteurId,
            'Bonus reçu',
            `Vous avez reçu un bonus de ${montant} FCFA.`,
            resultatGain.rows[0].id
        ]);

        await client.query('COMMIT');
        return resultatGain.rows[0];
        
    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur attribution crédits:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
  
 }
  // models/GestionnairePoint.js - VERSION SANS validee_par
// models/GestionnairePoint.js - tableauBord avec stats personnalisées
static async tableauBord(gestionnaireId) {
    const gestionnaire = await this.trouverParId(gestionnaireId);
    
    if (!gestionnaire || !gestionnaire.point_collecte_id) {
        return {
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
            }
        };
    }
    
    try {
        // Stats GLOBALES du point
        const globalStats = await pool.query(`
            SELECT 
                COUNT(CASE WHEN m.statut = 'deposee' THEN 1 END) as en_attente,
                COUNT(CASE WHEN m.statut = 'validee' THEN 1 END) as total_validees,
                COALESCE(SUM(CASE WHEN m.statut = 'validee' THEN m.poids_depose ELSE 0 END), 0) as poids_total_global
            FROM missions m
            WHERE m.point_depot_id = $1
        `, [gestionnaire.point_collecte_id]);
        
        // ✅ Stats PERSONNELLES de CE gestionnaire
        const mesStats = await pool.query(`
            SELECT 
                COUNT(CASE WHEN m.statut = 'validee' AND m.validee_par = $1 THEN 1 END) as missions_validees,
                COALESCE(SUM(CASE WHEN m.statut = 'validee' AND m.validee_par = $1 THEN m.poids_depose ELSE 0 END), 0) as poids_total_valide
            FROM missions m
            WHERE m.point_depot_id = $2
        `, [gestionnaireId, gestionnaire.point_collecte_id]);
        
        return {
            statistiques: {
                en_attente: parseInt(globalStats.rows[0]?.en_attente) || 0,
                total_validees: parseInt(globalStats.rows[0]?.total_validees) || 0,
                poids_total_global: parseFloat(globalStats.rows[0]?.poids_total_global) || 0,
                gains_distribues_global: 0
            },
            mes_statistiques: {
                missions_validees: parseInt(mesStats.rows[0]?.missions_validees) || 0,
                poids_total_valide: parseFloat(mesStats.rows[0]?.poids_total_valide) || 0,
                gains_distribues: 0
            }
        };
    } catch (error) {
        console.error('❌ Erreur dans tableauBord:', error);
        return {
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
            }
        };
    }
}

// models/GestionnairePoint.js - mesMissionsValidees avec filtre
static async mesMissionsValidees(gestionnaireId) {
    const gestionnaire = await this.trouverParId(gestionnaireId);
    
    if (!gestionnaire || !gestionnaire.point_collecte_id) {
        return [];
    }
    
    try {
        // ✅ Filtrer par validee_par = gestionnaireId
        const result = await pool.query(`
            SELECT 
                m.id,
                m.date_validation,
                m.poids_depose,
                m.validation_notes,
                d.type_dechet,
                d.quantite as quantite_initiale,
                d.unite,
                c.id as collecteur_id,
                c.nom_complet as collecteur_nom,
                c.telephone as collecteur_telephone
            FROM missions m
            JOIN declarations_dechets d ON m.declaration_id = d.id
            JOIN collecteurs c ON m.collecteur_id = c.id
            WHERE m.point_depot_id = $1 
              AND m.statut = 'validee'
              AND m.validee_par = $2  -- ← AJOUTER CE FILTRE
            ORDER BY m.date_validation DESC
        `, [gestionnaire.point_collecte_id, gestionnaireId]);
        
        return result.rows;
    } catch (error) {
        console.error('❌ Erreur dans mesMissionsValidees:', error);
        return [];
    }
}
// models/GestionnairePoint.js - monHistorique avec filtre
static async monHistorique(gestionnaireId, limite = 20) {
    const gestionnaire = await this.trouverParId(gestionnaireId);
    
    if (!gestionnaire || !gestionnaire.point_collecte_id) {
        return [];
    }
    
    try {
        // ✅ Filtrer par validee_par = gestionnaireId
        const result = await pool.query(`
            SELECT 
                'validation' as type_action,
                m.id as mission_id,
                m.date_validation as date_action,
                c.nom_complet as collecteur_nom,
                m.poids_depose as poids,
                d.type_dechet
            FROM missions m
            JOIN collecteurs c ON m.collecteur_id = c.id
            JOIN declarations_dechets d ON m.declaration_id = d.id
            WHERE m.point_depot_id = $1 
              AND m.statut = 'validee'
              AND m.validee_par = $2  -- ← AJOUTER CE FILTRE
            ORDER BY m.date_validation DESC
            LIMIT $3
        `, [gestionnaire.point_collecte_id, gestionnaireId, limite]);
        
        return result.rows;
    } catch (error) {
        console.error('❌ Erreur dans monHistorique:', error);
        return [];
    }
}

// models/GestionnairePoint.js - toutesMissionsDuPoint avec indicateur
static async toutesMissionsDuPoint(gestionnaireId, statut = null) {
    const gestionnaire = await this.trouverParId(gestionnaireId);
    
    if (!gestionnaire || !gestionnaire.point_collecte_id) {
        return [];
    }
    
    try {
        let query = `
            SELECT 
                m.id,
                m.statut,
                m.date_depot_point,
                m.date_validation,
                m.poids_depose,
                m.validation_notes,
                m.validee_par,
                d.type_dechet,
                d.quantite as quantite_initiale,
                d.unite,
                c.id as collecteur_id,
                c.nom_complet as collecteur_nom,
                c.telephone as collecteur_telephone,
                CASE WHEN m.validee_par = $2 THEN true ELSE false END as validee_par_moi
            FROM missions m
            JOIN declarations_dechets d ON m.declaration_id = d.id
            JOIN collecteurs c ON m.collecteur_id = c.id
            WHERE m.point_depot_id = $1
        `;
        
        const params = [gestionnaire.point_collecte_id, gestionnaireId];
        
        if (statut) {
            query += ` AND m.statut = $3`;
            params.push(statut);
        }
        
        query += ` ORDER BY m.date_depot_point DESC`;
        
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('❌ Erreur dans toutesMissionsDuPoint:', error);
        return [];
    }
}


    // ✅ Mettre à jour un gestionnaire
    static async mettreAJour(id, donnees) {
        const champs = [];
        const valeurs = [];
        let index = 1;

        if (donnees.nomComplet) {
            champs.push(`nom_complet = $${index++}`);
            valeurs.push(donnees.nomComplet);
        }
        if (donnees.telephone) {
            champs.push(`telephone = $${index++}`);
            valeurs.push(donnees.telephone);
        }
        if (donnees.fonction) {
            champs.push(`fonction = $${index++}`);
            valeurs.push(donnees.fonction);
        }
        if (donnees.pointCollecteId) {
            champs.push(`point_collecte_id = $${index++}`);
            valeurs.push(donnees.pointCollecteId);
        }
        if (donnees.estActif !== undefined) {
            champs.push(`est_actif = $${index++}`);
            valeurs.push(donnees.estActif);
        }
        if (donnees.derniere_connexion) {
            champs.push(`derniere_connexion = $${index++}`);
            valeurs.push(donnees.derniere_connexion);
        }
        if (donnees.mot_de_passe_hash) {
            champs.push(`mot_de_passe_hash = $${index++}`);
            valeurs.push(donnees.mot_de_passe_hash);
        }

        valeurs.push(id);
        const requete = `
            UPDATE gestionnaires_points 
            SET ${champs.join(', ')}
            WHERE id = $${index}
            RETURNING id, email, nom_complet, point_collecte_id, fonction, est_actif
        `;

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows[0];
    }

    // AJOUT POUR LES ANALYSES :

    // models/GestionnairePoint.js - Ajoutez ces nouvelles méthodes

// ✅ Statistiques complètes par point de collecte
static async statistiquesCompletes(gestionnaireId) {
    const gestionnaire = await this.trouverParId(gestionnaireId);
    
    if (!gestionnaire || !gestionnaire.point_collecte_id) {
        return {
            point_collecte: null,
            global: {
                total_missions: 0,
                missions_validees: 0,
                missions_en_attente: 0,
                poids_total_valide: 0,
                poids_moyen_par_mission: 0
            },
            par_type_dechet: [],
            evolution_hebdomadaire: []
        };
    }
    
    try {
        // Informations du point de collecte
        const pointInfo = await pool.query(`
            SELECT id, nom, adresse, commune , cree_le
            FROM points_depot_volontaire  
            WHERE id = $1
        `, [gestionnaire.point_collecte_id]);
        
        // Statistiques globales du point
        const globalStats = await pool.query(`
            SELECT 
                COUNT(*) as total_missions,
                COUNT(CASE WHEN statut = 'validee' THEN 1 END) as missions_validees,
                COUNT(CASE WHEN statut = 'deposee' THEN 1 END) as missions_en_attente,
                COALESCE(SUM(CASE WHEN statut = 'validee' THEN poids_depose ELSE 0 END), 0) as poids_total_valide,
                COALESCE(AVG(CASE WHEN statut = 'validee' THEN poids_depose END), 0) as poids_moyen
            FROM missions 
            WHERE point_depot_id = $1
        `, [gestionnaire.point_collecte_id]);
        
        // Statistiques par type de déchet
        const statsParType = await pool.query(`
            SELECT 
                d.type_dechet,
                COUNT(*) as nombre_missions,
                COUNT(CASE WHEN m.statut = 'validee' THEN 1 END) as missions_validees,
                COUNT(CASE WHEN m.statut = 'deposee' THEN 1 END) as missions_en_attente,
                COALESCE(SUM(CASE WHEN m.statut = 'validee' THEN m.poids_depose ELSE 0 END), 0) as poids_valide,
                COALESCE(AVG(CASE WHEN m.statut = 'validee' THEN m.poids_depose END), 0) as poids_moyen
            FROM missions m
            JOIN declarations_dechets d ON m.declaration_id = d.id
            WHERE m.point_depot_id = $1
            GROUP BY d.type_dechet
            ORDER BY poids_valide DESC
        `, [gestionnaire.point_collecte_id]);
        
        // Évolution hebdomadaire
        const evolution = await pool.query(`
            SELECT 
                DATE_TRUNC('week', date_validation) as semaine,
                COUNT(*) as missions_validees,
                COALESCE(SUM(poids_depose), 0) as poids_total
            FROM missions 
            WHERE point_depot_id = $1 
              AND statut = 'validee'
              AND date_validation >= NOW() - INTERVAL '8 weeks'
            GROUP BY DATE_TRUNC('week', date_validation)
            ORDER BY semaine DESC
        `, [gestionnaire.point_collecte_id]);
        
        // Top collecteurs du point
        const topCollecteurs = await pool.query(`
            SELECT 
                c.id,
                c.nom_complet,
                c.telephone,
                COUNT(m.id) as missions_validees,
                COALESCE(SUM(m.poids_depose), 0) as poids_total
            FROM missions m
            JOIN collecteurs c ON m.collecteur_id = c.id
            WHERE m.point_depot_id = $1 
              AND m.statut = 'validee'
            GROUP BY c.id, c.nom_complet, c.telephone
            ORDER BY poids_total DESC
            LIMIT 5
        `, [gestionnaire.point_collecte_id]);
        
        return {
            point_collecte: pointInfo.rows[0] || null,
            global: {
                total_missions: parseInt(globalStats.rows[0]?.total_missions) || 0,
                missions_validees: parseInt(globalStats.rows[0]?.missions_validees) || 0,
                missions_en_attente: parseInt(globalStats.rows[0]?.missions_en_attente) || 0,
                poids_total_valide: parseFloat(globalStats.rows[0]?.poids_total_valide) || 0,
                poids_moyen_par_mission: parseFloat(globalStats.rows[0]?.poids_moyen) || 0
            },
            par_type_dechet: statsParType.rows,
            evolution_hebdomadaire: evolution.rows,
            top_collecteurs: topCollecteurs.rows
        };
        
    } catch (error) {
        console.error('❌ Erreur dans statistiquesCompletes:', error);
        return {
            point_collecte: null,
            global: {
                total_missions: 0,
                missions_validees: 0,
                missions_en_attente: 0,
                poids_total_valide: 0,
                poids_moyen_par_mission: 0
            },
            par_type_dechet: [],
            evolution_hebdomadaire: [],
            top_collecteurs: []
        };
    }
}

// ✅ Statistiques détaillées par type de déchet pour un point
static async statistiquesParTypeDechet(gestionnaireId) {
    const gestionnaire = await this.trouverParId(gestionnaireId);
    
    if (!gestionnaire || !gestionnaire.point_collecte_id) {
        return [];
    }
    
    try {
        const result = await pool.query(`
            SELECT 
                d.type_dechet,
                COUNT(*) as nombre_total_missions,
                COUNT(CASE WHEN m.statut = 'validee' THEN 1 END) as missions_validees,
                COUNT(CASE WHEN m.statut = 'deposee' THEN 1 END) as missions_en_attente,
                COALESCE(SUM(CASE WHEN m.statut = 'validee' THEN m.poids_depose ELSE 0 END), 0) as poids_total_valide,
                COALESCE(SUM(d.quantite), 0) as poids_estime_initial,
                ROUND(
                    (COALESCE(SUM(CASE WHEN m.statut = 'validee' THEN m.poids_depose ELSE 0 END), 0) / 
                    NULLIF(SUM(d.quantite), 0) * 100)::numeric, 2
                ) as taux_realisation,
                MIN(m.date_validation) as premiere_validation,
                MAX(m.date_validation) as derniere_validation
            FROM missions m
            JOIN declarations_dechets d ON m.declaration_id = d.id
            WHERE m.point_depot_id = $1
            GROUP BY d.type_dechet
            ORDER BY poids_total_valide DESC
        `, [gestionnaire.point_collecte_id]);
        
        return result.rows;
        
    } catch (error) {
        console.error('❌ Erreur dans statistiquesParTypeDechet:', error);
        return [];
    }
}
// ✅ Répartition journalière des validations (VERSION CORRIGÉE)
static async repartitionJournaliere(gestionnaireId, jours = 30) {
    const gestionnaire = await this.trouverParId(gestionnaireId);
    
    if (!gestionnaire || !gestionnaire.point_collecte_id) {
        return [];
    }
    
    try {
        // D'abord, récupérer les données journalières
        const result = await pool.query(`
            SELECT 
                DATE(m.date_validation) as jour,
                d.type_dechet,
                COUNT(*) as nombre_par_type,
                SUM(m.poids_depose) as poids_par_type
            FROM missions m
            JOIN declarations_dechets d ON m.declaration_id = d.id
            WHERE m.point_depot_id = $1 
              AND m.statut = 'validee'
              AND m.date_validation >= NOW() - ($2 || ' days')::INTERVAL
            GROUP BY DATE(m.date_validation), d.type_dechet
            ORDER BY jour DESC, d.type_dechet
        `, [gestionnaire.point_collecte_id, jours]);
        
        // Regrouper par jour dans le code JavaScript
        const joursMap = new Map();
        
        for (const row of result.rows) {
            const jour = row.jour.toISOString().split('T')[0];
            
            if (!joursMap.has(jour)) {
                joursMap.set(jour, {
                    jour: row.jour,
                    nombre_validations: 0,
                    poids_total: 0,
                    collecteurs: new Set(),
                    repartition_par_type: {}
                });
            }
            
            const jourData = joursMap.get(jour);
            jourData.nombre_validations += parseInt(row.nombre_par_type);
            jourData.poids_total += parseFloat(row.poids_par_type || 0);
            jourData.repartition_par_type[row.type_dechet] = parseInt(row.nombre_par_type);
        }
        
        // Récupérer les collecteurs distincts par jour
        const collecteursResult = await pool.query(`
            SELECT 
                DATE(m.date_validation) as jour,
                COUNT(DISTINCT m.collecteur_id) as collecteurs_actifs
            FROM missions m
            WHERE m.point_depot_id = $1 
              AND m.statut = 'validee'
              AND m.date_validation >= NOW() - ($2 || ' days')::INTERVAL
            GROUP BY DATE(m.date_validation)
        `, [gestionnaire.point_collecte_id, jours]);
        
        // Combiner les données
        const collecteursMap = new Map();
        for (const row of collecteursResult.rows) {
            const jour = row.jour.toISOString().split('T')[0];
            collecteursMap.set(jour, row.collecteurs_actifs);
        }
        
        // Construire le résultat final
        const resultats = [];
        for (const [jour, data] of joursMap) {
            resultats.push({
                jour: data.jour,
                nombre_validations: data.nombre_validations,
                poids_total: data.poids_total,
                collecteurs_actifs: collecteursMap.get(jour) || 0,
                repartition_par_type: data.repartition_par_type
            });
        }
        
        // Trier par jour décroissant
        resultats.sort((a, b) => b.jour - a.jour);
        
        return resultats;
        
    } catch (error) {
        console.error('❌ Erreur dans repartitionJournaliere:', error);
        return [];
    }
}

// ✅ Mettre à jour le profil du gestionnaire (lui-même) - SANS point de collecte
static async mettreAJourProfil(id, donnees) {
    const champs = [];
    const valeurs = [];
    let index = 1;

    // Champs modifiables par le gestionnaire lui-même
    if (donnees.nomComplet) {
        champs.push(`nom_complet = $${index++}`);
        valeurs.push(donnees.nomComplet);
    }
    if (donnees.telephone) {
        champs.push(`telephone = $${index++}`);
        valeurs.push(donnees.telephone);
    }
    if (donnees.fonction) {
        champs.push(`fonction = $${index++}`);
        valeurs.push(donnees.fonction);
    }

    if (champs.length === 0) {
        return null;
    }

    valeurs.push(id);
    const requete = `
        UPDATE gestionnaires_points 
        SET ${champs.join(', ')}, modifie_le = CURRENT_TIMESTAMP
        WHERE id = $${index}
        RETURNING id, email, nom_complet, telephone, point_collecte_id, fonction
    `;

    const resultat = await pool.query(requete, valeurs);
    return resultat.rows[0];
}

// ✅ Mettre à jour TOUT le gestionnaire (pour superviseur) - AVEC point de collecte
static async mettreAJourComplet(id, donnees, superviseurId) {
    const champs = [];
    const valeurs = [];
    let index = 1;

    // Tous les champs modifiables par le superviseur
    if (donnees.nomComplet) {
        champs.push(`nom_complet = $${index++}`);
        valeurs.push(donnees.nomComplet);
    }
    if (donnees.telephone) {
        champs.push(`telephone = $${index++}`);
        valeurs.push(donnees.telephone);
    }
    if (donnees.fonction) {
        champs.push(`fonction = $${index++}`);
        valeurs.push(donnees.fonction);
    }
    if (donnees.pointCollecteId !== undefined) {
        champs.push(`point_collecte_id = $${index++}`);
        valeurs.push(donnees.pointCollecteId);
    }
    if (donnees.estActif !== undefined) {
        champs.push(`est_actif = $${index++}`);
        valeurs.push(donnees.estActif);
    }
    if (donnees.email) {
        champs.push(`email = $${index++}`);
        valeurs.push(donnees.email);
    }

    if (champs.length === 0) {
        return null;
    }

    valeurs.push(id);
    const requete = `
        UPDATE gestionnaires_points 
        SET ${champs.join(', ')}, modifie_le = CURRENT_TIMESTAMP
        WHERE id = $${index}
        RETURNING id, email, nom_complet, telephone, point_collecte_id, fonction, est_actif
    `;

    const resultat = await pool.query(requete, valeurs);
    return resultat.rows[0];
}

}

export default GestionnairePoint;