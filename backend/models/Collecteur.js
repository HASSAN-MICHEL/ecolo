import { pool } from '../config/database.js';

class Collecteur {
    // Créer un nouveau collecteur
    static async creer(donnees) {
        const requete = `
            INSERT INTO collecteurs (
                email, telephone, mot_de_passe_hash, nom_complet,
                type_collecteur, numero_identite, zone_intervention,
                zone_intervention_nom, quartiers_habituels, communes_intervention,
                photo_profil_url, cgu_acceptees
            ) VALUES ($1, $2, $3, $4, $5, $6, 
                ST_GeomFromGeoJSON($7), $8, $9, $10, $11, $12)
            RETURNING id, email, telephone, nom_complet, type_collecteur, 
                      statut, zone_intervention_nom, cree_le
        `;
        
        const valeurs = [
            donnees.email,
            donnees.telephone,
            donnees.motDePasseHash,
            donnees.nomComplet,
            donnees.typeCollecteur,
            donnees.numeroIdentite,
            JSON.stringify(donnees.zoneIntervention), // Polygone en GeoJSON
            donnees.zoneInterventionNom,
            donnees.quartiersHabituels || [],
            donnees.communesIntervention || [],
            donnees.photoProfilUrl || null,
            donnees.cguAcceptees || false
        ];
        
        const resultat = await pool.query(requete, valeurs);
        return resultat.rows[0];
    }

    // Trouver par email
    static async trouverParEmail(email) {
        const requete = 'SELECT * FROM collecteurs WHERE email = $1';
        const resultat = await pool.query(requete, [email]);
        return resultat.rows[0];
    }

    // Trouver par téléphone
    static async trouverParTelephone(telephone) {
        const requete = 'SELECT * FROM collecteurs WHERE telephone = $1';
        const resultat = await pool.query(requete, [telephone]);
        return resultat.rows[0];
    }

    // Trouver par ID
    static async trouverParId(id) {
        const requete = `
            SELECT id, email, telephone, nom_complet, type_collecteur,
                   numero_identite, zone_intervention_nom, quartiers_habituels,
                   communes_intervention, statut, est_actif, photo_profil_url,
                   points_total, gains_total, cree_le, derniere_connexion,
                   ST_AsGeoJSON(zone_intervention) as zone_intervention_geojson
            FROM collecteurs 
            WHERE id = $1
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    // Mettre à jour le profil
    static async mettreAJour(id, donnees) {
        const champs = [];
        const valeurs = [];
        let index = 1;

        if (donnees.nomComplet) {
            champs.push(`nom_complet = $${index++}`);
            valeurs.push(donnees.nomComplet);
        }
        if (donnees.telephone) {
            champs.push(`telephone = $${index++}`);
            valeurs.push(donnees.telephone);
        }
        if (donnees.zoneInterventionNom) {
            champs.push(`zone_intervention_nom = $${index++}`);
            valeurs.push(donnees.zoneInterventionNom);
        }
        if (donnees.quartiersHabituels) {
            champs.push(`quartiers_habituels = $${index++}`);
            valeurs.push(donnees.quartiersHabituels);
        }
        if (donnees.communesIntervention) {
            champs.push(`communes_intervention = $${index++}`);
            valeurs.push(donnees.communesIntervention);
        }
        if (donnees.photoProfilUrl) {
            champs.push(`photo_profil_url = $${index++}`);
            valeurs.push(donnees.photoProfilUrl);
        }

        valeurs.push(id);
        const requete = `
            UPDATE collecteurs 
            SET ${champs.join(', ')}
            WHERE id = $${index}
            RETURNING id, email, telephone, nom_complet, type_collecteur,
                      zone_intervention_nom, quartiers_habituels, communes_intervention,
                      photo_profil_url, points_total, gains_total
        `;

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows[0];
    }

    // Mettre à jour le statut (validation par superviseur)
    static async valider(id, superviseurId, notes) {
        const requete = `
            UPDATE collecteurs 
            SET statut = 'actif',
                est_actif = true,
                valide_par = $1,
                valide_le = CURRENT_TIMESTAMP,
                notes_validation = $2
            WHERE id = $3
            RETURNING id, nom_complet, statut
        `;
        const resultat = await pool.query(requete, [superviseurId, notes, id]);
        return resultat.rows[0];
    }

    // Suspendre un collecteur
    static async suspendre(id, raison) {
        const requete = `
            UPDATE collecteurs 
            SET statut = 'suspendu',
                est_actif = false,
                notes_validation = $1
            WHERE id = $2
            RETURNING id, nom_complet, statut
        `;
        const resultat = await pool.query(requete, [raison, id]);
        return resultat.rows[0];
    }

    // Obtenir les missions d'un collecteur
    // static async obtenirMissions(id, statut = null) {
    //     let requete = `
    //         SELECT m.*, 
    //                d.type_dechet, d.quantite, d.unite, d.adresse,
    //                p.nom_complet as producteur_nom,
    //                p.telephone as producteur_telephone,
    //                p.adresse as producteur_adresse,
    //                ST_AsGeoJSON(p.localisation_gps) as producteur_localisation
    //         FROM missions m
    //         JOIN declarations_dechets d ON m.declaration_id = d.id
    //         JOIN producteurs p ON d.producteur_id = p.id
    //         WHERE m.collecteur_id = $1
    //     `;
        
    //     const params = [id];
        
    //     if (statut && statut !== 'tous') {
    //         requete += ` AND m.statut = $2`;
    //         params.push(statut);
    //     }
        
    //     requete += ` ORDER BY m.cree_le DESC`;
        
    //     const resultat = await pool.query(requete, params);
    //     return resultat.rows;
    // }

    // Obtenir les missions d'un collecteur
static async obtenirMissions(id, statut = null) {
    let requete = `
        SELECT m.*, 
               d.type_dechet, d.quantite, d.unite,
               p.nom_complet as producteur_nom,
               p.telephone as producteur_telephone,
               p.adresse as producteur_adresse,  -- ✅ L'adresse vient de p, pas de d
               p.quartier, p.commune,
               ST_AsGeoJSON(p.localisation_gps) as producteur_localisation
        FROM missions m
        JOIN declarations_dechets d ON m.declaration_id = d.id
        JOIN producteurs p ON d.producteur_id = p.id
        WHERE m.collecteur_id = $1
    `;
    
    const params = [id];
    
    if (statut && statut !== 'tous') {
        requete += ` AND m.statut = $2`;
        params.push(statut);
    }
    
    requete += ` ORDER BY m.cree_le DESC`;
    
    const resultat = await pool.query(requete, params);
    return resultat.rows;
}

// ✅ Obtenir toutes les missions du collecteur avec détails
static async missionsAvecDetails(id, statut = null) {
    let requete = `
        SELECT 
            m.*,
            d.type_dechet,
            d.quantite,
            d.unite,
            p.nom_complet as producteur_nom,
            p.adresse as producteur_adresse,
            pdv.nom as point_depot_nom,
            gc.id as gain_id,
            gc.montant as gain_montant,
            gc.type_gain,
            gc.statut as gain_statut,
            gc.date_validation as gain_date
        FROM missions m
        JOIN declarations_dechets d ON m.declaration_id = d.id
        JOIN producteurs p ON d.producteur_id = p.id
        LEFT JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
        LEFT JOIN gains_collecteurs gc ON m.id = gc.mission_id
        WHERE m.collecteur_id = $1
    `;
    
    const params = [id];
    
    if (statut && statut !== 'tous') {
        requete += ` AND m.statut = $2`;
        params.push(statut);
    }
    
    requete += ` ORDER BY 
        CASE 
            WHEN m.statut = 'en_cours' THEN 1
            WHEN m.statut = 'acceptee' THEN 2
            WHEN m.statut = 'deposee' THEN 3
            WHEN m.statut = 'validee' THEN 4
            ELSE 5
        END,
        m.date_validation DESC NULLS LAST,
        m.cree_le DESC
    `;
    
    const resultat = await pool.query(requete, params);
    return resultat.rows;
}

// ✅ Obtenir toutes les missions du collecteur avec détails des gains
static async missionsAvecDetails(id, statut = null) {
    let requete = `
        SELECT 
            m.*,
            d.type_dechet,
            d.quantite,
            d.unite,
            p.nom_complet as producteur_nom,
            p.telephone as producteur_telephone,
            p.adresse as producteur_adresse,
            pdv.nom as point_depot_nom,
            pdv.adresse as point_depot_adresse,
            COALESCE(
                (SELECT json_agg(json_build_object(
                    'id', gc.id,
                    'montant', gc.montant,
                    'type', gc.type_gain,
                    'statut', gc.statut,
                    'date', gc.date_validation
                )) FROM gains_collecteurs gc WHERE gc.mission_id = m.id), '[]'
            ) as gains
        FROM missions m
        JOIN declarations_dechets d ON m.declaration_id = d.id
        JOIN producteurs p ON d.producteur_id = p.id
        LEFT JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
        WHERE m.collecteur_id = $1
    `;
    
    const params = [id];
    
    if (statut && statut !== 'tous') {
        requete += ` AND m.statut = $2`;
        params.push(statut);
    }
    
    requete += ` ORDER BY 
        CASE 
            WHEN m.statut = 'en_cours' THEN 1
            WHEN m.statut = 'acceptee' THEN 2
            WHEN m.statut = 'deposee' THEN 3
            WHEN m.statut = 'validee' THEN 4
            ELSE 5
        END,
        m.date_validation DESC NULLS LAST,
        m.cree_le DESC
    `;
    
    const resultat = await pool.query(requete, params);
    return resultat.rows;
}

// ✅ Obtenir tous les gains avec détails des missions
static async gainsAvecDetails(id) {
    const requete = `
        SELECT 
            gc.*,
            m.id as mission_id,
            m.statut as mission_statut,
            m.date_validation as mission_date,
            m.poids_depose,
            d.type_dechet,
            pdv.nom as point_depot_nom,
            p.nom_complet as producteur_nom
        FROM gains_collecteurs gc
        JOIN missions m ON gc.mission_id = m.id
        JOIN declarations_dechets d ON m.declaration_id = d.id
        JOIN producteurs p ON d.producteur_id = p.id
        LEFT JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
        WHERE gc.collecteur_id = $1
        ORDER BY gc.date_validation DESC NULLS LAST, gc.cree_le DESC
    `;
    
    const resultat = await pool.query(requete, [id]);
    return resultat.rows;
}

// ✅ Statistiques détaillées des gains
static async statistiquesGains(id) {
    const requete = `
        SELECT 
            COALESCE(SUM(gc.montant) FILTER (WHERE gc.statut = 'valide'), 0) as total_gains,
            COALESCE(SUM(gc.montant) FILTER (WHERE gc.type_gain = 'collecte'), 0) as gains_collecte,
            COALESCE(SUM(gc.montant) FILTER (WHERE gc.type_gain = 'bonus'), 0) as gains_bonus,
            COUNT(DISTINCT gc.mission_id) as missions_payees,
            MAX(gc.date_validation) as dernier_paiement,
            AVG(gc.montant) FILTER (WHERE gc.type_gain = 'collecte') as gain_moyen_collecte,
            EXTRACT(YEAR FROM age(CURRENT_DATE, MIN(gc.date_validation))) as jours_depuis_dernier
        FROM gains_collecteurs gc
        WHERE gc.collecteur_id = $1 AND gc.statut = 'valide'
    `;
    
    const resultat = await pool.query(requete, [id]);
    return resultat.rows[0] || {
        total_gains: 0,
        gains_collecte: 0,
        gains_bonus: 0,
        missions_payees: 0,
        gain_moyen_collecte: 0
    };
}
// ✅ Obtenir tous les gains avec détails des missions
static async gainsAvecDetails(id) {
    const requete = `
        SELECT 
            gc.*,
            m.id as mission_id,
            m.statut as mission_statut,
            m.date_validation as mission_date,
            m.poids_depose,
            d.type_dechet,
            pdv.nom as point_depot_nom
        FROM gains_collecteurs gc
        JOIN missions m ON gc.mission_id = m.id
        JOIN declarations_dechets d ON m.declaration_id = d.id
        LEFT JOIN points_depot_volontaire pdv ON m.point_depot_id = pdv.id
        WHERE gc.collecteur_id = $1
        ORDER BY gc.date_validation DESC NULLS LAST, gc.cree_le DESC
    `;
    
    const resultat = await pool.query(requete, [id]);
    return resultat.rows;
}

// ✅ Statistiques détaillées des gains
static async statistiquesGains(id) {
    const requete = `
        SELECT 
            COALESCE(SUM(gc.montant) FILTER (WHERE gc.statut = 'valide'), 0) as total_gains,
            COALESCE(SUM(gc.montant) FILTER (WHERE gc.type_gain = 'collecte'), 0) as gains_collecte,
            COALESCE(SUM(gc.montant) FILTER (WHERE gc.type_gain = 'bonus'), 0) as gains_bonus,
            COUNT(DISTINCT gc.mission_id) as missions_payees,
            MAX(gc.date_validation) as dernier_paiement,
            AVG(gc.montant) as gain_moyen
        FROM gains_collecteurs gc
        WHERE gc.collecteur_id = $1 AND gc.statut = 'valide'
    `;
    
    const resultat = await pool.query(requete, [id]);
    return resultat.rows[0];
}

    // Mettre à jour la dernière connexion
    static async mettreAJourConnexion(id) {
        const requete = `
            UPDATE collecteurs 
            SET derniere_connexion = CURRENT_TIMESTAMP
            WHERE id = $1
        `;
        await pool.query(requete, [id]);
    }

    // Obtenir les gains
    static async obtenirGains(id) {
        const requete = `
            SELECT * FROM gains_collecteurs 
            WHERE collecteur_id = $1
            ORDER BY cree_le DESC
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows;
    }

    // Obtenir le tableau de bord
    static async tableauBord(id) {
        const requete = `
            SELECT * FROM tableau_bord_collecteur 
            WHERE collecteur_id = $1
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    // Trouver les collecteurs disponibles dans une zone
    static async trouverDisponiblesDansZone(longitude, latitude, rayon = 10) {
        const requete = `
            SELECT id, nom_complet, telephone, points_total,
                   ST_Distance(
                       zone_intervention::geography,
                       ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
                   ) as distance
            FROM collecteurs
            WHERE statut = 'actif' 
              AND est_actif = true
              AND ST_DWithin(
                  zone_intervention::geography,
                  ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
                  $3 * 1000
              )
            ORDER BY distance
        `;
        const resultat = await pool.query(requete, [longitude, latitude, rayon]);
        return resultat.rows;
    }
}

export default Collecteur;