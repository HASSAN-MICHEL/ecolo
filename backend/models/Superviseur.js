// import { pool } from '../config/database.js';

// class Superviseur {
//     // Créer un superviseur (admin uniquement)
//     static async creer(donnees) {
//         const requete = `
//             INSERT INTO superviseurs (
//                 email, telephone, mot_de_passe_hash, nom_complet, role
//             ) VALUES ($1, $2, $3, $4, $5)
//             RETURNING id, email, telephone, nom_complet, role, cree_le
//         `;
        
//         const resultat = await pool.query(requete, [
//             donnees.email,
//             donnees.telephone,
//             donnees.motDePasseHash,
//             donnees.nomComplet,
//             donnees.role || 'superviseur'
//         ]);
        
//         return resultat.rows[0];
//     }

//     // Trouver par email
//     static async trouverParEmail(email) {
//         const requete = 'SELECT * FROM superviseurs WHERE email = $1';
//         const resultat = await pool.query(requete, [email]);
//         return resultat.rows[0];
//     }

//     // Trouver par ID
//     static async trouverParId(id) {
//         const requete = `
//             SELECT id, email, telephone, nom_complet, role, 
//                    est_actif, derniere_connexion, cree_le
//             FROM superviseurs 
//             WHERE id = $1
//         `;
//         const resultat = await pool.query(requete, [id]);
//         return resultat.rows[0];
//     }

//     // Activer/Désactiver un collecteur
//     static async activerCollecteur(collecteurId, superviseurId, activer = true) {
//         const requete = `
//             UPDATE collecteurs 
//             SET est_actif = $1,
//                 valide_par = $2,
//                 valide_le = CURRENT_TIMESTAMP
//             WHERE id = $3
//             RETURNING id, nom_complet, est_actif
//         `;
//         const resultat = await pool.query(requete, [activer, superviseurId, collecteurId]);
//         return resultat.rows[0];
//     }

//     // Créer un compte gestionnaire
//     static async creerGestionnaire(donnees, superviseurId) {
//         const requete = `
//             INSERT INTO gestionnaires_points (
//                 email, telephone, mot_de_passe_hash, nom_complet,
//                 point_collecte_id, fonction, cree_par
//             ) VALUES ($1, $2, $3, $4, $5, $6, $7)
//             RETURNING id, email, nom_complet, point_collecte_id, cree_le
//         `;
        
//         const resultat = await pool.query(requete, [
//             donnees.email,
//             donnees.telephone,
//             donnees.motDePasseHash,
//             donnees.nomComplet,
//             donnees.pointCollecteId,
//             donnees.fonction,
//             superviseurId
//         ]);
        
//         return resultat.rows[0];
//     }

//     // Modifier un gestionnaire
//     static async modifierGestionnaire(gestionnaireId, donnees) {
//         const champs = [];
//         const valeurs = [];
//         let index = 1;

//         if (donnees.nomComplet) {
//             champs.push(`nom_complet = $${index++}`);
//             valeurs.push(donnees.nomComplet);
//         }
//         if (donnees.telephone) {
//             champs.push(`telephone = $${index++}`);
//             valeurs.push(donnees.telephone);
//         }
//         if (donnees.fonction) {
//             champs.push(`fonction = $${index++}`);
//             valeurs.push(donnees.fonction);
//         }
//         if (donnees.pointCollecteId) {
//             champs.push(`point_collecte_id = $${index++}`);
//             valeurs.push(donnees.pointCollecteId);
//         }
//         if (donnees.estActif !== undefined) {
//             champs.push(`est_actif = $${index++}`);
//             valeurs.push(donnees.estActif);
//         }

//         valeurs.push(gestionnaireId);
//         const requete = `
//             UPDATE gestionnaires_points 
//             SET ${champs.join(', ')}
//             WHERE id = $${index}
//             RETURNING id, email, nom_complet, point_collecte_id, fonction, est_actif
//         `;

//         const resultat = await pool.query(requete, valeurs);
//         return resultat.rows[0];
//     }

//     // PAR EMAIL 
//     static async findByEmail(email) {
//     try {
//         const requete = 'SELECT * FROM superviseurs WHERE email = $1';
//         const resultat = await pool.query(requete, [email]);
//         return resultat.rows[0];
//     } catch (erreur) {
//         console.error('Erreur findByEmail superviseur:', erreur);
//         throw erreur;
//     }
//    }
//     // Attribuer une mission à un collecteur
//     static async attribuerMission(missionId, collecteurId, superviseurId) {
//         const requete = `
//             UPDATE missions 
//             SET collecteur_id = $1,
//                 statut = 'acceptee',
//                 date_acceptation = CURRENT_TIMESTAMP
//             WHERE id = $2
//             RETURNING *
//         `;
//         const resultat = await pool.query(requete, [collecteurId, missionId]);
//         return resultat.rows[0];
//     }

//     // Liste des collecteurs en attente de validation
//     static async collecteursEnAttente() {
//         const requete = `
//             SELECT id, nom_complet, email, telephone, type_collecteur,
//                    numero_identite, zone_intervention_nom, quartiers_habituels,
//                    cree_le
//             FROM collecteurs
//             WHERE statut = 'en_attente'
//             ORDER BY cree_le ASC
//         `;
//         const resultat = await pool.query(requete);
//         return resultat.rows;
//     }

//     // Liste des gestionnaires
//     static async gestionnaires() {
//         const requete = `
//             SELECT g.*, p.nom as point_collecte_nom
//             FROM gestionnaires_points g
//             LEFT JOIN points_depot_volontaire p ON g.point_collecte_id = p.id
//             ORDER BY g.cree_le DESC
//         `;
//         const resultat = await pool.query(requete);
//         return resultat.rows;
//     }

//     // Statistiques générales
//     static async statistiques() {
//         const requete = `
//             SELECT 
//                 (SELECT COUNT(*) FROM collecteurs) as total_collecteurs,
//                 (SELECT COUNT(*) FROM collecteurs WHERE statut = 'actif') as collecteurs_actifs,
//                 (SELECT COUNT(*) FROM collecteurs WHERE statut = 'en_attente') as collecteurs_en_attente,
//                 (SELECT COUNT(*) FROM gestionnaires_points) as total_gestionnaires,
//                 (SELECT COUNT(*) FROM missions WHERE statut = 'validee') as missions_validees,
//                 (SELECT COUNT(*) FROM missions WHERE statut = 'disponible') as missions_disponibles,
//                 (SELECT COALESCE(SUM(poids_depose), 0) FROM missions WHERE statut = 'validee') as total_dechets_collectes,
//                 (SELECT COALESCE(SUM(gains_attribues), 0) FROM missions WHERE statut = 'validee') as total_gains_distribues
//         `;
//         const resultat = await pool.query(requete);
//         return resultat.rows[0];
//     }
// }

// export default Superviseur;



import { pool } from '../config/database.js';

class Superviseur {
    // Créer un superviseur (admin uniquement)
    static async creer(donnees) {
        const requete = `
            INSERT INTO superviseurs (
                email, telephone, mot_de_passe_hash, nom_complet, role
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, telephone, nom_complet, role, cree_le
        `;
        
        const resultat = await pool.query(requete, [
            donnees.email,
            donnees.telephone,
            donnees.motDePasseHash,
            donnees.nomComplet,
            donnees.role || 'superviseur'
        ]);
        
        return resultat.rows[0];
    }

    // Trouver par email
    static async trouverParEmail(email) {
        const requete = 'SELECT * FROM superviseurs WHERE email = $1';
        const resultat = await pool.query(requete, [email]);
        return resultat.rows[0];
    }

    // Trouver par ID
    static async trouverParId(id) {
        const requete = `
            SELECT id, email, telephone, nom_complet, role, 
                   est_actif, derniere_connexion, cree_le
            FROM superviseurs 
            WHERE id = $1
        `;
        const resultat = await pool.query(requete, [id]);
        return resultat.rows[0];
    }

    // ✅ ACTIVER UN COLLECTEUR (US15)
    static async activerCollecteur(collecteurId, superviseurId, notes = '') {
        const requete = `
            UPDATE collecteurs 
            SET statut = 'actif',
                est_actif = true,
                valide_par = $1,
                valide_le = CURRENT_TIMESTAMP,
                notes_validation = $2
            WHERE id = $3
            RETURNING id, nom_complet, email, statut
        `;
        const resultat = await pool.query(requete, [superviseurId, notes, collecteurId]);
        return resultat.rows[0];
    }

    // ✅ SUSPENDRE UN COLLECTEUR
    static async suspendreCollecteur(collecteurId, raison) {
        const requete = `
            UPDATE collecteurs 
            SET statut = 'suspendu',
                est_actif = false,
                notes_validation = $1
            WHERE id = $2
            RETURNING id, nom_complet, email, statut
        `;
        const resultat = await pool.query(requete, [raison, collecteurId]);
        return resultat.rows[0];
    }

    // ✅ LISTE DES COLLECTEURS EN ATTENTE
    static async collecteursEnAttente() {
        const requete = `
            SELECT id, nom_complet, email, telephone, type_collecteur,
                   numero_identite, zone_intervention_nom, quartiers_habituels,
                   communes_intervention, cree_le
            FROM collecteurs
            WHERE statut = 'en_attente'
            ORDER BY cree_le ASC
        `;
        const resultat = await pool.query(requete);
        return resultat.rows;
    }

    // ✅ LISTE DES GESTIONNAIRES
    static async gestionnaires() {
        const requete = `
            SELECT g.id, g.email, g.telephone, g.nom_complet, 
                   g.fonction, g.est_actif, g.cree_le,
                   p.nom as point_collecte_nom,
                   p.adresse as point_collecte_adresse
            FROM gestionnaires_points g
            LEFT JOIN points_depot_volontaire p ON g.point_collecte_id = p.id
            ORDER BY g.cree_le DESC
        `;
        const resultat = await pool.query(requete);
        return resultat.rows;
    }

    // ✅ CRÉER UN GESTIONNAIRE (US21)
    static async creerGestionnaire(donnees, superviseurId) {
        const requete = `
            INSERT INTO gestionnaires_points (
                email, telephone, mot_de_passe_hash, nom_complet,
                point_collecte_id, fonction, cree_par
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, email, nom_complet, point_collecte_id, fonction, cree_le
        `;
        
        const resultat = await pool.query(requete, [
            donnees.email,
            donnees.telephone,
            donnees.motDePasseHash,
            donnees.nomComplet,
            donnees.pointCollecteId,
            donnees.fonction || 'Gestionnaire',
            superviseurId
        ]);
        
        return resultat.rows[0];
    }

    // ✅ MODIFIER UN GESTIONNAIRE (US22)
    static async modifierGestionnaire(gestionnaireId, donnees) {
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
        if (donnees.fonction) {
            champs.push(`fonction = $${index++}`);
            valeurs.push(donnees.fonction);
        }
        if (donnees.pointCollecteId) {
            champs.push(`point_collecte_id = $${index++}`);
            valeurs.push(donnees.pointCollecteId);
        }
        if (donnees.estActif !== undefined) {
            champs.push(`est_actif = $${index++}`);
            valeurs.push(donnees.estActif);
        }

        valeurs.push(gestionnaireId);
        const requete = `
            UPDATE gestionnaires_points 
            SET ${champs.join(', ')}
            WHERE id = $${index}
            RETURNING id, email, nom_complet, point_collecte_id, fonction, est_actif
        `;

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows[0];
    }

    // ✅ ATTRIBUER UNE MISSION À UN COLLECTEUR (US16)
    static async attribuerMission(missionId, collecteurId, superviseurId) {
        const requete = `
            UPDATE missions 
            SET collecteur_id = $1,
                statut = 'acceptee',
                date_acceptation = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        const resultat = await pool.query(requete, [collecteurId, missionId]);
        
        // Ajouter une notification
        if (resultat.rows[0]) {
            await pool.query(`
                INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification, reference_id, reference_type)
                VALUES ($1, 'collecteur', 'Mission attribuée', 
                        'Une mission vous a été attribuée par un superviseur.', 
                        'nouvelle_mission', $2, 'mission')
            `, [collecteurId, missionId]);
        }
        
        return resultat.rows[0];
    }

    // ✅ STATISTIQUES GÉNÉRALES
    static async statistiques() {
        const requete = `
            SELECT 
                (SELECT COUNT(*) FROM collecteurs) as total_collecteurs,
                (SELECT COUNT(*) FROM collecteurs WHERE statut = 'actif') as collecteurs_actifs,
                (SELECT COUNT(*) FROM collecteurs WHERE statut = 'en_attente') as collecteurs_en_attente,
                (SELECT COUNT(*) FROM gestionnaires_points) as total_gestionnaires,
                (SELECT COUNT(*) FROM missions WHERE statut = 'validee') as missions_validees,
                (SELECT COUNT(*) FROM missions WHERE statut = 'disponible') as missions_disponibles,
                (SELECT COALESCE(SUM(poids_depose), 0) FROM missions WHERE statut = 'validee') as total_dechets_collectes,
                (SELECT COALESCE(SUM(gains_attribues), 0) FROM missions WHERE statut = 'validee') as total_gains_distribues
        `;
        const resultat = await pool.query(requete);
        return resultat.rows[0];
    }

    // ✅ findByEmail (alias pour trouverParEmail)
    static async findByEmail(email) {
        return this.trouverParEmail(email);
    }

    // ✅ Mettre à jour
    static async update(id, donnees) {
        const champs = [];
        const valeurs = [];
        let index = 1;

        if (donnees.derniere_connexion) {
            champs.push(`derniere_connexion = $${index++}`);
            valeurs.push(donnees.derniere_connexion);
        }
        if (donnees.mot_de_passe_hash) {
            champs.push(`mot_de_passe_hash = $${index++}`);
            valeurs.push(donnees.mot_de_passe_hash);
        }

        if (champs.length === 0) return null;

        valeurs.push(id);
        const requete = `
            UPDATE superviseurs 
            SET ${champs.join(', ')}
            WHERE id = $${index}
            RETURNING id, email, nom_complet
        `;

        const resultat = await pool.query(requete, valeurs);
        return resultat.rows[0];
    }
}

export default Superviseur;