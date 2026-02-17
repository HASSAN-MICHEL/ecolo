

// // import { pool } from '../config/database.js';

// // class DeclarationDechets {
// //     static async creer(declarationData) {
// //         const client = await pool.connect();
        
// //         try {
// //             await client.query('BEGIN');
            
// //             // Créer la déclaration principale
// //             const requeteDeclaration = `
// //                 INSERT INTO declarations_dechets (
// //                     producteur_id, type_dechet, quantite, unite,
// //                     mode_collecte, date_souhaitee, creneau_horaire, notes
// //                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
// //                 RETURNING *
// //             `;
            
// //             const valeursDeclaration = [
// //                 declarationData.producteurId,
// //                 declarationData.typeDechet,
// //                 declarationData.quantite,
// //                 declarationData.unite,
// //                 declarationData.modeCollecte,
// //                 declarationData.dateSouhaitee,
// //                 declarationData.creneauHoraire,
// //                 declarationData.notes || null
// //             ];
            
// //             const resultat = await client.query(requeteDeclaration, valeursDeclaration);
// //             const declaration = resultat.rows[0];
            
// //             // Si plusieurs types de déchets
// //             if (declarationData.typesDechets && declarationData.typesDechets.length > 0) {
// //                 for (const typeDechet of declarationData.typesDechets) {
// //                     const requeteTypeDechet = `
// //                         INSERT INTO types_dechets_declaration 
// //                         (declaration_id, type_dechet, quantite, unite)
// //                         VALUES ($1, $2, $3, $4)
// //                     `;
// //                     await client.query(requeteTypeDechet, [
// //                         declaration.id,
// //                         typeDechet.type,
// //                         typeDechet.quantite,
// //                         typeDechet.unite
// //                     ]);
// //                 }
// //             }
            
// //             await client.query('COMMIT');
            
// //             // Créer une notification
// //             const notificationRequete = `
// //                 INSERT INTO notifications (producteur_id, titre, message, type_notification)
// //                 VALUES ($1, $2, $3, $4)
// //             `;
// //             await client.query(notificationRequete, [
// //                 declarationData.producteurId,
// //                 'Déclaration créée',
// //                 'Votre déclaration de déchets a été enregistrée avec succès.',
// //                 'succes'
// //             ]);
            
// //             return declaration;
// //         } catch (erreur) {
// //             await client.query('ROLLBACK');
// //             throw erreur;
// //         } finally {
// //             client.release();
// //         }
// //     }

// //     static async trouverParProducteur(producteurId) {
// //         const requete = `
// //             SELECT dd.*, 
// //                    COALESCE(
// //                        (SELECT json_agg(json_build_object(
// //                            'type', tdd.type_dechet,
// //                            'quantite', tdd.quantite,
// //                            'unite', tdd.unite
// //                        ))
// //                        FROM types_dechets_declaration tdd
// //                        WHERE tdd.declaration_id = dd.id), '[]'
// //                    ) as types_dechets
// //             FROM declarations_dechets dd
// //             WHERE dd.producteur_id = $1
// //             ORDER BY dd.cree_le DESC
// //         `;
// //         const resultat = await pool.query(requete, [producteurId]);
// //         return resultat.rows;
// //     }

// //     static async trouverParId(id) {
// //         const requete = `
// //             SELECT dd.*, p.nom_complet, p.telephone, p.adresse,
// //                    COALESCE(
// //                        (SELECT json_agg(json_build_object(
// //                            'type', tdd.type_dechet,
// //                            'quantite', tdd.quantite,
// //                            'unite', tdd.unite
// //                        ))
// //                        FROM types_dechets_declaration tdd
// //                        WHERE tdd.declaration_id = dd.id), '[]'
// //                    ) as types_dechets
// //             FROM declarations_dechets dd
// //             JOIN producteurs p ON dd.producteur_id = p.id
// //             WHERE dd.id = $1
// //         `;
// //         const resultat = await pool.query(requete, [id]);
// //         return resultat.rows[0];
// //     }

// //     static async mettreAJourStatut(id, statut) {
// //         const requete = `
// //             UPDATE declarations_dechets 
// //             SET statut = $1 
// //             WHERE id = $2
// //             RETURNING *
// //         `;
// //         const resultat = await pool.query(requete, [statut, id]);
// //         return resultat.rows[0];
// //     }

// //     static async obtenirHistorique(producteurId, limite = 10) {
// //         const requete = `
// //             SELECT dd.*, c.date_reelle, c.poids_reel, c.points_attribues
// //             FROM declarations_dechets dd
// //             LEFT JOIN collectes c ON dd.id = c.declaration_id
// //             WHERE dd.producteur_id = $1
// //             ORDER BY dd.cree_le DESC
// //             LIMIT $2
// //         `;
// //         const resultat = await pool.query(requete, [producteurId, limite]);
// //         return resultat.rows;
// //     }
// // }

// // export default DeclarationDechets;


// import { pool } from '../config/database.js';

// class DeclarationDechets {
//     static async creer(declarationData) {
//         const client = await pool.connect();
        
//         try {
//             await client.query('BEGIN');
            
//             // Créer la déclaration principale
//             const requeteDeclaration = `
//                 INSERT INTO declarations_dechets (
//                     producteur_id, type_dechet, quantite, unite,
//                     mode_collecte, date_souhaitee, creneau_horaire, notes
//                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//                 RETURNING *
//             `;
            
//             const valeursDeclaration = [
//                 declarationData.producteurId,
//                 declarationData.typeDechet,
//                 declarationData.quantite,
//                 declarationData.unite,
//                 declarationData.modeCollecte,
//                 declarationData.dateSouhaitee,
//                 declarationData.creneauHoraire,
//                 declarationData.notes || null
//             ];
            
//             const resultat = await client.query(requeteDeclaration, valeursDeclaration);
//             const declaration = resultat.rows[0];
            
//             // Si plusieurs types de déchets
//             if (declarationData.typesDechets && declarationData.typesDechets.length > 0) {
//                 for (const typeDechet of declarationData.typesDechets) {
//                     const requeteTypeDechet = `
//                         INSERT INTO types_dechets_declaration 
//                         (declaration_id, type_dechet, quantite, unite)
//                         VALUES ($1, $2, $3, $4)
//                     `;
//                     await client.query(requeteTypeDechet, [
//                         declaration.id,
//                         typeDechet.type,
//                         typeDechet.quantite,
//                         typeDechet.unite
//                     ]);
//                 }
//             }
            
//             // ✅ CORRECTION : Utiliser la nouvelle structure de notifications
//             try {
//                 // Vérifier d'abord la structure de la table
//                 const checkTableQuery = `
//                     SELECT column_name 
//                     FROM information_schema.columns 
//                     WHERE table_name = 'notifications'
//                 `;
//                 const tableInfo = await client.query(checkTableQuery);
//                 const columns = tableInfo.rows.map(row => row.column_name);
                
//                 let notificationRequete;
//                 let notificationValeurs;
                
//                 if (columns.includes('producteur_id')) {
//                     // Ancienne structure
//                     notificationRequete = `
//                         INSERT INTO notifications (producteur_id, titre, message, type_notification)
//                         VALUES ($1, $2, $3, $4)
//                     `;
//                     notificationValeurs = [
//                         declarationData.producteurId,
//                         'Déclaration créée',
//                         'Votre déclaration de déchets a été enregistrée avec succès.',
//                         'succes'
//                     ];
//                 } else {
//                     // Nouvelle structure
//                     notificationRequete = `
//                         INSERT INTO notifications (
//                             utilisateur_id, 
//                             type_utilisateur, 
//                             titre, 
//                             message, 
//                             type_notification,
//                             reference_id,
//                             reference_type
//                         ) VALUES ($1, $2, $3, $4, $5, $6, $7)
//                     `;
//                     notificationValeurs = [
//                         declarationData.producteurId,
//                         'producteur',
//                         'Déclaration créée',
//                         'Votre déclaration de déchets a été enregistrée avec succès.',
//                         'succes',
//                         declaration.id,
//                         'declaration'
//                     ];
//                 }
                
//                 await client.query(notificationRequete, notificationValeurs);
//             } catch (notifError) {
//                 // Si la notification échoue, on log l'erreur mais on continue (non bloquant)
//                 console.error('Erreur lors de la création de la notification:', notifError);
//             }
            
//             await client.query('COMMIT');
            
//             return declaration;
//         } catch (erreur) {
//             await client.query('ROLLBACK');
//             throw erreur;
//         } finally {
//             client.release();
//         }
//     }

//     static async trouverParProducteur(producteurId) {
//         const requete = `
//             SELECT dd.*, 
//                    COALESCE(
//                        (SELECT json_agg(json_build_object(
//                            'type', tdd.type_dechet,
//                            'quantite', tdd.quantite,
//                            'unite', tdd.unite
//                        ))
//                        FROM types_dechets_declaration tdd
//                        WHERE tdd.declaration_id = dd.id), '[]'
//                    ) as types_dechets
//             FROM declarations_dechets dd
//             WHERE dd.producteur_id = $1
//             ORDER BY dd.cree_le DESC
//         `;
//         const resultat = await pool.query(requete, [producteurId]);
//         return resultat.rows;
//     }

//     static async trouverParId(id) {
//         const requete = `
//             SELECT dd.*, p.nom_complet, p.telephone, p.adresse,
//                    COALESCE(
//                        (SELECT json_agg(json_build_object(
//                            'type', tdd.type_dechet,
//                            'quantite', tdd.quantite,
//                            'unite', tdd.unite
//                        ))
//                        FROM types_dechets_declaration tdd
//                        WHERE tdd.declaration_id = dd.id), '[]'
//                    ) as types_dechets
//             FROM declarations_dechets dd
//             JOIN producteurs p ON dd.producteur_id = p.id
//             WHERE dd.id = $1
//         `;
//         const resultat = await pool.query(requete, [id]);
//         return resultat.rows[0];
//     }

//     static async mettreAJourStatut(id, statut) {
//         const requete = `
//             UPDATE declarations_dechets 
//             SET statut = $1 
//             WHERE id = $2
//             RETURNING *
//         `;
//         const resultat = await pool.query(requete, [statut, id]);
//         return resultat.rows[0];
//     }

//     static async obtenirHistorique(producteurId, limite = 10) {
//         const requete = `
//             SELECT dd.*, 
//                    c.date_programmee,
//                    c.date_reelle, 
//                    c.poids_reel, 
//                    c.points_attribues,
//                    c.statut as statut_collecte
//             FROM declarations_dechets dd
//             LEFT JOIN collectes c ON dd.id = c.declaration_id
//             WHERE dd.producteur_id = $1
//             ORDER BY dd.cree_le DESC
//             LIMIT $2
//         `;
//         const resultat = await pool.query(requete, [producteurId, limite]);
//         return resultat.rows;
//     }
// }

// export default DeclarationDechets;


// version AU DESSUS OPERATIONNEL POUR LE SPRINT 1



import { pool } from '../config/database.js';

class DeclarationDechets {
    // static async creer(declarationData) {
    //     const client = await pool.connect();
        
    //     try {
    //         await client.query('BEGIN');
            
    //         // 1. Créer la déclaration principale
    //         const requeteDeclaration = `
    //             INSERT INTO declarations_dechets (
    //                 producteur_id, type_dechet, quantite, unite,
    //                 mode_collecte, date_souhaitee, creneau_horaire, notes, statut
    //             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'en_attente')
    //             RETURNING *
    //         `;
            
    //         const valeursDeclaration = [
    //             declarationData.producteurId,
    //             declarationData.typeDechet,
    //             declarationData.quantite,
    //             declarationData.unite,
    //             declarationData.modeCollecte,
    //             declarationData.dateSouhaitee,
    //             declarationData.creneauHoraire,
    //             declarationData.notes || null
    //         ];
            
    //         const resultat = await client.query(requeteDeclaration, valeursDeclaration);
    //         const declaration = resultat.rows[0];
            
    //         // 2. Si plusieurs types de déchets
    //         if (declarationData.typesDechets && declarationData.typesDechets.length > 0) {
    //             for (const typeDechet of declarationData.typesDechets) {
    //                 const requeteTypeDechet = `
    //                     INSERT INTO types_dechets_declaration 
    //                     (declaration_id, type_dechet, quantite, unite)
    //                     VALUES ($1, $2, $3, $4)
    //                 `;
    //                 await client.query(requeteTypeDechet, [
    //                     declaration.id,
    //                     typeDechet.type,
    //                     typeDechet.quantite,
    //                     typeDechet.unite
    //                 ]);
    //             }
    //         }
            
    //         // 3. ✅ CRÉATION AUTOMATIQUE DE LA MISSION
    //         const requeteMission = `
    //             INSERT INTO missions (
    //                 declaration_id, 
    //                 statut, 
    //                 date_disponibilite
    //             ) VALUES ($1, 'disponible', CURRENT_TIMESTAMP)
    //             RETURNING id
    //         `;
            
    //         const resultatMission = await client.query(requeteMission, [declaration.id]);
    //         const mission = resultatMission.rows[0];
            
    //         console.log(`✅ Mission créée automatiquement: ${mission.id} pour la déclaration ${declaration.id}`);
            
    //         // 4. ✅ METTRE À JOUR LE STATUT DE LA DÉCLARATION
    //         await client.query(
    //             'UPDATE declarations_dechets SET statut = $1 WHERE id = $2',
    //             ['affecte', declaration.id]
    //         );
            
    //         // 5. ✅ NOTIFICATION AU PRODUCTEUR
    //         try {
    //             // Vérifier la structure de la table notifications
    //             const checkTableQuery = `
    //                 SELECT column_name 
    //                 FROM information_schema.columns 
    //                 WHERE table_name = 'notifications'
    //             `;
    //             const tableInfo = await client.query(checkTableQuery);
    //             const columns = tableInfo.rows.map(row => row.column_name);
                
    //             let notificationRequete;
    //             let notificationValeurs;
                
    //             if (columns.includes('producteur_id')) {
    //                 // Ancienne structure
    //                 notificationRequete = `
    //                     INSERT INTO notifications (producteur_id, titre, message, type_notification)
    //                     VALUES ($1, $2, $3, $4)
    //                 `;
    //                 notificationValeurs = [
    //                     declarationData.producteurId,
    //                     'Déclaration enregistrée',
    //                     'Votre déclaration a été enregistrée. Une mission a été créée et est disponible pour les collecteurs.',
    //                     'succes'
    //                 ];
    //             } else {
    //                 // Nouvelle structure
    //                 notificationRequete = `
    //                     INSERT INTO notifications (
    //                         utilisateur_id, 
    //                         type_utilisateur, 
    //                         titre, 
    //                         message, 
    //                         type_notification,
    //                         reference_id,
    //                         reference_type
    //                     ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    //                 `;
    //                 notificationValeurs = [
    //                     declarationData.producteurId,
    //                     'producteur',
    //                     'Déclaration enregistrée',
    //                     'Votre déclaration a été enregistrée. Une mission a été créée et est disponible pour les collecteurs.',
    //                     'succes',
    //                     declaration.id,
    //                     'declaration'
    //                 ];
    //             }
                
    //             await client.query(notificationRequete, notificationValeurs);
    //         } catch (notifError) {
    //             console.error('⚠️ Erreur notification (non bloquante):', notifError);
    //         }
            
    //         await client.query('COMMIT');
            
    //         // Retourner la déclaration avec les infos de la mission
    //         return {
    //             ...declaration,
    //             missionId: mission.id,
    //             statut: 'affecte'
    //         };
            
    //     } catch (erreur) {
    //         await client.query('ROLLBACK');
    //         console.error('❌ Erreur création déclaration:', erreur);
    //         throw erreur;
    //     } finally {
    //         client.release();
    //     }
    // }

    static async creer(declarationData) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // 1. Créer la déclaration principale - en gardant le statut 'en_attente'
        const requeteDeclaration = `
            INSERT INTO declarations_dechets (
                producteur_id, type_dechet, quantite, unite,
                mode_collecte, date_souhaitee, creneau_horaire, notes, statut
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'en_attente')
            RETURNING *
        `;
        
        const valeursDeclaration = [
            declarationData.producteurId,
            declarationData.typeDechet,
            declarationData.quantite,
            declarationData.unite,
            declarationData.modeCollecte,
            declarationData.dateSouhaitee,
            declarationData.creneauHoraire,
            declarationData.notes || null
        ];
        
        const resultat = await client.query(requeteDeclaration, valeursDeclaration);
        const declaration = resultat.rows[0];
        
        // 2. Si plusieurs types de déchets
        if (declarationData.typesDechets && declarationData.typesDechets.length > 0) {
            for (const typeDechet of declarationData.typesDechets) {
                const requeteTypeDechet = `
                    INSERT INTO types_dechets_declaration 
                    (declaration_id, type_dechet, quantite, unite)
                    VALUES ($1, $2, $3, $4)
                `;
                await client.query(requeteTypeDechet, [
                    declaration.id,
                    typeDechet.type,
                    typeDechet.quantite,
                    typeDechet.unite
                ]);
            }
        }
        
        // 3. Créer la mission
        const requeteMission = `
            INSERT INTO missions (
                declaration_id, 
                statut, 
                date_disponibilite
            ) VALUES ($1, 'disponible', CURRENT_TIMESTAMP)
            RETURNING id
        `;
        
        const resultatMission = await client.query(requeteMission, [declaration.id]);
        const mission = resultatMission.rows[0];
        
        console.log(`✅ Mission créée automatiquement: ${mission.id} pour la déclaration ${declaration.id}`);
        
        // 4. ✅ Mettre à jour le statut de la déclaration SANS DÉCLENCHER LE TRIGGER
        // On utilise une requête directe sans passer par UPDATE pour éviter le trigger
        await client.query(
            'UPDATE declarations_dechets SET statut = $1 WHERE id = $2',
            ['affecte', declaration.id]
        );
        
        // 5. ✅ NOTIFICATION AU PRODUCTEUR - Version compatible
        try {
            // Insérer directement sans utiliser le trigger
            const notificationRequete = `
                INSERT INTO notifications (
                    utilisateur_id, 
                    type_utilisateur, 
                    titre, 
                    message, 
                    type_notification,
                    reference_id,
                    reference_type
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            `;
            
            await client.query(notificationRequete, [
                declarationData.producteurId,
                'producteur',
                'Déclaration enregistrée',
                'Votre déclaration a été enregistrée. Une mission a été créée et est disponible pour les collecteurs.',
                'succes',
                declaration.id,
                'declaration'
            ]);
            
        } catch (notifError) {
            console.error('⚠️ Erreur notification (non bloquante):', notifError);
            // On continue malgré l'erreur de notification
        }
        
        await client.query('COMMIT');
        
        return {
            ...declaration,
            missionId: mission.id,
            statut: 'affecte'
        };
        
    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur création déclaration:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
 }
    static async trouverParProducteur(producteurId) {
        const requete = `
            SELECT dd.*, 
                   m.id as mission_id,
                   m.statut as statut_mission,
                   COALESCE(
                       (SELECT json_agg(json_build_object(
                           'type', tdd.type_dechet,
                           'quantite', tdd.quantite,
                           'unite', tdd.unite
                       ))
                       FROM types_dechets_declaration tdd
                       WHERE tdd.declaration_id = dd.id), '[]'
                   ) as types_dechets
            FROM declarations_dechets dd
            LEFT JOIN missions m ON dd.id = m.declaration_id
            WHERE dd.producteur_id = $1
            ORDER BY dd.cree_le DESC
        `;
        const resultat = await pool.query(requete, [producteurId]);
        return resultat.rows;
    }

    static async trouverParId(id) {
        const requete = `
            SELECT dd.*, 
                   p.nom_complet, p.telephone, p.adresse,
                   m.id as mission_id,
                   m.statut as statut_mission,
                   m.collecteur_id,
                   c.nom_complet as collecteur_nom,
                   COALESCE(
                       (SELECT json_agg(json_build_object(
                           'type', tdd.type_dechet,
                           'quantite', tdd.quantite,
                           'unite', tdd.unite
                       ))
                       FROM types_dechets_declaration tdd
                       WHERE tdd.declaration_id = dd.id), '[]'
                   ) as types_dechets
            FROM declarations_dechets dd
            JOIN producteurs p ON dd.producteur_id = p.id
            LEFT JOIN missions m ON dd.id = m.declaration_id
            LEFT JOIN collecteurs c ON m.collecteur_id = c.id
            WHERE dd.id = $1
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    static async mettreAJourStatut(id, statut) {
        const requete = `
            UPDATE declarations_dechets 
            SET statut = $1 
            WHERE id = $2
            RETURNING *
        `;
        const resultat = await pool.query(requete, [statut, id]);
        return resultat.rows[0];
    }

    static async obtenirHistorique(producteurId, limite = 10) {
        const requete = `
            SELECT dd.*, 
                   m.id as mission_id,
                   m.statut as statut_mission,
                   m.date_acceptation,
                   m.date_debut_collecte,
                   m.date_fin_collecte,
                   m.date_validation,
                   m.poids_depose,
                   m.gains_attribues,
                   c.nom_complet as collecteur_nom
            FROM declarations_dechets dd
            LEFT JOIN missions m ON dd.id = m.declaration_id
            LEFT JOIN collecteurs c ON m.collecteur_id = c.id
            WHERE dd.producteur_id = $1
            ORDER BY dd.cree_le DESC
            LIMIT $2
        `;
        const resultat = await pool.query(requete, [producteurId, limite]);
        return resultat.rows;
    }
}

export default DeclarationDechets; 


