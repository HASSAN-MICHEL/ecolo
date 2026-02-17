// import { pool } from '../config/database.js';

// class GestionnairePoint {
//     // Créer un nouveau gestionnaire (par superviseur)
//     static async creer(donnees, creePar) {
//         const requete = `
//             INSERT INTO gestionnaires_points (
//                 email, telephone, mot_de_passe_hash, nom_complet,
//                 point_collecte_id, fonction, cree_par
//             ) VALUES ($1, $2, $3, $4, $5, $6, $7)
//             RETURNING id, email, telephone, nom_complet, point_collecte_id, fonction, cree_le
//         `;
        
//         const valeurs = [
//             donnees.email,
//             donnees.telephone,
//             donnees.motDePasseHash,
//             donnees.nomComplet,
//             donnees.pointCollecteId,
//             donnees.fonction || 'Gestionnaire',
//             creePar
//         ];
        
//         const resultat = await pool.query(requete, valeurs);
//         return resultat.rows[0];
//     }

//     // Trouver par email
//     static async trouverParEmail(email) {
//         const requete = `
//             SELECT g.*, p.nom as point_collecte_nom 
//             FROM gestionnaires_points g
//             LEFT JOIN points_depot_volontaire p ON g.point_collecte_id = p.id
//             WHERE g.email = $1
//         `;
//         const resultat = await pool.query(requete, [email]);
//         return resultat.rows[0];
//     }
// // PAR EMAIL 
//     static async findByEmail(email) {
//     try {
//         const requete = `
//             SELECT g.*, p.nom as point_collecte_nom 
//             FROM gestionnaires_points g
//             LEFT JOIN points_depot_volontaire p ON g.point_collecte_id = p.id
//             WHERE g.email = $1
//         `;
//         const resultat = await pool.query(requete, [email]);
//         return resultat.rows[0];
//     } catch (erreur) {
//         console.error('Erreur findByEmail gestionnaire:', erreur);
//         throw erreur;
//     }
//   }
//     // Trouver par ID
//     static async trouverParId(id) {
//         const requete = `
//             SELECT g.*, p.nom as point_collecte_nom,
//                    p.adresse as point_collecte_adresse,
//                    p.types_dechets_acceptes
//             FROM gestionnaires_points g
//             LEFT JOIN points_depot_volontaire p ON g.point_collecte_id = p.id
//             WHERE g.id = $1
//         `;
//         const resultat = await pool.query(requete, [id]);
//         return resultat.rows[0];
//     }

//     // Mettre à jour
//     static async mettreAJour(id, donnees) {
//         const champs = [];
//         const valeurs = [];
//         let index = 1;

//         if (donnees.nomComplet) {
//             champs.push(`nom_complet = $${index++}`);
//             valeurs.push(donnees.nomComplet);
//         }
//         if (donnees.telephone) {
//             champs.push(`telephone = $${index++}`);
//             valeurs.push(donnees.telephone);
//         }
//         if (donnees.fonction) {
//             champs.push(`fonction = $${index++}`);
//             valeurs.push(donnees.fonction);
//         }
//         if (donnees.pointCollecteId) {
//             champs.push(`point_collecte_id = $${index++}`);
//             valeurs.push(donnees.pointCollecteId);
//         }
//         if (donnees.estActif !== undefined) {
//             champs.push(`est_actif = $${index++}`);
//             valeurs.push(donnees.estActif);
//         }

//         valeurs.push(id);
//         const requete = `
//             UPDATE gestionnaires_points 
//             SET ${champs.join(', ')}
//             WHERE id = $${index}
//             RETURNING id, email, telephone, nom_complet, point_collecte_id, fonction, est_actif
//         `;

//         const resultat = await pool.query(requete, valeurs);
//         return resultat.rows[0];
//     }

//     // Valider une mission (pesée)
//     // static async validerMission(missionId, gestionnaireId, donnees) {
//     //     const client = await pool.connect();
        
//     //     try {
//     //         await client.query('BEGIN');

//     //         // Mettre à jour la mission
//     //         const requeteMission = `
//     //             UPDATE missions 
//     //             SET statut = 'validee',
//     //                 date_validation = CURRENT_TIMESTAMP,
//     //                 poids_depose = $1,
//     //                 qualite_dechets = $2,
//     //                 validation_notes = $3,
//     //                 valide_par = $4,
//     //                 points_attribues = CEIL($1 * 10),
//     //                 gains_attribues = $1 * 100
//     //             WHERE id = $5
//     //             RETURNING *, collecteur_id
//     //         `;
            
//     //         const resultatMission = await client.query(requeteMission, [
//     //             donnees.poidsDepose,
//     //             donnees.qualiteDechets || 'conforme',
//     //             donnees.notes,
//     //             gestionnaireId,
//     //             missionId
//     //         ]);
            
//     //         const mission = resultatMission.rows[0];

//     //         // Mettre à jour le stock du point de collecte
//     //         const requeteStock = `
//     //             UPDATE points_depot_volontaire 
//     //             SET 
//     //             WHERE id = (SELECT point_collecte_id FROM gestionnaires_points WHERE id = $1)
//     //         `;
//     //         // TODO: Implémenter la gestion de stock

//     //         await client.query('COMMIT');
//     //         return mission;
//     //     } catch (erreur) {
//     //         await client.query('ROLLBACK');
//     //         throw erreur;
//     //     } finally {
//     //         client.release();
//     //     }
//     // }

//     // Valider une mission (pesée)
// static async validerMission(missionId, gestionnaireId, donnees) {
//     const client = await pool.connect();
    
//     try {
//         await client.query('BEGIN');

//         // ✅ Conversion explicite des types
//         const poidsDepose = parseFloat(donnees.poidsDepose);
//         const pointsAttribues = Math.ceil(poidsDepose * 10); // Exemple: 10 points par kg
//         const gainsAttribues = poidsDepose * 100; // Exemple: 100 FCFA par kg

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
//             RETURNING *, collecteur_id
//         `;
        
//         const resultatMission = await client.query(requeteMission, [
//             poidsDepose,                    // $1 numeric
//             donnees.qualiteDechets || 'conforme', // $2 text
//             donnees.notes || null,          // $3 text
//             gestionnaireId,                  // $4 uuid
//             pointsAttribues,                 // $5 integer
//             gainsAttribues,                   // $6 numeric
//             missionId                         // $7 uuid
//         ]);
        
//         const mission = resultatMission.rows[0];

//         // Mettre à jour les gains du collecteur
//         if (mission && mission.collecteur_id) {
//             await client.query(`
//                 INSERT INTO gains_collecteurs (collecteur_id, mission_id, montant, type_gain, statut)
//                 VALUES ($1, $2, $3, 'collecte', 'valide')
//             `, [mission.collecteur_id, missionId, gainsAttribues]);
//         }

//         await client.query('COMMIT');
//         return mission;
//     } catch (erreur) {
//         await client.query('ROLLBACK');
//         console.error('❌ Erreur validation mission:', erreur);
//         throw erreur;
//     } finally {
//         client.release();
//     }
//  }

//     // Obtenir les missions en attente de validation
//     static async missionsEnAttente(gestionnaireId) {
//         const requete = `
//             SELECT m.*, 
//                    d.type_dechet, d.quantite, d.unite,
//                    p.nom_complet as producteur_nom,
//                    c.nom_complet as collecteur_nom
//             FROM missions m
//             JOIN declarations_dechets d ON m.declaration_id = d.id
//             JOIN producteurs p ON d.producteur_id = p.id
//             JOIN collecteurs c ON m.collecteur_id = c.id
//             JOIN gestionnaires_points g ON g.id = $1
//             WHERE m.statut = 'deposee' 
//               AND m.point_depot_id = g.point_collecte_id
//             ORDER BY m.date_depot_point DESC
//         `;
//         const resultat = await pool.query(requete, [gestionnaireId]);
//         return resultat.rows;
//     }

//     // Attribuer des crédits à un collecteur
//     static async attribuerCredits(collecteurId, missionId, montant, gestionnaireId) {
//         const requete = `
//             INSERT INTO gains_collecteurs (collecteur_id, mission_id, montant, type_gain, statut)
//             VALUES ($1, $2, $3, 'collecte', 'valide')
//             RETURNING *
//         `;
//         const resultat = await pool.query(requete, [collecteurId, missionId, montant]);
//         return resultat.rows[0];
//     }

//     // Tableau de bord
//     static async tableauBord(id) {
//         const requete = `
//             SELECT * FROM tableau_bord_gestionnaire 
//             WHERE gestionnaire_id = $1
//         `;
//         const resultat = await pool.query(requete, [id]);
//         return resultat.rows[0];
//     }
// }

// export default GestionnairePoint;

// Gestionnaire original au dessus 



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
        
        if (statut && statut !== 'tous') {
            requete += ` AND m.statut = $2`;
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
                gc.id as gain_id,
                gc.montant as gain_montant,
                gc.statut as gain_statut,
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

    // ✅ Valider une mission et attribuer les gains
    static async validerMission(missionId, gestionnaireId, donnees) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Vérifier que la mission appartient bien à ce gestionnaire
            const verification = await client.query(`
                SELECT m.* FROM missions m
                JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
                JOIN gestionnaires_points g ON g.point_collecte_id = pdv.id
                WHERE m.id = $1 AND g.id = $2 AND m.statut = 'deposee'
            `, [missionId, gestionnaireId]);

            if (verification.rows.length === 0) {
                throw new Error('Mission non trouvée ou déjà validée');
            }

            const poidsDepose = parseFloat(donnees.poidsDepose);
            const pointsAttribues = Math.ceil(poidsDepose * 10); // 10 points par kg
            const gainsAttribues = poidsDepose * 100; // 100 FCFA par kg

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
                RETURNING *, collecteur_id
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
            
            const mission = resultatMission.rows[0];

            // Créer l'entrée dans gains_collecteurs
            if (mission && mission.collecteur_id) {
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
                    SET gains_total = gains_total + $1
                    WHERE id = $2
                `, [gainsAttribues, mission.collecteur_id]);

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
                    `Votre mission a été validée. Vous avez gagné ${gainsAttribues} FCFA.`,
                    resultatGain.rows[0].id
                ]);
            }

            await client.query('COMMIT');
            
            // Retourner la mission avec les détails du gain
            return await this.missionDetails(missionId, gestionnaireId);
            
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
                SELECT * FROM missions 
                WHERE id = $1 AND valide_par = $2 AND statut = 'validee'
            `, [missionId, gestionnaireId]);

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

            await client.query('COMMIT');
            return resultatGain.rows[0];
            
        } catch (erreur) {
            await client.query('ROLLBACK');
            throw erreur;
        } finally {
            client.release();
        }
    }

    // ✅ Tableau de bord complet
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
                    d.type_dechet
                FROM missions m
                JOIN declarations_dechets d ON m.declaration_id = d.id
                JOIN collecteurs c ON m.collecteur_id = c.id
                JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
                JOIN gestionnaires_points g ON g.point_collecte_id = pdv.id
                WHERE g.id = $1 AND m.statut = 'validee'
                ORDER BY m.date_validation DESC
                LIMIT 10
            )
            SELECT 
                (SELECT row_to_json(stats) FROM stats) as statistiques,
                (SELECT json_agg(dernieres_activites) FROM dernieres_activites) as dernieres_activites
        `;
        
        const resultat = await pool.query(requete, [gestionnaireId]);
        return resultat.rows[0];
    }
}

export default GestionnairePoint;
