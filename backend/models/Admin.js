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

static async mettreAJour(id, donnees) {
    // Construction dynamique des champs à mettre à jour
    const champs = [];
    const valeurs = [];
    let index = 1;

    if (donnees.nomComplet !== undefined) {
        champs.push(`nom_complet = $${index++}`);
        valeurs.push(donnees.nomComplet);
    }
    if (donnees.email !== undefined) {
        champs.push(`email = $${index++}`);
        valeurs.push(donnees.email);
    }
    if (donnees.telephone !== undefined) {
        champs.push(`telephone = $${index++}`);
        valeurs.push(donnees.telephone);
    }
    if (donnees.role !== undefined) {
        champs.push(`role = $${index++}`);
        valeurs.push(donnees.role);
    }
    if (donnees.motDePasseHash !== undefined) {
        champs.push(`mot_de_passe_hash = $${index++}`);
        valeurs.push(donnees.motDePasseHash);
    }
    // Ajoutez d'autres champs si nécessaire (par exemple 'est_actif' pour un super admin)

    if (champs.length === 0) {
        throw new Error('Aucune donnée à mettre à jour');
    }

    valeurs.push(id);
    const requete = `
        UPDATE admins
        SET ${champs.join(', ')}, mis_a_jour_le = NOW()
        WHERE id = $${index}
        RETURNING id, email, telephone, nom_complet, role, est_actif, cree_le, mis_a_jour_le
    `;

    const resultat = await pool.query(requete, valeurs);
    return resultat.rows[0];
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