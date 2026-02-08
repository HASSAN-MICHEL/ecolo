// import {pool} from '../config/database.js';

// class DeclarationDechets {
//     static async creer(declarationData) {
//         const client = await pool.connect();

//         try {
//             await client.query('BEGIN');

//             // créons ici la principal declaration

//             const requeteDeclaration = `
//                 INSERT INTO declarations_dechets (
//                     producteur_id, type_dechet, quantite, unite,
//                     mode_collecte, date_souhaitee, creneau_horaire, notes
//                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//                 RETURNING *
//             `;


//             const valeurDeclaration = [
//                 declarationData.producteurId,
//                 declarationData.typeDechet,
//                 declarationData.quantite,
//                 declarationData.unite,
//                 declarationData.modeCollecte,
//                 declarationData.dateSouhaitee,
//                 declarationData.creneauHoraire,
//                 declarationData.notes || null
//             ];

//             const resultat = await client.query(requeteDeclaration , valeurDeclaration);

//             const declaration = resultat.rows[0];
              
//             //ici est pour géré lorsque il y a plusieurs type de dechet dans une même declaration

//             if(declarationData.typeDechets && declarationData.typeDechets.length > 0){

//                 for (const typeDechet of declarationData.typeDechets){

//                      const requeteTypeDechet = `
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

//         }
//     }

//     await client.query('COMMIT');
            
//             // Créer une notification automatiquement lorsque la requete est envoyé
//             const notificationRequete = `
//                 INSERT INTO notifications (producteur_id, titre, message, type_notification)
//                 VALUES ($1, $2, $3, $4)
//             `;
//             await client.query(notificationRequete, [
//                 declarationData.producteurId,
//                 'Déclaration créée',
//                 'Votre déclaration de déchets a été enregistrée avec succès.',
//                 'succes'
//             ]);
            
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
//                    COALESCE(json_agg(tdd) FILTER (WHERE tdd.declaration_id IS NOT NULL), '[]') as types_dechets
//             FROM declarations_dechets dd
//             LEFT JOIN types_dechets_declaration tdd ON dd.id = tdd.declaration_id
//             WHERE dd.producteur_id = $1
//             GROUP BY dd.id
//             ORDER BY dd.cree_le DESC
//         `;
//         const resultat = await pool.query(requete, [producteurId]);
//         return resultat.rows;
//     }

//     static async trouverParId(id) {
//         const requete = `
//             SELECT dd.*, p.nom_complet, p.telephone, p.adresse,
//                    COALESCE(json_agg(tdd) FILTER (WHERE tdd.declaration_id IS NOT NULL), '[]') as types_dechets
//             FROM declarations_dechets dd
//             JOIN producteurs p ON dd.producteur_id = p.id
//             LEFT JOIN types_dechets_declaration tdd ON dd.id = tdd.declaration_id
//             WHERE dd.id = $1
//             GROUP BY dd.id, p.id
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
//             SELECT dd.*, c.date_reelle, c.poids_reel, c.points_attribues
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


import { pool } from '../config/database.js';

class DeclarationDechets {
    static async creer(declarationData) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Créer la déclaration principale
            const requeteDeclaration = `
                INSERT INTO declarations_dechets (
                    producteur_id, type_dechet, quantite, unite,
                    mode_collecte, date_souhaitee, creneau_horaire, notes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
            
            // Si plusieurs types de déchets
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
            
            await client.query('COMMIT');
            
            // Créer une notification
            const notificationRequete = `
                INSERT INTO notifications (producteur_id, titre, message, type_notification)
                VALUES ($1, $2, $3, $4)
            `;
            await client.query(notificationRequete, [
                declarationData.producteurId,
                'Déclaration créée',
                'Votre déclaration de déchets a été enregistrée avec succès.',
                'succes'
            ]);
            
            return declaration;
        } catch (erreur) {
            await client.query('ROLLBACK');
            throw erreur;
        } finally {
            client.release();
        }
    }

    static async trouverParProducteur(producteurId) {
        const requete = `
            SELECT dd.*, 
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
            WHERE dd.producteur_id = $1
            ORDER BY dd.cree_le DESC
        `;
        const resultat = await pool.query(requete, [producteurId]);
        return resultat.rows;
    }

    static async trouverParId(id) {
        const requete = `
            SELECT dd.*, p.nom_complet, p.telephone, p.adresse,
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
            SELECT dd.*, c.date_reelle, c.poids_reel, c.points_attribues
            FROM declarations_dechets dd
            LEFT JOIN collectes c ON dd.id = c.declaration_id
            WHERE dd.producteur_id = $1
            ORDER BY dd.cree_le DESC
            LIMIT $2
        `;
        const resultat = await pool.query(requete, [producteurId, limite]);
        return resultat.rows;
    }
}

export default DeclarationDechets;