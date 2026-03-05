// models/StockDechet.js
import { pool } from '../config/database.js';

class StockDechet {
    // Obtenir les stocks du point de collecte
    static async obtenirStocks(pointDepotId) {
        const requete = `
            SELECT 
                s.id,
                s.type_dechet,
                s.quantite_disponible,
                s.unite,
                s.prix_estime,
                s.dernier_mouvement,
                s.modifie_le,
                pdv.nom as point_depot_nom
            FROM stocks_dechets s
            JOIN points_depot_volontaire pdv ON s.point_depot_id = pdv.id
            WHERE s.point_depot_id = $1
            ORDER BY s.type_dechet
        `;
        
        const resultat = await pool.query(requete, [pointDepotId]);
        return resultat.rows;
    }
    
    // Mettre à jour manuellement un stock (ajustement)
    static async ajusterStock(pointDepotId, typeDechet, nouvelleQuantite, raison, gestionnaireId) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Récupérer l'ancienne quantité
            const ancien = await client.query(`
                SELECT quantite_disponible FROM stocks_dechets
                WHERE point_depot_id = $1 AND type_dechet = $2
            `, [pointDepotId, typeDechet]);
            
            const ancienneQuantite = ancien.rows[0]?.quantite_disponible || 0;
            
            // Mettre à jour le stock
            const resultat = await client.query(`
                INSERT INTO stocks_dechets (
                    point_depot_id,
                    type_dechet,
                    quantite_disponible,
                    dernier_mouvement
                ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                ON CONFLICT (point_depot_id, type_dechet) 
                DO UPDATE SET 
                    quantite_disponible = $3,
                    dernier_mouvement = CURRENT_TIMESTAMP,
                    modifie_le = CURRENT_TIMESTAMP
                RETURNING *
            `, [pointDepotId, typeDechet, nouvelleQuantite]);
            
            // Journaliser l'ajustement
            await client.query(`
                INSERT INTO historique_actions (
                    utilisateur_id,
                    action,
                    details,
                    cree_le
                ) VALUES ($1, 'ajustement_stock', $2, CURRENT_TIMESTAMP)
            `, [
                gestionnaireId,
                JSON.stringify({
                    point_depot_id: pointDepotId,
                    type_dechet: typeDechet,
                    ancienne_quantite: ancienneQuantite,
                    nouvelle_quantite: nouvelleQuantite,
                    raison: raison
                })
            ]);
            
            await client.query('COMMIT');
            return resultat.rows[0];
            
        } catch (erreur) {
            await client.query('ROLLBACK');
            console.error('❌ Erreur dans ajusterStock:', erreur);
            throw erreur;
        } finally {
            client.release();
        }
    }
    
    // Obtenir l'historique des mouvements de stock
    static async historiqueMouvements(pointDepotId, limite = 50) {
        const requete = `
            SELECT 
                ha.id,
                ha.action,
                ha.details,
                ha.cree_le,
                gp.nom_complet as effectue_par
            FROM historique_actions ha
            JOIN gestionnaires_points gp ON ha.utilisateur_id = gp.id
            WHERE ha.action IN ('achat_dechets', 'ajustement_stock')
              AND ha.details->>'point_depot_id' = $1::text
            ORDER BY ha.cree_le DESC
            LIMIT $2
        `;
        
        const resultat = await pool.query(requete, [pointDepotId, limite]);
        return resultat.rows;
    }
    
    // Alerte quand un stock est bas
    static async stocksBas(seuil = 50) {
        const requete = `
            SELECT 
                s.*,
                pdv.nom as point_depot_nom,
                pdv.commune
            FROM stocks_dechets s
            JOIN points_depot_volontaire pdv ON s.point_depot_id = pdv.id
            WHERE s.quantite_disponible < $1
            ORDER BY s.quantite_disponible ASC
        `;
        
        const resultat = await pool.query(requete, [seuil]);
        return resultat.rows;
    }


    static async listerDisponibles(filtres = {}) {
    let requete = `
        SELECT 
            s.*,
            pdv.nom as point_nom,
            pdv.commune,
            pdv.quartier,
            pdv.adresse,
            pdv.localisation_gps,
            (s.quantite_disponible - COALESCE(s.quantite_reservee, 0)) as quantite_immediatement_disponible
        FROM stocks_dechets s
        JOIN points_depot_volontaire pdv ON s.point_depot_id = pdv.id
        WHERE s.quantite_disponible > 0
    `;
    const valeurs = [];
    let index = 1;

    if (filtres.typeDechet) {
        requete += ` AND s.type_dechet = $${index++}`;
        valeurs.push(filtres.typeDechet);
    }

    if (filtres.commune) {
        requete += ` AND pdv.commune = $${index++}`;
        valeurs.push(filtres.commune);
    }

    requete += ` ORDER BY s.quantite_disponible DESC`;

    const resultat = await pool.query(requete, valeurs);
    return resultat.rows;
}

// Trouver un stock par point et type
static async trouverParPointEtType(pointDepotId, typeDechet) {
    const requete = `
        SELECT * FROM stocks_dechets 
        WHERE point_depot_id = $1 AND type_dechet = $2
    `;
    const resultat = await pool.query(requete, [pointDepotId, typeDechet]);
    return resultat.rows[0];
}

// Réduire le stock après enlèvement
static async reduireStock(pointDepotId, typeDechet, quantite) {
    const requete = `
        UPDATE stocks_dechets 
        SET quantite_disponible = quantite_disponible - $1,
            dernier_mouvement = CURRENT_TIMESTAMP
        WHERE point_depot_id = $2 AND type_dechet = $3
        RETURNING *
    `;
    const resultat = await pool.query(requete, [quantite, pointDepotId, typeDechet]);
    return resultat.rows[0];
}
}

export default StockDechet;