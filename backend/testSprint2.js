import { pool } from './config/database.js';
import bcrypt from 'bcrypt';

async function seedSprint2() {
    try {
        console.log('🌱 Insertion des données de test pour le Sprint 2...');

        // Hasher les mots de passe
        const salt = await bcrypt.genSalt(10);
        const motDePasseHash = await bcrypt.hash('password123', salt);

        // 1. Créer des points de collecte
        await pool.query(`
            INSERT INTO points_depot_volontaire (nom, adresse, localisation_gps, quartier, commune, types_dechets_acceptes, horaires_ouverture) VALUES
            ('Point de collecte Nord', '123 Avenue du Nord', ST_SetSRID(ST_MakePoint(2.3622, 48.8666), 4326), 'Quartier Nord', 'Paris', 
             ARRAY['plastique_pet', 'papier_carton', 'metal']::type_dechet[],
             '{"lundi": "08:00-18:00", "mardi": "08:00-18:00", "mercredi": "08:00-18:00", "jeudi": "08:00-18:00", "vendredi": "08:00-18:00"}'),
            ('Point de collecte Sud', '456 Rue du Sud', ST_SetSRID(ST_MakePoint(2.3422, 48.8466), 4326), 'Quartier Sud', 'Paris',
             ARRAY['plastique_pet', 'plastique_pehd', 'verre']::type_dechet[],
             '{"lundi": "09:00-17:00", "mardi": "09:00-17:00", "mercredi": "09:00-17:00", "jeudi": "09:00-17:00", "vendredi": "09:00-17:00"}')
        `);

        // 2. Créer des collecteurs de test
        await pool.query(`
            INSERT INTO collecteurs (email, telephone, mot_de_passe_hash, nom_complet, type_collecteur, numero_identite, zone_intervention, zone_intervention_nom, quartiers_habituels, communes_intervention, statut) VALUES
            ('collecteur1@test.com', '771234567', '$2b$10$93v23LjP01WD7x6tcXC.3.7GllFXeBxc5p.vGMwNEQ54ElqBep9Z.' , 'Amadou Diallo', 'independant', 'ID123456',
             ST_SetSRID(ST_MakePolygon(ST_GeomFromText('LINESTRING(2.3522 48.8566, 2.3622 48.8566, 2.3622 48.8666, 2.3522 48.8666, 2.3522 48.8566)')), 4326),
             'Zone Centre', ARRAY['Centre-ville', 'République'], ARRAY['Paris'], 'actif'),
            ('collecteur2@test.com', '778901234', '$2b$10$yHwwnsMv7r9D4/2dXEwZ6O90P3pOCh89stRQY6mXNQwjwLw.kO2HC', 'Fatou Ndiaye', 'cooperative', 'COOP001',
             ST_SetSRID(ST_MakePolygon(ST_GeomFromText('LINESTRING(2.3422 48.8466, 2.3522 48.8466, 2.3522 48.8566, 2.3422 48.8566, 2.3422 48.8466)')), 4326),
             'Zone Sud', ARRAY['Gare', 'Montparnasse'], ARRAY['Paris'], 'actif')
        `);

        // 3. Créer des gestionnaires de point
        await pool.query(`
            INSERT INTO gestionnaires_points (email, telephone, mot_de_passe_hash, nom_complet, point_collecte_id, fonction, cree_par) VALUES
            ('gestionnaire1@ecocollect.com', '781234567','$2b$10$YxqWPMimUnLUeOC1maIEWOCel29JYp2US1xRmC83gTdXftPHaCX2O' , 'Mariam Sow', (SELECT id FROM points_depot_volontaire WHERE nom = 'Point de collecte Nord'), 'Responsable de site', (SELECT id FROM superviseurs LIMIT 1)),
            ('gestionnaire2@ecocollect.com', '782345678', '$2b$10$WMMT/XT/BzFQgW8b8GUp/uCXFc8.vVY7LhshePyI7Wb/eEH0SfQjS', 'Ousmane Fall', (SELECT id FROM points_depot_volontaire WHERE nom = 'Point de collecte Sud'), 'Agent de pesée', (SELECT id FROM superviseurs LIMIT 1))
        `);

        // 4. Créer des déclarations de déchets (si pas déjà fait)
        const producteurId = await pool.query("SELECT id FROM producteurs WHERE email = 'test@ecocollect.com'");
        
        if (producteurId.rows[0]) {
            await pool.query(`
                INSERT INTO declarations_dechets (producteur_id, type_dechet, quantite, unite, mode_collecte, statut, date_souhaitee) VALUES
                ($1, 'plastique_pet', 5.0, 'kg', 'collecte_domicile', 'en_attente', CURRENT_DATE + 1),
                ($1, 'papier_carton', 3.5, 'kg', 'collecte_domicile', 'en_attente', CURRENT_DATE + 2),
                ($1, 'metal', 2.0, 'kg', 'depot_volontaire', 'en_attente', CURRENT_DATE + 3)
            `, [producteurId.rows[0].id]);
        }

        // 5. Créer des missions à partir des déclarations
        await pool.query(`
            INSERT INTO missions (declaration_id, statut, date_disponibilite)
            SELECT id, 'disponible', CURRENT_TIMESTAMP
            FROM declarations_dechets
            WHERE statut = 'en_attente'
        `);

        console.log('✅ Données de test Sprint 2 insérées avec succès!');
        
    } catch (erreur) {
        console.error('❌ Erreur insertion données test:', erreur);
    }
}

export default seedSprint2;