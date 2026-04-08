import { pool } from '../config/database.js';

class Recycleur {
   

static async creer(donnees) {
    const requete = `
        INSERT INTO recycleurs (
            email, telephone, mot_de_passe_hash, nom_entreprise,
            nom_responsable, adresse, quartier, commune,
            numero_identite, photo_profil_url, photo_cni_recto_url,
            photo_cni_verso_url, cgu_acceptees, statut,
            est_actif, valide_par, valide_le
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
    `;

    const valeurs = [
        donnees.email,
        donnees.telephone,
        donnees.motDePasseHash,
        donnees.nomEntreprise,
        donnees.nomResponsable,
        donnees.adresse,
        donnees.quartier,
        donnees.commune,
        donnees.numeroIdentite,
        donnees.photoProfilUrl,      // ← URL Supabase
        donnees.photoCniRectoUrl,    // ← URL Supabase
        donnees.photoCniVersoUrl,    // ← URL Supabase
        donnees.cguAcceptees || false,
        donnees.statut || 'en_attente',
        donnees.est_actif || false,
        donnees.valide_par || null,
        donnees.valide_le || null
    ];

    const resultat = await pool.query(requete, valeurs);
    return resultat.rows[0];
}

    static async trouverParEmail(email) {
        const requete = 'SELECT * FROM recycleurs WHERE email = $1';
        const resultat = await pool.query(requete, [email]);
        return resultat.rows[0];
    }

    static async trouverParTelephone(telephone) {
        const requete = 'SELECT * FROM recycleurs WHERE telephone = $1';
        const resultat = await pool.query(requete, [telephone]);
        return resultat.rows[0];
    }

    static async trouverParId(id) {
        const requete = 'SELECT * FROM recycleurs WHERE id = $1';
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    

    // static async listerTous(filtres = {}) {
    //     let requete = 'SELECT * FROM recycleurs WHERE 1=1';
    //     const valeurs = [];
        
    //     if (filtres.statut) {
    //         requete += ` AND statut = $${valeurs.length + 1}`;
    //         valeurs.push(filtres.statut);
    //     }
        
    //     requete += ' ORDER BY cree_le DESC';
        
    //     const resultat = await pool.query(requete, valeurs);
    //     return resultat.rows;
    // }
    // Trouver par email


    // Trouver par ID
    // static async trouverParId(id) {
    //     const requete = `
    //         SELECT id, email, telephone, nom_entreprise, nom_responsable,
    //                adresse, quartier, commune, numero_identite,
    //                photo_profil_url, photo_cni_recto_url, photo_cni_verso_url,
    //                statut, est_actif, notes_validation, valide_par, valide_le,
    //                cgu_acceptees, cree_le, derniere_connexion,
    //                ST_AsText(localisation_gps) as localisation_gps_text
    //         FROM recycleurs 
    //         WHERE id = $1
    //     `;
    //     const resultat = await pool.query(requete, [id]);
    //     return resultat.rows[0];
    // }

    // Lister les recycleurs en attente
    static async listerEnAttente() {
        const requete = `
            SELECT id, email, telephone, nom_entreprise, nom_responsable,
                   adresse, quartier, commune, photo_profil_url, cree_le
            FROM recycleurs
            WHERE statut = 'en_attente'
            ORDER BY cree_le DESC
        `;
        const resultat = await pool.query(requete);
        return resultat.rows;
    }

    // Lister tous les recycleurs
    static async listerTous(filtres = {}) {
        let requete = `
            SELECT id, email, telephone, nom_entreprise, nom_responsable,
                   adresse, quartier, commune, statut, est_actif,
                   photo_profil_url, cree_le
            FROM recycleurs
            WHERE 1=1
        `;
        const valeurs = [];
        let index = 1;

        if (filtres.statut) {
            requete += ` AND statut = $${index++}`;
            valeurs.push(filtres.statut);
        }

        if (filtres.commune) {
            requete += ` AND commune = $${index++}`;
            valeurs.push(filtres.commune);
        }

        requete += ` ORDER BY cree_le DESC`;
        
        const resultat = await pool.query(requete, valeurs);
        return resultat.rows;
    }

    // Valider un recycleur
    static async valider(id, superviseurId, notes) {
        const requete = `
            UPDATE recycleurs 
            SET statut = 'actif',
                est_actif = true,
                valide_par = $1,
                valide_le = CURRENT_TIMESTAMP,
                notes_validation = $2
            WHERE id = $3
            RETURNING id, nom_entreprise, statut
        `;
        const resultat = await pool.query(requete, [superviseurId, notes, id]);
        return resultat.rows[0];
    }

    // Suspendre un recycleur
    static async suspendre(id, raison) {
        const requete = `
            UPDATE recycleurs 
            SET statut = 'suspendu',
                est_actif = false,
                notes_validation = $1
            WHERE id = $2
            RETURNING id, nom_entreprise, statut
        `;
        const resultat = await pool.query(requete, [raison, id]);
        return resultat.rows[0];
    }

static async valider(id, validateurId, notes) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // 🔍 Vérifier si le validateur est un admin ou un superviseur
        const validateurCheck = await client.query(`
            SELECT 'admin' as type FROM admins WHERE id = $1
            UNION ALL
            SELECT 'superviseur' as type FROM superviseurs WHERE id = $1
        `, [validateurId]);

        if (validateurCheck.rows.length === 0) {
            throw new Error('Validateur non trouvé (ni admin, ni superviseur)');
        }

        const validateurType = validateurCheck.rows[0].type;

        // Vérifier que le recycleur existe
        const recycleurCheck = await client.query(`
            SELECT * FROM recycleurs WHERE id = $1
        `, [id]);

        if (recycleurCheck.rows.length === 0) {
            throw new Error('Recycleur non trouvé');
        }

        // ✅ Mettre à jour le recycleur avec les infos du validateur
        const resultat = await client.query(`
            UPDATE recycleurs 
            SET 
                statut = 'actif',
                est_actif = true,
                notes_validation = COALESCE($2, notes_validation),
                valide_par = $3,
                valide_par_type = $4,
                valide_le = CURRENT_TIMESTAMP,
                modifie_le = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `, [id, notes, validateurId, validateurType]);

        // Créer une notification pour le recycleur
        await client.query(`
            INSERT INTO notifications (
                utilisateur_id,
                type_utilisateur,
                titre,
                message,
                type_notification,
                reference_id,
                reference_type
            ) VALUES ($1, 'recycleur', $2, $3, 'compte_valide', $4, 'recycleur')
        `, [
            id,
            'Compte validé',
            'Félicitations ! Votre compte recycleur a été validé. Vous pouvez maintenant accéder à toutes les fonctionnalités.',
            id
        ]);

        // Journaliser l'action
        await client.query(`
            INSERT INTO historique_actions (
                utilisateur_id,
                action,
                details,
                adresse_ip
            ) VALUES ($1, $2, $3, $4)
        `, [
            validateurId,
            'VALIDATION_RECYCLEUR',
            JSON.stringify({ recycleurId: id, notes, validateurType }),
            null // IP à ajouter si disponible
        ]);

        await client.query('COMMIT');
        return resultat.rows[0];

    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur dans Recycleur.valider:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}

// Ajouter aussi la méthode pour réactiver un recycleur
static async reactiver(id, validateurId, notes) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Vérifier le validateur
        const validateurCheck = await client.query(`
            SELECT 'admin' as type FROM admins WHERE id = $1
            UNION ALL
            SELECT 'superviseur' as type FROM superviseurs WHERE id = $1
        `, [validateurId]);

        if (validateurCheck.rows.length === 0) {
            throw new Error('Validateur non trouvé');
        }

        const validateurType = validateurCheck.rows[0].type;

        // Réactiver le recycleur
        const resultat = await client.query(`
            UPDATE recycleurs 
            SET 
                est_actif = true,
                statut = 'actif',
                notes_validation = COALESCE($2, notes_validation || 'Compte réactivé'),
                valide_par = $3,
                valide_par_type = $4,
                valide_le = CURRENT_TIMESTAMP,
                modifie_le = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `, [id, notes, validateurId, validateurType]);

        if (resultat.rows.length === 0) {
            throw new Error('Recycleur non trouvé');
        }

        // Notification
        await client.query(`
            INSERT INTO notifications (
                utilisateur_id,
                type_utilisateur,
                titre,
                message,
                type_notification,
                reference_id,
                reference_type
            ) VALUES ($1, 'recycleur', $2, $3, 'compte_reactivé', $4, 'recycleur')
        `, [
            id,
            'Compte réactivé',
            'Votre compte recycleur a été réactivé. Bienvenue !',
            id
        ]);

        await client.query('COMMIT');
        return resultat.rows[0];

    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur dans Recycleur.reactiver:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}


    // models/Recycleur.js
static async mettreAJour(id, donnees) {
    const champs = [];
    const valeurs = [];
    let index = 1;

    // Liste des champs modifiables
    const champsModifiables = {
        email: 'email',
        telephone: 'telephone',
        nom_entreprise: 'nomEntreprise',
        nom_responsable: 'nomResponsable',
        adresse: 'adresse',
        quartier: 'quartier',
        commune: 'commune',
        numero_identite: 'numeroIdentite',
        photo_profil_url: 'photoProfilUrl',
        photo_cni_recto_url: 'photoCniRectoUrl',
        photo_cni_verso_url: 'photoCniVersoUrl',
        statut: 'statut',
        est_actif: 'est_actif',
        notes_validation: 'notesValidation',
        valide_par: 'validePar',
        valide_le: 'valideLe'
    };

    for (const [dbField, dataField] of Object.entries(champsModifiables)) {
        if (donnees[dataField] !== undefined) {
            champs.push(`${dbField} = $${index++}`);
            valeurs.push(donnees[dataField]);
        }
    }

    if (champs.length === 0) return null;

    valeurs.push(id);
    const requete = `
        UPDATE recycleurs 
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
            UPDATE recycleurs 
            SET derniere_connexion = CURRENT_TIMESTAMP
            WHERE id = $1
        `;
        await pool.query(requete, [id]);
    }
 static async getDemandesEnlevement(id, filtres = {}) {
        let requete = `
            SELECT de.*, pdv.nom as point_nom, pdv.commune
            FROM demandes_enlevement de
            JOIN points_depot_volontaire pdv ON de.point_depot_id = pdv.id
            WHERE de.recycleur_id = $1
        `;
        const valeurs = [id];
        let index = 2;

        if (filtres.statut) {
            requete += ` AND de.statut = $${index++}`;
            valeurs.push(filtres.statut);
        }

        requete += ' ORDER BY de.cree_le DESC';
        
        const resultat = await pool.query(requete, valeurs);
        return resultat.rows;
    }

    static async getDeclarationsRecyclage(id, filtres = {}) {
        let requete = `
            SELECT dr.*, de.point_depot_id
            FROM declarations_recyclage dr
            LEFT JOIN demandes_enlevement de ON dr.demande_enlevement_id = de.id
            WHERE dr.recycleur_id = $1
        `;
        const valeurs = [id];
        let index = 2;

        if (filtres.annee) {
            requete += ` AND EXTRACT(YEAR FROM dr.date_recyclage) = $${index++}`;
            valeurs.push(filtres.annee);
        }

        requete += ' ORDER BY dr.date_recyclage DESC';
        
        const resultat = await pool.query(requete, valeurs);
        return resultat.rows;
    }

    static async getStocksDisponibles() {
        const requete = `
            SELECT 
                s.*,
                pdv.nom as point_nom,
                pdv.commune,
                pdv.quartier,
                pdv.adresse
            FROM stocks_dechets s
            JOIN points_depot_volontaire pdv ON s.point_depot_id = pdv.id
            WHERE s.quantite_disponible > 0
            ORDER BY s.quantite_disponible DESC
        `;
        const resultat = await pool.query(requete);
        return resultat.rows;
    }

    static async getDashboard(id) {
        const requete = `
            WITH stats_globales AS (
                SELECT 
                    COUNT(DISTINCT de.id) as total_demandes,
                    COUNT(DISTINCT de.id) FILTER (WHERE de.statut = 'validee') as demandes_validees,
                    COUNT(DISTINCT de.id) FILTER (WHERE de.statut = 'realisee') as demandes_realisees,
                    COUNT(DISTINCT dr.id) as total_declarations,
                    COALESCE(SUM(dr.quantite_recyclee), 0) as total_kg_recycles,
                    COALESCE(SUM(dr.quantite_recyclee) FILTER (WHERE EXTRACT(YEAR FROM dr.date_recyclage) = EXTRACT(YEAR FROM CURRENT_DATE)), 0) as kg_annee_courante
                FROM recycleurs r
                LEFT JOIN demandes_enlevement de ON r.id = de.recycleur_id
                LEFT JOIN declarations_recyclage dr ON r.id = dr.recycleur_id
                WHERE r.id = $1
                GROUP BY r.id
            ),
            demandes_recentes AS (
                SELECT 
                    de.id,
                    de.date_souhaitee,
                    de.quantite_demandee,
                    de.type_dechet,
                    de.statut,
                    pdv.nom as point_nom
                FROM demandes_enlevement de
                JOIN points_depot_volontaire pdv ON de.point_depot_id = pdv.id
                WHERE de.recycleur_id = $1
                ORDER BY de.cree_le DESC
                LIMIT 10
            )
            SELECT 
                sg.*,
                (SELECT json_agg(demandes_recentes) FROM demandes_recentes) as dernieres_demandes
            FROM stats_globales sg
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    static async getStatistiquesDemandes(recycleurId) {
    const requete = `
        SELECT 
            COUNT(*) as total_demandes,
            COUNT(*) FILTER (WHERE statut = 'en_attente') as demandes_en_attente,
            COUNT(*) FILTER (WHERE statut = 'validee') as demandes_validees,
            COUNT(*) FILTER (WHERE statut = 'refusee') as demandes_refusees,
            COUNT(*) FILTER (WHERE statut = 'realisee') as demandes_realisees,
            COALESCE(SUM(quantite_demandee) FILTER (WHERE statut = 'validee'), 0) as kg_valides,
            COALESCE(SUM(quantite_demandee) FILTER (WHERE statut = 'realisee'), 0) as kg_realises,
            COALESCE(SUM(quantite_reelle) FILTER (WHERE statut = 'realisee'), 0) as kg_reellement_recus
        FROM demandes_enlevement
        WHERE recycleur_id = $1
    `;
    
    const resultat = await pool.query(requete, [recycleurId]);
    return resultat.rows[0];
}
}



export default Recycleur;



// import { pool } from '../config/database.js';

// class Recycleur {
//     static async trouverParEmail(email) {
//         const requete = 'SELECT * FROM recycleurs WHERE email = $1';
//         const resultat = await pool.query(requete, [email]);
//         return resultat.rows[0];
//     }

//     static async trouverParTelephone(telephone) {
//         const requete = 'SELECT * FROM recycleurs WHERE telephone = $1';
//         const resultat = await pool.query(requete, [telephone]);
//         return resultat.rows[0];
//     }

//     static async trouverParId(id) {
//         const requete = 'SELECT * FROM recycleurs WHERE id = $1';
//         const resultat = await pool.query(requete, [id]);
//         return resultat.rows[0];
//     }

//     static async creer(donnees) {
//         const requete = `
//             INSERT INTO recycleurs (
//                 email, telephone, mot_de_passe_hash, nom_entreprise,
//                 nom_responsable, adresse, localisation_gps, quartier,
//                 commune, numero_identite, photo_cni_recto_url,
//                 photo_cni_verso_url, photo_profil_url, cgu_acceptees
//             ) VALUES ($1, $2, $3, $4, $5, $6, ST_GeogFromText($7), $8, $9, $10, $11, $12, $13, $14)
//             RETURNING *
//         `;
        
//         const pointGeo = donnees.localisation_gps ? 
//             `POINT(${donnees.localisation_gps.lng} ${donnees.localisation_gps.lat})` : null;
        
//         const valeurs = [
//             donnees.email,
//             donnees.telephone,
//             donnees.motDePasseHash,
//             donnees.nomEntreprise,
//             donnees.nomResponsable,
//             donnees.adresse,
//             pointGeo,
//             donnees.quartier,
//             donnees.commune,
//             donnees.numeroIdentite,
//             donnees.photoCniRectoUrl,
//             donnees.photoCniVersoUrl,
//             donnees.photoProfilUrl,
//             donnees.cguAcceptees || false
//         ];

//         const resultat = await pool.query(requete, valeurs);
//         return resultat.rows[0];
//     }

//     static async listerTous(filtres = {}) {
//         let requete = 'SELECT * FROM recycleurs WHERE 1=1';
//         const valeurs = [];
        
//         if (filtres.statut) {
//             requete += ` AND statut = $${valeurs.length + 1}`;
//             valeurs.push(filtres.statut);
//         }
        
//         requete += ' ORDER BY cree_le DESC';
        
//         const resultat = await pool.query(requete, valeurs);
//         return resultat.rows;
//     }

//     static async mettreAJour(id, donnees) {
//         // Implémentez la mise à jour
//     }
// }

// export default Recycleur;