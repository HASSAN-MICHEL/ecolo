import PointDepot from '../models/PointDepot.js';

class PointDepotController {
    // Récupérer tous les points de collecte
    static async getAll(req, res) {
        try {
            const points = await PointDepot.getAll();
            res.json({
                success: true,
                points,
                total: points.length
            });
        } catch (erreur) {
            console.error('❌ Erreur récupération points:', erreur);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors de la récupération des points de collecte' 
            });
        }
    }

    // Récupérer un point de collecte par ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const point = await PointDepot.getById(id);
            
            if (!point) {
                return res.status(404).json({
                    success: false,
                    message: 'Point de collecte non trouvé'
                });
            }

            res.json({
                success: true,
                point
            });
        } catch (erreur) {
            console.error('❌ Erreur:', erreur);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
    }

    // Créer un point de collecte
    static async create(req, res) {
        try {
            const nouveauPoint = await PointDepot.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Point de collecte créé avec succès',
                point: nouveauPoint
            });
        } catch (erreur) {
            console.error('❌ Erreur création point:', erreur);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors de la création du point de collecte' 
            });
        }
    }

    // Mettre à jour un point de collecte
    static async update(req, res) {
        try {
            const { id } = req.params;
            const point = await PointDepot.update(id, req.body);
            
            if (!point) {
                return res.status(404).json({
                    success: false,
                    message: 'Point de collecte non trouvé'
                });
            }

            res.json({
                success: true,
                message: 'Point de collecte mis à jour avec succès',
                point
            });
        } catch (erreur) {
            console.error('❌ Erreur mise à jour point:', erreur);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors de la mise à jour du point de collecte' 
            });
        }
    }

    // Supprimer (désactiver) un point de collecte
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const point = await PointDepot.delete(id);
            
            if (!point) {
                return res.status(404).json({
                    success: false,
                    message: 'Point de collecte non trouvé'
                });
            }

            res.json({
                success: true,
                message: 'Point de collecte désactivé avec succès'
            });
        } catch (erreur) {
            console.error('❌ Erreur suppression point:', erreur);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur lors de la suppression du point de collecte' 
            });
        }
    }
}

export default PointDepotController;