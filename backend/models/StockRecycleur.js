// models/StockRecycleur.js
import { pool } from '../config/database.js';

class StockRecycleur {
    // Initialiser ou mettre à jour le stock d'un recycleur après validation d'une demande
    static async ajouterDepuisDemande(demandeId, recycleurId, typeDechet, quantite) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            // Arrondir la quantité à 2 décimales
            const quantiteArrondie = Math.round(parseFloat(quantite) * 100) / 100;
            
            // Récupérer le stock actuel
            const stockActuel = await client.query(`
                SELECT quantite_disponible 
                FROM stocks_recycleurs 
                WHERE recycleur_id = $1 AND type_dechet = $2
                FOR UPDATE
            `, [recycleurId, typeDechet]);
            
            let stockAvant = 0;
            let stockApres = quantiteArrondie;
            
            if (stockActuel.rows.length > 0) {
                stockAvant = parseFloat(stockActuel.rows[0].quantite_disponible);
                stockApres = stockAvant + quantiteArrondie;
                
                // Mettre à jour le stock existant
                await client.query(`
                    UPDATE stocks_recycleurs 
                    SET quantite_disponible = $1,
                        dernier_mouvement = CURRENT_TIMESTAMP,
                        modifie_le = CURRENT_TIMESTAMP
                    WHERE recycleur_id = $2 AND type_dechet = $3
                `, [stockApres, recycleurId, typeDechet]);
            } else {
                // Créer un nouveau stock
                await client.query(`
                    INSERT INTO stocks_recycleurs (
                        recycleur_id, type_dechet, quantite_disponible, 
                        dernier_mouvement
                    ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                `, [recycleurId, typeDechet, quantiteArrondie]);
            }
            
            // Journaliser dans l'historique
            await client.query(`
                INSERT INTO historique_stocks_recycleurs (
                    recycleur_id, type_mouvement, type_dechet, quantite,
                    stock_avant, stock_apres, reference_id, reference_type, notes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [
                recycleurId,
                'reception',
                typeDechet,
                quantiteArrondie,
                stockAvant,
                stockApres,
                demandeId,
                'demande',
                `Réception suite à validation de la demande`
            ]);
            
            await client.query('COMMIT');
            
            return {
                recycleurId,
                typeDechet,
                quantite: quantiteArrondie,
                stockAvant,
                stockApres
            };
            
        } catch (erreur) {
            await client.query('ROLLBACK');
            console.error('❌ Erreur ajouterDepuisDemande:', erreur);
            throw erreur;
        } finally {
            client.release();
        }
    }
    
    // Retirer du stock après déclaration de recyclage
    // models/StockRecycleur.js - Méthode retirerPourRecyclage avec logs

static async retirerPourRecyclage(recycleurId, typeDechet, quantite, declarationId) {
    const client = await pool.connect();
    
    try {
        console.log(`📝 retirerPourRecyclage - Début`);
        console.log(`   recycleurId: ${recycleurId}`);
        console.log(`   typeDechet: ${typeDechet}`);
        console.log(`   quantite: ${quantite}`);
        
        await client.query('BEGIN');
        
        const quantiteArrondie = Math.round(parseFloat(quantite) * 100) / 100;
        
        // Vérifier le stock disponible
        const stockCheck = await client.query(`
            SELECT quantite_disponible 
            FROM stocks_recycleurs 
            WHERE recycleur_id = $1 AND type_dechet = $2
            FOR UPDATE
        `, [recycleurId, typeDechet]);
        
        if (stockCheck.rows.length === 0) {
            throw new Error(`Aucun stock disponible pour ${typeDechet}`);
        }
        
        const stockAvant = parseFloat(stockCheck.rows[0].quantite_disponible);
        const stockApres = stockAvant - quantiteArrondie;
        
        console.log(`   Stock avant: ${stockAvant}, après: ${stockApres}`);
        
        if (stockApres < -0.01) { // Marge d'erreur de 0.01 kg
            throw new Error(`Stock insuffisant. Disponible: ${stockAvant.toFixed(2)} kg, Demandé: ${quantiteArrondie.toFixed(2)} kg`);
        }
        
        // Mettre à jour le stock
        await client.query(`
            UPDATE stocks_recycleurs 
            SET quantite_disponible = $1,
                dernier_mouvement = CURRENT_TIMESTAMP,
                modifie_le = CURRENT_TIMESTAMP
            WHERE recycleur_id = $2 AND type_dechet = $3
        `, [stockApres, recycleurId, typeDechet]);
        
        // Journaliser dans l'historique
        await client.query(`
            INSERT INTO historique_stocks_recycleurs (
                recycleur_id, type_mouvement, type_dechet, quantite,
                stock_avant, stock_apres, reference_id, reference_type, notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
            recycleurId,
            'recyclage',
            typeDechet,
            quantiteArrondie,
            stockAvant,
            stockApres,
            declarationId,
            'declaration',
            `Recyclage de ${quantiteArrondie} kg`
        ]);
        
        await client.query('COMMIT');
        console.log(`✅ retirerPourRecyclage - Succès`);
        
        return {
            recycleurId,
            typeDechet,
            quantite: quantiteArrondie,
            stockAvant,
            stockApres
        };
        
    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur retirerPourRecyclage:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}
    // Récupérer le stock d'un recycleur
    static async getStocksRecycleur(recycleurId) {
        const requete = `
            SELECT 
                id,
                type_dechet,
                quantite_disponible,
                unite,
                dernier_mouvement
            FROM stocks_recycleurs
            WHERE recycleur_id = $1 AND quantite_disponible > 0
            ORDER BY type_dechet
        `;
        const resultat = await pool.query(requete, [recycleurId]);
        return resultat.rows;
    }
    
    // Récupérer l'historique des mouvements
    static async getHistorique(recycleurId, limite = 50) {
        const requete = `
            SELECT 
                id,
                type_mouvement,
                type_dechet,
                quantite,
                stock_avant,
                stock_apres,
                reference_id,
                reference_type,
                notes,
                cree_le
            FROM historique_stocks_recycleurs
            WHERE recycleur_id = $1
            ORDER BY cree_le DESC
            LIMIT $2
        `;
        const resultat = await pool.query(requete, [recycleurId, limite]);
        return resultat.rows;
    }
    
    // Obtenir les statistiques par type de déchet
    static async getStatistiquesParType(recycleurId) {
        const requete = `
            SELECT 
                type_dechet,
                SUM(CASE WHEN type_mouvement = 'reception' THEN quantite ELSE 0 END) as total_recu,
                SUM(CASE WHEN type_mouvement = 'recyclage' THEN quantite ELSE 0 END) as total_recycle,
                (SUM(CASE WHEN type_mouvement = 'reception' THEN quantite ELSE 0 END) - 
                 SUM(CASE WHEN type_mouvement = 'recyclage' THEN quantite ELSE 0 END)) as stock_actuel
            FROM historique_stocks_recycleurs
            WHERE recycleur_id = $1
            GROUP BY type_dechet
            ORDER BY type_dechet
        `;
        const resultat = await pool.query(requete, [recycleurId]);
        return resultat.rows;
    }
}

export default StockRecycleur;