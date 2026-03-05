


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
     static async listerTous() {
        const requete = `
            SELECT id, email, telephone, nom_complet, role, 
                   est_actif, derniere_connexion, cree_le
            FROM superviseurs
            ORDER BY cree_le DESC
        `;
        const resultat = await pool.query(requete);
        return resultat.rows;
    }
    // Trouver par email
    static async trouverParEmail(email) {
        const requete = 'SELECT * FROM superviseurs WHERE email = $1';
        const resultat = await pool.query(requete, [email]);
        return resultat.rows[0];
    }
  
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


    static async getDemandesEnlevement(filtres = {}) {
    let requete = `
        SELECT 
            de.*,
            r.nom_entreprise as recycleur_nom,
            r.nom_responsable as recycleur_responsable,
            r.email as recycleur_email,
            r.telephone as recycleur_telephone,
            pdv.nom as point_nom,
            pdv.commune as point_commune,
            pdv.quartier as point_quartier,
            pdv.adresse as point_adresse,
            s.nom_complet as valide_par_nom
        FROM demandes_enlevement de
        JOIN recycleurs r ON de.recycleur_id = r.id
        JOIN points_depot_volontaire pdv ON de.point_depot_id = pdv.id
        LEFT JOIN superviseurs s ON de.valide_par = s.id
        WHERE 1=1
    `;
    
    const valeurs = [];
    let index = 1;

    if (filtres.statut) {
        requete += ` AND de.statut = $${index}`;
        valeurs.push(filtres.statut);
        index++;
    }

    if (filtres.recycleurId) {
        requete += ` AND de.recycleur_id = $${index}`;
        valeurs.push(filtres.recycleurId);
        index++;
    }

    if (filtres.pointDepotId) {
        requete += ` AND de.point_depot_id = $${index}`;
        valeurs.push(filtres.pointDepotId);
        index++;
    }

    requete += ` ORDER BY de.cree_le DESC`;

    const resultat = await pool.query(requete, valeurs);
    return resultat.rows;
}

// Récupérer les demandes traitées par un superviseur spécifique
static async getDemandesParSuperviseur(superviseurId, filtres = {}) {
    let requete = `
        SELECT 
            de.*,
            r.nom_entreprise as recycleur_nom,
            r.nom_responsable as recycleur_responsable,
            r.email as recycleur_email,
            r.telephone as recycleur_telephone,
            pdv.nom as point_nom,
            pdv.commune as point_commune,
            pdv.quartier as point_quartier,
            pdv.adresse as point_adresse
        FROM demandes_enlevement de
        JOIN recycleurs r ON de.recycleur_id = r.id
        JOIN points_depot_volontaire pdv ON de.point_depot_id = pdv.id
        WHERE de.valide_par = $1
    `;
    
    const valeurs = [superviseurId];
    let index = 2;

    if (filtres.statut) {
        requete += ` AND de.statut = $${index}`;
        valeurs.push(filtres.statut);
        index++;
    }

    if (filtres.dateDebut) {
        requete += ` AND de.date_validation >= $${index}`;
        valeurs.push(filtres.dateDebut);
        index++;
    }

    if (filtres.dateFin) {
        requete += ` AND de.date_validation <= $${index}`;
        valeurs.push(filtres.dateFin);
        index++;
    }

    requete += ` ORDER BY de.date_validation DESC`;

    const resultat = await pool.query(requete, valeurs);
    return resultat.rows;
}


// static async validerDemandeEnlevement(demandeId, superviseurId) {
//     const client = await pool.connect();
    
//     try {
//         await client.query('BEGIN');

//         // Vérifier que la demande existe et est en attente
//         const demandeCheck = await client.query(`
//             SELECT * FROM demandes_enlevement 
//             WHERE id = $1 AND statut = 'en_attente'
//         `, [demandeId]);

//         if (demandeCheck.rows.length === 0) {
//             throw new Error('Demande non trouvée ou déjà traitée');
//         }

//         const demande = demandeCheck.rows[0];

//         // Vérifier le stock disponible
//         const stockCheck = await client.query(`
//             SELECT quantite_disponible, quantite_reservee 
//             FROM stocks_dechets 
//             WHERE point_depot_id = $1 AND type_dechet = $2
//             FOR UPDATE
//         `, [demande.point_depot_id, demande.type_dechet]);

//         if (stockCheck.rows.length === 0) {
//             throw new Error('Stock non trouvé');
//         }

//         const stock = stockCheck.rows[0];
//         const disponible = stock.quantite_disponible - (stock.quantite_reservee || 0);

//         if (disponible < demande.quantite_demandee) {
//             throw new Error('Stock insuffisant pour cette demande');
//         }

//         // Valider la demande - CORRIGÉ: 2 paramètres, pas 3
//         await client.query(`
//             UPDATE demandes_enlevement 
//             SET statut = 'validee',
//                 valide_par = $1,
//                 date_validation = CURRENT_TIMESTAMP
//             WHERE id = $2
//         `, [superviseurId, demandeId]);  // ← 2 paramètres seulement

//         // Mettre à jour le stock (réserver la quantité)
//         await client.query(`
//             UPDATE stocks_dechets 
//             SET quantite_reservee = COALESCE(quantite_reservee, 0) + $1
//             WHERE point_depot_id = $2 AND type_dechet = $3
//         `, [demande.quantite_demandee, demande.point_depot_id, demande.type_dechet]);

//         // Journaliser l'action
//         await client.query(`
//             INSERT INTO historique_actions (
//                 utilisateur_id,
//                 action,
//                 details,
//                 cree_le
//             ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
//         `, [
//             superviseurId,
//             'validation_demande_recycleur',
//             JSON.stringify({
//                 demande_id: demandeId,
//                 recycleur_id: demande.recycleur_id,
//                 point_depot_id: demande.point_depot_id,
//                 type_dechet: demande.type_dechet,
//                 quantite: demande.quantite_demandee
//             })
//         ]);

//         // Notification au recycleur - CORRIGÉ: 6 paramètres
//         await client.query(`
//             INSERT INTO notifications (
//                 utilisateur_id,
//                 type_utilisateur,
//                 titre,
//                 message,
//                 type_notification,
//                 reference_id,
//                 reference_type
//             ) VALUES ($1, $2, $3, $4, $5, $6, $7)
//         `, [
//             demande.recycleur_id,
//             'recycleur',
//             'Demande validée',
//             `Votre demande d'enlèvement de ${demande.quantite_demandee} kg de ${demande.type_dechet} a été validée.`,
//             'demande_validee',
//             demandeId,
//             'demande'
//         ]);

//         await client.query('COMMIT');
        
//         return {
//             id: demandeId,
//             statut: 'validee',
//             validePar: superviseurId
//         };

//     } catch (erreur) {
//         await client.query('ROLLBACK');
//         console.error('❌ Erreur validation demande:', erreur);
//         throw erreur;
//     } finally {
//         client.release();
//     }
// }


static async validerDemandeEnlevement(demandeId, superviseurId) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // 1. Récupérer la demande
        const demandeCheck = await client.query(`
            SELECT * FROM demandes_enlevement 
            WHERE id = $1 AND statut = 'en_attente'
        `, [demandeId]);

        if (demandeCheck.rows.length === 0) {
            throw new Error('Demande non trouvée ou déjà traitée');
        }

        const demande = demandeCheck.rows[0];
        const quantiteDemandee = parseFloat(demande.quantite_demandee);
        const quantiteArrondie = Math.round(quantiteDemandee * 100) / 100;

        // 2. Récupérer le stock actuel
        const stockCheck = await client.query(`
            SELECT quantite_disponible, quantite_reservee 
            FROM stocks_dechets 
            WHERE point_depot_id = $1 AND type_dechet = $2
            FOR UPDATE
        `, [demande.point_depot_id, demande.type_dechet]);

        if (stockCheck.rows.length === 0) {
            throw new Error('Stock non trouvé');
        }

        const stock = stockCheck.rows[0];
        
        // Arrondir les valeurs pour éviter les problèmes de flottants
        const stockDisponible = parseFloat(stock.quantite_disponible);
        const stockReserve = parseFloat(stock.quantite_reservee || 0);
        
        const stockDisponibleArrondi = Math.round(stockDisponible * 100) / 100;
        const stockReserveArrondi = Math.round(stockReserve * 100) / 100;
        
        // Calculer le disponible réel (en tenant compte des réservations)
        const disponible = stockDisponibleArrondi - stockReserveArrondi;
        
        console.log(`📊 Validation demande - Stock: ${stockDisponibleArrondi} kg, Réservé: ${stockReserveArrondi} kg, Disponible: ${disponible} kg, Demandé: ${quantiteArrondie} kg`);

        if (disponible < quantiteArrondie - 0.01) { // Marge d'erreur de 0.01 kg (10g)
            throw new Error(`Stock insuffisant. Disponible: ${disponible.toFixed(2)} kg, Demandé: ${quantiteArrondie.toFixed(2)} kg`);
        }

        // Sauvegarder l'état AVANT modification
        const etatAvant = {
            quantite_disponible: stockDisponibleArrondi,
            quantite_reservee: stockReserveArrondi
        };

        // 3. VALIDER LA DEMANDE
        await client.query(`
            UPDATE demandes_enlevement 
            SET statut = 'validee',
                valide_par = $1,
                date_validation = CURRENT_TIMESTAMP
            WHERE id = $2
        `, [superviseurId, demandeId]);

        // 4. DIMINUER LE STOCK DISPONIBLE
        const nouvelleQuantiteDisponible = stockDisponibleArrondi - quantiteArrondie;
        const nouvelleQuantiteReservee = stockReserveArrondi - quantiteArrondie;
        
        await client.query(`
            UPDATE stocks_dechets 
            SET quantite_disponible = $1,
                quantite_reservee = $2,
                dernier_mouvement = CURRENT_TIMESTAMP
            WHERE point_depot_id = $3 AND type_dechet = $4
        `, [
            nouvelleQuantiteDisponible.toFixed(2), // Forcer 2 décimales
            nouvelleQuantiteReservee.toFixed(2),
            demande.point_depot_id,
            demande.type_dechet
        ]);

        // 5. JOURNALISER L'ACTION
        await client.query(`
            INSERT INTO historique_actions (
                utilisateur_id,
                action,
                details,
                cree_le
            ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        `, [
            superviseurId,
            'retrait_stock_recycleur',
            JSON.stringify({
                demande_id: demandeId,
                recycleur_id: demande.recycleur_id,
                point_depot_id: demande.point_depot_id,
                type_dechet: demande.type_dechet,
                quantite_retiree: quantiteArrondie.toFixed(2),
                stock_avant: etatAvant.quantite_disponible.toFixed(2),
                stock_apres: nouvelleQuantiteDisponible.toFixed(2),
                date: new Date().toISOString()
            })
        ]);

        // 6. NOTIFICATION
        await client.query(`
            INSERT INTO notifications (
                utilisateur_id,
                type_utilisateur,
                titre,
                message,
                type_notification,
                reference_id,
                reference_type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            demande.recycleur_id,
            'recycleur',
            '✅ Demande validée',
            `Votre demande de ${quantiteArrondie.toFixed(2)} kg de ${demande.type_dechet} a été validée. Le stock a été retiré.`,
            'succes',
            demandeId,
            'demande'
        ]);

await client.query('COMMIT');
        
        // ✅ RETOURNER TOUTES LES INFORMATIONS NÉCESSAIRES
        return {
            id: demandeId,
            statut: 'validee',
            validePar: superviseurId,
            quantite_retiree: quantiteArrondie,
            stock_restant: nouvelleQuantiteDisponible,
            point_depot_id: demande.point_depot_id,
            type_dechet: demande.type_dechet,
            recycleur_id: demande.recycleur_id,        // ← AJOUTÉ
            quantite_demandee: demande.quantite_demandee // ← AJOUTÉ
        };

    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur validation demande:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}


// Récupérer l'historique des retraits de stock
static async getHistoriqueRetraits(pointDepotId = null, typeDechet = null, dateDebut = null, dateFin = null) {
    let requete = `
        SELECT 
            ha.id,
            ha.utilisateur_id,
            s.nom_complet as superviseur_nom,
            ha.action,
            ha.details,
            ha.cree_le as date_retrait
        FROM historique_actions ha
        JOIN superviseurs s ON ha.utilisateur_id = s.id
        WHERE ha.action = 'retrait_stock_recycleur'
    `;
    
    const valeurs = [];
    let index = 1;

    if (pointDepotId) {
        requete += ` AND ha.details->>'point_depot_id' = $${index}`;
        valeurs.push(pointDepotId);
        index++;
    }

    if (typeDechet) {
        requete += ` AND ha.details->>'type_dechet' = $${index}`;
        valeurs.push(typeDechet);
        index++;
    }

    if (dateDebut) {
        requete += ` AND ha.cree_le >= $${index}`;
        valeurs.push(dateDebut);
        index++;
    }

    if (dateFin) {
        requete += ` AND ha.cree_le <= $${index}`;
        valeurs.push(dateFin);
        index++;
    }

    requete += ` ORDER BY ha.cree_le DESC`;

    const resultat = await pool.query(requete, valeurs);
    return resultat.rows;
}


// Obtenir l'évolution d'un stock sur une période
static async getEvolutionStock(pointDepotId, typeDechet, periodeJours = 30) {
    const requete = `
        WITH RECURSIVE dates AS (
            SELECT 
                CURRENT_DATE - generate_series(0, $1) as date
        ),
        mouvements AS (
            SELECT 
                DATE(ha.cree_le) as date_mouvement,
                (ha.details->>'quantite_retiree')::numeric as quantite_retiree,
                (ha.details->>'stock_avant')::numeric as stock_avant,
                (ha.details->>'stock_apres')::numeric as stock_apres
            FROM historique_actions ha
            WHERE ha.action = 'retrait_stock_recycleur'
              AND ha.details->>'point_depot_id' = $2
              AND ha.details->>'type_dechet' = $3
              AND ha.cree_le >= CURRENT_DATE - ($1 || ' days')::interval
        ),
        stock_initial AS (
            SELECT quantite_disponible as stock_actuel
            FROM stocks_dechets
            WHERE point_depot_id = $2 AND type_dechet = $3
        )
        SELECT 
            d.date,
            COALESCE(m.quantite_retiree, 0) as quantite_retiree,
            COALESCE(m.stock_avant, (SELECT stock_actuel FROM stock_initial)) as stock_debut_journee,
            COALESCE(m.stock_apres, (SELECT stock_actuel FROM stock_initial)) as stock_fin_journee
        FROM dates d
        LEFT JOIN mouvements m ON d.date = m.date_mouvement
        ORDER BY d.date DESC
    `;
    
    const resultat = await pool.query(requete, [periodeJours, pointDepotId, typeDechet]);
    return resultat.rows;
}

// Refuser une demande d'enlèvement - À vérifier aussi
static async refuserDemandeEnlevement(demandeId, superviseurId, motif) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Vérifier que la demande existe et est en attente
        const demandeCheck = await client.query(`
            SELECT * FROM demandes_enlevement 
            WHERE id = $1 AND statut = 'en_attente'
        `, [demandeId]);

        if (demandeCheck.rows.length === 0) {
            throw new Error('Demande non trouvée ou déjà traitée');
        }

        const demande = demandeCheck.rows[0];

        // Refuser la demande - CORRIGÉ: 3 paramètres
        await client.query(`
            UPDATE demandes_enlevement 
            SET statut = 'refusee',
                valide_par = $1,
                notes = COALESCE(notes, '') || '\nMotif refus: ' || $2
            WHERE id = $3
        `, [superviseurId, motif, demandeId]);  // ← 3 paramètres

        // Journaliser l'action
        await client.query(`
            INSERT INTO historique_actions (
                utilisateur_id,
                action,
                details,
                cree_le
            ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        `, [
            superviseurId,
            'refus_demande_recycleur',
            JSON.stringify({
                demande_id: demandeId,
                recycleur_id: demande.recycleur_id,
                motif: motif
            })
        ]);

        // Notification au recycleur - CORRIGÉ: 7 paramètres
        await client.query(`
            INSERT INTO notifications (
                utilisateur_id,
                type_utilisateur,
                titre,
                message,
                type_notification,
                reference_id,
                reference_type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            demande.recycleur_id,
            'recycleur',
            'Demande refusée',
            `Votre demande d'enlèvement a été refusée. Motif: ${motif}`,
            'demande_refusee',
            demandeId,
            'demande'
        ]);

        await client.query('COMMIT');
        
        return {
            id: demandeId,
            statut: 'refusee',
            validePar: superviseurId
        };

    } catch (erreur) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur refus demande:', erreur);
        throw erreur;
    } finally {
        client.release();
    }
}

// Récupérer les statistiques des demandes
static async statistiquesDemandes(superviseurId = null) {
    let requete = `
        SELECT 
            COUNT(*) as total_demandes,
            COUNT(*) FILTER (WHERE statut = 'en_attente') as demandes_en_attente,
            COUNT(*) FILTER (WHERE statut = 'validee') as demandes_validees,
            COUNT(*) FILTER (WHERE statut = 'refusee') as demandes_refusees,
            COUNT(*) FILTER (WHERE statut = 'realisee') as demandes_realisees,
            COALESCE(SUM(quantite_demandee) FILTER (WHERE statut = 'validee'), 0) as kg_valides,
            COALESCE(SUM(quantite_reelle) FILTER (WHERE statut = 'realisee'), 0) as kg_realises
        FROM demandes_enlevement
        WHERE 1=1
    `;
    
    const valeurs = [];

    if (superviseurId) {
        requete += ` AND valide_par = $1`;
        valeurs.push(superviseurId);
    }

    const resultat = await pool.query(requete, valeurs);
    return resultat.rows[0];
}



}

export default Superviseur;