-- database/schema.sql
-- Script complet de création de votre base de données

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enumérations (en français)
CREATE TYPE type_producteur AS ENUM ('menage', 'commerce', 'entreprise', 'administration');
CREATE TYPE type_dechet AS ENUM ('plastique_pet', 'plastique_pehd', 'papier_carton', 'metal', 'verre', 'organique');
CREATE TYPE mode_collecte AS ENUM ('collecte_domicile', 'depot_volontaire');
CREATE TYPE statut_declaration AS ENUM ('en_attente', 'affecte', 'programme', 'termine', 'annule');

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

-- Table des collectes
CREATE TABLE collectes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    declaration_id UUID REFERENCES declarations_dechets(id) ON DELETE SET NULL,
    collecteur_id UUID,
    date_programmee DATE NOT NULL,
    heure_programmee VARCHAR(50),
    date_reelle DATE,
    poids_reel DECIMAL(10, 2),
    statut VARCHAR(50) DEFAULT 'programmee',
    notes TEXT,
    points_attribues INTEGER DEFAULT 0,
    terminee_le TIMESTAMP,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producteur_id UUID REFERENCES producteurs(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type_notification VARCHAR(50) CHECK (type_notification IN ('info', 'succes', 'alerte', 'collecteur_affecte', 'collecte_programmee', 'collecte_terminee')),
    est_lue BOOLEAN DEFAULT false,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des points/récompenses
CREATE TABLE historique_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producteur_id UUID REFERENCES producteurs(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    raison VARCHAR(255) NOT NULL,
    reference_id UUID,
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
    IF NEW.unite = 'sacs' THEN
        NEW.poids_estime = NEW.quantite * 10;
    ELSIF NEW.unite = 'unites' THEN
        NEW.poids_estime = NEW.quantite * 1;
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
        points_a_attribuer := CEIL(NEW.poids_reel);
        
        UPDATE producteurs 
        SET points = points + points_a_attribuer
        WHERE id = (
            SELECT producteur_id 
            FROM declarations_dechets 
            WHERE id = NEW.declaration_id
        );
        
        INSERT INTO historique_points (producteur_id, points, raison, reference_id, type_reference)
        SELECT 
            dd.producteur_id,
            points_a_attribuer,
            'Collecte terminée',
            NEW.id,
            'collecte'
        FROM declarations_dechets dd
        WHERE dd.id = NEW.declaration_id;
        
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