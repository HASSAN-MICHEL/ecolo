import { pool } from '../config/database.js';

class DashboardController {
    // Obtenir les données du tableau de bord
    static async obtenirDashboard(req, res) {
        try {
            const producteurId = req.producteurId;

            // Requête pour obtenir toutes les statistiques
            const requete = `
                SELECT 
                    p.points,
                    COUNT(DISTINCT dd.id) as total_declarations,
                    COUNT(DISTINCT c.id) as total_collectes,
                    COALESCE(SUM(c.poids_reel), 0) as total_dechets_collectes,
                    MAX(c.terminee_le) as derniere_collecte_date
                FROM producteurs p
                LEFT JOIN declarations_dechets dd ON p.id = dd.producteur_id
                LEFT JOIN collectes c ON dd.id = c.declaration_id AND c.statut = 'terminee'
                WHERE p.id = $1
                GROUP BY p.id
            `;

            const resultat = await pool.query(requete, [producteurId]);
            const dashboardData = resultat.rows[0] || {
                points: 0,
                total_declarations: 0,
                total_collectes: 0,
                total_dechets_collectes: 0,
                derniere_collecte_date: null
            };

            res.json({
                success: true,
                data: dashboardData
            });
        } catch (erreur) {
            console.error('Erreur récupération dashboard:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la récupération du tableau de bord',
                erreur: erreur.message 
            });
        }
    }

    // Obtenir les notifications
    static async obtenirNotifications(req, res) {
        try {
            const producteurId = req.producteurId;
            const { limite = 10 } = req.query;

            const requete = `
                SELECT * FROM notifications
                WHERE producteur_id = $1
                ORDER BY cree_le DESC
                LIMIT $2
            `;

            const resultat = await pool.query(requete, [producteurId, parseInt(limite)]);
            
            res.json({
                success: true,
                notifications: resultat.rows,
                total: resultat.rows.length
            });
        } catch (erreur) {
            console.error('Erreur récupération notifications:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la récupération des notifications',
                erreur: erreur.message 
            });
        }
    }

    // Obtenir l'historique pour le dashboard
    static async obtenirHistoriqueDashboard(req, res) {
        try {
            const producteurId = req.producteurId;
            const { limite = 5 } = req.query;

            const requete = `
                SELECT 
                    dd.id,
                    dd.type_dechet,
                    dd.quantite,
                    dd.unite,
                    dd.statut,
                    dd.date_declaration,
                    c.date_reelle,
                    c.poids_reel,
                    c.points_attribues
                FROM declarations_dechets dd
                LEFT JOIN collectes c ON dd.id = c.declaration_id
                WHERE dd.producteur_id = $1
                ORDER BY dd.cree_le DESC
                LIMIT $2
            `;

            const resultat = await pool.query(requete, [producteurId, parseInt(limite)]);
            
            res.json({
                success: true,
                historique: resultat.rows,
                total: resultat.rows.length
            });
        } catch (erreur) {
            console.error('Erreur récupération historique:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la récupération de l\'historique',
                erreur: erreur.message 
            });
        }
    }
}

export default DashboardController;