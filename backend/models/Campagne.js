
import { pool } from '../config/database.js';

class Campagne {
    // Créer une nouvelle campagne
    static async creer(donnees, createurId, createurType) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            const requete = `
                INSERT INTO campagnes (
                    nom,
                    description,
                    date_debut,
                    date_fin,
                    types_dechets,
                    zones_intervention,
                    poids_attendue,
                    prix_par_kg,
                    statut,
                    createur_id,
                    createur_type
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *
            `;

            const valeurs = [
                donnees.nom,
                donnees.description || null,
                donnees.dateDebut,
                donnees.dateFin,
                donnees.typesDechets,
                donnees.zonesIntervention || [],
                donnees.poidsAttendue,
                donnees.prixParKg,
                'planifiee',
                createurId,
                createurType
            ];

            const resultat = await client.query(requete, valeurs);
            const campagne = resultat.rows[0];

            // Ajouter le créateur comme promoteur par défaut
            await client.query(`
                INSERT INTO promoteurs_campagne (
                    campagne_id,
                    promoteur_id,
                    promoteur_type,
                    contribution_financiere,
                    date_ajout
                ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            `, [campagne.id, createurId, createurType, donnees.budgetTotal || null]);

            await client.query('COMMIT');
            return campagne;

        } catch (erreur) {
            await client.query('ROLLBACK');
            console.error('❌ Erreur création campagne:', erreur);
            throw erreur;
        } finally {
            client.release();
        }
    }

    // Ajouter un promoteur à une campagne
    static async ajouterPromoteur(campagneId, promoteurId, promoteurType, contribution) {
        const requete = `
            INSERT INTO promoteurs_campagne (
                campagne_id,
                promoteur_id,
                promoteur_type,
                contribution_financiere
            ) VALUES ($1, $2, $3, $4)
            ON CONFLICT (campagne_id, promoteur_id, promoteur_type) 
            DO UPDATE SET 
                contribution_financiere = EXCLUDED.contribution_financiere,
                date_ajout = CURRENT_TIMESTAMP
            RETURNING *
        `;

        const resultat = await pool.query(requete, [campagneId, promoteurId, promoteurType, contribution]);
        return resultat.rows[0];
    }

    // Récupérer les promoteurs d'une campagne
    static async getPromoteurs(campagneId) {
        const requete = `
            SELECT 
                pc.*,
                CASE 
                    WHEN pc.promoteur_type = 'sponsor' THEN s.nom_organisation
                    WHEN pc.promoteur_type = 'ong' THEN o.nom_ong
                    WHEN pc.promoteur_type = 'superviseur' THEN sp.nom_complet
                    WHEN pc.promoteur_type = 'admin' THEN a.nom_complet
                END as nom_promoteur,
                CASE 
                    WHEN pc.promoteur_type = 'sponsor' THEN s.email
                    WHEN pc.promoteur_type = 'ong' THEN o.email
                    WHEN pc.promoteur_type = 'superviseur' THEN sp.email
                    WHEN pc.promoteur_type = 'admin' THEN a.email
                END as email_promoteur
            FROM promoteurs_campagne pc
            LEFT JOIN sponsors s ON pc.promoteur_id = s.id AND pc.promoteur_type = 'sponsor'
            LEFT JOIN ongs o ON pc.promoteur_id = o.id AND pc.promoteur_type = 'ong'
            LEFT JOIN superviseurs sp ON pc.promoteur_id = sp.id AND pc.promoteur_type = 'superviseur'
            LEFT JOIN admins a ON pc.promoteur_id = a.id AND pc.promoteur_type = 'admin'
            WHERE pc.campagne_id = $1
        `;

        const resultat = await pool.query(requete, [campagneId]);
        return resultat.rows;
    }

    // Récupérer les campagnes d'un promoteur
    static async getCampagnesParPromoteur(promoteurId, promoteurType) {
        const requete = `
            SELECT 
                c.*,
                pc.contribution_financiere,
                pc.date_ajout as date_participation,
                COALESCE(sc.poids_collecte, 0) as poids_collecte_actuel,
                COALESCE(sc.montant_utilise, 0) as montant_utilise,
                c.poids_attendue - COALESCE(sc.poids_collecte, 0) as poids_restant,
                CASE 
                    WHEN c.date_fin < CURRENT_DATE THEN 'terminee'
                    WHEN c.date_debut > CURRENT_DATE THEN 'a_venir'
                    WHEN c.statut = 'active' THEN 'en_cours'
                    ELSE c.statut
                END as statut_calculé
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
            WHERE pc.promoteur_id = $1 AND pc.promoteur_type = $2
            ORDER BY c.date_debut DESC
        `;

        const resultat = await pool.query(requete, [promoteurId, promoteurType]);
        return resultat.rows;
    }

    static async getDetailsParPoint(campagneId) {
    const requete = `
        SELECT 
            pdv.id as point_id,
            pdv.nom as point_nom,
            pdv.commune,
            pdv.quartier,
            COALESCE(SUM(m.poids_depose), 0) as poids_collecte,
            COUNT(DISTINCT m.id) as nombre_missions,
            COUNT(DISTINCT m.collecteur_id) as collecteurs_actifs,
            MIN(m.date_validation) as premiere_collecte,
            MAX(m.date_validation) as derniere_collecte
        FROM points_depot_volontaire pdv
        LEFT JOIN missions m ON pdv.id = m.point_depot_id 
            AND m.campagne_id = $1 
            AND m.statut = 'validee'
        GROUP BY pdv.id, pdv.nom, pdv.commune, pdv.quartier
        ORDER BY poids_collecte DESC
    `;

    const resultat = await pool.query(requete, [campagneId]);
    return resultat.rows;
}

    // Mettre à jour le statut d'une campagne
    static async mettreAJourStatut(campagneId, statut) {
        const requete = `
            UPDATE campagnes 
            SET statut = $1,
                modifie_le = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;

        const resultat = await pool.query(requete, [statut, campagneId]);
        return resultat.rows[0];
    }

    static async getSuivi(campagneId) {
        const requete = `
            SELECT * FROM suivi_campagne 
            WHERE campagne_id = $1 
            ORDER BY date_suivi DESC
        `;
        const resultat = await pool.query(requete, [campagneId]);
        return resultat.rows;
    }

    // Ajouter un suivi de campagne
    static async ajouterSuivi(campagneId, donnees) {
        const requete = `
            INSERT INTO suivi_campagne (
                campagne_id,
                date_suivi,
                poids_collecte,
                montant_utilise,
                points_concernes,
                details
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const resultat = await pool.query(requete, [
            campagneId,
            donnees.dateSuivi || new Date(),
            donnees.poidsCollecte,
            donnees.montantUtilise,
            donnees.pointsConcernes || 0,
            donnees.details || {}
        ]);

        return resultat.rows[0];
    }


static async getStatistiques(campagneId) {
    const requete = `
        WITH stats AS (
            SELECT 
                c.id,
                c.nom,
                c.description,
                c.date_debut,
                c.date_fin,
                c.poids_attendue,
                c.prix_par_kg,
                c.statut,
                COALESCE(SUM(s.poids_collecte), 0) as poids_total_collecte,
                COALESCE(SUM(s.montant_utilise), 0) as montant_total_utilise,
                COUNT(DISTINCT m.point_depot_id) as points_couverts,
                COUNT(DISTINCT m.id) as missions_realisees,
                c.poids_attendue - COALESCE(SUM(s.poids_collecte), 0) as poids_restant,
                CASE 
                    WHEN COALESCE(SUM(s.poids_collecte), 0) >= c.poids_attendue THEN 100
                    ELSE ROUND((COALESCE(SUM(s.poids_collecte), 0) / c.poids_attendue * 100)::numeric, 2)
                END as pourcentage_realisation
            FROM campagnes c
            LEFT JOIN missions m ON m.campagne_id = c.id AND m.statut = 'validee'
            LEFT JOIN suivi_campagne s ON c.id = s.campagne_id
            WHERE c.id = $1
            GROUP BY c.id
        )
        SELECT * FROM stats
    `;

    const resultat = await pool.query(requete, [campagneId]);
    return resultat.rows[0];
}

// models/Campagne.js - Ajouter cette méthode
static async trouverParOng(ongId, filtres = {}) {
    let query = `
        SELECT 
            c.*,
            COALESCE(
                (SELECT json_agg(
                    json_build_object(
                        'type_dechet', co.type_dechet,
                        'poids_attendue', co.poids_attendue,
                        'poids_collecte_actuel', co.poids_collecte_actuel,
                        'prix_par_kg', co.prix_par_kg
                    )
                ) FROM campagne_objectifs co WHERE co.campagne_id = c.id
            ), '[]'::json) as objectifs,
            COALESCE(c.types_dechets, '[]'::json) as types_dechets,
            COALESCE(c.zones_intervention, '[]'::json) as zones_intervention,
            c.poids_attendue,
            COALESCE(sc.poids_collecte, 0) as poids_collecte_actuel
        FROM campagnes c
        LEFT JOIN (
            SELECT 
                campagne_id,
                SUM(poids_collecte) as poids_collecte
            FROM suivi_campagne
            GROUP BY campagne_id
        ) sc ON c.id = sc.campagne_id
        WHERE c.ong_id = $1
    `;
    
    const params = [ongId];
    let paramIndex = 2;
    
    if (filtres.statut) {
        query += ` AND c.statut = $${paramIndex}`;
        params.push(filtres.statut);
        paramIndex++;
    }
    
    if (filtres.typeDechet) {
        query += ` AND $${paramIndex} = ANY(c.types_dechets)`;
        params.push(filtres.typeDechet);
        paramIndex++;
    }
    
    query += ` ORDER BY c.created_at DESC`;
    
    const result = await pool.query(query, params);
    return result.rows;
}

// campagne par ONGS
static async trouverParIdEtOng(campagneId, ongId) {
    const query = `
        SELECT 
            c.*,
            COALESCE(
                (SELECT json_agg(
                    json_build_object(
                        'type_dechet', co.type_dechet,
                        'poids_attendue', co.poids_attendue,
                        'poids_collecte_actuel', co.poids_collecte_actuel,
                        'prix_par_kg', co.prix_par_kg
                    )
                ) FROM campagne_objectifs co WHERE co.campagne_id = c.id
            ), '[]'::json) as objectifs,
            COALESCE(
                (SELECT json_agg(
                    json_build_object(
                        'point_id', pd.id,
                        'point_nom', pd.nom,
                        'commune', pd.commune,
                        'quartier', pd.quartier,
                        'adresse', pd.adresse,
                        'poids_collecte', COALESCE(
                            (SELECT SUM(poids_collecte) 
                             FROM suivi_campagne 
                             WHERE campagne_id = c.id AND point_depot_id = pd.id), 0
                        ),
                        'nombre_missions', COALESCE(
                            (SELECT COUNT(*) 
                             FROM missions 
                             WHERE campagne_id = c.id AND point_depot_id = pd.id AND statut = 'validee'), 0
                        )
                    )
                ) FROM points_depot pd WHERE pd.campagne_id = c.id
            ), '[]'::json) as points_couverts,
            COALESCE(c.types_dechets, '[]'::json) as types_dechets,
            COALESCE(c.zones_intervention, '[]'::json) as zones_intervention
        FROM campagnes c
        WHERE c.id = $1 AND c.ong_id = $2
    `;
    
    const result = await pool.query(query, [campagneId, ongId]);
    return result.rows[0];
}

// Si vous voulez aussi récupérer les objectifs dans les statistiques
static async getStatistiquesCompletes(campagneId) {
    const client = await pool.connect();
    
    try {
        const statistiques = await this.getStatistiques(campagneId);
        const objectifs = await this.getObjectifs(campagneId);
        
        return {
            ...statistiques,
            objectifs
        };
    } finally {
        client.release();
    }
}


static async getEtatCampagnes(promoteurId = null, promoteurType = null) {
    let requete = `
        SELECT 
            c.*,
            COALESCE(SUM(s.poids_collecte), 0) as poids_total_collecte,
            COALESCE(SUM(s.montant_utilise), 0) as montant_total_utilise,
            COUNT(DISTINCT s.point_depot_id) as points_couverts,
            c.poids_attendue - COALESCE(SUM(s.poids_collecte), 0) as poids_restant,
            CASE 
                WHEN COALESCE(SUM(s.poids_collecte), 0) >= c.poids_attendue THEN 100
                ELSE ROUND((COALESCE(SUM(s.poids_collecte), 0) / c.poids_attendue * 100)::numeric, 2)
            END as pourcentage_realisation,
            CASE
                WHEN c.date_fin < CURRENT_DATE THEN 'terminee'
                WHEN c.date_debut > CURRENT_DATE THEN 'a_venir'
                WHEN COALESCE(SUM(s.poids_collecte), 0) >= c.poids_attendue THEN 'terminee'
                ELSE c.statut
            END as statut_reel
        FROM campagnes c
        LEFT JOIN suivi_campagne s ON c.id = s.campagne_id
    `;
    
    const valeurs = [];
    let index = 1;
    
    if (promoteurId && promoteurType) {
        requete = `
            SELECT 
                c.*,
                pc.contribution_financiere,
                COALESCE(SUM(s.poids_collecte), 0) as poids_total_collecte,
                COALESCE(SUM(s.montant_utilise), 0) as montant_total_utilise,
                COUNT(DISTINCT s.point_depot_id) as points_couverts,
                c.poids_attendue - COALESCE(SUM(s.poids_collecte), 0) as poids_restant,
                CASE 
                    WHEN COALESCE(SUM(s.poids_collecte), 0) >= c.poids_attendue THEN 100
                    ELSE ROUND((COALESCE(SUM(s.poids_collecte), 0) / c.poids_attendue * 100)::numeric, 2)
                END as pourcentage_realisation
            FROM campagnes c
            JOIN promoteurs_campagne pc ON c.id = pc.campagne_id
            LEFT JOIN suivi_campagne s ON c.id = s.campagne_id
            WHERE pc.promoteur_id = $1 AND pc.promoteur_type = $2
            GROUP BY c.id, pc.contribution_financiere
        `;
        valeurs.push(promoteurId, promoteurType);
        index = 3;
    } else {
        requete += ` GROUP BY c.id`;
    }
    
    requete += ` ORDER BY c.date_debut DESC`;
    
    const resultat = await pool.query(requete, valeurs);
    return resultat.rows;
}
static async getEvolutionJournaliere(campagneId) {
        const requete = `
            SELECT 
                DATE(m.date_validation) as jour,
                COUNT(*) as nombre_missions,
                COALESCE(SUM(m.poids_depose), 0) as poids_total,
                COALESCE(SUM(m.gains_attribues), 0) as gains_total,
                COUNT(DISTINCT m.point_depot_id) as points_actifs
            FROM missions m
            WHERE m.campagne_id = $1 AND m.statut = 'validee'
            GROUP BY DATE(m.date_validation)
            ORDER BY jour DESC
        `;

        const resultat = await pool.query(requete, [campagneId]);
        return resultat.rows;
    }

    // Rechercher des campagnes (pour admin/superviseur)
    static async rechercher(filtres = {}) {
        let requete = `
            SELECT 
                c.*,
                COUNT(DISTINCT pc.id) as nombre_promoteurs,
                COALESCE(sc.poids_collecte, 0) as poids_collecte_actuel,
                c.poids_attendue - COALESCE(sc.poids_collecte, 0) as poids_restant
            FROM campagnes c
            LEFT JOIN promoteurs_campagne pc ON c.id = pc.campagne_id
            LEFT JOIN (
                SELECT 
                    campagne_id,
                    SUM(poids_collecte) as poids_collecte
                FROM suivi_campagne
                GROUP BY campagne_id
            ) sc ON c.id = sc.campagne_id
            WHERE 1=1
        `;

        const valeurs = [];
        let index = 1;

        if (filtres.statut) {
            requete += ` AND c.statut = $${index}`;
            valeurs.push(filtres.statut);
            index++;
        }

        if (filtres.typeDechet) {
            requete += ` AND $${index} = ANY(c.types_dechets)`;
            valeurs.push(filtres.typeDechet);
            index++;
        }

        if (filtres.dateDebut) {
            requete += ` AND c.date_debut >= $${index}`;
            valeurs.push(filtres.dateDebut);
            index++;
        }

        if (filtres.dateFin) {
            requete += ` AND c.date_fin <= $${index}`;
            valeurs.push(filtres.dateFin);
            index++;
        }

        if (filtres.zone) {
            requete += ` AND $${index} = ANY(c.zones_intervention)`;
            valeurs.push(filtres.zone);
            index++;
        }

        requete += ` GROUP BY c.id, sc.poids_collecte ORDER BY c.date_debut DESC`;

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows;
    }


static async trouverParId(id) {
    const client = await pool.connect();
    
    try {
        // Récupérer les informations de base de la campagne
        const campagneResult = await client.query(`
            SELECT 
                c.*,
                COALESCE(sc.poids_collecte, 0) as poids_collecte_actuel,
                COALESCE(sc.montant_utilise, 0) as montant_utilise
            FROM campagnes c
            LEFT JOIN (
                SELECT 
                    campagne_id,
                    SUM(poids_collecte) as poids_collecte,
                    SUM(montant_utilise) as montant_utilise
                FROM suivi_campagne
                GROUP BY campagne_id
            ) sc ON c.id = sc.campagne_id
            WHERE c.id = $1
        `, [id]);

        if (campagneResult.rows.length === 0) {
            return null;
        }

        const campagne = campagneResult.rows[0];

        // Récupérer les objectifs
        const objectifsResult = await client.query(`
            SELECT 
                id,
                type_dechet,
                poids_attendue,
                prix_par_kg,
                poids_collecte_actuel
            FROM campagne_objectifs
            WHERE campagne_id = $1
            ORDER BY type_dechet
        `, [id]);

        // Récupérer les promoteurs
        const promoteursResult = await client.query(`
            SELECT 
                pc.*,
                CASE 
                    WHEN pc.promoteur_type = 'sponsor' THEN s.nom_organisation
                    WHEN pc.promoteur_type = 'ong' THEN o.nom_ong
                    WHEN pc.promoteur_type = 'superviseur' THEN sp.nom_complet
                    WHEN pc.promoteur_type = 'admin' THEN a.nom_complet
                END as nom_promoteur,
                CASE 
                    WHEN pc.promoteur_type = 'sponsor' THEN s.email
                    WHEN pc.promoteur_type = 'ong' THEN o.email
                    WHEN pc.promoteur_type = 'superviseur' THEN sp.email
                    WHEN pc.promoteur_type = 'admin' THEN a.email
                END as email_promoteur
            FROM promoteurs_campagne pc
            LEFT JOIN sponsors s ON pc.promoteur_id = s.id AND pc.promoteur_type = 'sponsor'
            LEFT JOIN ongs o ON pc.promoteur_id = o.id AND pc.promoteur_type = 'ong'
            LEFT JOIN superviseurs sp ON pc.promoteur_id = sp.id AND pc.promoteur_type = 'superviseur'
            LEFT JOIN admins a ON pc.promoteur_id = a.id AND pc.promoteur_type = 'admin'
            WHERE pc.campagne_id = $1
        `, [id]);

        return {
            ...campagne,
            objectifs: objectifsResult.rows,
            promoteurs: promoteursResult.rows
        };

    } catch (erreur) {
        console.error('❌ Erreur dans trouverParId:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}

    // Mettre à jour une campagne
    static async mettreAJour(id, donnees) {
        const champs = [];
        const valeurs = [];
        let index = 1;

        const champsModifiables = {
            nom: 'nom',
            description: 'description',
            date_debut: 'dateDebut',
            date_fin: 'dateFin',
            types_dechets: 'typesDechets',
            zones_intervention: 'zonesIntervention',
            poids_attendue: 'poidsAttendue',
            prix_par_kg: 'prixParKg',
            statut: 'statut'
        };

        for (const [dbField, dataField] of Object.entries(champsModifiables)) {
            if (donnees[dataField] !== undefined) {
                champs.push(`${dbField} = $${index}`);
                valeurs.push(donnees[dataField]);
                index++;
            }
        }

        if (champs.length === 0) return null;

        valeurs.push(id);
        const requete = `
            UPDATE campagnes 
            SET ${champs.join(', ')}, modifie_le = CURRENT_TIMESTAMP
            WHERE id = $${index}
            RETURNING *
        `;

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows[0];
    }


// Récupérer les campagnes actives pour un point et type de déchet
static async getCampagnesActivesPourPoint(pointDepotId, typeDechet) {
    const requete = `
        SELECT 
            c.id,
            c.nom,
            c.description,
            c.date_debut,
            c.date_fin,
            c.types_dechets,
            c.poids_attendue,
            c.prix_par_kg,
            c.budget_total,
            COALESCE(SUM(s.poids_collecte), 0) as poids_collecte_actuel,
            c.poids_attendue - COALESCE(SUM(s.poids_collecte), 0) as poids_restant,
            CASE 
                WHEN COALESCE(SUM(s.poids_collecte), 0) >= c.poids_attendue THEN 100
                ELSE ROUND((COALESCE(SUM(s.poids_collecte), 0) / c.poids_attendue * 100)::numeric, 2)
            END as pourcentage_realisation
        FROM campagnes c
        LEFT JOIN suivi_campagne s ON c.id = s.campagne_id
        WHERE c.statut = 'active'
          AND c.date_debut <= CURRENT_DATE
          AND c.date_fin >= CURRENT_DATE
          AND $1 = ANY(c.types_dechets)
        GROUP BY c.id
        HAVING COALESCE(SUM(s.poids_collecte), 0) < c.poids_attendue
        ORDER BY c.date_fin ASC
    `;

    const resultat = await pool.query(requete, [typeDechet]);
    return resultat.rows;
}

static async mettreAJourDepuisMission(campagneId, missionId, pointDepotId, typeDechet, poids, montant) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Vérifier que la campagne accepte ce type de déchet
        const campagneCheck = await client.query(`
            SELECT * FROM campagnes 
            WHERE id = $1 AND $2 = ANY(types_dechets)
        `, [campagneId, typeDechet]);

        if (campagneCheck.rows.length === 0) {
            throw new Error('Cette campagne n\'accepte pas ce type de déchet');
        }

        // Ajouter ou mettre à jour le suivi pour aujourd'hui
        await client.query(`
            INSERT INTO suivi_campagne (
                campagne_id,
                date_suivi,
                poids_collecte,
                montant_utilise,
                points_concernes,
                details
            ) VALUES ($1, CURRENT_DATE, $2, $3, 1, $4)
            ON CONFLICT (campagne_id, date_suivi) 
            DO UPDATE SET 
                poids_collecte = suivi_campagne.poids_collecte + $2,
                montant_utilise = suivi_campagne.montant_utilise + $3,
                points_concernes = suivi_campagne.points_concernes + 1,
                details = suivi_campagne.details || $4
        `, [
            campagneId,
            poids,
            montant,
            JSON.stringify({
                mission_id: missionId,
                point_depot_id: pointDepotId,
                type_dechet: typeDechet,
                date: new Date().toISOString()
            })
        ]);

        // Vérifier si l'objectif est atteint
        const stats = await client.query(`
            SELECT 
                c.poids_attendue,
                COALESCE(SUM(s.poids_collecte), 0) as total_collecte
            FROM campagnes c
            LEFT JOIN suivi_campagne s ON c.id = s.campagne_id
            WHERE c.id = $1
            GROUP BY c.id, c.poids_attendue
        `, [campagneId]);

        if (stats.rows.length > 0) {
            const { poids_attendue, total_collecte } = stats.rows[0];
            
            // Si l'objectif est atteint ou dépassé, marquer la campagne comme terminée
            if (parseFloat(total_collecte) >= parseFloat(poids_attendue)) {
                await client.query(`
                    UPDATE campagnes 
                    SET statut = 'terminee',
                        modifie_le = CURRENT_TIMESTAMP
                    WHERE id = $1
                `, [campagneId]);
            }
        }

        await client.query('COMMIT');
        
        return { campagneId, poids, total_actuel: poids };

    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur mettreAJourDepuisMission:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}

// Créer une campagne avec objectifs multiples
static async creerAvecObjectifs(donnees, createurId, createurType) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // 1. Créer la campagne principale
        const requeteCampagne = `
            INSERT INTO campagnes (
                nom,
                description,
                date_debut,
                date_fin,
                zones_intervention,
                statut,
                createur_id,
                createur_type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const resultatCampagne = await client.query(requeteCampagne, [
            donnees.nom,
            donnees.description || null,
            donnees.dateDebut,
            donnees.dateFin,
            donnees.zonesIntervention || [],
            'planifiee',
            createurId,
            createurType
        ]);
        
        const campagne = resultatCampagne.rows[0];

        // 2. Ajouter les objectifs pour chaque type de déchet
        let poidsTotal = 0;
        for (const objectif of donnees.objectifs) {
            await client.query(`
                INSERT INTO campagne_objectifs (
                    campagne_id,
                    type_dechet,
                    poids_attendue,
                    prix_par_kg
                ) VALUES ($1, $2, $3, $4)
            `, [campagne.id, objectif.typeDechet, objectif.poidsAttendue, objectif.prixParKg]);
            
            poidsTotal += parseFloat(objectif.poidsAttendue);
        }

        // 3. Mettre à jour le poids total dans la campagne
        await client.query(`
            UPDATE campagnes 
            SET poids_attendue = $1
            WHERE id = $2
        `, [poidsTotal, campagne.id]);

        // 4. Ajouter le créateur comme promoteur par défaut
        await client.query(`
            INSERT INTO promoteurs_campagne (
                campagne_id,
                promoteur_id,
                promoteur_type,
                contribution_financiere,
                date_ajout
            ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        `, [campagne.id, createurId, createurType, donnees.budgetTotal || null]);

        await client.query('COMMIT');
        
        // Recharger la campagne avec ses objectifs
        return await this.trouverParId(campagne.id);

    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur création campagne:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}

// Récupérer les objectifs d'une campagne
static async getObjectifs(campagneId) {
    const requete = `
        SELECT 
            id,
            type_dechet,
            poids_attendue,
            prix_par_kg,
            poids_collecte_actuel,
            (poids_attendue - poids_collecte_actuel) as poids_restant,
            CASE 
                WHEN poids_attendue > 0 THEN 
                    ROUND((poids_collecte_actuel / poids_attendue * 100)::numeric, 2)
                ELSE 0
            END as pourcentage_realisation
        FROM campagne_objectifs
        WHERE campagne_id = $1
        ORDER BY type_dechet
    `;

    const resultat = await pool.query(requete, [campagneId]);
    return resultat.rows;
}

// Mettre à jour un objectif après une collecte
static async mettreAJourObjectif(campagneId, typeDechet, poids, montant) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Mettre à jour le poids collecté pour ce type
        await client.query(`
            UPDATE campagne_objectifs 
            SET poids_collecte_actuel = poids_collecte_actuel + $1,
                modifie_le = CURRENT_TIMESTAMP
            WHERE campagne_id = $2 AND type_dechet = $3
            RETURNING *
        `, [poids, campagneId, typeDechet]);

        // Ajouter dans suivi_campagne pour l'historique global
        await client.query(`
            INSERT INTO suivi_campagne (
                campagne_id,
                date_suivi,
                poids_collecte,
                montant_utilise,
                points_concernes,
                details
            ) VALUES ($1, CURRENT_DATE, $2, $3, 1, $4)
            ON CONFLICT (campagne_id, date_suivi) 
            DO UPDATE SET 
                poids_collecte = suivi_campagne.poids_collecte + $2,
                montant_utilise = suivi_campagne.montant_utilise + $3,
                points_concernes = suivi_campagne.points_concernes + 1,
                details = suivi_campagne.details || $4
        `, [
            campagneId,
            poids,
            montant,
            JSON.stringify({
                type_dechet: typeDechet,
                date: new Date().toISOString()
            })
        ]);

        // Vérifier si tous les objectifs sont atteints
        const objectifsRestants = await client.query(`
            SELECT COUNT(*) as reste
            FROM campagne_objectifs
            WHERE campagne_id = $1 
              AND poids_collecte_actuel < poids_attendue
        `, [campagneId]);

        if (parseInt(objectifsRestants.rows[0].reste) === 0) {
            await client.query(`
                UPDATE campagnes 
                SET statut = 'terminee',
                    modifie_le = CURRENT_TIMESTAMP
                WHERE id = $1
            `, [campagneId]);
        }

        await client.query('COMMIT');
        
        return { campagneId, typeDechet, poids };

    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur mettreAJourObjectif:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}


static async trouverParId(id) {
    const requete = `
        SELECT 
            c.*,
            COALESCE(json_agg(DISTINCT jsonb_build_object(
                'id', o.id,
                'type_dechet', o.type_dechet,
                'poids_attendue', o.poids_attendue,
                'prix_par_kg', o.prix_par_kg,
                'poids_collecte_actuel', o.poids_collecte_actuel
            )) FILTER (WHERE o.id IS NOT NULL), '[]') as objectifs,
            json_agg(DISTINCT jsonb_build_object(
                'id', pc.id,
                'promoteur_id', pc.promoteur_id,
                'promoteur_type', pc.promoteur_type,
                'contribution', pc.contribution_financiere,
                'date_ajout', pc.date_ajout
            )) FILTER (WHERE pc.id IS NOT NULL) as promoteurs,
            COALESCE(sc.poids_collecte, 0) as poids_collecte_actuel,
            COALESCE(sc.montant_utilise, 0) as montant_utilise
        FROM campagnes c
        LEFT JOIN campagne_objectifs o ON c.id = o.campagne_id
        LEFT JOIN promoteurs_campagne pc ON c.id = pc.campagne_id
        LEFT JOIN (
            SELECT 
                campagne_id,
                SUM(poids_collecte) as poids_collecte,
                SUM(montant_utilise) as montant_utilise
            FROM suivi_campagne
            GROUP BY campagne_id
        ) sc ON c.id = sc.campagne_id
        WHERE c.id = $1
        GROUP BY c.id, sc.poids_collecte, sc.montant_utilise
    `;

    const resultat = await pool.query(requete, [id]);
    return resultat.rows[0];
}

static async getRapportComplet(campagneId) {
    const client = await pool.connect();
    
    try {
        // Récupérer toutes les données en parallèle
        const [
            campagne,
            promoteurs,
            statistiques,
            pointsCollecte,
            evolutionJournaliere,
            suivi,
            objectifs
        ] = await Promise.all([
            this.trouverParId(campagneId),
            this.getPromoteurs(campagneId),
            this.getStatistiques(campagneId),
            this.getDetailsParPoint(campagneId),
            this.getEvolutionJournaliere(campagneId),
            this.getSuivi(campagneId),
            this.getObjectifs(campagneId)
        ]);

        // Calculer des indicateurs supplémentaires
        const tauxRealisation = statistiques?.poids_total_collecte && statistiques?.poids_attendue
            ? (statistiques.poids_total_collecte / statistiques.poids_attendue * 100).toFixed(2)
            : 0;

        const joursRestants = campagne?.date_fin
            ? Math.max(0, Math.ceil((new Date(campagne.date_fin) - new Date()) / (1000 * 60 * 60 * 24)))
            : 0;

        const rapport = {
            campagne: {
                id: campagne.id,
                nom: campagne.nom,
                description: campagne.description,
                date_debut: campagne.date_debut,
                date_fin: campagne.date_fin,
                statut: campagne.statut,
                poids_attendue: parseFloat(campagne.poids_attendue || 0),
                prix_par_kg: parseFloat(campagne.prix_par_kg || 0),
                budget_total: parseFloat(campagne.budget_total || 0),
                zones_intervention: campagne.zones_intervention || [],
                types_dechets: campagne.types_dechets || []
            },
            objectifs: objectifs.map(obj => ({
                type_dechet: obj.type_dechet,
                poids_attendue: parseFloat(obj.poids_attendue),
                poids_collecte: parseFloat(obj.poids_collecte_actuel || 0),
                pourcentage: obj.pourcentage_realisation,
                prix_par_kg: parseFloat(obj.prix_par_kg)
            })),
            statistiques: {
                poids_total_collecte: parseFloat(statistiques?.poids_total_collecte || 0),
                montant_total_utilise: parseFloat(statistiques?.montant_total_utilise || 0),
                points_couverts: parseInt(statistiques?.points_couverts || 0),
                missions_realisees: parseInt(statistiques?.missions_realisees || 0),
                poids_restant: parseFloat(statistiques?.poids_restant || 0),
                pourcentage_realisation: parseFloat(tauxRealisation),
                jours_restants: joursRestants
            },
            points_collecte: pointsCollecte.map(point => ({
                id: point.point_id,
                nom: point.point_nom,
                commune: point.commune,
                quartier: point.quartier,
                poids_collecte: parseFloat(point.poids_collecte || 0),
                nombre_missions: parseInt(point.nombre_missions || 0),
                collecteurs_actifs: parseInt(point.collecteurs_actifs || 0),
                premiere_collecte: point.premiere_collecte,
                derniere_collecte: point.derniere_collecte
            })),
            evolution_journaliere: evolutionJournaliere.map(jour => ({
                date: jour.jour,
                poids: parseFloat(jour.poids_total || 0),
                missions: parseInt(jour.nombre_missions || 0),
                gains: parseFloat(jour.gains_total || 0),
                points_actifs: parseInt(jour.points_actifs || 0)
            })),
            suivi: suivi.map(s => ({
                date: s.date_suivi,
                poids_collecte: parseFloat(s.poids_collecte || 0),
                montant_utilise: parseFloat(s.montant_utilise || 0),
                points_concernes: parseInt(s.points_concernes || 0),
                details: s.details
            })),
            promoteurs: promoteurs.map(p => ({
                id: p.id,
                type: p.promoteur_type,
                nom: p.nom_promoteur,
                email: p.email_promoteur,
                contribution: parseFloat(p.contribution_financiere || 0),
                date_ajout: p.date_ajout
            })),
            date_generation: new Date().toISOString()
        };

        return rapport;

    } catch (erreur) {
        console.error('❌ Erreur dans getRapportComplet:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}

static async retirerPromoteur(campagneId, promoteurId, promoteurType) {
    const requete = `
        DELETE FROM promoteurs_campagne
        WHERE campagne_id = $1 AND promoteur_id = $2 AND promoteur_type = $3
        RETURNING *
    `;
    const resultat = await pool.query(requete, [campagneId, promoteurId, promoteurType]);
    return resultat.rows[0];
}

static async lister(filtres = {}) {
    return await this.rechercher(filtres);
}

}

export default Campagne;