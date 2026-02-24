import { pool } from '../config/database.js';

class Mission {
    // Créer une nouvelle mission à partir d'une déclaration
    static async creerDepuisDeclaration(declarationId) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            // Récupérer les infos de la déclaration
            const requeteDeclaration = `
                SELECT d.*, p.localisation_gps, p.adresse, p.quartier, p.commune
                FROM declarations_dechets d
                JOIN producteurs p ON d.producteur_id = p.id
                WHERE d.id = $1
            `;
            const declaration = await client.query(requeteDeclaration, [declarationId]);
            
            if (!declaration.rows[0]) {
                throw new Error('Déclaration non trouvée');
            }

            // Créer la mission
            const requeteMission = `
                INSERT INTO missions (
                    declaration_id, statut, date_disponibilite
                ) VALUES ($1, 'disponible', CURRENT_TIMESTAMP)
                RETURNING *
            `;
            
            const resultat = await client.query(requeteMission, [declarationId]);
            const mission = resultat.rows[0];

            // Mettre à jour le statut de la déclaration
            await client.query(
                'UPDATE declarations_dechets SET statut = $1 WHERE id = $2',
                ['affecte', declarationId]
            );

            await client.query('COMMIT');
            return mission;
        } catch (erreur) {
            await client.query('ROLLBACK');
            throw erreur;
        } finally {
            client.release();
        }
    }

    
    static async attribuer(missionId, collecteurId) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Mettre à jour la mission
        const requeteMission = `
            UPDATE missions 
            SET collecteur_id = $1,
                statut = 'acceptee',
                date_acceptation = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        
        const resultatMission = await client.query(requeteMission, [collecteurId, missionId]);
        const mission = resultatMission.rows[0];

        // ✅ METTRE À JOUR LA DÉCLARATION
        await client.query(`
            UPDATE declarations_dechets 
            SET statut = 'programme',
                modifie_le = CURRENT_TIMESTAMP
            WHERE id = $1
        `, [mission.declaration_id]);

        // Notification au collecteur
        await client.query(
            `INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification, reference_id, reference_type)
             VALUES ($1, 'collecteur', 'Mission acceptée', 'Vous avez accepté une mission de collecte.', 'mission_acceptee', $2, 'mission')`,
            [collecteurId, missionId]
        );

        await client.query('COMMIT');
        return mission;
    } catch (erreur) {
        await client.query('ROLLBACK');
        throw erreur;
    } finally {
        client.release();
    }

    
 }

    // Démarrer une collecte
    static async demarrerCollecte(missionId, collecteurId) {
        const requete = `
            UPDATE missions 
            SET statut = 'en_cours',
                date_debut_collecte = CURRENT_TIMESTAMP
            WHERE id = $1 AND collecteur_id = $2
            RETURNING *
        `;
        const resultat = await pool.query(requete, [missionId, collecteurId]);
        return resultat.rows[0];
    }


    static async mettreAJourDeclaration(missionId, nouveauStatutDeclaration) {
    const requete = `
        UPDATE declarations_dechets d
        SET statut = $1,
            modifie_le = CURRENT_TIMESTAMP
        FROM missions m
        WHERE m.id = $2 AND m.declaration_id = d.id
        RETURNING d.*
    `;
    const resultat = await pool.query(requete, [nouveauStatutDeclaration, missionId]);
    return resultat.rows[0];
   }
    // Terminer la collecte (avant dépôt)
   


    static async terminerCollecte(missionId, collecteurId, donnees) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        const requete = `
            UPDATE missions 
            SET statut = 'deposee',
                date_fin_collecte = CURRENT_TIMESTAMP,
                date_depot_point = CURRENT_TIMESTAMP,
                photo_preuve_url = $1,
                code_confirmation_producteur = $2,
                notes_collecte = $3,
                conformite_tri = $4
            WHERE id = $5 AND collecteur_id = $6
            RETURNING *
        `;
        
        const resultat = await client.query(requete, [
            donnees.photoPreuveUrl,
            donnees.codeConfirmation,
            donnees.notes,
            donnees.conformiteTri,
            missionId,
            collecteurId
        ]);
        
        const mission = resultat.rows[0];

        // ✅ METTRE À JOUR LA DÉCLARATION
        await client.query(`
            UPDATE declarations_dechets 
            SET statut = 'termine',
                modifie_le = CURRENT_TIMESTAMP
            WHERE id = $1
        `, [mission.declaration_id]);

        await client.query('COMMIT');
        return mission;
    } catch (erreur) {
        await client.query('ROLLBACK');
        throw erreur;
    } finally {
        client.release();
    }
  }

    // Déposer au point de collecte
    static async deposerAuPoint(missionId, collecteurId, pointDepotId) {
        const requete = `
            UPDATE missions 
            SET point_depot_id = $1
            WHERE id = $2 AND collecteur_id = $3
            RETURNING *
        `;
        const resultat = await pool.query(requete, [pointDepotId, missionId, collecteurId]);
        return resultat.rows[0];
    }

   

    static async disponiblesPourCollecteur(collecteurId) {
    const requete = `
        SELECT m.*, 
               d.type_dechet, d.quantite, d.unite,
               p.nom_complet as producteur_nom,
               p.telephone as producteur_telephone,
               p.adresse,  -- ✅ L'adresse vient de p
               p.quartier, p.commune,
               ST_AsGeoJSON(p.localisation_gps) as localisation_gps
        FROM missions m
        JOIN declarations_dechets d ON m.declaration_id = d.id
        JOIN producteurs p ON d.producteur_id = p.id
        WHERE m.statut = 'disponible'
          AND (m.collecteur_id IS NULL OR m.collecteur_id != $1)
        ORDER BY m.cree_le ASC
    `;
    
    const resultat = await pool.query(requete, [collecteurId]);
    return resultat.rows;
 }

  

    static async obtenirParCollecteur(collecteurId, statut = null) {
    let requete = `
        SELECT m.*, 
               d.type_dechet, d.quantite, d.unite,
               p.nom_complet as producteur_nom,
               p.telephone as producteur_telephone,
               p.adresse,
               p.quartier, p.commune,
               ST_AsGeoJSON(p.localisation_gps) as localisation_gps
        FROM missions m
        JOIN declarations_dechets d ON m.declaration_id = d.id
        JOIN producteurs p ON d.producteur_id = p.id
        WHERE m.collecteur_id = $1
    `;
    
    const params = [collecteurId];
    
    if (statut && statut !== 'tous') {
        requete += ` AND m.statut = $2`;
        params.push(statut);
    }
    
    requete += ` ORDER BY m.cree_le DESC`;
    
    const resultat = await pool.query(requete, params);
    return resultat.rows;
}

    // Obtenir une mission par ID
    static async trouverParId(id) {
        const requete = `
            SELECT m.*, 
                   d.type_dechet, d.quantite, d.unite, d.adresse,
                   d.notes as declaration_notes,
                   p.nom_complet as producteur_nom,
                   p.telephone as producteur_telephone,
                   p.adresse as producteur_adresse,
                   ST_AsGeoJSON(p.localisation_gps) as producteur_localisation,
                   c.nom_complet as collecteur_nom,
                   c.telephone as collecteur_telephone,
                   pdv.nom as point_depot_nom,
                   pdv.adresse as point_depot_adresse
            FROM missions m
            JOIN declarations_dechets d ON m.declaration_id = d.id
            JOIN producteurs p ON d.producteur_id = p.id
            LEFT JOIN collecteurs c ON m.collecteur_id = c.id
            LEFT JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
            WHERE m.id = $1
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }


    // Ajouter une photo preuve
    static async ajouterPhoto(missionId, collecteurId, url, type) {
        const requete = `
            INSERT INTO photos_preuves (mission_id, collecteur_id, url_photo, type_photo)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const resultat = await pool.query(requete, [missionId, collecteurId, url, type]);
        return resultat.rows[0];
    }



    // Obtenir les photos d'une mission
    static async obtenirPhotos(missionId) {
        const requete = `
            SELECT * FROM photos_preuves 
            WHERE mission_id = $1
            ORDER BY cree_le DESC
        `;
        const resultat = await pool.query(requete, [missionId]);
        return resultat.rows;
    }
}

export default Mission;