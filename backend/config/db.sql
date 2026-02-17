  
  -- Creons notre  base de données , et ici nous allons utilisé des triggers et implementé les fonctions et vue  necessaire en base de données pour mon travail : ICI on a commencé par les Producteurs
CREATE DATABASE ecocollect_db;
\c ecocollect_db;   ALTER TABLE producteurs ADD COLUMN IF NOT EXISTS derniere_connexion TIMESTAMP;

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enumérations (en français)
CREATE TYPE type_producteur AS ENUM ('menage', 'commerce', 'entreprise', 'administration');
CREATE TYPE type_dechet AS ENUM ('plastique_pet', 'plastique_pehd', 'papier_carton', 'metal', 'verre', 'organique');
CREATE TYPE mode_collecte AS ENUM ('collecte_domicile', 'depot_volontaire');
CREATE TYPE statut_declaration AS ENUM ('en_attente', 'affecte', 'programme', 'termine', 'annule');


CREATE TYPE statut_collecteur AS ENUM ('en_attente', 'actif', 'suspendu', 'inactif');
CREATE TYPE type_collecteur AS ENUM ('independant', 'cooperative');
CREATE TYPE statut_mission AS ENUM ('disponible', 'acceptee', 'en_cours', 'deposee', 'validee', 'refusee', 'annulee');
CREATE TYPE type_utilisateur AS ENUM ('collecteur', 'gestionnaire', 'superviseur' , 'producteur');
CREATE TYPE type_utilisateur AS ENUM ('producteur');
-- Table des producteurs
CREATE TABLE producteurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    type_producteur type_producteur NOT NULL,
    nom_complet VARCHAR(255) NOT NULL,
    adresse TEXT NOT NULL,
    localisation_gps GEOGRAPHY(POINT, 4326),
    quartier VARCHAR(100),
    commune VARCHAR(100),
    est_actif BOOLEAN DEFAULT true,
    cgu_acceptees BOOLEAN DEFAULT false,
    cgu_acceptees_le TIMESTAMP,
    points INTEGER DEFAULT 0,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des déclarations de déchets
CREATE TABLE declarations_dechets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producteur_id UUID REFERENCES producteurs(id) ON DELETE CASCADE,
    date_declaration DATE DEFAULT CURRENT_DATE,
    type_dechet type_dechet NOT NULL,
    quantite DECIMAL(10, 2) NOT NULL,
    unite VARCHAR(20) CHECK (unite IN ('kg', 'sacs', 'unites')),
    poids_estime DECIMAL(10, 2),
    mode_collecte mode_collecte NOT NULL,
    statut statut_declaration DEFAULT 'en_attente',
    date_souhaitee DATE,
    creneau_horaire VARCHAR(50),
    notes TEXT,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour supporter plusieurs types de déchets par déclaration
CREATE TABLE types_dechets_declaration (
    declaration_id UUID REFERENCES declarations_dechets(id) ON DELETE CASCADE,
    type_dechet type_dechet NOT NULL,
    quantite DECIMAL(10, 2) NOT NULL,
    unite VARCHAR(20) CHECK (unite IN ('kg', 'sacs', 'unites')),
    PRIMARY KEY (declaration_id, type_dechet)
);

-- -- Table des collectes
-- CREATE TABLE collectes (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     declaration_id UUID REFERENCES declarations_dechets(id) ON DELETE SET NULL,
--     collecteur_id UUID, -- À relier à la table des collecteurs (future implémentation)
--     date_programmee DATE NOT NULL,
--     heure_programmee VARCHAR(50),
--     date_reelle DATE,
--     poids_reel DECIMAL(10, 2),
--     statut VARCHAR(50) DEFAULT 'programmee',
--     notes TEXT,
--     points_attribues INTEGER DEFAULT 0,
--     terminee_le TIMESTAMP,
--     cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

ALTER TABLE missions 
ADD COLUMN IF NOT EXISTS date_programmee DATE,
ADD COLUMN IF NOT EXISTS heure_programmee VARCHAR(50);

-- Table des points/récompenses
CREATE TABLE historique_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producteur_id UUID REFERENCES producteurs(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    raison VARCHAR(255) NOT NULL,
    reference_id UUID, -- ID de la collecte ou action liée
    type_reference VARCHAR(50),
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des tokens de réinitialisation de mot de passe
CREATE TABLE tokens_reinitialisation_mdp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producteur_id UUID REFERENCES producteurs(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expire_le TIMESTAMP NOT NULL,
    utilise BOOLEAN DEFAULT false,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des adresses de dépôt volontaire
CREATE TABLE points_depot_volontaire (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    adresse TEXT NOT NULL,
    localisation_gps GEOGRAPHY(POINT, 4326),
    quartier VARCHAR(100),
    commune VARCHAR(100),
    types_dechets_acceptes type_dechet[],
    horaires_ouverture JSONB,
    est_actif BOOLEAN DEFAULT true,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Trigger pour mettre à jour modifié_le
CREATE OR REPLACE FUNCTION mettre_a_jour_modifie_le()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modifie_le = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Application des triggers
CREATE TRIGGER mettre_a_jour_producteurs_modifie_le 
    BEFORE UPDATE ON producteurs 
    FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_modifie_le();

CREATE TRIGGER mettre_a_jour_declarations_modifie_le 
    BEFORE UPDATE ON declarations_dechets 
    FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_modifie_le();

-- Trigger pour calculer le poids estimé
CREATE OR REPLACE FUNCTION calculer_poids_estime()
RETURNS TRIGGER AS $$
BEGIN
    -- Conversion basique (à ajuster selon les besoins réels)
    IF NEW.unite = 'sacs' THEN
        NEW.poids_estime = NEW.quantite * 10; -- Supposition: 10kg par sac
    ELSIF NEW.unite = 'unites' THEN
        NEW.poids_estime = NEW.quantite * 1; -- Supposition: 1kg par unité
    ELSE
        NEW.poids_estime = NEW.quantite;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculer_poids_avant_insertion
    BEFORE INSERT ON declarations_dechets
    FOR EACH ROW EXECUTE FUNCTION calculer_poids_estime();

-- Trigger pour attribuer des points après collecte
CREATE OR REPLACE FUNCTION attribuer_points_apres_collecte()
RETURNS TRIGGER AS $$
DECLARE
    points_a_attribuer INTEGER;
BEGIN
    IF NEW.statut = 'terminee' AND OLD.statut != 'terminee' THEN
        -- Calcul des points basé sur le poids
        points_a_attribuer := CEIL(NEW.poids_reel);
        
        -- Mise à jour du total de points du producteur
        UPDATE producteurs 
        SET points = points + points_a_attribuer
        WHERE id = (
            SELECT producteur_id 
            FROM declarations_dechets 
            WHERE id = NEW.declaration_id
        );
        
        -- Historique des points
        INSERT INTO historique_points (producteur_id, points, raison, reference_id, type_reference)
        SELECT 
            dd.producteur_id,
            points_a_attribuer,
            'Collecte terminée',
            NEW.id,
            'collecte'
        FROM declarations_dechets dd
        WHERE dd.id = NEW.declaration_id;
        
        -- Notification au producteur
        INSERT INTO notifications (producteur_id, titre, message, type_notification)
        SELECT 
            dd.producteur_id,
            'Collecte terminée',
            'Votre collecte a été terminée. Vous avez gagné ' || points_a_attribuer || ' points.',
            'succes'
        FROM declarations_dechets dd
        WHERE dd.id = NEW.declaration_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER attribuer_points_sur_collecte_terminee
    AFTER UPDATE ON collectes
    FOR EACH ROW EXECUTE FUNCTION attribuer_points_apres_collecte();

-- Trigger pour notifier quand un collecteur est affecté
CREATE OR REPLACE FUNCTION notifier_affectation_collecteur()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.statut = 'affecte' AND OLD.statut != 'affecte' THEN
        INSERT INTO notifications (producteur_id, titre, message, type_notification)
        SELECT 
            producteur_id,
            'Collecteur affecté',
            'Un collecteur a été affecté à votre déclaration. Vous serez notifié du créneau horaire.',
            'collecteur_affecte'
        FROM declarations_dechets
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER notifier_affectation_collecteur_trigger
    AFTER UPDATE ON declarations_dechets
    FOR EACH ROW EXECUTE FUNCTION notifier_affectation_collecteur();

-- Index pour optimiser les requêtes
CREATE INDEX idx_producteurs_email ON producteurs(email);
CREATE INDEX idx_producteurs_telephone ON producteurs(telephone);
CREATE INDEX idx_declarations_producteur_id ON declarations_dechets(producteur_id);
CREATE INDEX idx_declarations_statut ON declarations_dechets(statut);
CREATE INDEX idx_declarations_date ON declarations_dechets(date_declaration);
CREATE INDEX idx_collectes_declaration_id ON collectes(declaration_id);
CREATE INDEX idx_collectes_statut ON collectes(statut);
CREATE INDEX idx_notifications_producteur_id ON notifications(producteur_id);
CREATE INDEX idx_historique_points_producteur_id ON historique_points(producteur_id);
CREATE INDEX idx_points_depot_localisation ON points_depot_volontaire USING GIST(localisation_gps);

-- Vue pour le tableau de bord des producteurs
CREATE OR REPLACE VIEW tableau_bord_producteur AS
SELECT 
    p.id as producteur_id,
    p.nom_complet,
    p.type_producteur,
    p.points,
    COUNT(DISTINCT dd.id) as total_declarations,
    COUNT(DISTINCT c.id) as total_collectes,
    COALESCE(SUM(c.poids_reel), 0) as total_dechets_collectes,
    MAX(c.terminee_le) as derniere_collecte_date
FROM producteurs p
LEFT JOIN declarations_dechets dd ON p.id = dd.producteur_id
LEFT JOIN collectes c ON dd.id = c.declaration_id AND c.statut = 'terminee'
GROUP BY p.id, p.nom_complet, p.type_producteur, p.points;

-- Vue pour les déclarations en attente
CREATE OR REPLACE VIEW declarations_en_attente AS
SELECT 
    dd.*,
    p.nom_complet,
    p.type_producteur,
    p.quartier,
    p.commune
FROM declarations_dechets dd
JOIN producteurs p ON dd.producteur_id = p.id
WHERE dd.statut = 'en_attente'
ORDER BY dd.cree_le ASC;



-- LANCEMENT DU SPRINT 2 COLLECTEURS ET GESTIONNAIRES DE POINT : NOUVELLE TABLE ET TRIGGERS 

CREATE TABLE collecteurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom_complet VARCHAR(255) NOT NULL,
    type_collecteur type_collecteur NOT NULL,
    numero_identite VARCHAR(50),
    zone_intervention GEOMETRY(POLYGON, 4326), -- Zone sous forme de polygone
    zone_intervention_nom VARCHAR(255),
    quartiers_habituels TEXT[], -- Liste des quartiers
    communes_intervention TEXT[],
    statut statut_collecteur DEFAULT 'en_attente',
    est_actif BOOLEAN DEFAULT false,
    notes_validation TEXT,
    valide_par UUID, -- ID du superviseur
    valide_le TIMESTAMP,
    photo_profil_url TEXT,
    cgu_acceptees BOOLEAN DEFAULT false,
    cgu_acceptees_le TIMESTAMP,
    points_total INTEGER DEFAULT 0,
    gains_total DECIMAL(10, 2) DEFAULT 0,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion TIMESTAMP
);


CREATE TABLE gestionnaires_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom_complet VARCHAR(255) NOT NULL,
    point_collecte_id UUID REFERENCES points_depot_volontaire(id) ON DELETE SET NULL,
    fonction VARCHAR(100),
    est_actif BOOLEAN DEFAULT true,
    cree_par UUID, -- ID du superviseur qui a créé le compte
    derniere_connexion TIMESTAMP,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE superviseurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20) UNIQUE,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom_complet VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'superviseur',
    est_actif BOOLEAN DEFAULT true,
    derniere_connexion TIMESTAMP,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE collectes RENAME TO missions;

-- Recréation de la table missions avec plus de champs
DROP TABLE IF EXISTS missions CASCADE;
CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    declaration_id UUID REFERENCES declarations_dechets(id) ON DELETE SET NULL,
    collecteur_id UUID REFERENCES collecteurs(id) ON DELETE SET NULL,
    statut statut_mission DEFAULT 'disponible',
    date_disponibilite TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_acceptation TIMESTAMP,
    date_debut_collecte TIMESTAMP,
    date_fin_collecte TIMESTAMP,
    date_depot_point TIMESTAMP,
    date_validation TIMESTAMP,
    
    -- Informations collecte
    photo_preuve_url TEXT,
    code_confirmation_producteur VARCHAR(10),
    notes_collecte TEXT,
    conformite_tri BOOLEAN,
    
    -- Informations dépôt
    point_depot_id UUID REFERENCES points_depot_volontaire(id),
    poids_depose DECIMAL(10, 2),
    qualite_dechets VARCHAR(50), -- conforme / non_conforme
    
    -- Validation gestionnaire
    valide_par UUID, -- ID du gestionnaire
    validation_notes TEXT,
    points_attribues INTEGER DEFAULT 0,
    gains_attribues DECIMAL(10, 2) DEFAULT 0,
    
    -- Métadonnées
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE DES NOTIFICATIONS (améliorée)
-- ============================================
DROP TABLE IF EXISTS notifications CASCADE;
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL,
    type_utilisateur type_utilisateur NOT NULL,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type_notification VARCHAR(50) CHECK (type_notification IN (
        'info', 'succes', 'alerte', 'nouvelle_mission', 'mission_acceptee', 
        'mission_terminee', 'validation_collecte', 'paiement_recu', 'compte_valide'
    )),
    reference_id UUID, -- ID de la mission, collecte, etc.
    reference_type VARCHAR(50),
    est_lue BOOLEAN DEFAULT false,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE DES TOKENS (unifiée)
-- ============================================
DROP TABLE IF EXISTS tokens_reinitialisation_mdp CASCADE;
CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL,
    type_utilisateur type_utilisateur NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    type_token VARCHAR(50) CHECK (type_token IN ('reset_password', 'validation_email', 'validation_compte')),
    expire_le TIMESTAMP NOT NULL,
    utilise BOOLEAN DEFAULT false,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE photos_preuves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    collecteur_id UUID REFERENCES collecteurs(id),
    url_photo TEXT NOT NULL,
    type_photo VARCHAR(50) CHECK (type_photo IN ('avant_collecte', 'apres_collecte', 'depot', 'autre')),
    description TEXT,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE DES GAINS COLLECTEURS
-- ============================================
CREATE TABLE gains_collecteurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collecteur_id UUID REFERENCES collecteurs(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
    montant DECIMAL(10, 2) NOT NULL,
    type_gain VARCHAR(50) CHECK (type_gain IN ('collecte', 'bonus', 'prime')),
    statut VARCHAR(50) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'valide', 'paye')),
    date_validation TIMESTAMP,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE DES HISTORIQUES D'ACTIONS
-- ============================================
CREATE TABLE historique_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL,
    type_utilisateur type_utilisateur NOT NULL,
    action VARCHAR(255) NOT NULL,
    details JSONB,
    adresse_ip INET,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEX POUR OPTIMISATION
-- ============================================
-- Index pour collecteurs
CREATE INDEX idx_collecteurs_email ON collecteurs(email);
CREATE INDEX idx_collecteurs_telephone ON collecteurs(telephone);
CREATE INDEX idx_collecteurs_statut ON collecteurs(statut);
CREATE INDEX idx_collecteurs_zone ON collecteurs USING GIST(zone_intervention);

-- Index pour missions
CREATE INDEX idx_missions_collecteur_id ON missions(collecteur_id);
CREATE INDEX idx_missions_statut ON missions(statut);
CREATE INDEX idx_missions_declaration_id ON missions(declaration_id);
CREATE INDEX idx_missions_point_depot ON missions(point_depot_id);
CREATE INDEX idx_missions_date_validation ON missions(date_validation);

-- Index pour gestionnaires
CREATE INDEX idx_gestionnaires_email ON gestionnaires_points(email);
CREATE INDEX idx_gestionnaires_point_collecte ON gestionnaires_points(point_collecte_id);

-- Index pour notifications
CREATE INDEX idx_notifications_utilisateur ON notifications(utilisateur_id, type_utilisateur);
CREATE INDEX idx_notifications_non_lues ON notifications(est_lue) WHERE est_lue = false;

-- ============================================
-- FONCTIONS ET TRIGGERS
-- ============================================

-- Trigger pour mettre à jour modifié_le sur toutes les tables
CREATE OR REPLACE FUNCTION mettre_a_jour_modifie_le()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modifie_le = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Application des triggers
CREATE TRIGGER mettre_a_jour_collecteurs_modifie_le 
    BEFORE UPDATE ON collecteurs 
    FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_modifie_le();

CREATE TRIGGER mettre_a_jour_gestionnaires_modifie_le 
    BEFORE UPDATE ON gestionnaires_points 
    FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_modifie_le();

CREATE TRIGGER mettre_a_jour_superviseurs_modifie_le 
    BEFORE UPDATE ON superviseurs 
    FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_modifie_le();

CREATE TRIGGER mettre_a_jour_missions_modifie_le 
    BEFORE UPDATE ON missions 
    FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_modifie_le();

-- Fonction pour notifier collecteur d'une nouvelle mission
CREATE OR REPLACE FUNCTION notifier_nouvelle_mission()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.statut = 'disponible' AND (OLD.statut IS NULL OR OLD.statut != 'disponible') THEN
        -- Créer des notifications pour les collecteurs dans la zone
        INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification, reference_id, reference_type)
        SELECT 
            c.id,
            'collecteur',
            'Nouvelle mission disponible',
            'Une nouvelle mission de collecte est disponible dans votre zone.',
            'nouvelle_mission',
            NEW.id,
            'mission'
        FROM collecteurs c
        WHERE c.statut = 'actif' 
          AND c.est_actif = true
          AND ST_Intersects(
              c.zone_intervention,
              (SELECT localisation_gps::geometry FROM producteurs 
               WHERE id = (SELECT producteur_id FROM declarations_dechets WHERE id = NEW.declaration_id))
          );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER notifier_nouvelle_mission_trigger
    AFTER INSERT ON missions
    FOR EACH ROW EXECUTE FUNCTION notifier_nouvelle_mission();

-- Fonction pour calculer les gains du collecteur
CREATE OR REPLACE FUNCTION calculer_gains_collecteur()
RETURNS TRIGGER AS $$
DECLARE
    montant_gain DECIMAL(10, 2);
BEGIN
    IF NEW.statut = 'validee' AND (OLD.statut IS NULL OR OLD.statut != 'validee') THEN
        -- Calcul du gain (exemple: 100 FCFA par kg)
        montant_gain := NEW.poids_depose * 100;
        
        -- Mise à jour des gains du collecteur
        UPDATE collecteurs 
        SET gains_total = gains_total + montant_gain
        WHERE id = NEW.collecteur_id;
        
        -- Enregistrement du gain
        INSERT INTO gains_collecteurs (collecteur_id, mission_id, montant, type_gain, statut)
        VALUES (NEW.collecteur_id, NEW.id, montant_gain, 'collecte', 'valide');
        
        -- Notification au collecteur
        INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification, reference_id, reference_type)
        VALUES (
            NEW.collecteur_id,
            'collecteur',
            'Mission validée',
            'Votre mission a été validée. Vous avez gagné ' || montant_gain || ' FCFA.',
            'validation_collecte',
            NEW.id,
            'mission'
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculer_gains_sur_validation
    AFTER UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION calculer_gains_collecteur();

-- ============================================
-- VUES POUR TABLEAUX DE BORD
-- ============================================

-- Vue pour tableau de bord collecteur
CREATE OR REPLACE VIEW tableau_bord_collecteur AS
SELECT 
    c.id as collecteur_id,
    c.nom_complet,
    c.email,
    c.telephone,
    c.statut,
    c.points_total,
    c.gains_total,
    COUNT(DISTINCT m.id) as total_missions,
    COUNT(DISTINCT CASE WHEN m.statut = 'validee' THEN m.id END) as missions_validees,
    COUNT(DISTINCT CASE WHEN m.statut = 'en_cours' THEN m.id END) as missions_en_cours,
    COALESCE(SUM(m.poids_depose), 0) as total_dechets_collectes,
    COALESCE(SUM(CASE WHEN m.statut = 'validee' THEN m.gains_attribues END), 0) as gains_du_mois,
    MAX(m.date_validation) as derniere_mission_validee
FROM collecteurs c
LEFT JOIN missions m ON c.id = m.collecteur_id
GROUP BY c.id, c.nom_complet, c.email, c.telephone, c.statut, c.points_total, c.gains_total;

-- Vue pour tableau de bord gestionnaire
CREATE OR REPLACE VIEW tableau_bord_gestionnaire AS
SELECT 
    gp.id as gestionnaire_id,
    gp.nom_complet,
    gp.point_collecte_id,
    pdv.nom as point_collecte_nom,
    COUNT(DISTINCT m.id) as total_receptions,
    COALESCE(SUM(m.poids_depose), 0) as total_poids_recu,
    COUNT(DISTINCT CASE WHEN m.date_validation >= CURRENT_DATE THEN m.id END) as receptions_aujourdhui,
    COALESCE(SUM(CASE WHEN m.date_validation >= CURRENT_DATE THEN m.poids_depose END), 0) as poids_aujourdhui
FROM gestionnaires_points gp
LEFT JOIN points_depot_volontaire pdv ON gp.point_collecte_id = pdv.id
LEFT JOIN missions m ON pdv.id = m.point_depot_id AND m.statut = 'validee'
GROUP BY gp.id, gp.nom_complet, gp.point_collecte_id, pdv.nom;

