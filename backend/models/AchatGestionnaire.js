// import { pool } from '../config/database.js';

// class AchatGestionnaire {
//     static async creer(donnees) {
//         const requete = `
//             INSERT INTO achats_gestionnaires (
//                 gestionnaire_id, point_depot_id, nom_vendeur,
//                 telephone_vendeur, type_dechet, poids,
//                 prix_par_kg, recu_url, notes
//             ) VALUES ($1, $2, $3, $4, $5::type_dechet, $6, $7, $8, $9)
//             RETURNING *
//         `;

//         const valeurs = [
//             donnees.gestionnaireId,
//             donnees.pointDepotId,
//             donnees.nomVendeur,
//             donnees.telephoneVendeur,
//             donnees.typeDechet,
//             donnees.poids,
//             donnees.prixParKg,
//             donnees.recuUrl,
//             donnees.notes
//         ];

//         const resultat = await pool.query(requete, valeurs);
        
//         // Mettre à jour le stock
//         await pool.query(`
//             INSERT INTO stocks_dechets (point_depot_id, type_dechet, quantite_disponible, dernier_mouvement)
//             VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
//             ON CONFLICT (point_depot_id, type_dechet) 
//             DO UPDATE SET 
//                 quantite_disponible = stocks_dechets.quantite_disponible + EXCLUDED.quantite_disponible,
//                 dernier_mouvement = EXCLUDED.dernier_mouvement
//         `, [donnees.pointDepotId, donnees.typeDechet, donnees.poids]);

//         return resultat.rows[0];
//     }

//     static async lister(filtres = {}) {
//         let requete = `
//             SELECT a.*, gp.nom_complet as gestionnaire_nom,
//                    pdv.nom as point_nom
//             FROM achats_gestionnaires a
//             JOIN gestionnaires_points gp ON a.gestionnaire_id = gp.id
//             JOIN points_depot_volontaire pdv ON a.point_depot_id = pdv.id
//             WHERE 1=1
//         `;
//         const valeurs = [];

//         if (filtres.gestionnaireId) {
//             requete += ` AND a.gestionnaire_id = $${valeurs.length + 1}`;
//             valeurs.push(filtres.gestionnaireId);
//         }
//         if (filtres.pointDepotId) {
//             requete += ` AND a.point_depot_id = $${valeurs.length + 1}`;
//             valeurs.push(filtres.pointDepotId);
//         }
//         if (filtres.dateDebut) {
//             requete += ` AND a.date_achat >= $${valeurs.length + 1}`;
//             valeurs.push(filtres.dateDebut);
//         }
//         if (filtres.dateFin) {
//             requete += ` AND a.date_achat <= $${valeurs.length + 1}`;
//             valeurs.push(filtres.dateFin);
//         }

//         requete += ' ORDER BY a.date_achat DESC';
        
//         const resultat = await pool.query(requete, valeurs);
//         return resultat.rows;
//     }

//     static async getStats(gestionnaireId) {
//         const requete = `
//             SELECT 
//                 COUNT(*) as total_achats,
//                 COALESCE(SUM(poids), 0) as total_poids,
//                 COALESCE(SUM(total), 0) as total_montant,
//                 AVG(prix_par_kg) as prix_moyen,
//                 COUNT(DISTINCT nom_vendeur) as vendeurs_distincts
//             FROM achats_gestionnaires
//             WHERE gestionnaire_id = $1
//         `;
//         const resultat = await pool.query(requete, [gestionnaireId]);
//         return resultat.rows[0];
//     }
// }

// export default AchatGestionnaire;


// models/AchatGestionnaire.js
import { pool } from '../config/database.js';

class AchatGestionnaire {
    // Créer un achat de déchets (vendeur non inscrit)
   static async creerAchat(donnees, gestionnaireId) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // 1. Insérer l'achat - MAINTENANT avec "recu_url" (sans accent)
        const requeteAchat = `
            INSERT INTO achats_gestionnaires (
                gestionnaire_id,
                point_depot_id,
                nom_vendeur,
                telephone_vendeur,
                type_dechet,
                poids,
                prix_par_kg,
                recu_url,        -- ← Nouveau nom sans accent
                notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, type_dechet, poids, prix_par_kg, total, date_achat
        `;
        
        const valeursAchat = [
            gestionnaireId,
            donnees.pointDepotId,
            donnees.nomVendeur || 'Anonyme',
            donnees.telephoneVendeur || null,
            donnees.typeDechet,
            donnees.poids,
            donnees.prixParKg,
            donnees.recuUrl || null,    // Correspond au paramètre
            donnees.notes || null
        ];
        
        console.log('📝 Requête SQL:', requeteAchat);
        console.log('📦 Valeurs:', valeursAchat);
        
        const resultatAchat = await client.query(requeteAchat, valeursAchat);
        const achat = resultatAchat.rows[0];
        
        // 2. Mettre à jour le stock
        await client.query(`
            INSERT INTO stocks_dechets (
                point_depot_id,
                type_dechet,
                quantite_disponible,
                dernier_mouvement
            ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            ON CONFLICT (point_depot_id, type_dechet) 
            DO UPDATE SET 
                quantite_disponible = stocks_dechets.quantite_disponible + $3,
                dernier_mouvement = CURRENT_TIMESTAMP,
                modifie_le = CURRENT_TIMESTAMP
        `, [donnees.pointDepotId, donnees.typeDechet, donnees.poids]);
        
        // 3. Journaliser l'action
        await client.query(`
            INSERT INTO historique_actions (
                utilisateur_id,
                action,
                details,
                cree_le
            ) VALUES ($1, 'achat_dechets', $2, CURRENT_TIMESTAMP)
        `, [
            gestionnaireId,
            JSON.stringify({
                achat_id: achat.id,
                type_dechet: donnees.typeDechet,
                poids: donnees.poids,
                montant: achat.total,
                vendeur: donnees.nomVendeur || 'Anonyme'
            })
        ]);
        
        await client.query('COMMIT');
        
        return {
            ...achat,
            message: `Achat de ${donnees.poids} kg de ${donnees.typeDechet} effectué avec succès`
        };
        
    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur dans creerAchat:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}

// Mettez également à jour les autres méthodes qui pourraient utiliser cette colonne
static async getRecuAchat(achatId) {
    try {
        const requete = `
            SELECT a.*, gp.nom_complet as gestionnaire_nom, pdv.nom as point_depot_nom
            FROM achats_gestionnaires a
            JOIN gestionnaires_points gp ON a.gestionnaire_id = gp.id
            JOIN points_depot_volontaire pdv ON a.point_depot_id = pdv.id
            WHERE a.id = $1
        `;
        
        const resultat = await pool.query(requete, [achatId]);
        
        if (resultat.rows.length === 0) {
            return null;
        }
        
        return resultat.rows[0];
    } catch (error) {
        console.error('❌ Erreur getRecuAchat:', error);
        throw error;
    }
}
    
    // Obtenir l'historique des achats du gestionnaire
    static async historiqueAchats(gestionnaireId, limite = 50, offset = 0) {
        const requete = `
            SELECT 
                a.id,
                a.type_dechet,
                a.poids,
                a.prix_par_kg,
                a.total,
                a.date_achat,
                a.nom_vendeur,
                a.telephone_vendeur,
                a.recu_url,
                a.notes,
                pdv.nom as point_depot_nom
            FROM achats_gestionnaires a
            JOIN points_depot_volontaire pdv ON a.point_depot_id = pdv.id
            WHERE a.gestionnaire_id = $1
            ORDER BY a.date_achat DESC
            LIMIT $2 OFFSET $3
        `;
        
        const resultat = await pool.query(requete, [gestionnaireId, limite, offset]);
        return resultat.rows;
    }
    
    // Obtenir les statistiques des achats
    static async statistiquesAchats(gestionnaireId, periode = '30 days') {
        const requete = `
            SELECT 
                COUNT(*) as nombre_achats,
                SUM(poids) as poids_total_achete,
                SUM(total) as montant_total_depense,
                AVG(prix_par_kg) as prix_moyen_kg,
                COUNT(DISTINCT type_dechet) as types_dechets_achetes,
                COUNT(DISTINCT DATE(date_achat)) as jours_activite
            FROM achats_gestionnaires
            WHERE gestionnaire_id = $1
              AND date_achat >= NOW() - $2::INTERVAL
        `;
        
        const resultat = await pool.query(requete, [gestionnaireId, periode]);
        return resultat.rows[0];
    }
    
    // Statistiques par type de déchet
    static async statistiquesParType(gestionnaireId, periode = '30 days') {
        const requete = `
            SELECT 
                type_dechet,
                COUNT(*) as nombre_achats,
                SUM(poids) as poids_total,
                SUM(total) as montant_total,
                AVG(prix_par_kg) as prix_moyen,
                MAX(prix_par_kg) as prix_max,
                MIN(prix_par_kg) as prix_min
            FROM achats_gestionnaires
            WHERE gestionnaire_id = $1
              AND date_achat >= NOW() - $2::INTERVAL
            GROUP BY type_dechet
            ORDER BY poids_total DESC
        `;
        
        const resultat = await pool.query(requete, [gestionnaireId, periode]);
        return resultat.rows;
    }
}

export default AchatGestionnaire;