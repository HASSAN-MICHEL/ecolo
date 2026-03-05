import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';

class Admin {
    // Créer un nouvel admin
    static async creer(donnees) {
        const requete = `
            INSERT INTO admins (
                email, telephone, mot_de_passe_hash, nom_complet, role
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, telephone, nom_complet, role, cree_le
        `;
        
        const valeurs = [
            donnees.email,
            donnees.telephone || null,
            donnees.motDePasseHash,
            donnees.nomComplet,
            donnees.role || 'admin'
        ];
        
        try {
            const resultat = await pool.query(requete, valeurs);
            return resultat.rows[0];
        } catch (error) {
            console.error('❌ Erreur création admin:', error);
            throw error;
        }
    }

    // Trouver par email
    static async trouverParEmail(email) {
        const requete = 'SELECT * FROM admins WHERE email = $1';
        const resultat = await pool.query(requete, [email]);
        return resultat.rows[0];
    }

    // Trouver par téléphone
    static async trouverParTelephone(telephone) {
        const requete = 'SELECT * FROM admins WHERE telephone = $1';
        const resultat = await pool.query(requete, [telephone]);
        return resultat.rows[0];
    }

    // Trouver par ID
    static async trouverParId(id) {
        const requete = `
            SELECT id, email, telephone, nom_complet, role, est_actif,
                   derniere_connexion, cree_le
            FROM admins 
            WHERE id = $1
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    // Mettre à jour la connexion
    static async mettreAJourConnexion(id) {
        const requete = `
            UPDATE admins 
            SET derniere_connexion = CURRENT_TIMESTAMP
            WHERE id = $1
        `;
        await pool.query(requete, [id]);
    }

    // Lister tous les admins
    static async listerTous() {
        const requete = `
            SELECT id, email, telephone, nom_complet, role, est_actif,
                   derniere_connexion, cree_le
            FROM admins
            ORDER BY cree_le DESC
        `;
        const resultat = await pool.query(requete);
        return resultat.rows;
    }

    // Désactiver un admin
    static async desactiver(id) {
        const requete = `
            UPDATE admins 
            SET est_actif = false, modifie_le = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING id, email, nom_complet
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    // Activer un admin
    static async activer(id) {
        const requete = `
            UPDATE admins 
            SET est_actif = true, modifie_le = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING id, email, nom_complet
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }
}

export default Admin;