import { pool } from '../config/database.js';

class Producteur {
    static async creer(producteurData) {
        const requete = `
            INSERT INTO producteurs (
                email, telephone, mot_de_passe_hash, type_producteur,
                nom_complet, adresse, localisation_gps, quartier, commune, cgu_acceptees
            ) VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326), $9, $10, $11)
            RETURNING id, email, telephone, type_producteur, nom_complet, quartier, commune, cree_le
        `;
        
        const valeurs = [
            producteurData.email,
            producteurData.telephone,
            producteurData.motDePasseHash,
            producteurData.typeProducteur,
            producteurData.nomComplet,
            producteurData.adresse,
            producteurData.longitude,
            producteurData.latitude,
            producteurData.quartier,
            producteurData.commune,
            producteurData.cguAcceptees || false
        ];
        
        const resultat = await pool.query(requete, valeurs);
        return resultat.rows[0];
    }

    static async trouverParEmail(email) {
        const requete = 'SELECT * FROM producteurs WHERE email = $1';
        const resultat = await pool.query(requete, [email]);
        return resultat.rows[0];
    }

    static async trouverParTelephone(telephone) {
        const requete = 'SELECT * FROM producteurs WHERE telephone = $1';
        const resultat = await pool.query(requete, [telephone]);
        return resultat.rows[0];
    }

    static async trouverParId(id) {
        const requete = `
            SELECT id, email, telephone, type_producteur, nom_complet, adresse,
                   quartier, commune, est_actif, points, cree_le
            FROM producteurs WHERE id = $1
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    static async mettreAJour(id, donnees) {
        const champs = Object.keys(donnees);
        const valeurs = Object.values(donnees);
        
        const requete = `
            UPDATE producteurs 
            SET ${champs.map((champ, index) => `${champ} = $${index + 1}`).join(', ')}
            WHERE id = $${champs.length + 1}
            RETURNING id, email, telephone, type_producteur, nom_complet, quartier, commune
        `;
        
        const resultat = await pool.query(requete, [...valeurs, id]);
        return resultat.rows[0];
    }

    static async reinitialiserMotDePasse(id, nouveauMotDePasseHash) {
        const requete = `
            UPDATE producteurs 
            SET mot_de_passe_hash = $1 
            WHERE id = $2
        `;
        await pool.query(requete, [nouveauMotDePasseHash, id]);
    }

    static async obtenirTableauDeBord(producteurId) {
        const requete = `
            SELECT * FROM tableau_bord_producteur 
            WHERE producteur_id = $1
        `;
        const resultat = await pool.query(requete, [producteurId]);
        return resultat.rows[0];
    }
}

export default Producteur;