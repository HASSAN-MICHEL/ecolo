import { pool } from '../config/database.js';

class Ong {
      static async creer(donnees) {
        const requete = `
            INSERT INTO ongs (
                email, telephone, mot_de_passe_hash, nom_ong,
                numero_agrement, domaine_intervention, nom_responsable,
                adresse, localisation_gps, statut,
                est_actif, cgu_acceptees, cgu_acceptees_le
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
                CASE WHEN $9::text IS NOT NULL THEN ST_GeogFromText($9) ELSE NULL END,
                $10, $11, $12, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        
        const pointGeo = donnees.localisation_gps ? 
            `POINT(${donnees.localisation_gps.lng} ${donnees.localisation_gps.lat})` : null;
        
        const valeurs = [
            donnees.email,
            donnees.telephone,
            donnees.motDePasseHash,
            donnees.nomOng,
            donnees.numeroAgrement,
            donnees.domaineIntervention || [],
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
        const requete = 'SELECT * FROM ongs WHERE email = $1';
        const resultat = await pool.query(requete, [email]);
        return resultat.rows[0];
    }

    static async trouverParTelephone(telephone) {
        const requete = 'SELECT * FROM ongs WHERE telephone = $1';
        const resultat = await pool.query(requete, [telephone]);
        return resultat.rows[0];
    }

    static async trouverParId(id) {
        const requete = 'SELECT * FROM ongs WHERE id = $1';
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    static async listerTous(filtres = {}) {
        let requete = 'SELECT * FROM ongs WHERE 1=1';
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
            nom_ong: 'nomOng',
            numero_agrement: 'numeroAgrement',
            domaine_intervention: 'domaineIntervention',
            nom_responsable: 'nomResponsable',
            adresse: 'adresse',
            telephone: 'telephone',
            
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
            UPDATE ongs 
            SET ${champs.join(', ')}, modifie_le = CURRENT_TIMESTAMP
            WHERE id = $${index}
            RETURNING *
        `;

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows[0];
    }

    static async getCampagnes(id) {
        const requete = `
            SELECT c.*, pc.contribution_financiere, pc.objectif_specifique
            FROM campagnes c
            JOIN promoteurs_campagne pc ON c.id = pc.campagne_id
            WHERE pc.promoteur_id = $1 AND pc.promoteur_type = 'ong'
            ORDER BY c.date_debut DESC
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows;
    }



       // Récupérer les rapports déposés
    static async getRapports(id) {
        const requete = `
            SELECT * FROM rapports_ong
            WHERE ong_id = $1
            ORDER BY cree_le DESC
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows;
    }

    // Déposer un rapport
    static async deposerRapport(ongId, donnees) {
        const requete = `
            INSERT INTO rapports_ong (
                ong_id,
                titre,
                description,
                fichier_url,
                type_rapport,
                zone_concernee,
                date_evenement
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;

        const resultat = await pool.query(requete, [
            ongId,
            donnees.titre,
            donnees.description,
            donnees.fichierUrl,
            donnees.typeRapport,
            donnees.zoneConcernee,
            donnees.dateEvenement || new Date()
        ]);

        return resultat.rows[0];
    }

    // Obtenir les statistiques globales pour l'ONG
    static async getStatistiquesGlobales() {
        // Données agrégées en lecture seule
        const requete = `
            SELECT 
                (SELECT COUNT(*) FROM campagnes WHERE statut = 'active') as campagnes_actives,
                (SELECT COUNT(*) FROM campagnes WHERE date_fin >= CURRENT_DATE) as campagnes_en_cours,
                (SELECT COALESCE(SUM(poids_attendue), 0) FROM campagnes WHERE statut = 'active') as objectif_total_kg,
                (SELECT COALESCE(SUM(poids_collecte), 0) FROM suivi_campagne) as poids_total_collecte,
                (SELECT COUNT(DISTINCT point_depot_id) FROM missions WHERE statut = 'validee') as points_actifs,
                (SELECT COUNT(DISTINCT collecteur_id) FROM missions WHERE statut = 'validee') as collecteurs_actifs
        `;

        const resultat = await pool.query(requete);
        return resultat.rows[0];
    }

    // Obtenir le dashboard de l'ONG
    static async getDashboard(id) {
        const [campagnes, rapports, statsGlobales] = await Promise.all([
            this.getCampagnes(id),
            this.getRapports(id),
            this.getStatistiquesGlobales()
        ]);

        return {
            campagnes_suivies: campagnes,
            rapports_deposes: rapports,
            statistiques_globales: statsGlobales,
            dernier_rapport: rapports[0] || null
        };
    }
  // Mettre à jour la connexion
    static async mettreAJourConnexion(id) {
        const requete = `
            UPDATE ongs 
            SET derniere_connexion = CURRENT_TIMESTAMP
            WHERE id = $1
        `;
        await pool.query(requete, [id]);
    }

    static async getDashboard(id) {
        const requete = `
            WITH stats_campagnes AS (
                SELECT 
                    COUNT(DISTINCT c.id) as total_campagnes,
                    COALESCE(SUM(sc.poids_collecte), 0) as total_kg_collectes,
                    COUNT(DISTINCT pdv.id) as points_concernes
                FROM promoteurs_campagne pc
                JOIN campagnes c ON pc.campagne_id = c.id
                LEFT JOIN suivi_campagne sc ON c.id = sc.campagne_id
                LEFT JOIN points_depot_volontaire pdv ON pdv.commune = ANY(c.zones_intervention)
                WHERE pc.promoteur_id = $1 AND pc.promoteur_type = 'ong'
                GROUP BY pc.promoteur_id
            )
            SELECT * FROM stats_campagnes
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    static async ajouterRapport(ongId, donnees) {
        const requete = `
            INSERT INTO rapports_ong (
                ong_id, titre, description, fichier_url,
                type_rapport, zone_concernee, date_evenement
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const resultat = await pool.query(requete, [
            ongId,
            donnees.titre,
            donnees.description,
            donnees.fichierUrl,
            donnees.typeRapport,
            donnees.zoneConcernee,
            donnees.dateEvenement
        ]);
        return resultat.rows[0];
    }
}

export default Ong;