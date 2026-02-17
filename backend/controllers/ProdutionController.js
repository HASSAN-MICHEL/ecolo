


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Producteur from '../models/Producteur.js';
import require from 'express';
import crypto from 'crypto';
import { pool } from '../config/database.js';

class ProdutionController {
    // Inscription
    static async inscrire(req, res) {
        try {
            const { 
                email, 
                telephone, 
                motDePasse, 
                typeProducteur, 
                nomComplet, 
                adresse, 
                longitude, 
                latitude, 
                quartier, 
                commune,
                cguAcceptees 
            } = req.body;

            // Vérifier si l'utilisateur existe déjà
            const producteurExiste = await Producteur.trouverParEmail(email);
            if (producteurExiste) {
                return res.status(400).json({ 
                    message: 'Un compte avec cet email existe déjà' 
                });
            }

            // Vérifier le téléphone
            const telephoneExiste = await Producteur.trouverParTelephone(telephone);
            if (telephoneExiste) {
                return res.status(400).json({ 
                    message: 'Un compte avec ce numéro de téléphone existe déjà' 
                });
            }

            // Valider les CGU
            if (!cguAcceptees) {
                return res.status(400).json({ 
                    message: 'Vous devez accepter les CGU' 
                });
            }

            // Hasher le mot de passe
            const salt = await bcrypt.genSalt(10);
            const motDePasseHash = await bcrypt.hash(motDePasse, salt);

            // Créer le producteur
            const producteurData = {
                email,
                telephone,
                motDePasseHash,
                typeProducteur,
                nomComplet,
                adresse,
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude),
                quartier,
                commune,
                cguAcceptees
            };

            const nouveauProducteur = await Producteur.creer(producteurData);

            // Générer le token JWT
            const token = jwt.sign(
                { id: nouveauProducteur.id, email: nouveauProducteur.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            res.status(201).json({
                message: 'Inscription réussie',
                token,
                producteur: {
                    id: nouveauProducteur.id,
                    email: nouveauProducteur.email,
                    telephone: nouveauProducteur.telephone,
                    typeProducteur: nouveauProducteur.type_producteur,
                    nomComplet: nouveauProducteur.nom_complet,
                    quartier: nouveauProducteur.quartier,
                    commune: nouveauProducteur.commune
                }
            });
        } catch (erreur) {
            console.error('Erreur inscription:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de l\'inscription',
                erreur: erreur.message 
            });
        }
    }

    // Connexion
    static async connecter(req, res) {
        try {
            const { identifiant, motDePasse } = req.body;

            // Trouver le producteur par email ou téléphone
            let producteur = await Producteur.trouverParEmail(identifiant);
            if (!producteur) {
                producteur = await Producteur.trouverParTelephone(identifiant);
            }

            if (!producteur) {
                return res.status(401).json({ 
                    message: 'Identifiants incorrects' 
                });
            }

            // Vérifier le mot de passe
            const motDePasseValide = await bcrypt.compare(motDePasse, producteur.mot_de_passe_hash);
            if (!motDePasseValide) {
                return res.status(401).json({ 
                    message: 'Identifiants incorrects' 
                });
            }

            // Vérifier si le compte est actif
            if (!producteur.est_actif) {
                return res.status(403).json({ 
                    message: 'Compte désactivé. Contactez l\'administration.' 
                });
            }

            // Générer le token JWT
            const token = jwt.sign(
                { id: producteur.id, email: producteur.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            res.json({
                message: 'Connexion réussie',
                token,
                producteur: {
                    id: producteur.id,
                    email: producteur.email,
                    telephone: producteur.telephone,
                    typeProducteur: producteur.type_producteur,
                    nomComplet: producteur.nom_complet,
                    points: producteur.points,
                    quartier: producteur.quartier,
                    commune: producteur.commune
                }
            });
        } catch (erreur) {
            console.error('Erreur connexion:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de la connexion',
                erreur: erreur.message 
            });
        }
    }

    // Demande de réinitialisation de mot de passe
    static async demanderReinitialisationMdp(req, res) {
        try {
            const { email } = req.body;

            const producteur = await Producteur.trouverParEmail(email);
            if (!producteur) {
                // Pour des raisons de sécurité, on ne révèle pas si l'email existe
                return res.json({ 
                    message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation' 
                });
            }

            // Générer un token de réinitialisation
            const token = crypto.randomBytes(32).toString('hex');
            const expireLe = new Date();
            expireLe.setHours(expireLe.getHours() + 1); // Valide 1 heure

            // Sauvegarder le token
            const requete = `
                INSERT INTO tokens_reinitialisation_mdp 
                (producteur_id, token, expire_le)
                VALUES ($1, $2, $3)
            `;
            await pool.query(requete, [producteur.id, token, expireLe]);

            // Ici, vous devriez envoyer un email avec le lien
            // Pour l'instant, on retourne le token (dans un environnement réel, envoyez un email)
            const lienReinitialisation = `${process.env.FRONTEND_URL}/reinitialiser-mot-de-passe?token=${token}`;
            
            console.log(`Lien de réinitialisation pour ${email}: ${lienReinitialisation}`);

            res.json({ 
                message: 'Lien de réinitialisation généré avec succès',
                lien: lienReinitialisation // À supprimer en production
            });
        } catch (erreur) {
            console.error('Erreur demande réinitialisation:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de la demande de réinitialisation',
                erreur: erreur.message 
            });
        }
    }

    // Réinitialiser le mot de passe
    static async reinitialiserMdp(req, res) {
        try {
            const { token, nouveauMotDePasse } = req.body;

            // Vérifier le token
            const requeteToken = `
                SELECT * FROM tokens_reinitialisation_mdp 
                WHERE token = $1 AND utilise = false AND expire_le > NOW()
            `;
            const resultatToken = await pool.query(requeteToken, [token]);
            const tokenValide = resultatToken.rows[0];

            if (!tokenValide) {
                return res.status(400).json({ 
                    message: 'Token invalide ou expiré' 
                });
            }

            // Hasher le nouveau mot de passe
            const salt = await bcrypt.genSalt(10);
            const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, salt);

            // Mettre à jour le mot de passe
            await Producteur.reinitialiserMotDePasse(tokenValide.producteur_id, nouveauMotDePasseHash);

            // Marquer le token comme utilisé
            await pool.query(
                'UPDATE tokens_reinitialisation_mdp SET utilise = true WHERE id = $1',
                [tokenValide.id]
            );

            res.json({ 
                message: 'Mot de passe réinitialisé avec succès' 
            });
        } catch (erreur) {
            console.error('Erreur réinitialisation:', erreur);
            res.status(500).json({ 
                message: 'Erreur lors de la réinitialisation du mot de passe',
                erreur: erreur.message 
            });
        }
    }

    // Vérifier le token (pour le middleware)
    static verifierTokenne(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                message: 'Accès non autorisé Vous ne pouvez pas . Token manquant.' 
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.producteurId = decode.id;
            req.producteurEmail = decode.email;
            next();
        } catch (erreur) {
            return res.status(401).json({ 
                message: 'Token invalide ou expiré' 
            });
        }
    }
}

export default ProdutionController;

