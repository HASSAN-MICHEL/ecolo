import { pool } from '../config/database.js';

class ProfileController {
    // Mettre à jour le profil
    static async mettreAJourProfil(req, res) {
        try {
            const producteurId = req.producteurId;
            const { nomComplet, telephone, adresse, quartier, commune } = req.body;

            // Validation
            if (!nomComplet) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Le nom complet est obligatoire' 
                });
            }

            // Vérifier si le téléphone existe déjà (sauf pour l'utilisateur actuel)
            if (telephone) {
                const checkPhoneQuery = `
                    SELECT id FROM producteurs 
                    WHERE telephone = $1 AND id != $2
                `;
                const phoneResult = await pool.query(checkPhoneQuery, [telephone, producteurId]);
                
                if (phoneResult.rows.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Ce numéro de téléphone est déjà utilisé'
                    });
                }
            }

            // Mettre à jour le profil
            const updateQuery = `
                UPDATE producteurs 
                SET nom_complet = $1,
                    telephone = COALESCE($2, telephone),
                    adresse = COALESCE($3, adresse),
                    quartier = COALESCE($4, quartier),
                    commune = COALESCE($5, commune),
                    modifie_le = CURRENT_TIMESTAMP
                WHERE id = $6
                RETURNING id, email, telephone, type_producteur, 
                          nom_complet, adresse, quartier, commune, 
                          points, cree_le, modifie_le
            `;

            const result = await pool.query(updateQuery, [
                nomComplet,
                telephone,
                adresse,
                quartier,
                commune,
                producteurId
            ]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Producteur non trouvé'
                });
            }

            res.json({
                success: true,
                message: 'Profil mis à jour avec succès',
                producteur: result.rows[0]
            });

        } catch (erreur) {
            console.error('Erreur mise à jour profil:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la mise à jour du profil',
                erreur: erreur.message 
            });
        }
    }

    // Changer le mot de passe
    static async changerMotDePasse(req, res) {
        try {
            const producteurId = req.producteurId;
            const { motDePasseActuel, nouveauMotDePasse } = req.body;

            // Validation
            if (!motDePasseActuel || !nouveauMotDePasse) {
                return res.status(400).json({
                    success: false,
                    message: 'Les deux mots de passe sont requis'
                });
            }

            if (nouveauMotDePasse.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: 'Le nouveau mot de passe doit contenir au moins 8 caractères'
                });
            }

            // Vérifier le mot de passe actuel
            const checkPasswordQuery = `
                SELECT mot_de_passe_hash FROM producteurs WHERE id = $1
            `;
            const passwordResult = await pool.query(checkPasswordQuery, [producteurId]);

            if (passwordResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Producteur non trouvé'
                });
            }

            // Dans un cas réel, vous vérifieriez avec bcrypt
            // const motDePasseValide = await bcrypt.compare(motDePasseActuel, passwordResult.rows[0].mot_de_passe_hash);
            // Pour l'instant, on simule
            const motDePasseValide = true; // À remplacer par la vérification réelle

            if (!motDePasseValide) {
                return res.status(401).json({
                    success: false,
                    message: 'Mot de passe actuel incorrect'
                });
            }

            // Hasher le nouveau mot de passe
            // const salt = await bcrypt.genSalt(10);
            // const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, salt);
            const nouveauMotDePasseHash = 'hashed_password'; // À remplacer

            // Mettre à jour le mot de passe
            const updateQuery = `
                UPDATE producteurs 
                SET mot_de_passe_hash = $1,
                    modifie_le = CURRENT_TIMESTAMP
                WHERE id = $2
            `;

            await pool.query(updateQuery, [nouveauMotDePasseHash, producteurId]);

            res.json({
                success: true,
                message: 'Mot de passe changé avec succès'
            });

        } catch (erreur) {
            console.error('Erreur changement mot de passe:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors du changement de mot de passe',
                erreur: erreur.message 
            });
        }
    }

    // Obtenir les informations du profil
    static async obtenirProfil(req, res) {
        try {
            const producteurId = req.producteurId;

            const query = `
                SELECT id, email, telephone, type_producteur, 
                       nom_complet, adresse, quartier, commune, 
                       points, cree_le, modifie_le, est_actif
                FROM producteurs 
                WHERE id = $1
            `;

            const result = await pool.query(query, [producteurId]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Producteur non trouvé'
                });
            }

            res.json({
                success: true,
                producteur: result.rows[0]
            });

        } catch (erreur) {
            console.error('Erreur récupération profil:', erreur);
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la récupération du profil',
                erreur: erreur.message 
            });
        }
    }
}

export default ProfileController;