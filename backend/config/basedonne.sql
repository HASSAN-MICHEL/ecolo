1. EXTENSIONS
sql
-- Extensions spatiales et UUID
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
2. TYPES ÉNUMÉRÉS (ENUM)
2.1 mode_collecte
sql
CREATE TYPE public.mode_collecte AS ENUM (
    'collecte_domicile',    -- Collecte à domicile
    'depot_volontaire'      -- Dépôt volontaire par le producteur
);
2.2 statut_collecteur
sql
CREATE TYPE public.statut_collecteur AS ENUM (
    'en_attente',   -- En attente de validation
    'actif',        -- Compte actif
    'suspendu',     -- Compte suspendu
    'inactif'       -- Compte inactif
);
2.3 statut_declaration
sql
CREATE TYPE public.statut_declaration AS ENUM (
    'en_attente',   -- Déclaration en attente
    'affecte',      -- Collecteur affecté
    'programme',    -- Collecte programmée
    'termine',      -- Collecte terminée
    'annule'        -- Déclaration annulée
);
2.4 statut_mission
sql
CREATE TYPE public.statut_mission AS ENUM (
    'disponible',   -- Mission disponible pour les collecteurs
    'acceptee',     -- Mission acceptée par un collecteur
    'en_cours',     -- Collecte en cours
    'deposee',      -- Déchets déposés au point de collecte
    'validee',      -- Mission validée
    'refusee',      -- Mission refusée
    'annulee'       -- Mission annulée
);
2.5 type_collecteur
sql
CREATE TYPE public.type_collecteur AS ENUM (
    'independant',   -- Collecteur indépendant
    'cooperative'    -- Membre d'une coopérative
);
2.6 type_dechet
sql
CREATE TYPE public.type_dechet AS ENUM (
    'plastique_pet',     -- Plastique PET
    'plastique_pehd',    -- Plastique PEHD
    'papier_carton',     -- Papier et carton
    'metal',             -- Métaux
    'verre',             -- Verre
    'organique'          -- Déchets organiques
);
2.7 type_producteur
sql
CREATE TYPE public.type_producteur AS ENUM (
    'menage',           -- Ménage particulier
    'commerce',         -- Commerce
    'entreprise',       -- Entreprise
    'administration'    -- Administration publique
);
2.8 type_utilisateur
sql
CREATE TYPE public.type_utilisateur AS ENUM (
    'collecteur',       -- Collecteur de déchets
    'gestionnaire',     -- Gestionnaire de point de collecte
    'superviseur',      -- Superviseur général
    'producteur'        -- Producteur de déchets
);
3. FONCTIONS
3.1 attribuer_points_apres_collecte()
sql
CREATE FUNCTION public.attribuer_points_apres_collecte() 
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
3.2 calculer_gains_collecteur()
sql
CREATE FUNCTION public.calculer_gains_collecteur() 
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
3.3 calculer_poids_estime()
sql
CREATE FUNCTION public.calculer_poids_estime() 
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
3.4 mettre_a_jour_modifie_le()
sql
CREATE FUNCTION public.mettre_a_jour_modifie_le() 
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.modifie_le = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;
3.5 notifier_affectation_collecteur()
sql
CREATE FUNCTION public.notifier_affectation_collecteur() 
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
3.6 notifier_nouvelle_mission()
sql
CREATE FUNCTION public.notifier_nouvelle_mission() 
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
4.1 codes_reinitialisation
sql
CREATE TABLE public.codes_reinitialisation (
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
4.2 collecteurs
sql
CREATE TABLE public.collecteurs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL,
    mot_de_passe_hash character varying(255) NOT NULL,
    nom_complet character varying(255) NOT NULL,
    type_collecteur public.type_collecteur NOT NULL,
    numero_identite character varying(50),
    zone_intervention public.geometry(Polygon,4326),
    zone_intervention_nom character varying(255),
    quartiers_habituels text[],
    communes_intervention text[],
    statut public.statut_collecteur DEFAULT 'en_attente'::public.statut_collecteur,
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
4.3 producteurs
sql
CREATE TABLE public.producteurs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL,
    mot_de_passe_hash character varying(255) NOT NULL,
    type_producteur public.type_producteur NOT NULL,
    nom_complet character varying(255) NOT NULL,
    adresse text NOT NULL,
    localisation_gps public.geography(Point,4326),
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
4.4 declarations_dechets
sql
CREATE TABLE public.declarations_dechets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    producteur_id uuid,
    date_declaration date DEFAULT CURRENT_DATE,
    type_dechet public.type_dechet NOT NULL,
    quantite numeric(10,2) NOT NULL,
    unite character varying(20),
    poids_estime numeric(10,2),
    mode_collecte public.mode_collecte NOT NULL,
    statut public.statut_declaration DEFAULT 'en_attente'::public.statut_declaration,
    date_souhaitee date,
    creneau_horaire character varying(50),
    notes text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT declarations_dechets_pkey PRIMARY KEY (id),
    CONSTRAINT declarations_dechets_unite_check CHECK (((unite)::text = ANY ((ARRAY['kg'::character varying, 'sacs'::character varying, 'unites'::character varying])::text[])))
);
4.5 types_dechets_declaration
sql
CREATE TABLE public.types_dechets_declaration (
    declaration_id uuid NOT NULL,
    type_dechet public.type_dechet NOT NULL,
    quantite numeric(10,2) NOT NULL,
    unite character varying(20),
    CONSTRAINT types_dechets_declaration_pkey PRIMARY KEY (declaration_id, type_dechet),
    CONSTRAINT types_dechets_declaration_unite_check CHECK (((unite)::text = ANY ((ARRAY['kg'::character varying, 'sacs'::character varying, 'unites'::character varying])::text[])))
);
4.6 missions
sql
CREATE TABLE public.missions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    declaration_id uuid,
    collecteur_id uuid,
    statut public.statut_mission DEFAULT 'disponible'::public.statut_mission,
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
4.7 points_depot_volontaire
sql
CREATE TABLE public.points_depot_volontaire (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nom character varying(255) NOT NULL,
    adresse text NOT NULL,
    localisation_gps public.geography(Point,4326),
    quartier character varying(100),
    commune character varying(100),
    types_dechets_acceptes public.type_dechet[],
    horaires_ouverture jsonb,
    est_actif boolean DEFAULT true,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT points_depot_volontaire_pkey PRIMARY KEY (id)
);
4.8 gestionnaires_points
sql
CREATE TABLE public.gestionnaires_points (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
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
4.9 superviseurs
sql
CREATE TABLE public.superviseurs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
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
4.10 gains_collecteurs
sql
CREATE TABLE public.gains_collecteurs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
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
4.11 historique_points
sql
CREATE TABLE public.historique_points (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    producteur_id uuid,
    points integer NOT NULL,
    raison character varying(255) NOT NULL,
    reference_id uuid,
    type_reference character varying(50),
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT historique_points_pkey PRIMARY KEY (id)
);
4.12 notifications
sql
CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    utilisateur_id uuid NOT NULL,
    type_utilisateur public.type_utilisateur NOT NULL,
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
4.13 photos_preuves
sql
CREATE TABLE public.photos_preuves (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    mission_id uuid,
    collecteur_id uuid,
    url_photo text NOT NULL,
    type_photo character varying(50),
    description text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT photos_preuves_pkey PRIMARY KEY (id),
    CONSTRAINT photos_preuves_type_photo_check CHECK (((type_photo)::text = ANY ((ARRAY['avant_collecte'::character varying, 'apres_collecte'::character varying, 'depot'::character varying, 'autre'::character varying])::text[])))
);
4.14 tokens
sql
CREATE TABLE public.tokens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
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
4.15 historique_actions
sql
CREATE TABLE public.historique_actions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    utilisateur_id uuid NOT NULL,
    action character varying(255) NOT NULL,
    details jsonb,
    adresse_ip inet,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT historique_actions_pkey PRIMARY KEY (id)
);
5. VUES
5.1 declarations_en_attente
sql
CREATE VIEW public.declarations_en_attente AS
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
   FROM (public.declarations_dechets dd
     JOIN public.producteurs p ON ((dd.producteur_id = p.id)))
  WHERE (dd.statut = 'en_attente'::public.statut_declaration)
  ORDER BY dd.cree_le;
5.2 tableau_bord_collecteur
sql
CREATE VIEW public.tableau_bord_collecteur AS
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
            WHEN (m.statut = 'validee'::public.statut_mission) THEN m.id
            ELSE NULL::uuid
        END) AS missions_validees,
    count(DISTINCT
        CASE
            WHEN (m.statut = 'en_cours'::public.statut_mission) THEN m.id
            ELSE NULL::uuid
        END) AS missions_en_cours,
    COALESCE(sum(m.poids_depose), (0)::numeric) AS total_dechets_collectes,
    COALESCE(sum(
        CASE
            WHEN (m.statut = 'validee'::public.statut_mission) THEN m.gains_attribues
            ELSE NULL::numeric
        END), (0)::numeric) AS gains_du_mois,
    max(m.date_validation) AS derniere_mission_validee
   FROM (public.collecteurs c
     LEFT JOIN public.missions m ON ((c.id = m.collecteur_id)))
  GROUP BY c.id, c.nom_complet, c.email, c.telephone, c.statut, c.points_total, c.gains_total;
5.3 tableau_bord_gestionnaire
sql
CREATE VIEW public.tableau_bord_gestionnaire AS
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
   FROM ((public.gestionnaires_points gp
     LEFT JOIN public.points_depot_volontaire pdv ON ((gp.point_collecte_id = pdv.id)))
     LEFT JOIN public.missions m ON (((pdv.id = m.point_depot_id) AND (m.statut = 'validee'::public.statut_mission))))
  GROUP BY gp.id, gp.nom_complet, gp.point_collecte_id, pdv.nom;
6. INDEX
sql
-- Index sur codes_reinitialisation
CREATE INDEX idx_codes_reinitialisation_code ON public.codes_reinitialisation USING btree (code);
CREATE INDEX idx_codes_reinitialisation_utilisateur ON public.codes_reinitialisation USING btree (utilisateur_id);

-- Index sur collecteurs
CREATE INDEX idx_collecteurs_email ON public.collecteurs USING btree (email);
CREATE INDEX idx_collecteurs_statut ON public.collecteurs USING btree (statut);
CREATE INDEX idx_collecteurs_telephone ON public.collecteurs USING btree (telephone);
CREATE INDEX idx_collecteurs_zone ON public.collecteurs USING gist (zone_intervention);

-- Index sur declarations_dechets
CREATE INDEX idx_declarations_date ON public.declarations_dechets USING btree (date_declaration);
CREATE INDEX idx_declarations_producteur_id ON public.declarations_dechets USING btree (producteur_id);
CREATE INDEX idx_declarations_statut ON public.declarations_dechets USING btree (statut);

-- Index sur gestionnaires_points
CREATE INDEX idx_gestionnaires_email ON public.gestionnaires_points USING btree (email);
CREATE INDEX idx_gestionnaires_point_collecte ON public.gestionnaires_points USING btree (point_collecte_id);

-- Index sur historique_points
CREATE INDEX idx_historique_points_producteur_id ON public.historique_points USING btree (producteur_id);

-- Index sur missions
CREATE INDEX idx_missions_collecteur_id ON public.missions USING btree (collecteur_id);
CREATE INDEX idx_missions_date_validation ON public.missions USING btree (date_validation);
CREATE INDEX idx_missions_declaration_id ON public.missions USING btree (declaration_id);
CREATE INDEX idx_missions_point_depot ON public.missions USING btree (point_depot_id);
CREATE INDEX idx_missions_statut ON public.missions USING btree (statut);
CREATE INDEX idx_missions_validee_par ON public.missions USING btree (validee_par);

-- Index sur points_depot_volontaire
CREATE INDEX idx_points_depot_localisation ON public.points_depot_volontaire USING gist (localisation_gps);

-- Index sur producteurs
CREATE INDEX idx_producteurs_email ON public.producteurs USING btree (email);
CREATE INDEX idx_producteurs_telephone ON public.producteurs USING btree (telephone);
7. TRIGGERS
7.1 Triggers sur missions
sql
-- Calculer les gains lors de la validation d'une mission
CREATE TRIGGER calculer_gains_sur_validation 
AFTER UPDATE ON public.missions 
FOR EACH ROW 
EXECUTE FUNCTION public.calculer_gains_collecteur();

-- Notifier les collecteurs d'une nouvelle mission
CREATE TRIGGER notifier_nouvelle_mission_trigger 
AFTER INSERT ON public.missions 
FOR EACH ROW 
EXECUTE FUNCTION public.notifier_nouvelle_mission();

-- Mettre à jour la date de modification
CREATE TRIGGER mettre_a_jour_missions_modifie_le 
BEFORE UPDATE ON public.missions 
FOR EACH ROW 
EXECUTE FUNCTION public.mettre_a_jour_modifie_le();
7.2 Triggers sur declarations_dechets
sql
-- Calculer le poids estimé avant insertion
CREATE TRIGGER calculer_poids_avant_insertion 
BEFORE INSERT ON public.declarations_dechets 
FOR EACH ROW 
EXECUTE FUNCTION public.calculer_poids_estime();

-- Notifier l'affectation d'un collecteur
CREATE TRIGGER notifier_affectation_collecteur_trigger 
AFTER UPDATE ON public.declarations_dechets 
FOR EACH ROW 
EXECUTE FUNCTION public.notifier_affectation_collecteur();

-- Mettre à jour la date de modification
CREATE TRIGGER mettre_a_jour_declarations_modifie_le 
BEFORE UPDATE ON public.declarations_dechets 
FOR EACH ROW 
EXECUTE FUNCTION public.mettre_a_jour_modifie_le();
7.3 Triggers sur collecteurs
sql
-- Mettre à jour la date de modification
CREATE TRIGGER mettre_a_jour_collecteurs_modifie_le 
BEFORE UPDATE ON public.collecteurs 
FOR EACH ROW 
EXECUTE FUNCTION public.mettre_a_jour_modifie_le();
7.4 Triggers sur producteurs
sql
-- Mettre à jour la date de modification
CREATE TRIGGER mettre_a_jour_producteurs_modifie_le 
BEFORE UPDATE ON public.producteurs 
FOR EACH ROW 
EXECUTE FUNCTION public.mettre_a_jour_modifie_le();
7.5 Triggers sur gestionnaires_points
sql
-- Mettre à jour la date de modification
CREATE TRIGGER mettre_a_jour_gestionnaires_modifie_le 
BEFORE UPDATE ON public.gestionnaires_points 
FOR EACH ROW 
EXECUTE FUNCTION public.mettre_a_jour_modifie_le();
8. CONTRAINTES DE CLÉS ÉTRANGÈRES
sql
-- declarations_dechets -> producteurs
ALTER TABLE ONLY public.declarations_dechets
    ADD CONSTRAINT declarations_dechets_producteur_id_fkey 
    FOREIGN KEY (producteur_id) REFERENCES public.producteurs(id) ON DELETE CASCADE;

-- types_dechets_declaration -> declarations_dechets
ALTER TABLE ONLY public.types_dechets_declaration
    ADD CONSTRAINT types_dechets_declaration_declaration_id_fkey 
    FOREIGN KEY (declaration_id) REFERENCES public.declarations_dechets(id) ON DELETE CASCADE;

-- missions -> declarations_dechets
ALTER TABLE ONLY public.missions
    ADD CONSTRAINT missions_declaration_id_fkey 
    FOREIGN KEY (declaration_id) REFERENCES public.declarations_dechets(id) ON DELETE SET NULL;

-- missions -> collecteurs
ALTER TABLE ONLY public.missions
    ADD CONSTRAINT missions_collecteur_id_fkey 
    FOREIGN KEY (collecteur_id) REFERENCES public.collecteurs(id) ON DELETE SET NULL;

-- missions -> points_depot_volontaire
ALTER TABLE ONLY public.missions
    ADD CONSTRAINT missions_point_depot_id_fkey 
    FOREIGN KEY (point_depot_id) REFERENCES public.points_depot_volontaire(id);

-- missions -> gestionnaires_points (validation)
ALTER TABLE ONLY public.missions
    ADD CONSTRAINT missions_validee_par_fkey 
    FOREIGN KEY (validee_par) REFERENCES public.gestionnaires_points(id);

-- gains_collecteurs -> collecteurs
ALTER TABLE ONLY public.gains_collecteurs
    ADD CONSTRAINT gains_collecteurs_collecteur_id_fkey 
    FOREIGN KEY (collecteur_id) REFERENCES public.collecteurs(id) ON DELETE CASCADE;

-- gains_collecteurs -> missions
ALTER TABLE ONLY public.gains_collecteurs
    ADD CONSTRAINT gains_collecteurs_mission_id_fkey 
    FOREIGN KEY (mission_id) REFERENCES public.missions(id) ON DELETE SET NULL;

-- gestionnaires_points -> points_depot_volontaire
ALTER TABLE ONLY public.gestionnaires_points
    ADD CONSTRAINT gestionnaires_points_point_collecte_id_fkey 
    FOREIGN KEY (point_collecte_id) REFERENCES public.points_depot_volontaire(id) ON DELETE SET NULL;

-- historique_points -> producteurs
ALTER TABLE ONLY public.historique_points
    ADD CONSTRAINT historique_points_producteur_id_fkey 
    FOREIGN KEY (producteur_id) REFERENCES public.producteurs(id) ON DELETE CASCADE;

-- photos_preuves -> missions
ALTER TABLE ONLY public.photos_preuves
    ADD CONSTRAINT photos_preuves_mission_id_fkey 
    FOREIGN KEY (mission_id) REFERENCES public.missions(id) ON DELETE CASCADE;

-- photos_preuves -> collecteurs
ALTER TABLE ONLY public.photos_preuves
    ADD CONSTRAINT photos_preuves_collecteur_id_fkey 
    FOREIGN KEY (collecteur_id) REFERENCES public.collecteurs(id);