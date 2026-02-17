
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

    // ✅ Valider une mission et attribuer les gains automatiquement
    // static async validerMission(missionId, gestionnaireId, donnees) {
    //     const client = await pool.connect();
        
    //     try {
    //         await client.query('BEGIN');

    //         // Vérifier que la mission existe et est en attente
    //         const verification = await client.query(`
    //             SELECT m.*, m.collecteur_id 
    //             FROM missions m
    //             JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
    //             JOIN gestionnaires_points g ON g.point_collecte_id = pdv.id
    //             WHERE m.id = $1 AND g.id = $2 AND m.statut = 'deposee'
    //         `, [missionId, gestionnaireId]);

    //         if (verification.rows.length === 0) {
    //             throw new Error('Mission non trouvée ou déjà validée');
    //         }

    //         const mission = verification.rows[0];
    //         const poidsDepose = parseFloat(donnees.poidsDepose);
            
    //         // Calcul automatique des gains (100 FCFA par kg)
    //         const gainsAttribues = poidsDepose * 100;
    //         const pointsAttribues = Math.ceil(poidsDepose * 10); // 10 points par kg

    //         // Mettre à jour la mission
    //         const requeteMission = `
    //             UPDATE missions 
    //             SET statut = 'validee',
    //                 date_validation = CURRENT_TIMESTAMP,
    //                 poids_depose = $1::numeric,
    //                 qualite_dechets = $2,
    //                 validation_notes = $3,
    //                 valide_par = $4,
    //                 points_attribues = $5::integer,
    //                 gains_attribues = $6::numeric
    //             WHERE id = $7
    //             RETURNING *
    //         `;
            
    //         const resultatMission = await client.query(requeteMission, [
    //             poidsDepose,
    //             donnees.qualiteDechets || 'conforme',
    //             donnees.validationNotes || null,
    //             gestionnaireId,
    //             pointsAttribues,
    //             gainsAttribues,
    //             missionId
    //         ]);
            
    //         const missionMaj = resultatMission.rows[0];

    //         // Créer l'entrée dans gains_collecteurs (gain automatique)
    //         if (mission.collecteur_id) {
    //             const requeteGain = `
    //                 INSERT INTO gains_collecteurs (
    //                     collecteur_id, 
    //                     mission_id, 
    //                     montant, 
    //                     type_gain, 
    //                     statut,
    //                     date_validation
    //                 ) VALUES ($1, $2, $3, 'collecte', 'valide', CURRENT_TIMESTAMP)
    //                 RETURNING *
    //             `;
                
    //             const resultatGain = await client.query(requeteGain, [
    //                 mission.collecteur_id,
    //                 missionId,
    //                 gainsAttribues
    //             ]);

    //             // Mettre à jour le total des gains du collecteur
    //             await client.query(`
    //                 UPDATE collecteurs 
    //                 SET gains_total = gains_total + $1,
    //                     points_total = points_total + $2
    //                 WHERE id = $3
    //             `, [gainsAttribues, pointsAttribues, mission.collecteur_id]);

    //             // Notification au collecteur
    //             await client.query(`
    //                 INSERT INTO notifications (
    //                     utilisateur_id, 
    //                     type_utilisateur, 
    //                     titre, 
    //                     message, 
    //                     type_notification,
    //                     reference_id,
    //                     reference_type
    //                 ) VALUES ($1, 'collecteur', $2, $3, 'validation_collecte', $4, 'gain')
    //             `, [
    //                 mission.collecteur_id,
    //                 'Mission validée',
    //                 `Votre mission a été validée. Vous avez gagné ${gainsAttribues} FCFA et ${pointsAttribues} points.`,
    //                 resultatGain.rows[0].id
    //             ]);
    //         }

    //         await client.query('COMMIT');
            
    //         // Retourner la mission avec tous ses détails
    //         return await this.missionDetails(missionId, gestionnaireId);
            
    //     } catch (erreur) {
    //         await client.query('ROLLBACK');
    //         console.error('❌ Erreur validation mission:', erreur);
    //         throw erreur;
    //     } finally {
    //         client.release();
    //     }
    // }

    // ✅ Valider une mission (version simplifiée sans point_depot_id)
static async validerMission(missionId, gestionnaireId, donnees) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Vérifier que la mission existe et est en attente (sans la jointure sur point_depot)
        const verification = await client.query(`
            SELECT m.*, m.collecteur_id 
            FROM missions m
            WHERE m.id = $1 AND m.statut = 'deposee'
        `, [missionId]);

        if (verification.rows.length === 0) {
            throw new Error('Mission non trouvée ou déjà validée');
        }

        const mission = verification.rows[0];
        const poidsDepose = parseFloat(donnees.poidsDepose);
        
        // Calcul automatique des gains (100 FCFA par kg)
        const gainsAttribues = poidsDepose * 100;
        const pointsAttribues = Math.ceil(poidsDepose * 10);

        // Mettre à jour la mission
        const requeteMission = `
            UPDATE missions 
            SET statut = 'validee',
                date_validation = CURRENT_TIMESTAMP,
                poids_depose = $1::numeric,
                qualite_dechets = $2,
                validation_notes = $3,
                valide_par = $4,
                points_attribues = $5::integer,
                gains_attribues = $6::numeric
            WHERE id = $7
            RETURNING *
        `;
        
        const resultatMission = await client.query(requeteMission, [
            poidsDepose,
            donnees.qualiteDechets || 'conforme',
            donnees.validationNotes || null,
            gestionnaireId,
            pointsAttribues,
            gainsAttribues,
            missionId
        ]);
        
        const missionMaj = resultatMission.rows[0];

        // Créer l'entrée dans gains_collecteurs
        if (mission.collecteur_id) {
            const requeteGain = `
                INSERT INTO gains_collecteurs (
                    collecteur_id, 
                    mission_id, 
                    montant, 
                    type_gain, 
                    statut,
                    date_validation
                ) VALUES ($1, $2, $3, 'collecte', 'valide', CURRENT_TIMESTAMP)
                RETURNING *
            `;
            
            const resultatGain = await client.query(requeteGain, [
                mission.collecteur_id,
                missionId,
                gainsAttribues
            ]);

            // Mettre à jour le total des gains du collecteur
            await client.query(`
                UPDATE collecteurs 
                SET gains_total = gains_total + $1,
                    points_total = points_total + $2
                WHERE id = $3
            `, [gainsAttribues, pointsAttribues, mission.collecteur_id]);

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
                ) VALUES ($1, 'collecteur', $2, $3, 'validation_collecte', $4, 'gain')
            `, [
                mission.collecteur_id,
                'Mission validée',
                `Votre mission a été validée. Vous avez gagné ${gainsAttribues} FCFA et ${pointsAttribues} points.`,
                resultatGain.rows[0].id
            ]);
        }

        await client.query('COMMIT');
        
        return missionMaj;
        
    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur validation mission:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}

    // ✅ Attribuer des crédits supplémentaires (bonus)
    static async attribuerCredits(collecteurId, missionId, montant, gestionnaireId) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Vérifier que la mission a été validée par ce gestionnaire
            const verification = await client.query(`
                SELECT m.* FROM missions m
                JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
                JOIN gestionnaires_points g ON g.point_collecte_id = pdv.id
                WHERE m.id = $1 
                  AND m.valide_par = $2 
                  AND m.statut = 'validee'
                  AND g.id = $3
            `, [missionId, gestionnaireId, gestionnaireId]);

            if (verification.rows.length === 0) {
                throw new Error('Mission non trouvée ou non validée par vous');
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
                SET gains_total = gains_total + $1
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
                `Vous avez reçu un bonus de ${montant} FCFA pour la mission #${missionId.substring(0,8)}.`,
                resultatGain.rows[0].id
            ]);

            await client.query('COMMIT');
            return resultatGain.rows[0];
            
        } catch (erreur) {
            await client.query('ROLLBACK');
            throw erreur;
        } finally {
            client.release();
        }
    }

    // ✅ Tableau de bord complet avec historique
    static async tableauBord(gestionnaireId) {
        const requete = `
            WITH stats AS (
                SELECT 
                    COUNT(*) FILTER (WHERE m.statut = 'deposee') as en_attente,
                    COUNT(*) FILTER (WHERE m.statut = 'validee') as validees,
                    COUNT(*) FILTER (WHERE m.date_validation >= CURRENT_DATE) as aujourd_hui,
                    COALESCE(SUM(m.poids_depose) FILTER (WHERE m.statut = 'validee'), 0) as poids_total,
                    COALESCE(SUM(m.gains_attribues) FILTER (WHERE m.statut = 'validee'), 0) as gains_distribues,
                    COALESCE(AVG(m.poids_depose) FILTER (WHERE m.statut = 'validee'), 0) as poids_moyen
                FROM missions m
                JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
                JOIN gestionnaires_points g ON g.point_collecte_id = pdv.id
                WHERE g.id = $1
            ),
            dernieres_activites AS (
                SELECT 
                    m.id,
                    m.statut,
                    m.date_validation,
                    m.poids_depose,
                    m.gains_attribues,
                    c.nom_complet as collecteur_nom,
                    d.type_dechet,
                    gc.montant as bonus_attribue
                FROM missions m
                JOIN declarations_dechets d ON m.declaration_id = d.id
                JOIN collecteurs c ON m.collecteur_id = c.id
                LEFT JOIN gains_collecteurs gc ON m.id = gc.mission_id AND gc.type_gain = 'bonus'
                JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
                JOIN gestionnaires_points g ON g.point_collecte_id = pdv.id
                WHERE g.id = $1 AND m.statut = 'validee'
                ORDER BY m.date_validation DESC
                LIMIT 20
            ),
            top_collecteurs AS (
                SELECT 
                    c.id,
                    c.nom_complet,
                    COUNT(m.id) as missions_validees,
                    SUM(m.poids_depose) as total_poids,
                    SUM(m.gains_attribues) as total_gains
                FROM missions m
                JOIN collecteurs c ON m.collecteur_id = c.id
                JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
                JOIN gestionnaires_points g ON g.point_collecte_id = pdv.id
                WHERE g.id = $1 AND m.statut = 'validee'
                GROUP BY c.id, c.nom_complet
                ORDER BY total_gains DESC
                LIMIT 5
            )
            SELECT 
                (SELECT row_to_json(stats) FROM stats) as statistiques,
                (SELECT json_agg(dernieres_activites) FROM dernieres_activites) as dernieres_activites,
                (SELECT json_agg(top_collecteurs) FROM top_collecteurs) as top_collecteurs
        `;
        
        const resultat = await pool.query(requete, [gestionnaireId]);
        return resultat.rows[0] || {
            statistiques: {
                en_attente: 0,
                validees: 0,
                aujourd_hui: 0,
                poids_total: 0,
                gains_distribues: 0,
                poids_moyen: 0
            },
            dernieres_activites: [],
            top_collecteurs: []
        };
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
}

export default GestionnairePoint;