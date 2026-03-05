-- Supprimer l'ancien type et le recréer avec tous les types
-- Mais attention: cela peut casser les tables qui utilisent ce type

-- D'abord, vérifier où le type est utilisé
SELECT typname, nspname 
FROM pg_type 
JOIN pg_namespace ON typnamespace = pg_namespace.oid 
WHERE typname = 'type_utilisateur';

-- Supprimer l'ancien type (si pas utilisé dans des tables)
DROP TYPE IF EXISTS type_utilisateur CASCADE;

-- Recréer le type avec tous les types d'utilisateurs
CREATE TYPE type_utilisateur AS ENUM (
    'collecteur',
    'gestionnaire', 
    'superviseur',
    'producteur',
    'admin',
    'recycleur',
    'sponsor',
    'ong'
);


1. EXTENSIONS
sql
-- Extensions spatiales et UUID
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
2. TYPES ÉNUMÉRÉS (ENUM)
sql
-- 2.1 mode_collecte
CREATE TYPE mode_collecte AS ENUM (
    'collecte_domicile',    -- Collecte à domicile
    'depot_volontaire'      -- Dépôt volontaire par le producteur
);

-- 2.2 statut_collecteur
CREATE TYPE statut_collecteur AS ENUM (
    'en_attente',   -- En attente de validation
    'actif',        -- Compte actif
    'suspendu',     -- Compte suspendu
    'inactif'       -- Compte inactif
);

-- 2.3 statut_declaration
CREATE TYPE statut_declaration AS ENUM (
    'en_attente',   -- Déclaration en attente
    'affecte',      -- Collecteur affecté
    'programme',    -- Collecte programmée
    'termine',      -- Collecte terminée
    'annule'        -- Déclaration annulée
);

-- 2.4 statut_mission
CREATE TYPE statut_mission AS ENUM (
    'disponible',   -- Mission disponible pour les collecteurs
    'acceptee',     -- Mission acceptée par un collecteur
    'en_cours',     -- Collecte en cours
    'deposee',      -- Déchets déposés au point de collecte
    'validee',      -- Mission validée
    'refusee',      -- Mission refusée
    'annulee'       -- Mission annulée
);

-- 2.5 type_collecteur
CREATE TYPE type_collecteur AS ENUM (
    'independant',   -- Collecteur indépendant
    'cooperative'    -- Membre d'une coopérative
);

-- 2.6 type_dechet
CREATE TYPE type_dechet AS ENUM (
    'plastique_pet',     -- Plastique PET
    'plastique_pehd',    -- Plastique PEHD
    'papier_carton',     -- Papier et carton
    'metal',             -- Métaux
    'verre',             -- Verre
    'organique'          -- Déchets organiques
);

-- 2.7 type_producteur
CREATE TYPE type_producteur AS ENUM (
    'menage',           -- Ménage particulier
    'commerce',         -- Commerce
    'entreprise',       -- Entreprise
    'administration'    -- Administration publique
);

-- 2.8 type_utilisateur
CREATE TYPE type_utilisateur AS ENUM (
    'collecteur',       -- Collecteur de déchets
    'gestionnaire',     -- Gestionnaire de point de collecte
    'superviseur',      -- Superviseur général
    'producteur'        -- Producteur de déchets
);
3. FONCTIONS
sql
-- 3.1 attribuer_points_apres_collecte()
CREATE FUNCTION attribuer_points_apres_collecte() 
RETURNS trigger
LANGUAGE plpgsql
AS $$
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
$$;

-- 3.2 calculer_gains_collecteur()
CREATE FUNCTION calculer_gains_collecteur() 
RETURNS trigger
LANGUAGE plpgsql
AS $$
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
$$;

-- 3.3 calculer_poids_estime()
CREATE FUNCTION calculer_poids_estime() 
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Conversion basique (ajuster selon les besoins réels)
    IF NEW.unite = 'sacs' THEN
        NEW.poids_estime = NEW.quantite * 10; -- Supposition: 10kg par sac
    ELSIF NEW.unite = 'unites' THEN
        NEW.poids_estime = NEW.quantite * 1; -- Supposition: 1kg par unité
    ELSE
        NEW.poids_estime = NEW.quantite;
    END IF;
    RETURN NEW;
END;
$$;

-- 3.4 mettre_a_jour_modifie_le()
CREATE FUNCTION mettre_a_jour_modifie_le() 
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.modifie_le = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 3.5 notifier_affectation_collecteur()
CREATE FUNCTION notifier_affectation_collecteur() 
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.statut = 'affecte' AND (OLD.statut IS NULL OR OLD.statut != 'affecte') THEN
        INSERT INTO notifications (
            utilisateur_id, 
            type_utilisateur, 
            titre, 
            message, 
            type_notification,
            reference_id,
            reference_type
        )
        SELECT 
            producteur_id,
            'producteur',
            'Collecteur affecté',
            'Un collecteur a été affecté à votre déclaration. Vous serez notifié du créneau horaire.',
            'collecteur_affecte',
            NEW.id,
            'declaration'
        FROM declarations_dechets
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

-- 3.6 notifier_nouvelle_mission()
CREATE FUNCTION notifier_nouvelle_mission() 
RETURNS trigger
LANGUAGE plpgsql
AS $$
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
$$;
4. TABLES
sql
-- 4.1 codes_reinitialisation
CREATE TABLE codes_reinitialisation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    utilisateur_id uuid NOT NULL,
    type_utilisateur character varying(50) NOT NULL,
    code character varying(6) NOT NULL,
    email character varying(255) NOT NULL,
    expire_le timestamp without time zone NOT NULL,
    utilise boolean DEFAULT false,
    tentatives integer DEFAULT 0,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT codes_reinitialisation_pkey PRIMARY KEY (id)
);

-- 4.2 collecteurs
CREATE TABLE collecteurs (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL,
    mot_de_passe_hash character varying(255) NOT NULL,
    nom_complet character varying(255) NOT NULL,
    type_collecteur type_collecteur NOT NULL,
    numero_identite character varying(50),
    zone_intervention geometry(Polygon,4326),
    zone_intervention_nom character varying(255),
    quartiers_habituels text[],
    communes_intervention text[],
    statut statut_collecteur DEFAULT 'en_attente'::statut_collecteur,
    est_actif boolean DEFAULT false,
    notes_validation text,
    valide_par uuid,
    valide_le timestamp without time zone,
    photo_profil_url text,
    cgu_acceptees boolean DEFAULT false,
    cgu_acceptees_le timestamp without time zone,
    points_total integer DEFAULT 0,
    gains_total numeric(10,2) DEFAULT 0,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion timestamp without time zone,
    photo_cni_recto_url text,
    photo_cni_verso_url text,
    CONSTRAINT collecteurs_pkey PRIMARY KEY (id),
    CONSTRAINT collecteurs_email_key UNIQUE (email),
    CONSTRAINT collecteurs_telephone_key UNIQUE (telephone)
);

-- 4.3 producteurs
CREATE TABLE producteurs (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL,
    mot_de_passe_hash character varying(255) NOT NULL,
    type_producteur type_producteur NOT NULL,
    nom_complet character varying(255) NOT NULL,
    adresse text NOT NULL,
    localisation_gps geography(Point,4326),
    quartier character varying(100),
    commune character varying(100),
    est_actif boolean DEFAULT true,
    cgu_acceptees boolean DEFAULT false,
    cgu_acceptees_le timestamp without time zone,
    points integer DEFAULT 0,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion timestamp without time zone,
    CONSTRAINT producteurs_pkey PRIMARY KEY (id),
    CONSTRAINT producteurs_email_key UNIQUE (email),
    CONSTRAINT producteurs_telephone_key UNIQUE (telephone)
);

-- 4.4 declarations_dechets
CREATE TABLE declarations_dechets (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    producteur_id uuid,
    date_declaration date DEFAULT CURRENT_DATE,
    type_dechet type_dechet NOT NULL,
    quantite numeric(10,2) NOT NULL,
    unite character varying(20),
    poids_estime numeric(10,2),
    mode_collecte mode_collecte NOT NULL,
    statut statut_declaration DEFAULT 'en_attente'::statut_declaration,
    date_souhaitee date,
    creneau_horaire character varying(50),
    notes text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT declarations_dechets_pkey PRIMARY KEY (id),
    CONSTRAINT declarations_dechets_unite_check CHECK (((unite)::text = ANY ((ARRAY['kg'::character varying, 'sacs'::character varying, 'unites'::character varying])::text[])))
);

-- 4.5 types_dechets_declaration
CREATE TABLE types_dechets_declaration (
    declaration_id uuid NOT NULL,
    type_dechet type_dechet NOT NULL,
    quantite numeric(10,2) NOT NULL,
    unite character varying(20),
    CONSTRAINT types_dechets_declaration_pkey PRIMARY KEY (declaration_id, type_dechet),
    CONSTRAINT types_dechets_declaration_unite_check CHECK (((unite)::text = ANY ((ARRAY['kg'::character varying, 'sacs'::character varying, 'unites'::character varying])::text[])))
);

-- 4.6 missions
CREATE TABLE missions (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    declaration_id uuid,
    collecteur_id uuid,
    statut statut_mission DEFAULT 'disponible'::statut_mission,
    date_disponibilite timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_acceptation timestamp without time zone,
    date_debut_collecte timestamp without time zone,
    date_fin_collecte timestamp without time zone,
    date_depot_point timestamp without time zone,
    date_validation timestamp without time zone,
    photo_preuve_url text,
    code_confirmation_producteur character varying(10),
    notes_collecte text,
    conformite_tri boolean,
    point_depot_id uuid,
    poids_depose numeric(10,2),
    qualite_dechets character varying(50),
    valide_par uuid,
    validation_notes text,
    points_attribues integer DEFAULT 0,
    gains_attribues numeric(10,2) DEFAULT 0,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_programmee date,
    heure_programmee character varying(50),
    validee_par uuid,
    prix_par_kg integer,
    CONSTRAINT missions_pkey PRIMARY KEY (id)
);

-- 4.7 points_depot_volontaire
CREATE TABLE points_depot_volontaire (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    nom character varying(255) NOT NULL,
    adresse text NOT NULL,
    localisation_gps geography(Point,4326),
    quartier character varying(100),
    commune character varying(100),
    types_dechets_acceptes type_dechet[],
    horaires_ouverture jsonb,
    est_actif boolean DEFAULT true,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT points_depot_volontaire_pkey PRIMARY KEY (id)
);

-- 4.8 gestionnaires_points
CREATE TABLE gestionnaires_points (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL,
    mot_de_passe_hash character varying(255) NOT NULL,
    nom_complet character varying(255) NOT NULL,
    point_collecte_id uuid,
    fonction character varying(100),
    est_actif boolean DEFAULT true,
    cree_par uuid,
    derniere_connexion timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT gestionnaires_points_pkey PRIMARY KEY (id),
    CONSTRAINT gestionnaires_points_email_key UNIQUE (email),
    CONSTRAINT gestionnaires_points_telephone_key UNIQUE (telephone)
);

-- 4.9 superviseurs
CREATE TABLE superviseurs (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20),
    mot_de_passe_hash character varying(255) NOT NULL,
    nom_complet character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'superviseur'::character varying,
    est_actif boolean DEFAULT true,
    derniere_connexion timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT superviseurs_pkey PRIMARY KEY (id),
    CONSTRAINT superviseurs_email_key UNIQUE (email),
    CONSTRAINT superviseurs_telephone_key UNIQUE (telephone)
);

-- 4.10 gains_collecteurs
CREATE TABLE gains_collecteurs (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    collecteur_id uuid,
    mission_id uuid,
    montant numeric(10,2) NOT NULL,
    type_gain character varying(50),
    statut character varying(50) DEFAULT 'en_attente'::character varying,
    date_validation timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT gains_collecteurs_pkey PRIMARY KEY (id),
    CONSTRAINT gains_collecteurs_statut_check CHECK (((statut)::text = ANY ((ARRAY['en_attente'::character varying, 'valide'::character varying, 'paye'::character varying])::text[]))),
    CONSTRAINT gains_collecteurs_type_gain_check CHECK (((type_gain)::text = ANY ((ARRAY['collecte'::character varying, 'bonus'::character varying, 'prime'::character varying])::text[])))
);

-- 4.11 historique_points
CREATE TABLE historique_points (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    producteur_id uuid,
    points integer NOT NULL,
    raison character varying(255) NOT NULL,
    reference_id uuid,
    type_reference character varying(50),
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT historique_points_pkey PRIMARY KEY (id)
);

-- 4.12 notifications
CREATE TABLE notifications (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    utilisateur_id uuid NOT NULL,
    type_utilisateur type_utilisateur NOT NULL,
    titre character varying(255) NOT NULL,
    message text NOT NULL,
    type_notification character varying(50),
    reference_id uuid,
    reference_type character varying(50),
    est_lue boolean DEFAULT false,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    producteur_id uuid,
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_type_notification_check CHECK (((type_notification)::text = ANY ((ARRAY['compte_valide'::character varying, 'mission_acceptee'::character varying, 'validation_collecte'::character varying, 'nouvelle_mission'::character varying, 'succes'::character varying, 'info'::character varying, 'gain_recu'::character varying])::text[])))
);

-- 4.13 photos_preuves
CREATE TABLE photos_preuves (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    mission_id uuid,
    collecteur_id uuid,
    url_photo text NOT NULL,
    type_photo character varying(50),
    description text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT photos_preuves_pkey PRIMARY KEY (id),
    CONSTRAINT photos_preuves_type_photo_check CHECK (((type_photo)::text = ANY ((ARRAY['avant_collecte'::character varying, 'apres_collecte'::character varying, 'depot'::character varying, 'autre'::character varying])::text[])))
);

-- 4.14 tokens
CREATE TABLE tokens (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    utilisateur_id uuid NOT NULL,
    token character varying(255) NOT NULL,
    type_token character varying(50),
    expire_le timestamp without time zone NOT NULL,
    utilise boolean DEFAULT false,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tokens_pkey PRIMARY KEY (id),
    CONSTRAINT tokens_token_key UNIQUE (token),
    CONSTRAINT tokens_type_token_check CHECK (((type_token)::text = ANY ((ARRAY['reset_password'::character varying, 'validation_email'::character varying, 'validation_compte'::character varying])::text[])))
);

-- 4.15 historique_actions
CREATE TABLE historique_actions (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    utilisateur_id uuid NOT NULL,
    action character varying(255) NOT NULL,
    details jsonb,
    adresse_ip inet,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT historique_actions_pkey PRIMARY KEY (id)
);
5. VUES
sql
-- 5.1 declarations_en_attente
CREATE VIEW declarations_en_attente AS
 SELECT dd.id,
    dd.producteur_id,
    dd.date_declaration,
    dd.type_dechet,
    dd.quantite,
    dd.unite,
    dd.poids_estime,
    dd.mode_collecte,
    dd.statut,
    dd.date_souhaitee,
    dd.creneau_horaire,
    dd.notes,
    dd.cree_le,
    dd.modifie_le,
    p.nom_complet,
    p.type_producteur,
    p.quartier,
    p.commune
   FROM (declarations_dechets dd
     JOIN producteurs p ON ((dd.producteur_id = p.id)))
  WHERE (dd.statut = 'en_attente'::statut_declaration)
  ORDER BY dd.cree_le;

-- 5.2 tableau_bord_collecteur
CREATE VIEW tableau_bord_collecteur AS
 SELECT c.id AS collecteur_id,
    c.nom_complet,
    c.email,
    c.telephone,
    c.statut,
    c.points_total,
    c.gains_total,
    count(DISTINCT m.id) AS total_missions,
    count(DISTINCT
        CASE
            WHEN (m.statut = 'validee'::statut_mission) THEN m.id
            ELSE NULL::uuid
        END) AS missions_validees,
    count(DISTINCT
        CASE
            WHEN (m.statut = 'en_cours'::statut_mission) THEN m.id
            ELSE NULL::uuid
        END) AS missions_en_cours,
    COALESCE(sum(m.poids_depose), (0)::numeric) AS total_dechets_collectes,
    COALESCE(sum(
        CASE
            WHEN (m.statut = 'validee'::statut_mission) THEN m.gains_attribues
            ELSE NULL::numeric
        END), (0)::numeric) AS gains_du_mois,
    max(m.date_validation) AS derniere_mission_validee
   FROM (collecteurs c
     LEFT JOIN missions m ON ((c.id = m.collecteur_id)))
  GROUP BY c.id, c.nom_complet, c.email, c.telephone, c.statut, c.points_total, c.gains_total;

-- 5.3 tableau_bord_gestionnaire
CREATE VIEW tableau_bord_gestionnaire AS
 SELECT gp.id AS gestionnaire_id,
    gp.nom_complet,
    gp.point_collecte_id,
    pdv.nom AS point_collecte_nom,
    count(DISTINCT m.id) AS total_receptions,
    COALESCE(sum(m.poids_depose), (0)::numeric) AS total_poids_recu,
    count(DISTINCT
        CASE
            WHEN (m.date_validation >= CURRENT_DATE) THEN m.id
            ELSE NULL::uuid
        END) AS receptions_aujourdhui,
    COALESCE(sum(
        CASE
            WHEN (m.date_validation >= CURRENT_DATE) THEN m.poids_depose
            ELSE NULL::numeric
        END), (0)::numeric) AS poids_aujourdhui
   FROM ((gestionnaires_points gp
     LEFT JOIN points_depot_volontaire pdv ON ((gp.point_collecte_id = pdv.id)))
     LEFT JOIN missions m ON (((pdv.id = m.point_depot_id) AND (m.statut = 'validee'::statut_mission))))
  GROUP BY gp.id, gp.nom_complet, gp.point_collecte_id, pdv.nom;
6. INDEX
sql
-- Index sur codes_reinitialisation
CREATE INDEX idx_codes_reinitialisation_code ON codes_reinitialisation USING btree (code);
CREATE INDEX idx_codes_reinitialisation_utilisateur ON codes_reinitialisation USING btree (utilisateur_id);

-- Index sur collecteurs
CREATE INDEX idx_collecteurs_email ON collecteurs USING btree (email);
CREATE INDEX idx_collecteurs_statut ON collecteurs USING btree (statut);
CREATE INDEX idx_collecteurs_telephone ON collecteurs USING btree (telephone);
CREATE INDEX idx_collecteurs_zone ON collecteurs USING gist (zone_intervention);

-- Index sur declarations_dechets
CREATE INDEX idx_declarations_date ON declarations_dechets USING btree (date_declaration);
CREATE INDEX idx_declarations_producteur_id ON declarations_dechets USING btree (producteur_id);
CREATE INDEX idx_declarations_statut ON declarations_dechets USING btree (statut);

-- Index sur gestionnaires_points
CREATE INDEX idx_gestionnaires_email ON gestionnaires_points USING btree (email);
CREATE INDEX idx_gestionnaires_point_collecte ON gestionnaires_points USING btree (point_collecte_id);

-- Index sur historique_points
CREATE INDEX idx_historique_points_producteur_id ON historique_points USING btree (producteur_id);

-- Index sur missions
CREATE INDEX idx_missions_collecteur_id ON missions USING btree (collecteur_id);
CREATE INDEX idx_missions_date_validation ON missions USING btree (date_validation);
CREATE INDEX idx_missions_declaration_id ON missions USING btree (declaration_id);
CREATE INDEX idx_missions_point_depot ON missions USING btree (point_depot_id);
CREATE INDEX idx_missions_statut ON missions USING btree (statut);
CREATE INDEX idx_missions_validee_par ON missions USING btree (validee_par);

-- Index sur points_depot_volontaire
CREATE INDEX idx_points_depot_localisation ON points_depot_volontaire USING gist (localisation_gps);

-- Index sur producteurs
CREATE INDEX idx_producteurs_email ON producteurs USING btree (email);
CREATE INDEX idx_producteurs_telephone ON producteurs USING btree (telephone);
7. TRIGGERS
sql
-- 7.1 Triggers sur missions
-- Calculer les gains lors de la validation d'une mission
CREATE TRIGGER calculer_gains_sur_validation 
AFTER UPDATE ON missions 
FOR EACH ROW 
EXECUTE FUNCTION calculer_gains_collecteur();

-- Notifier les collecteurs d'une nouvelle mission
CREATE TRIGGER notifier_nouvelle_mission_trigger 
AFTER INSERT ON missions 
FOR EACH ROW 
EXECUTE FUNCTION notifier_nouvelle_mission();

-- Mettre à jour la date de modification
CREATE TRIGGER mettre_a_jour_missions_modifie_le 
BEFORE UPDATE ON missions 
FOR EACH ROW 
EXECUTE FUNCTION mettre_a_jour_modifie_le();

-- 7.2 Triggers sur declarations_dechets
-- Calculer le poids estimé avant insertion
CREATE TRIGGER calculer_poids_avant_insertion 
BEFORE INSERT ON declarations_dechets 
FOR EACH ROW 
EXECUTE FUNCTION calculer_poids_estime();

-- Notifier l'affectation d'un collecteur
CREATE TRIGGER notifier_affectation_collecteur_trigger 
AFTER UPDATE ON declarations_dechets 
FOR EACH ROW 
EXECUTE FUNCTION notifier_affectation_collecteur();

-- Mettre à jour la date de modification
CREATE TRIGGER mettre_a_jour_declarations_modifie_le 
BEFORE UPDATE ON declarations_dechets 
FOR EACH ROW 
EXECUTE FUNCTION mettre_a_jour_modifie_le();

-- 7.3 Triggers sur collecteurs
-- Mettre à jour la date de modification
CREATE TRIGGER mettre_a_jour_collecteurs_modifie_le 
BEFORE UPDATE ON collecteurs 
FOR EACH ROW 
EXECUTE FUNCTION mettre_a_jour_modifie_le();

-- 7.4 Triggers sur producteurs
-- Mettre à jour la date de modification
CREATE TRIGGER mettre_a_jour_producteurs_modifie_le 
BEFORE UPDATE ON producteurs 
FOR EACH ROW 
EXECUTE FUNCTION mettre_a_jour_modifie_le();

-- 7.5 Triggers sur gestionnaires_points
-- Mettre à jour la date de modification
CREATE TRIGGER mettre_a_jour_gestionnaires_modifie_le 
BEFORE UPDATE ON gestionnaires_points 
FOR EACH ROW 
EXECUTE FUNCTION mettre_a_jour_modifie_le();
8. CONTRAINTES DE CLÉS ÉTRANGÈRES
sql
-- declarations_dechets -> producteurs
ALTER TABLE ONLY declarations_dechets
    ADD CONSTRAINT declarations_dechets_producteur_id_fkey 
    FOREIGN KEY (producteur_id) REFERENCES producteurs(id) ON DELETE CASCADE;

-- types_dechets_declaration -> declarations_dechets
ALTER TABLE ONLY types_dechets_declaration
    ADD CONSTRAINT types_dechets_declaration_declaration_id_fkey 
    FOREIGN KEY (declaration_id) REFERENCES declarations_dechets(id) ON DELETE CASCADE;

-- missions -> declarations_dechets
ALTER TABLE ONLY missions
    ADD CONSTRAINT missions_declaration_id_fkey 
    FOREIGN KEY (declaration_id) REFERENCES declarations_dechets(id) ON DELETE SET NULL;

-- missions -> collecteurs
ALTER TABLE ONLY missions
    ADD CONSTRAINT missions_collecteur_id_fkey 
    FOREIGN KEY (collecteur_id) REFERENCES collecteurs(id) ON DELETE SET NULL;

-- missions -> points_depot_volontaire
ALTER TABLE ONLY missions
    ADD CONSTRAINT missions_point_depot_id_fkey 
    FOREIGN KEY (point_depot_id) REFERENCES points_depot_volontaire(id);

-- missions -> gestionnaires_points (validation)
ALTER TABLE ONLY missions
    ADD CONSTRAINT missions_validee_par_fkey 
    FOREIGN KEY (validee_par) REFERENCES gestionnaires_points(id);

-- gains_collecteurs -> collecteurs
ALTER TABLE ONLY gains_collecteurs
    ADD CONSTRAINT gains_collecteurs_collecteur_id_fkey 
    FOREIGN KEY (collecteur_id) REFERENCES collecteurs(id) ON DELETE CASCADE;

-- gains_collecteurs -> missions
ALTER TABLE ONLY gains_collecteurs
    ADD CONSTRAINT gains_collecteurs_mission_id_fkey 
    FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE SET NULL;

-- gestionnaires_points -> points_depot_volontaire
ALTER TABLE ONLY gestionnaires_points
    ADD CONSTRAINT gestionnaires_points_point_collecte_id_fkey 
    FOREIGN KEY (point_collecte_id) REFERENCES points_depot_volontaire(id) ON DELETE SET NULL;

-- historique_points -> producteurs
ALTER TABLE ONLY historique_points
    ADD CONSTRAINT historique_points_producteur_id_fkey 
    FOREIGN KEY (producteur_id) REFERENCES producteurs(id) ON DELETE CASCADE;

-- photos_preuves -> missions
ALTER TABLE ONLY photos_preuves
    ADD CONSTRAINT photos_preuves_mission_id_fkey 
    FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE;

-- photos_preuves -> collecteurs
ALTER TABLE ONLY photos_preuves
    ADD CONSTRAINT photos_preuves_collecteur_id_fkey 
    FOREIGN KEY (collecteur_id) REFERENCES collecteurs(id);



-- Nouvelles fonctions pour pour ONG , SPONSORS , ADMINISTRATEURS ,  Recycleurs ,  et autres acteurs ainsi que abonnement producteur :

📊 NOUVELLES TABLES À CRÉER
sql
-- 1. TABLE ADMIN
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20) UNIQUE,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom_complet VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    est_actif BOOLEAN DEFAULT true,
    derniere_connexion TIMESTAMP,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLE RECYCLEURS
CREATE TABLE recycleurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom_entreprise VARCHAR(255) NOT NULL,
    nom_responsable VARCHAR(255) NOT NULL,
    adresse TEXT NOT NULL,
    localisation_gps GEOGRAPHY(POINT, 4326),
    quartier VARCHAR(100),
    commune VARCHAR(100),
    numero_identite VARCHAR(50),
    photo_cni_recto_url TEXT,
    photo_cni_verso_url TEXT,
    photo_profil_url TEXT,
    statut VARCHAR(50) DEFAULT 'en_attente', -- en_attente, actif, suspendu
    est_actif BOOLEAN DEFAULT false,
    notes_validation TEXT,
    valide_par UUID, -- ID du superviseur
    valide_le TIMESTAMP,
    cgu_acceptees BOOLEAN DEFAULT false,
    cgu_acceptees_le TIMESTAMP,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion TIMESTAMP,
    FOREIGN KEY (valide_par) REFERENCES superviseurs(id)
);

-- 3. TABLE SPONSORS/INSTITUTIONS
CREATE TABLE sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20) UNIQUE,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom_organisation VARCHAR(255) NOT NULL,
    type_organisation VARCHAR(50), -- sponsor, institution, entreprise
    nom_responsable VARCHAR(255),
    adresse TEXT,
    localisation_gps GEOGRAPHY(POINT, 4326),
    photo_logo_url TEXT,
    statut VARCHAR(50) DEFAULT 'actif',
    est_actif BOOLEAN DEFAULT true,
    cgu_acceptees BOOLEAN DEFAULT false,
    cgu_acceptees_le TIMESTAMP,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion TIMESTAMP
);

-- 4. TABLE ONG/SOCIETE CIVILE
CREATE TABLE ongs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20) UNIQUE,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    nom_ong VARCHAR(255) NOT NULL,
    numero_agrement VARCHAR(100),
    domaine_intervention TEXT[],
    nom_responsable VARCHAR(255),
    adresse TEXT,
    localisation_gps GEOGRAPHY(POINT, 4326),
    photo_logo_url TEXT,
    statut VARCHAR(50) DEFAULT 'actif',
    est_actif BOOLEAN DEFAULT true,
    cgu_acceptees BOOLEAN DEFAULT false,
    cgu_acceptees_le TIMESTAMP,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion TIMESTAMP
);

-- 5. TABLE CAMPAGNES
CREATE TABLE campagnes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    types_dechets type_dechet[] NOT NULL, -- Un ou plusieurs types
    zones_intervention TEXT[], -- Liste des zones/communes
    poids_attendue NUMERIC(10, 2) NOT NULL, -- En kg
    prix_par_kg NUMERIC(10, 2) NOT NULL, -- En FCFA
    budget_total NUMERIC(15, 2) GENERATED ALWAYS AS (poids_attendue * prix_par_kg) STORED,
    statut VARCHAR(50) DEFAULT 'planifiee', -- planifiee, active, terminee, suspendue
    createur_id UUID NOT NULL, -- Qui a créé la campagne (superviseur)
    createur_type VARCHAR(50) NOT NULL, -- 'superviseur'
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT campagnes_dates_check CHECK (date_fin >= date_debut)
);

-- 6. TABLE PROMOTEURS_CAMPAGNE (Sponsors/ONG associés à une campagne)
CREATE TABLE promoteurs_campagne (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campagne_id UUID NOT NULL,
    promoteur_id UUID NOT NULL,
    promoteur_type VARCHAR(50) NOT NULL, -- 'sponsor', 'ong'
    contribution_financiere NUMERIC(15, 2), -- Optionnel
    objectif_specifique TEXT,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campagne_id) REFERENCES campagnes(id) ON DELETE CASCADE,
    UNIQUE(campagne_id, promoteur_id, promoteur_type)
);

-- 7. TABLE SUIVI_CAMPAGNE
CREATE TABLE suivi_campagne (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campagne_id UUID NOT NULL,
    date_suivi DATE NOT NULL,
    poids_collecte NUMERIC(10, 2) DEFAULT 0,
    montant_utilise NUMERIC(15, 2) DEFAULT 0,
    points_concernes INTEGER DEFAULT 0, -- Nombre de points de collecte participants
    details JSONB, -- Détails par point de collecte
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campagne_id) REFERENCES campagnes(id) ON DELETE CASCADE,
    UNIQUE(campagne_id, date_suivi)
);

-- 8. TABLE DEMANDES_SUPPRESSION (Pour les superviseurs)
CREATE TABLE demandes_suppression (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    superviseur_id UUID NOT NULL,
    type_entite VARCHAR(50) NOT NULL, -- 'gestionnaire', 'point_collecte', 'promoteur', etc.
    entite_id UUID NOT NULL,
    raison TEXT NOT NULL,
    statut VARCHAR(50) DEFAULT 'en_attente', -- en_attente, approuvee, rejetee
    traitee_par UUID, -- ID de l'admin qui a traité
    traitee_le TIMESTAMP,
    notes_traitement TEXT,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (superviseur_id) REFERENCES superviseurs(id),
    FOREIGN KEY (traitee_par) REFERENCES admins(id)
);

-- 9. TABLE STOCKS_DECHETS (Pour les recycleurs)
CREATE TABLE stocks_dechets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    point_depot_id UUID NOT NULL,
    type_dechet type_dechet NOT NULL,
    quantite_disponible NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unite VARCHAR(20) DEFAULT 'kg',
    prix_estime NUMERIC(10, 2), -- Prix estimé par kg
    dernier_mouvement TIMESTAMP,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (point_depot_id) REFERENCES points_depot_volontaire(id),
    UNIQUE(point_depot_id, type_dechet)
);

-- 10. TABLE DEMANDES_ENLEVEMENT (Pour recycleurs)
CREATE TABLE demandes_enlevement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recycleur_id UUID NOT NULL,
    point_depot_id UUID NOT NULL,
    type_dechet type_dechet NOT NULL,
    quantite_demandee NUMERIC(10, 2) NOT NULL,
    date_souhaitee DATE NOT NULL,
    statut VARCHAR(50) DEFAULT 'en_attente', -- en_attente, acceptee, refusee, realisee
    valide_par UUID, -- Superviseur qui valide
    date_validation TIMESTAMP,
    notes TEXT,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recycleur_id) REFERENCES recycleurs(id),
    FOREIGN KEY (point_depot_id) REFERENCES points_depot_volontaire(id),
    FOREIGN KEY (valide_par) REFERENCES superviseurs(id)
);

-- 11. TABLE DECLARATIONS_RECYCLAGE
CREATE TABLE declarations_recyclage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recycleur_id UUID NOT NULL,
    demande_enlevement_id UUID, -- Optionnel, si lié à une demande
    type_dechet type_dechet NOT NULL,
    quantite_recyclee NUMERIC(10, 2) NOT NULL,
    date_recyclage DATE NOT NULL,
    certificat_url TEXT, -- Lien vers document justificatif
    statut VARCHAR(50) DEFAULT 'en_attente', -- en_attente, validee
    valide_par UUID,
    date_validation TIMESTAMP,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recycleur_id) REFERENCES recycleurs(id),
    FOREIGN KEY (demande_enlevement_id) REFERENCES demandes_enlevement(id),
    FOREIGN KEY (valide_par) REFERENCES superviseurs(id)
);

-- 12. TABLE RAPPORTS_ONG
CREATE TABLE rapports_ong (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ong_id UUID NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    fichier_url TEXT,
    type_rapport VARCHAR(50), -- alerte, observation, rapport
    zone_concernee TEXT,
    date_evenement DATE,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ong_id) REFERENCES ongs(id)
);

-- 13. TABLE PRODUCTEURS_PREMIUM (Abonnement)
CREATE TABLE producteurs_premium (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producteur_id UUID NOT NULL UNIQUE,
    type_abonnement VARCHAR(50) NOT NULL, -- mensuel, trimestriel, annuel
    frequence_collecte VARCHAR(50) NOT NULL, -- hebdomadaire, bi-mensuelle, mensuelle
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    montant_abonnement NUMERIC(10, 2) NOT NULL,
    statut VARCHAR(50) DEFAULT 'actif',
    prochaine_collecte DATE,
    cree_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifie_le TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producteur_id) REFERENCES producteurs(id),
    CONSTRAINT producteurs_premium_dates_check CHECK (date_fin >= date_debut)
);

-- 14. TABLE ACHATS_GESTIONNAIRES (Achat direct sans inscription)
CREATE TABLE achats_gestionnaires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gestionnaire_id UUID NOT NULL,
    point_depot_id UUID NOT NULL,
    nom_vendeur VARCHAR(255), -- Personne non inscrite
    telephone_vendeur VARCHAR(20),
    type_dechet type_dechet NOT NULL,
    poids NUMERIC(10, 2) NOT NULL,
    prix_par_kg NUMERIC(10, 2) NOT NULL,
    total NUMERIC(15, 2) GENERATED ALWAYS AS (poids * prix_par_kg) STORED,
    date_achat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reçu_url TEXT, -- Lien vers le reçu/justificatif
    notes TEXT,
    FOREIGN KEY (gestionnaire_id) REFERENCES gestionnaires_points(id),
    FOREIGN KEY (point_depot_id) REFERENCES points_depot_volontaire(id)
);
🔄 MODIFICATIONS DES TABLES EXISTANTES
sql
-- Ajouter type_producteur pour distinguer premium/standard
ALTER TABLE producteurs 
ADD COLUMN IF NOT EXISTS type_compte VARCHAR(50) DEFAULT 'standard', -- standard, premium
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255), -- Pour paiements
ADD COLUMN IF NOT EXISTS mode_paiement VARCHAR(50); -- carte, mobile_money, etc.

-- Ajouter traçabilité des créations
ALTER TABLE points_depot_volontaire
ADD COLUMN IF NOT EXISTS cree_par UUID,
ADD COLUMN IF NOT EXISTS cree_par_type VARCHAR(50); -- 'superviseur', 'admin'

ALTER TABLE gestionnaires_points
ADD COLUMN IF NOT EXISTS cree_par UUID,
ADD COLUMN IF NOT EXISTS cree_par_type VARCHAR(50); -- 'superviseur', 'admin'

-- Ajouter statut pour les campagnes dans missions (optionnel)
ALTER TABLE missions
ADD COLUMN IF NOT EXISTS campagne_id UUID,
ADD COLUMN IF NOT EXISTS prix_campagne NUMERIC(10, 2),
ADD FOREIGN KEY (campagne_id) REFERENCES campagnes(id);

