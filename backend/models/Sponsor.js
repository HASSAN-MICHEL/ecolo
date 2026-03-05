


import { pool } from '../config/database.js';

class Sponsor {
  static async creer(donnees) {
    const requete = `
        INSERT INTO sponsors (
            email, telephone, mot_de_passe_hash, nom_organisation,
            type_organisation, nom_responsable, adresse,
            localisation_gps, statut, est_actif,
            cgu_acceptees, cgu_acceptees_le
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 
            CASE WHEN $8::text IS NOT NULL THEN ST_GeogFromText($8) ELSE NULL END,
            $9, $10, $11, CURRENT_TIMESTAMP)
        RETURNING *
    `;
    
    const pointGeo = donnees.localisation_gps ? 
        `POINT(${donnees.localisation_gps.lng} ${donnees.localisation_gps.lat})` : null;
    
    const valeurs = [
        donnees.email,
        donnees.telephone,
        donnees.motDePasseHash,
        donnees.nomOrganisation,
        donnees.typeOrganisation,
        donnees.nomResponsable,
        donnees.adresse,
        pointGeo,
        donnees.statut || 'actif',
        donnees.est_actif !== undefined ? donnees.est_actif : true,
        donnees.cguAcceptees || false
    ];

    const resultat = await pool.query(requete, valeurs);
    return resultat.rows[0];
}

    static async trouverParEmail(email) {
        const requete = 'SELECT * FROM sponsors WHERE email = $1';
        const resultat = await pool.query(requete, [email]);
        return resultat.rows[0];
    }

    static async trouverParTelephone(telephone) {
        const requete = 'SELECT * FROM sponsors WHERE telephone = $1';
        const resultat = await pool.query(requete, [telephone]);
        return resultat.rows[0];
    }

    static async trouverParId(id) {
        const requete = 'SELECT * FROM sponsors WHERE id = $1';
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    static async listerTous(filtres = {}) {
        let requete = 'SELECT * FROM sponsors WHERE 1=1';
        const valeurs = [];
        
        if (filtres.statut) {
            requete += ` AND statut = $${valeurs.length + 1}`;
            valeurs.push(filtres.statut);
        }
        if (filtres.est_actif !== undefined) {
            requete += ` AND est_actif = $${valeurs.length + 1}`;
            valeurs.push(filtres.est_actif);
        }
        
        requete += ' ORDER BY cree_le DESC';
        
        const resultat = await pool.query(requete, valeurs);
        return resultat.rows;
    }

     static async mettreAJour(id, donnees) {
    const champs = [];
    const valeurs = [];
    let index = 1;

    const champsModifiables = {
        nom_organisation: 'nomOrganisation',
        type_organisation: 'typeOrganisation',
        nom_responsable: 'nomResponsable',
        adresse: 'adresse',
        telephone: 'telephone',
        // photo_logo_url supprimé
        statut: 'statut',
        est_actif: 'est_actif'
    };

    for (const [dbField, dataField] of Object.entries(champsModifiables)) {
        if (donnees[dataField] !== undefined) {
            champs.push(`${dbField} = $${index++}`);
            valeurs.push(donnees[dataField]);
        }
    }

    if (donnees.localisation_gps) {
        champs.push(`localisation_gps = ST_GeogFromText($${index++})`);
        valeurs.push(`POINT(${donnees.localisation_gps.lng} ${donnees.localisation_gps.lat})`);
    }

    if (champs.length === 0) return null;

    valeurs.push(id);
    const requete = `
        UPDATE sponsors 
        SET ${champs.join(', ')}, modifie_le = CURRENT_TIMESTAMP
        WHERE id = $${index}
        RETURNING *
    `;

    const resultat = await pool.query(requete, valeurs);
    return resultat.rows[0];
}

    // Mettre à jour la connexion
    static async mettreAJourConnexion(id) {
        const requete = `
            UPDATE sponsors 
            SET derniere_connexion = CURRENT_TIMESTAMP
            WHERE id = $1
        `;
        await pool.query(requete, [id]);
    }
    static async getCampagnes(id) {
        const requete = `
            SELECT c.*, pc.contribution_financiere, pc.objectif_specifique
            FROM campagnes c
            JOIN promoteurs_campagne pc ON c.id = pc.campagne_id
            WHERE pc.promoteur_id = $1 AND pc.promoteur_type = 'sponsor'
            ORDER BY c.date_debut DESC
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows;
    }



    // Obtenir les campagnes d'un sponsor
    static async obtenirCampagnes(id) {
        const requete = `
            SELECT c.*, pc.contribution_financiere, pc.objectif_specifique
            FROM campagnes c
            JOIN promoteurs_campagne pc ON c.id = pc.campagne_id
            WHERE pc.promoteur_id = $1 AND pc.promoteur_type = 'sponsor'
            ORDER BY c.date_debut DESC
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows;
    }

    static async getDashboard(id) {
        const campagnes = await this.getCampagnes(id);
        
        const stats = {
            total_campagnes: campagnes.length,
            campagnes_actives: campagnes.filter(c => c.statut_calculé === 'en_cours').length,
            campagnes_terminees: campagnes.filter(c => c.statut_calculé === 'terminee').length,
            budget_total: campagnes.reduce((acc, c) => acc + parseFloat(c.budget_total || 0), 0),
            montant_utilise: campagnes.reduce((acc, c) => acc + parseFloat(c.montant_utilise || 0), 0),
            poids_total_collecte: campagnes.reduce((acc, c) => acc + parseFloat(c.poids_collecte_actuel || 0), 0),
            poids_total_attendu: campagnes.reduce((acc, c) => acc + parseFloat(c.poids_attendue || 0), 0)
        };

        return {
            stats,
            campagnes_recentes: campagnes.slice(0, 5)
        };
    }

    static async activer(id) {
        const requete = `
            UPDATE sponsors 
            SET est_actif = true, modifie_le = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    static async desactiver(id, raison) {
        const requete = `
            UPDATE sponsors 
            SET est_actif = false, modifie_le = CURRENT_TIMESTAMP,
                notes_desactivation = $2
            WHERE id = $1
            RETURNING *
        `;
        const resultat = await pool.query(requete, [id, raison]);
        return resultat.rows[0];
    }
}

export default Sponsor;