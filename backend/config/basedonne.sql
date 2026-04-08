-- =====================================================
-- TYPES (ENUM)
-- =====================================================

CREATE TYPE mode_collecte AS ENUM (
    'collecte_domicile',
    'depot_volontaire'
);

CREATE TYPE statut_collecteur AS ENUM (
    'en_attente',
    'actif',
    'suspendu',
    'inactif'
);

CREATE TYPE statut_declaration AS ENUM (
    'en_attente',
    'affecte',
    'programme',
    'termine',
    'annule'
);

CREATE TYPE statut_mission AS ENUM (
    'disponible',
    'acceptee',
    'en_cours',
    'deposee',
    'validee',
    'refusee',
    'annulee'
);

CREATE TYPE type_collecteur AS ENUM (
    'independant',
    'cooperative'
);

CREATE TYPE type_dechet AS ENUM (
    'plastique_pet',
    'plastique_pehd',
    'papier_carton',
    'metal',
    'verre',
    'organique'
);

CREATE TYPE type_producteur AS ENUM (
    'menage',
    'commerce',
    'entreprise',
    'administration'
);

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

-- =====================================================
-- FUNCTIONS
-- =====================================================

CREATE FUNCTION attribuer_points_apres_collecte() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;

CREATE FUNCTION calculer_gains_collecteur() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    montant_gain DECIMAL(10, 2);
BEGIN
    IF NEW.statut = 'validee' AND (OLD.statut IS NULL OR OLD.statut != 'validee') THEN
        montant_gain := NEW.poids_depose * 100;
        
        UPDATE collecteurs 
        SET gains_total = gains_total + montant_gain
        WHERE id = NEW.collecteur_id;
        
        INSERT INTO gains_collecteurs (collecteur_id, mission_id, montant, type_gain, statut)
        VALUES (NEW.collecteur_id, NEW.id, montant_gain, 'collecte', 'valide');
        
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

CREATE FUNCTION calculer_poids_estime() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;

CREATE FUNCTION mettre_a_jour_modifie_le() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.modifie_le = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE FUNCTION notifier_affectation_collecteur() RETURNS trigger
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

CREATE FUNCTION notifier_nouvelle_mission() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.statut = 'disponible' AND (OLD.statut IS NULL OR OLD.statut != 'disponible') THEN
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

-- =====================================================
-- TABLES
-- =====================================================

CREATE TABLE achats_gestionnaires (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    gestionnaire_id uuid NOT NULL,
    point_depot_id uuid NOT NULL,
    nom_vendeur character varying(255),
    telephone_vendeur character varying(20),
    type_dechet type_dechet NOT NULL,
    poids numeric(10,2) NOT NULL,
    prix_par_kg numeric(10,2) NOT NULL,
    total numeric(15,2) GENERATED ALWAYS AS ((poids * prix_par_kg)) STORED,
    date_achat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    recu_url text,
    notes text,
    CONSTRAINT achats_gestionnaires_pkey PRIMARY KEY (id)
);

CREATE TABLE admins (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20),
    mot_de_passe_hash character varying(255) NOT NULL,
    nom_complet character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'admin'::character varying,
    est_actif boolean DEFAULT true,
    derniere_connexion timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    type_utilisateur character varying(50) DEFAULT 'admin'::character varying,
    mis_a_jour_le timestamp without time zone DEFAULT now(),
    CONSTRAINT admins_pkey PRIMARY KEY (id),
    CONSTRAINT admins_email_key UNIQUE (email),
    CONSTRAINT admins_telephone_key UNIQUE (telephone)
);

CREATE TABLE campagne_objectifs (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    campagne_id uuid NOT NULL,
    type_dechet type_dechet NOT NULL,
    poids_attendue numeric(10,2) NOT NULL,
    prix_par_kg numeric(10,2) NOT NULL,
    poids_collecte_actuel numeric(10,2) DEFAULT 0,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT campagne_objectifs_pkey PRIMARY KEY (id),
    CONSTRAINT campagne_objectifs_campagne_id_type_dechet_key UNIQUE (campagne_id, type_dechet)
);

CREATE TABLE campagnes (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    nom character varying(255) NOT NULL,
    description text,
    date_debut date NOT NULL,
    date_fin date NOT NULL,
    types_dechets type_dechet[],
    zones_intervention text[],
    poids_attendue numeric(10,2),
    prix_par_kg numeric(10,2),
    budget_total numeric(15,2) GENERATED ALWAYS AS ((poids_attendue * prix_par_kg)) STORED,
    statut character varying(50) DEFAULT 'planifiee'::character varying,
    createur_id uuid NOT NULL,
    createur_type character varying(50) NOT NULL,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT campagnes_pkey PRIMARY KEY (id),
    CONSTRAINT campagnes_dates_check CHECK ((date_fin >= date_debut))
);

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
    type_compte character varying(50) DEFAULT 'standard'::character varying,
    CONSTRAINT producteurs_pkey PRIMARY KEY (id),
    CONSTRAINT producteurs_email_key UNIQUE (email),
    CONSTRAINT producteurs_telephone_key UNIQUE (telephone)
);

CREATE TABLE declarations_recyclage (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    recycleur_id uuid NOT NULL,
    demande_enlevement_id uuid,
    type_dechet type_dechet NOT NULL,
    quantite_recyclee numeric(10,2) NOT NULL,
    date_recyclage date NOT NULL,
    certificat_url text,
    statut character varying(50) DEFAULT 'en_attente'::character varying,
    valide_par uuid,
    date_validation timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT declarations_recyclage_pkey PRIMARY KEY (id)
);

CREATE TABLE demandes_enlevement (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    recycleur_id uuid NOT NULL,
    point_depot_id uuid NOT NULL,
    type_dechet type_dechet NOT NULL,
    quantite_demandee numeric(10,2) NOT NULL,
    quantite_reelle numeric(10,2),
    date_souhaitee date NOT NULL,
    date_validation timestamp without time zone,
    date_realisation timestamp without time zone,
    statut character varying(50) DEFAULT 'en_attente'::character varying,
    valide_par uuid,
    notes text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT demandes_enlevement_pkey PRIMARY KEY (id)
);

CREATE TABLE demandes_suppression (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    superviseur_id uuid NOT NULL,
    type_entite character varying(50) NOT NULL,
    entite_id uuid NOT NULL,
    raison text NOT NULL,
    statut character varying(50) DEFAULT 'en_attente'::character varying,
    traitee_par uuid,
    traitee_le timestamp without time zone,
    notes_traitement text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT demandes_suppression_pkey PRIMARY KEY (id)
);

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

CREATE TABLE historique_actions (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    utilisateur_id uuid NOT NULL,
    action character varying(255) NOT NULL,
    details jsonb,
    adresse_ip inet,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT historique_actions_pkey PRIMARY KEY (id)
);

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

CREATE TABLE historique_stocks_recycleurs (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    recycleur_id uuid NOT NULL,
    type_mouvement character varying(50) NOT NULL,
    type_dechet type_dechet NOT NULL,
    quantite numeric(10,2) NOT NULL,
    stock_avant numeric(10,2) NOT NULL,
    stock_apres numeric(10,2) NOT NULL,
    reference_id uuid,
    reference_type character varying(50),
    notes text,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT historique_stocks_recycleurs_pkey PRIMARY KEY (id)
);

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
    campagne_id uuid,
    CONSTRAINT missions_pkey PRIMARY KEY (id)
);

CREATE TABLE notifications (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    utilisateur_id uuid NOT NULL,
    titre character varying(255) NOT NULL,
    message text NOT NULL,
    type_notification character varying(50),
    reference_id uuid,
    reference_type character varying(50),
    est_lue boolean DEFAULT false,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    producteur_id uuid,
    type_utilisateur type_utilisateur,
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_type_notification_check CHECK (((type_notification)::text = ANY ((ARRAY['compte_valide'::character varying, 'mission_acceptee'::character varying, 'validation_collecte'::character varying, 'nouvelle_mission'::character varying, 'succes'::character varying, 'info'::character varying, 'gain_recu'::character varying, 'demande_validee'::character varying, 'demande_refusee'::character varying, 'paiement_recu'::character varying])::text[])))
);

CREATE TABLE ongs (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20),
    mot_de_passe_hash character varying(255) NOT NULL,
    nom_ong character varying(255) NOT NULL,
    numero_agrement character varying(100),
    domaine_intervention text[],
    nom_responsable character varying(255),
    adresse text,
    localisation_gps geography(Point,4326),
    statut character varying(50) DEFAULT 'actif'::character varying,
    est_actif boolean DEFAULT true,
    cgu_acceptees boolean DEFAULT false,
    cgu_acceptees_le timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion timestamp without time zone,
    CONSTRAINT ongs_pkey PRIMARY KEY (id),
    CONSTRAINT ongs_email_key UNIQUE (email),
    CONSTRAINT ongs_telephone_key UNIQUE (telephone)
);

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

CREATE TABLE producteurs_premium (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    producteur_id uuid NOT NULL,
    type_abonnement character varying(50) NOT NULL,
    frequence_collecte character varying(50) NOT NULL,
    date_debut date NOT NULL,
    date_fin date NOT NULL,
    montant_abonnement numeric(10,2) NOT NULL,
    statut character varying(50) DEFAULT 'actif'::character varying,
    prochaine_collecte date,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT producteurs_premium_pkey PRIMARY KEY (id),
    CONSTRAINT producteurs_premium_producteur_id_key UNIQUE (producteur_id),
    CONSTRAINT producteurs_premium_dates_check CHECK ((date_fin >= date_debut))
);

CREATE TABLE promoteurs_campagne (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    campagne_id uuid NOT NULL,
    promoteur_id uuid NOT NULL,
    promoteur_type character varying(50) NOT NULL,
    contribution_financiere numeric(15,2),
    objectif_specifique text,
    date_ajout timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT promoteurs_campagne_pkey PRIMARY KEY (id),
    CONSTRAINT promoteurs_campagne_campagne_id_promoteur_id_promoteur_type_key UNIQUE (campagne_id, promoteur_id, promoteur_type)
);

CREATE TABLE rapports_ong (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    ong_id uuid NOT NULL,
    titre character varying(255) NOT NULL,
    description text,
    fichier_url text,
    type_rapport character varying(50),
    zone_concernee text,
    date_evenement date,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rapports_ong_pkey PRIMARY KEY (id)
);

CREATE TABLE recycleurs (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL,
    mot_de_passe_hash character varying(255) NOT NULL,
    nom_entreprise character varying(255) NOT NULL,
    nom_responsable character varying(255) NOT NULL,
    adresse text NOT NULL,
    localisation_gps geography(Point,4326),
    quartier character varying(100),
    commune character varying(100),
    numero_identite character varying(50),
    photo_cni_recto_url text,
    photo_cni_verso_url text,
    photo_profil_url text,
    statut character varying(50) DEFAULT 'en_attente'::character varying,
    est_actif boolean DEFAULT false,
    notes_validation text,
    valide_par uuid,
    valide_le timestamp without time zone,
    cgu_acceptees boolean DEFAULT false,
    cgu_acceptees_le timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion timestamp without time zone,
    valide_par_type character varying(50) DEFAULT 'superviseur'::character varying,
    CONSTRAINT recycleurs_pkey PRIMARY KEY (id),
    CONSTRAINT recycleurs_email_key UNIQUE (email),
    CONSTRAINT recycleurs_telephone_key UNIQUE (telephone)
);

CREATE TABLE sponsors (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20),
    mot_de_passe_hash character varying(255) NOT NULL,
    nom_organisation character varying(255) NOT NULL,
    type_organisation character varying(50),
    nom_responsable character varying(255),
    adresse text,
    localisation_gps geography(Point,4326),
    statut character varying(50) DEFAULT 'actif'::character varying,
    est_actif boolean DEFAULT true,
    cgu_acceptees boolean DEFAULT false,
    cgu_acceptees_le timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    derniere_connexion timestamp without time zone,
    notes_desactivation character varying(255),
    CONSTRAINT sponsors_pkey PRIMARY KEY (id),
    CONSTRAINT sponsors_email_key UNIQUE (email),
    CONSTRAINT sponsors_telephone_key UNIQUE (telephone)
);

CREATE TABLE stocks_dechets (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    point_depot_id uuid NOT NULL,
    type_dechet type_dechet NOT NULL,
    quantite_disponible numeric(10,2) DEFAULT 0 NOT NULL,
    unite character varying(20) DEFAULT 'kg'::character varying,
    prix_estime numeric(10,2),
    dernier_mouvement timestamp without time zone,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    quantite_reservee numeric(10,2) DEFAULT 0,
    CONSTRAINT stocks_dechets_pkey PRIMARY KEY (id),
    CONSTRAINT stocks_dechets_point_depot_id_type_dechet_key UNIQUE (point_depot_id, type_dechet)
);

CREATE TABLE stocks_recycleurs (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    recycleur_id uuid NOT NULL,
    type_dechet type_dechet NOT NULL,
    quantite_disponible numeric(10,2) DEFAULT 0 NOT NULL,
    unite character varying(20) DEFAULT 'kg'::character varying,
    dernier_mouvement timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modifie_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT stocks_recycleurs_pkey PRIMARY KEY (id),
    CONSTRAINT stocks_recycleurs_recycleur_id_type_dechet_key UNIQUE (recycleur_id, type_dechet)
);

CREATE TABLE suivi_campagne (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    campagne_id uuid NOT NULL,
    date_suivi date NOT NULL,
    poids_collecte numeric(10,2) DEFAULT 0,
    montant_utilise numeric(15,2) DEFAULT 0,
    points_concernes integer DEFAULT 0,
    details jsonb,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT suivi_campagne_pkey PRIMARY KEY (id),
    CONSTRAINT suivi_campagne_campagne_id_date_suivi_key UNIQUE (campagne_id, date_suivi)
);

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

CREATE TABLE transactions_paiement (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    producteur_id uuid NOT NULL,
    operateur character varying(20) NOT NULL,
    montant numeric(10,2) NOT NULL,
    telephone character varying(20) NOT NULL,
    statut character varying(20) DEFAULT 'en_attente'::character varying,
    cree_le timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_validation timestamp without time zone,
    CONSTRAINT transactions_paiement_pkey PRIMARY KEY (id),
    CONSTRAINT transactions_paiement_operateur_check CHECK (((operateur)::text = ANY ((ARRAY['ORANGE'::character varying, 'MTN'::character varying])::text[]))),
    CONSTRAINT transactions_paiement_statut_check CHECK (((statut)::text = ANY ((ARRAY['en_attente'::character varying, 'reussi'::character varying, 'echoue'::character varying])::text[])))
);

CREATE TABLE types_dechets_declaration (
    declaration_id uuid NOT NULL,
    type_dechet type_dechet NOT NULL,
    quantite numeric(10,2) NOT NULL,
    unite character varying(20),
    CONSTRAINT types_dechets_declaration_pkey PRIMARY KEY (declaration_id, type_dechet),
    CONSTRAINT types_dechets_declaration_unite_check CHECK (((unite)::text = ANY ((ARRAY['kg'::character varying, 'sacs'::character varying, 'unites'::character varying])::text[])))
);

-- =====================================================
-- VIEWS
-- =====================================================

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
   FROM declarations_dechets dd
     JOIN producteurs p ON (dd.producteur_id = p.id)
  WHERE (dd.statut = 'en_attente'::statut_declaration)
  ORDER BY dd.cree_le;

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
   FROM collecteurs c
     LEFT JOIN missions m ON (c.id = m.collecteur_id)
  GROUP BY c.id, c.nom_complet, c.email, c.telephone, c.statut, c.points_total, c.gains_total;

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
   FROM gestionnaires_points gp
     LEFT JOIN points_depot_volontaire pdv ON (gp.point_collecte_id = pdv.id)
     LEFT JOIN missions m ON ((pdv.id = m.point_depot_id) AND (m.statut = 'validee'::statut_mission))
  GROUP BY gp.id, gp.nom_complet, gp.point_collecte_id, pdv.nom;

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_campagne_objectifs_campagne ON campagne_objectifs USING btree (campagne_id);
CREATE INDEX idx_codes_reinitialisation_code ON codes_reinitialisation USING btree (code);
CREATE INDEX idx_codes_reinitialisation_utilisateur ON codes_reinitialisation USING btree (utilisateur_id);
CREATE INDEX idx_collecteurs_email ON collecteurs USING btree (email);
CREATE INDEX idx_collecteurs_statut ON collecteurs USING btree (statut);
CREATE INDEX idx_collecteurs_telephone ON collecteurs USING btree (telephone);
CREATE INDEX idx_collecteurs_zone ON collecteurs USING gist (zone_intervention);
CREATE INDEX idx_declarations_date ON declarations_dechets USING btree (date_declaration);
CREATE INDEX idx_declarations_producteur_id ON declarations_dechets USING btree (producteur_id);
CREATE INDEX idx_declarations_recycleur ON declarations_recyclage USING btree (recycleur_id);
CREATE INDEX idx_declarations_statut ON declarations_dechets USING btree (statut);
CREATE INDEX idx_demandes_recycleur ON demandes_enlevement USING btree (recycleur_id);
CREATE INDEX idx_demandes_statut ON demandes_enlevement USING btree (statut);
CREATE INDEX idx_gestionnaires_email ON gestionnaires_points USING btree (email);
CREATE INDEX idx_gestionnaires_point_collecte ON gestionnaires_points USING btree (point_collecte_id);
CREATE INDEX idx_historique_points_producteur_id ON historique_points USING btree (producteur_id);
CREATE INDEX idx_historique_stocks_recycleur ON historique_stocks_recycleurs USING btree (recycleur_id);
CREATE INDEX idx_missions_campagne ON missions USING btree (campagne_id);
CREATE INDEX idx_missions_collecteur_id ON missions USING btree (collecteur_id);
CREATE INDEX idx_missions_date_validation ON missions USING btree (date_validation);
CREATE INDEX idx_missions_declaration_id ON missions USING btree (declaration_id);
CREATE INDEX idx_missions_point_depot ON missions USING btree (point_depot_id);
CREATE INDEX idx_missions_statut ON missions USING btree (statut);
CREATE INDEX idx_missions_validee_par ON missions USING btree (validee_par);
CREATE INDEX idx_points_depot_localisation ON points_depot_volontaire USING gist (localisation_gps);
CREATE INDEX idx_producteurs_email ON producteurs USING btree (email);
CREATE INDEX idx_producteurs_premium_date_fin ON producteurs_premium USING btree (date_fin);
CREATE INDEX idx_producteurs_premium_producteur ON producteurs_premium USING btree (producteur_id);
CREATE INDEX idx_producteurs_premium_statut ON producteurs_premium USING btree (statut);
CREATE INDEX idx_producteurs_telephone ON producteurs USING btree (telephone);
CREATE INDEX idx_stocks_recycleurs_recycleur ON stocks_recycleurs USING btree (recycleur_id);
CREATE INDEX idx_transactions_producteur ON transactions_paiement USING btree (producteur_id);
CREATE INDEX idx_transactions_statut ON transactions_paiement USING btree (statut);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER calculer_gains_sur_validation AFTER UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION calculer_gains_collecteur();
CREATE TRIGGER calculer_poids_avant_insertion BEFORE INSERT ON declarations_dechets FOR EACH ROW EXECUTE FUNCTION calculer_poids_estime();
CREATE TRIGGER mettre_a_jour_collecteurs_modifie_le BEFORE UPDATE ON collecteurs FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_modifie_le();
CREATE TRIGGER mettre_a_jour_declarations_modifie_le BEFORE UPDATE ON declarations_dechets FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_modifie_le();
CREATE TRIGGER mettre_a_jour_gestionnaires_modifie_le BEFORE UPDATE ON gestionnaires_points FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_modifie_le();
CREATE TRIGGER mettre_a_jour_missions_modifie_le BEFORE UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_modifie_le();
CREATE TRIGGER mettre_a_jour_producteurs_modifie_le BEFORE UPDATE ON producteurs FOR EACH ROW EXECUTE FUNCTION mettre_a_jour_modifie_le();
CREATE TRIGGER notifier_affectation_collecteur_trigger AFTER UPDATE ON declarations_dechets FOR EACH ROW EXECUTE FUNCTION notifier_affectation_collecteur();
CREATE TRIGGER notifier_nouvelle_mission_trigger AFTER INSERT ON missions FOR EACH ROW EXECUTE FUNCTION notifier_nouvelle_mission();

-- =====================================================
-- FOREIGN KEY CONSTRAINTS
-- =====================================================

ALTER TABLE ONLY achats_gestionnaires ADD CONSTRAINT achats_gestionnaires_gestionnaire_id_fkey FOREIGN KEY (gestionnaire_id) REFERENCES gestionnaires_points(id);
ALTER TABLE ONLY achats_gestionnaires ADD CONSTRAINT achats_gestionnaires_point_depot_id_fkey FOREIGN KEY (point_depot_id) REFERENCES points_depot_volontaire(id);
ALTER TABLE ONLY campagne_objectifs ADD CONSTRAINT campagne_objectifs_campagne_id_fkey FOREIGN KEY (campagne_id) REFERENCES campagnes(id) ON DELETE CASCADE;
ALTER TABLE ONLY declarations_dechets ADD CONSTRAINT declarations_dechets_producteur_id_fkey FOREIGN KEY (producteur_id) REFERENCES producteurs(id) ON DELETE CASCADE;
ALTER TABLE ONLY declarations_recyclage ADD CONSTRAINT declarations_recyclage_demande_enlevement_id_fkey FOREIGN KEY (demande_enlevement_id) REFERENCES demandes_enlevement(id);
ALTER TABLE ONLY declarations_recyclage ADD CONSTRAINT declarations_recyclage_recycleur_id_fkey FOREIGN KEY (recycleur_id) REFERENCES recycleurs(id);
ALTER TABLE ONLY declarations_recyclage ADD CONSTRAINT declarations_recyclage_valide_par_fkey FOREIGN KEY (valide_par) REFERENCES superviseurs(id);
ALTER TABLE ONLY demandes_enlevement ADD CONSTRAINT demandes_enlevement_point_depot_id_fkey FOREIGN KEY (point_depot_id) REFERENCES points_depot_volontaire(id);
ALTER TABLE ONLY demandes_enlevement ADD CONSTRAINT demandes_enlevement_recycleur_id_fkey FOREIGN KEY (recycleur_id) REFERENCES recycleurs(id);
ALTER TABLE ONLY demandes_enlevement ADD CONSTRAINT demandes_enlevement_valide_par_fkey FOREIGN KEY (valide_par) REFERENCES superviseurs(id);
ALTER TABLE ONLY demandes_suppression ADD CONSTRAINT demandes_suppression_superviseur_id_fkey FOREIGN KEY (superviseur_id) REFERENCES superviseurs(id);
ALTER TABLE ONLY demandes_suppression ADD CONSTRAINT demandes_suppression_traitee_par_fkey FOREIGN KEY (traitee_par) REFERENCES admins(id);
ALTER TABLE ONLY gains_collecteurs ADD CONSTRAINT gains_collecteurs_collecteur_id_fkey FOREIGN KEY (collecteur_id) REFERENCES collecteurs(id) ON DELETE CASCADE;
ALTER TABLE ONLY gains_collecteurs ADD CONSTRAINT gains_collecteurs_mission_id_fkey FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE SET NULL;
ALTER TABLE ONLY gestionnaires_points ADD CONSTRAINT gestionnaires_points_point_collecte_id_fkey FOREIGN KEY (point_collecte_id) REFERENCES points_depot_volontaire(id) ON DELETE SET NULL;
ALTER TABLE ONLY historique_points ADD CONSTRAINT historique_points_producteur_id_fkey FOREIGN KEY (producteur_id) REFERENCES producteurs(id) ON DELETE CASCADE;
ALTER TABLE ONLY historique_stocks_recycleurs ADD CONSTRAINT historique_stocks_recycleurs_recycleur_id_fkey FOREIGN KEY (recycleur_id) REFERENCES recycleurs(id);
ALTER TABLE ONLY missions ADD CONSTRAINT missions_campagne_id_fkey FOREIGN KEY (campagne_id) REFERENCES campagnes(id) ON DELETE SET NULL;
ALTER TABLE ONLY missions ADD CONSTRAINT missions_collecteur_id_fkey FOREIGN KEY (collecteur_id) REFERENCES collecteurs(id) ON DELETE SET NULL;
ALTER TABLE ONLY missions ADD CONSTRAINT missions_declaration_id_fkey FOREIGN KEY (declaration_id) REFERENCES declarations_dechets(id) ON DELETE SET NULL;
ALTER TABLE ONLY missions ADD CONSTRAINT missions_point_depot_id_fkey FOREIGN KEY (point_depot_id) REFERENCES points_depot_volontaire(id);
ALTER TABLE ONLY missions ADD CONSTRAINT missions_validee_par_fkey FOREIGN KEY (validee_par) REFERENCES gestionnaires_points(id);
ALTER TABLE ONLY photos_preuves ADD CONSTRAINT photos_preuves_collecteur_id_fkey FOREIGN KEY (collecteur_id) REFERENCES collecteurs(id);
ALTER TABLE ONLY photos_preuves ADD CONSTRAINT photos_preuves_mission_id_fkey FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE;
ALTER TABLE ONLY producteurs_premium ADD CONSTRAINT producteurs_premium_producteur_id_fkey FOREIGN KEY (producteur_id) REFERENCES producteurs(id);
ALTER TABLE ONLY promoteurs_campagne ADD CONSTRAINT promoteurs_campagne_campagne_id_fkey FOREIGN KEY (campagne_id) REFERENCES campagnes(id) ON DELETE CASCADE;
ALTER TABLE ONLY stocks_dechets ADD CONSTRAINT stocks_dechets_point_depot_id_fkey FOREIGN KEY (point_depot_id) REFERENCES points_depot_volontaire(id);
ALTER TABLE ONLY stocks_recycleurs ADD CONSTRAINT stocks_recycleurs_recycleur_id_fkey FOREIGN KEY (recycleur_id) REFERENCES recycleurs(id);
ALTER TABLE ONLY suivi_campagne ADD CONSTRAINT suivi_campagne_campagne_id_fkey FOREIGN KEY (campagne_id) REFERENCES campagnes(id) ON DELETE CASCADE;
ALTER TABLE ONLY transactions_paiement ADD CONSTRAINT transactions_paiement_producteur_id_fkey FOREIGN KEY (producteur_id) REFERENCES producteurs(id) ON DELETE CASCADE;
ALTER TABLE ONLY types_dechets_declaration ADD CONSTRAINT types_dechets_declaration_declaration_id_fkey FOREIGN KEY (declaration_id) REFERENCES declarations_dechets(id) ON DELETE CASCADE;










--modification du 07/04/2026 pour les déclarations annexes

ALTER TABLE declarations_dechets
ADD COLUMN type_declaration VARCHAR(20) DEFAULT 'normale',
ADD COLUMN latitude_reelle DECIMAL(10,8),
ADD COLUMN longitude_reelle DECIMAL(11,8),
ADD COLUMN photo_url TEXT,
ADD COLUMN adresse_reelle TEXT;