


import { pool } from '../config/database.js';

class DeclarationDechets {
    

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
static async creerDeclarationAnnexe(donnees) {
    const {
        producteurId,
        typeDechet,
        quantite,
        unite,
        notes,
        latitudeReelle,
        longitudeReelle,
        adresseReelle,
        photoUrl
    } = donnees;

    // Valeur par défaut pour mode_collecte (choisir une valeur existante dans l'enum)
    const modeCollecte = 'depot_volontaire'; // ou 'collecte_domicile'

    const query = `
        INSERT INTO declarations_dechets (
            producteur_id, type_dechet, quantite, unite, notes,
            latitude_reelle, longitude_reelle, adresse_reelle,
            photo_url, type_declaration, statut, mode_collecte
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'annexe', 'en_attente', $10)
        RETURNING *
    `;
    const values = [
        producteurId, typeDechet, quantite, unite, notes,
        latitudeReelle, longitudeReelle, adresseReelle,
        photoUrl,
        modeCollecte
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// static async getDeclarationsAnnexesDisponibles() {
//     const query = `
//         SELECT 
//             d.*,
//             p.nom_complet as producteur_nom,
//             p.telephone as producteur_telephone
//         FROM declarations_dechets d
//         JOIN producteurs p ON d.producteur_id = p.id
//         WHERE d.type_declaration = 'annexe'
//           AND d.statut = 'disponible'
//           AND d.date_creation >= NOW() - INTERVAL '7 days'
//         ORDER BY d.date_creation ASC
//     `;
//     const result = await pool.query(query);
//     return result.rows;
// }

static async getDeclarationsAnnexesDisponibles() {
    const query = `
        SELECT 
            d.*,
            p.nom_complet as producteur_nom,
            p.telephone as producteur_telephone
        FROM declarations_dechets d
        JOIN producteurs p ON d.producteur_id = p.id
        WHERE d.type_declaration = 'annexe'
          AND d.statut = 'en_attente'
          AND d.cree_le >= NOW() - INTERVAL '7 days'
        ORDER BY d.cree_le ASC
    `;
    const result = await pool.query(query);
    return result.rows;
}

static async accepterDeclarationAnnexe(declarationId, collecteurId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const check = await client.query(
            'SELECT id FROM declarations_dechets WHERE id = $1 AND type_declaration = $2 AND statut = $3',
            [declarationId, 'annexe', 'en_attente']
        );
        if (check.rows.length === 0) throw new Error('Déclaration non disponible');
        
        await client.query(
            `UPDATE declarations_dechets SET statut = 'acceptee', date_acceptation = NOW() WHERE id = $1`,
            [declarationId]
        );
        
        const missionResult = await client.query(
            `INSERT INTO missions (declaration_id, collecteur_id, statut, date_acceptation)
             VALUES ($1, $2, 'acceptee', NOW())
             RETURNING *`,
            [declarationId, collecteurId]
        );
        
        await client.query('COMMIT');
        return missionResult.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}
}//collector2@test.com , nonobina@exemple.com

// Actif
//  238987675

// VIVI
// Collectionnaur@exemple.com

// Actif
//  2378765498

// BOLIOK
// collector2391@test.com

// Actif
//  90876576643

// BONI
// collector3@test.com

// Actif
//  237600987609

// Fatou Ndiaye
// collector2@test.com

// Actif
//  778901234

// AmadouNA ZALOMPODN
// collector1@test.com
export default DeclarationDechets; 


