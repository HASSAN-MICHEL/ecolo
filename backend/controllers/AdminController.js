// import bcrypt from 'bcrypt';
// import Admin from '../models/Admin.js';
// import Superviseur from '../models/Superviseur.js';
// import Recycleur from '../models/Recycleur.js';
// import { pool } from '../config/database.js';
// import Sponsor from '../models/Sponsor.js';
// import Ong from '../models/Ong.js';
// import Campagne from '../models/Campagne.js';
// import DemandeSuppression from '../models/DemandeSuppression.js';
// import Producteur from '../models/Producteur.js';
// import jwt from 'jsonwebtoken';

// class AdminController {
//     // Connexion admin

//     static async creerAdmin(req, res) {
//         try {
//             const { email, telephone, motDePasse, nomComplet, role } = req.body;
//             const existant = await Admin.trouverParEmail(email);
//             if (existant) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Un compte   existe déjà avec cet emails '
//                 });
//             }

//             const salt = await bcrypt.genSalt(10);
//             const motDePasseHash = await bcrypt.hash(motDePasse, salt);

//             const nouveauAdmin = await Admin.creer({
//                 email,
//                 telephone,
//                 motDePasseHash,
//                 nomComplet,
//                 role
//             });

//             res.status(201).json({
//                 success: true,
//                 message: 'Admin créé avec succès',
//                 admin: {
//                     id: nouveauAdmin.id,
//                     email: nouveauAdmin.email,
//                     nomComplet: nouveauAdmin.nom_complet,
//                     role: nouveauAdmin.role
//                 }
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur création admin:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la création',
//                 erreur: erreur.message
//             });
//         }
//     }

//     static async connexion(req, res) {
//         try {
//             const { email, motDePasse } = req.body;

//             const admin = await Admin.trouverParEmail(email);
//             if (!admin) {
//                 return res.status(401).json({
//                     success: false,
//                     message: 'Identifiants incorrects'
//                 });
//             }

//             const motDePasseValide = await bcrypt.compare(motDePasse, admin.mot_de_passe_hash);
//             if (!motDePasseValide) {
//                 return res.status(401).json({
//                     success: false,
//                     message: 'Identifiants incorrects'
//                 });
//             }

//             if (!admin.est_actif) {
//                 return res.status(403).json({
//                     success: false,
//                     message: 'Compte désactivé'
//                 });
//             }

//             await Admin.mettreAJourConnexion(admin.id);

//             const token = jwt.sign(
//                 { id: admin.id, email: admin.email, type: 'admin' },
//                 process.env.JWT_SECRET,
//                 { expiresIn: process.env.JWT_EXPIRE || '7d' }
//             );

//             res.json({
//                 success: true,
//                 message: 'Connexion réussie',
//                 token,
//                 utilisateur: {
//                     id: admin.id,
//                     email: admin.email,
//                     nomComplet: admin.nom_complet,
//                     role: admin.role,
//                     type: 'admin'
//                 }
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur connexion admin:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la connexion',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Créer un superviseur
//     static async creerSuperviseur(req, res) {
//         try {
//             const { email, telephone, motDePasse, nomComplet } = req.body;

//             // Vérifier si le superviseur existe déjà
//             const existant = await Superviseur.trouverParEmail(email);
//             if (existant) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Un superviseur avec cet email existe déjà'
//                 });
//             }

//             const salt = await bcrypt.genSalt(10);
//             const motDePasseHash = await bcrypt.hash(motDePasse, salt);

//             const nouveauSuperviseur = await Superviseur.creer({
//                 email,
//                 telephone,
//                 motDePasseHash,
//                 nomComplet
//             });

//             res.status(201).json({
//                 success: true,
//                 message: 'Superviseur créé avec succès',
//                 superviseur: {
//                     id: nouveauSuperviseur.id,
//                     email: nouveauSuperviseur.email,
//                     nomComplet: nouveauSuperviseur.nom_complet
//                 }
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur création superviseur:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la création',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Lister tous les superviseurs
//     static async listerSuperviseurs(req, res) {
//         try {
//             const resultat = await pool.query(`
//                 SELECT id, email, telephone, nom_complet, role, est_actif, cree_le
//                 FROM superviseurs
//                 ORDER BY cree_le DESC
//             `);

//             res.json({
//                 success: true,
//                 superviseurs: resultat.rows
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur liste superviseurs:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Dashboard admin global
//     static async tableauBord(req, res) {
//         try {
//             const stats = await pool.query(`
//                 WITH stats_producteurs AS (
//                     SELECT 
//                         COUNT(*) as total,
//                         COUNT(*) FILTER (WHERE type_compte = 'premium') as premium,
//                         COUNT(*) FILTER (WHERE date_part('month', cree_le) = date_part('month', CURRENT_DATE)) as nouveaux_mois
//                     FROM producteurs
//                 ),
//                 stats_collecteurs AS (
//                     SELECT 
//                         COUNT(*) as total,
//                         COUNT(*) FILTER (WHERE statut = 'actif') as actifs,
//                         COUNT(*) FILTER (WHERE statut = 'en_attente') as en_attente
//                     FROM collecteurs
//                 ),
//                 stats_recycleurs AS (
//                     SELECT 
//                         COUNT(*) as total,
//                         COUNT(*) FILTER (WHERE statut = 'actif') as actifs
//                     FROM recycleurs
//                 ),
//                 stats_gestionnaires AS (
//                     SELECT COUNT(*) as total FROM gestionnaires_points
//                 ),
//                 stats_campagnes AS (
//                     SELECT 
//                         COUNT(*) as total,
//                         COUNT(*) FILTER (WHERE statut = 'active') as actives,
//                         COUNT(*) FILTER (WHERE statut = 'terminee') as terminees
//                     FROM campagnes
//                 ),
//                 stats_missions AS (
//                     SELECT 
//                         COUNT(*) as total,
//                         COUNT(*) FILTER (WHERE statut = 'validee') as validees,
//                         COALESCE(SUM(poids_depose) FILTER (WHERE statut = 'validee'), 0) as total_kg
//                     FROM missions
//                 ),
//                  stats_superviseurs AS (
//                     SELECT 
//                         COUNT(*) as total,
//                         COUNT(*) FILTER (WHERE est_actif = true) as actifs
                        
//                     FROM superviseurs
//                 )
//                 SELECT 
//                     (SELECT row_to_json(stats_producteurs) FROM stats_producteurs) as producteurs,
//                     (SELECT row_to_json(stats_collecteurs) FROM stats_collecteurs) as collecteurs,
//                     (SELECT row_to_json(stats_recycleurs) FROM stats_recycleurs) as recycleurs,
//                     (SELECT row_to_json(stats_gestionnaires) FROM stats_gestionnaires) as gestionnaires,
//                     (SELECT row_to_json(stats_campagnes) FROM stats_campagnes) as campagnes,
//                     (SELECT row_to_json(stats_missions) FROM stats_missions) as missions,
//                     (SELECT row_to_json(stats_superviseurs) FROM stats_superviseurs) as superviseurs
//             `);

//             res.json({
//                 success: true,
//                 statistiques: stats.rows[0]
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur dashboard admin:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Traiter une demande de suppression
//     static async traiterDemandeSuppression(req, res) {
//         try {
//             const { demandeId } = req.params;
//             const { statut, notes } = req.body;

//             const resultat = await pool.query(`
//                 UPDATE demandes_suppression 
//                 SET statut = $1, 
//                     traitee_par = $2, 
//                     traitee_le = CURRENT_TIMESTAMP,
//                     notes_traitement = $3
//                 WHERE id = $4
//                 RETURNING *
//             `, [statut, req.utilisateurId, notes, demandeId]);

//             if (resultat.rows.length === 0) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Demande non trouvée'
//                 });
//             }

//             // Si approuvée, supprimer l'entité
//             if (statut === 'approuvee') {
//                 const demande = resultat.rows[0];
//                 await pool.query(
//                     `DELETE FROM ${demande.type_entite} WHERE id = $1`,
//                     [demande.entite_id]
//                 );
//             }

//             res.json({
//                 success: true,
//                 message: `Demande ${statut === 'approuvee' ? 'approuvée' : 'rejetée'}`,
//                 demande: resultat.rows[0]
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur traitement demande:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors du traitement',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Lister les demandes de suppression
//     static async listerDemandesSuppression(req, res) {
//         try {
//             const { statut } = req.query;
            
//             let requete = `
//                 SELECT ds.*, s.nom_complet as superviseur_nom
//                 FROM demandes_suppression ds
//                 JOIN superviseurs s ON ds.superviseur_id = s.id
//             `;
            
//             if (statut) {
//                 requete += ` WHERE ds.statut = $1`;
//                 const resultat = await pool.query(requete, [statut]);
//                 return res.json({ success: true, demandes: resultat.rows });
//             }
            
//             requete += ` ORDER BY ds.cree_le DESC`;
//             const resultat = await pool.query(requete);
            
//             res.json({
//                 success: true,
//                 demandes: resultat.rows
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur liste demandes:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Obtenir les producteurs premium
//     static async listerProducteursPremium(req, res) {
//         try {
//             const resultat = await pool.query(`
//                 SELECT p.*, pp.type_abonnement, pp.frequence_collecte,
//                        pp.date_debut, pp.date_fin, pp.montant_abonnement
//                 FROM producteurs p
//                 JOIN producteurs_premium pp ON p.id = pp.producteur_id
//                 WHERE pp.statut = 'actif'
//                 ORDER BY pp.date_fin ASC
//             `);

//             res.json({
//                 success: true,
//                 producteurs: resultat.rows
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur liste producteurs premium:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération',
//                 erreur: erreur.message
//             });
//         }
//     }

//     // Obtenir l'historique complet des actions
//     static async historiqueComplet(req, res) {
//         try {
//             const { type, dateDebut, dateFin, limit = 100 } = req.query;

//             let requete = `
//                 SELECT * FROM historique_actions 
//                 WHERE 1=1
//             `;
//             const valeurs = [];
//             let index = 1;

//             if (type) {
//                 requete += ` AND action LIKE $${index++}`;
//                 valeurs.push(`%${type}%`);
//             }

//             if (dateDebut) {
//                 requete += ` AND cree_le >= $${index++}`;
//                 valeurs.push(dateDebut);
//             }

//             if (dateFin) {
//                 requete += ` AND cree_le <= $${index++}`;
//                 valeurs.push(dateFin);
//             }

//             requete += ` ORDER BY cree_le DESC LIMIT $${index}`;
//             valeurs.push(limit);

//             const resultat = await pool.query(requete, valeurs);

//             res.json({
//                 success: true,
//                 historique: resultat.rows
//             });
//         } catch (erreur) {
//             console.error('❌ Erreur historique:', erreur);
//             res.status(500).json({
//                 success: false,
//                 message: 'Erreur lors de la récupération',
//                 erreur: erreur.message
//             });
//         }
//     }
// // ===== GESTION DES RECYCLEURS =====
// static async creerRecycleur(req, res) {
//       try {
//         // Logs détaillés pour voir ce que le backend reçoit
//         console.log('\n' + '='.repeat(50));
//         console.log('🔍 REQUÊTE REÇUE - CRÉATION RECYCLEUR');
//         console.log('='.repeat(50));
        
//         console.log('📦 req.body:', req.body);
//         console.log('📁 req.files:', req.files);
//         console.log('🔑 req.headers.content-type:', req.headers['content-type']);
        
//         // Vérifier si req.body est vide
//         if (Object.keys(req.body).length === 0) {
//             console.log('❌ req.body est vide!');
//             return res.status(400).json({
//                 success: false,
//                 message: 'Aucune donnée reçue. Vérifiez le Content-Type de la requête.'
//             });
//         }

//         // Extraction des données
//         const {
//             email,
//             telephone,
//             motDePasse,
//             nomEntreprise,
//             nomResponsable,
//             adresse,
//             quartier,
//             commune,
//             numeroIdentite
//         } = req.body;

//         // Log des champs extraits
//         console.log('\n📋 Champs extraits:');
//         console.log('email:', email);
//         console.log('telephone:', telephone);
//         console.log('motDePasse:', motDePasse ? '[PRÉSENT]' : '[MANQUANT]');
//         console.log('nomEntreprise:', nomEntreprise);
//         console.log('nomResponsable:', nomResponsable);

//         // Validation des champs obligatoires
//         const champsManquants = [];
//         if (!email) champsManquants.push('email');
//         if (!telephone) champsManquants.push('telephone');
//         if (!motDePasse) champsManquants.push('motDePasse');
//         if (!nomEntreprise) champsManquants.push('nomEntreprise');
//         if (!nomResponsable) champsManquants.push('nomResponsable');

//         if (champsManquants.length > 0) {
//             console.log('❌ Champs manquants:', champsManquants);
//             return res.status(400).json({
//                 success: false,
//                 message: `Champs obligatoires manquants: ${champsManquants.join(', ')}`
//             });
//         }

//         // Vérifier si le recycleur existe déjà
//         const existantEmail = await Recycleur.trouverParEmail(email);
//         if (existantEmail) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Un recycleur avec cet email existe déjà'
//             });
//         }

//         const existantTel = await Recycleur.trouverParTelephone(telephone);
//         if (existantTel) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Un recycleur avec ce téléphone existe déjà'
//             });
//         }

//         // Hasher le mot de passe
//         console.log('🔐 Hachage du mot de passe...');
//         const salt = await bcrypt.genSalt(10);
//         const motDePasseHash = await bcrypt.hash(motDePasse, salt);
//         console.log('✅ Mot de passe hashé avec succès');

//         // Récupérer les URLs des fichiers uploadés
//         let photoProfilUrl = null;
//         let photoCniRectoUrl = null;
//         let photoCniVersoUrl = null;

//         if (req.files) {
//             if (req.files.photoProfil) {
//                 photoProfilUrl = `/uploads/profils/${req.files.photoProfil[0].filename}`;
//                 console.log('📸 Photo profil:', photoProfilUrl);
//             }
//             if (req.files.photoCniRecto) {
//                 photoCniRectoUrl = `/uploads/cnis/${req.files.photoCniRecto[0].filename}`;
//                 console.log('🪪 CNI Recto:', photoCniRectoUrl);
//             }
//             if (req.files.photoCniVerso) {
//                 photoCniVersoUrl = `/uploads/cnis/${req.files.photoCniVerso[0].filename}`;
//                 console.log('🪪 CNI Verso:', photoCniVersoUrl);
//             }
//         }

//         // Validation des photos CNI
//         if (!photoCniRectoUrl || !photoCniVersoUrl) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Les photos recto et verso de la CNI sont requises'
//             });
//         }

//         // Préparer les données pour la création
//         const recycleurData = {
//             email,
//             telephone,
//             motDePasseHash,
//             nomEntreprise,
//             nomResponsable,
//             adresse: adresse || null,
//             quartier: quartier || null,
//             commune: commune || null,
//             numeroIdentite: numeroIdentite || null,
//             photoProfilUrl,
//             photoCniRectoUrl,
//             photoCniVersoUrl,
//             cguAcceptees: true,
//             statut: 'actif',
//             est_actif: false
//         };

//         console.log('📝 Création du recycleur avec les données:', {
//             ...recycleurData,
//             motDePasseHash: '[HIDDEN]'
//         });

//         // Créer le recycleur
//         const nouveauRecycleur = await Recycleur.creer(recycleurData);

//         res.status(201).json({
//             success: true,
//             message: 'Recycleur créé avec succès. En attente de validation.',
//             recycleur: {
//                 id: nouveauRecycleur.id,
//                 email: nouveauRecycleur.email,
//                 telephone: nouveauRecycleur.telephone,
//                 nomEntreprise: nouveauRecycleur.nom_entreprise,
//                 nomResponsable: nouveauRecycleur.nom_responsable,
//                 statut: nouveauRecycleur.statut
//             }
//         });

//     } catch (erreur) {
//         console.error('❌ Erreur création recycleur:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la création du recycleur',
//             erreur: erreur.message
//         });
//     }
// }

// static async listerRecycleurs(req, res) {
//     try {
//         const { statut } = req.query;
//         const recycleurs = await Recycleur.listerTous({ statut });
        
//         res.json({
//             success: true,
//             recycleurs
//         });
//     } catch (erreur) {
//         console.error('❌ Erreur liste recycleurs:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la récupération',
//             erreur: erreur.message
//         });
//     }
// }


// // Détails d'un recycleur
// static async detailsRecycleur(req, res) {
//     try {
//         const { id } = req.params;
//         const recycleur = await Recycleur.trouverParId(id);
        
//         if (!recycleur) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Recycleur non trouvé'
//             });
//         }

//         res.json({
//             success: true,
//             recycleur
//         });
//     } catch (erreur) {
//         console.error('❌ Erreur détails recycleur:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la récupération',
//             erreur: erreur.message
//         });
//     }
// }

// // Modifier un recycleur
// static async modifierRecycleur(req, res) {
//     try {
//         const { id } = req.params;
//         const {
//             email,
//             telephone,
//             nomEntreprise,
//             nomResponsable,
//             adresse,
//             quartier,
//             commune,
//             numeroIdentite
//         } = req.body;

//         // Vérifier si le recycleur existe
//         const existant = await Recycleur.trouverParId(id);
//         if (!existant) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Recycleur non trouvé'
//             });
//         }

//         // Préparer les données de mise à jour
//         const donneesMiseAJour = {
//             email,
//             telephone,
//             nomEntreprise,
//             nomResponsable,
//             adresse,
//             quartier,
//             commune,
//             numeroIdentite
//         };

//         // Gérer les nouveaux fichiers si fournis
//         if (req.files) {
//             if (req.files.photoProfil) {
//                 donneesMiseAJour.photoProfilUrl = `/uploads/profils/${req.files.photoProfil[0].filename}`;
//             }
//             if (req.files.photoCniRecto) {
//                 donneesMiseAJour.photoCniRectoUrl = `/uploads/cnis/${req.files.photoCniRecto[0].filename}`;
//             }
//             if (req.files.photoCniVerso) {
//                 donneesMiseAJour.photoCniVersoUrl = `/uploads/cnis/${req.files.photoCniVerso[0].filename}`;
//             }
//         }

//         const recycleurModifie = await Recycleur.mettreAJour(id, donneesMiseAJour);

//         res.json({
//             success: true,
//             message: 'Recycleur modifié avec succès',
//             recycleur: recycleurModifie
//         });

//     } catch (erreur) {
//         console.error('❌ Erreur modification recycleur:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la modification',
//             erreur: erreur.message
//         });
//     }
// }

// // Valider un recycleur (si besoin)
// static async validerRecycleur(req, res) {
//     try {
//         const { id } = req.params;
//         const { notes } = req.body;

//         const recycleur = await Recycleur.trouverParId(id);
//         if (!recycleur) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Recycleur non trouvé'
//             });
//         }

//         const recycleurValide = await Recycleur.mettreAJour(id, {
//             statut: 'actif',
//             est_actif: true,
//             notes_validation: notes,
//             valide_par: req.utilisateurId,
//             valide_le: new Date()
//         });

//         res.json({
//             success: true,
//             message: 'Recycleur validé avec succès',
//             recycleur: recycleurValide
//         });

//     } catch (erreur) {
//         console.error('❌ Erreur validation recycleur:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la validation',
//             erreur: erreur.message
//         });
//     }
// }

// // Suspendre un recycleur
// static async suspendreRecycleur(req, res) {
//     try {
//         const { id } = req.params;
//         const { raison } = req.body;

//         if (!raison) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'La raison de la suspension est requise'
//             });
//         }

//         const recycleur = await Recycleur.trouverParId(id);
//         if (!recycleur) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Recycleur non trouvé'
//             });
//         }

//         const recycleurSuspendu = await Recycleur.mettreAJour(id, {
//             statut: 'suspendu',
//             est_actif: false,
//             notes_validation: raison
//         });

//         res.json({
//             success: true,
//             message: 'Recycleur suspendu avec succès',
//             recycleur: recycleurSuspendu
//         });

//     } catch (erreur) {
//         console.error('❌ Erreur suspension recycleur:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la suspension',
//             erreur: erreur.message
//         });
//     }
// }

// // Demander la suppression d'un recycleur
// static async demanderSuppressionRecycleur(req, res) {
//     try {
//         const { id } = req.params;
//         const { raison } = req.body;

//         if (!raison) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'La raison de la suppression est requise'
//             });
//         }

//         // Créer une demande de suppression
//         const demande = await pool.query(`
//             INSERT INTO demandes_suppression (
//                 superviseur_id, type_entite, entite_id, raison, statut
//             ) VALUES ($1, $2, $3, $4, $5)
//             RETURNING *
//         `, [req.utilisateurId, 'recycleur', id, raison, 'en_attente']);

//         res.json({
//             success: true,
//             message: 'Demande de suppression envoyée',
//             demande: demande.rows[0]
//         });

//     } catch (erreur) {
//         console.error('❌ Erreur demande suppression:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la demande',
//             erreur: erreur.message
//         });
//     }
// }

// // Supprimer un recycleur (admin seulement)
// static async supprimerRecycleur(req, res) {
//     try {
//         const { id } = req.params;

//         const recycleur = await Recycleur.trouverParId(id);
//         if (!recycleur) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Recycleur non trouvé'
//             });
//         }

//         // Supprimer les fichiers associés si nécessaire
//         // ...

//         await pool.query('DELETE FROM recycleurs WHERE id = $1', [id]);

//         res.json({
//             success: true,
//             message: 'Recycleur supprimé avec succès'
//         });

//     } catch (erreur) {
//         console.error('❌ Erreur suppression recycleur:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la suppression',
//             erreur: erreur.message
//         });
//     }
// }

// // ===== GESTION DES SPONSORS =====
// static async creerSponsor(req, res) {
//     try {
//         const {
//             email, telephone, motDePasse, nomOrganisation,
//             typeOrganisation, nomResponsable, adresse,
//             longitude, latitude
//         } = req.body;

//         const existant = await Sponsor.trouverParEmail(email);
//         if (existant) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Un sponsor avec cet email existe déjà'
//             });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const motDePasseHash = await bcrypt.hash(motDePasse, salt);

//         const nouveauSponsor = await Sponsor.creer({
//             email,
//             telephone,
//             motDePasseHash,
//             nomOrganisation,
//             typeOrganisation,
//             nomResponsable,
//             adresse,
//             localisation_gps: latitude && longitude ? { lat: latitude, lng: longitude } : null,
//             photoLogoUrl: req.file ? `/uploads/logos/${req.file.filename}` : null,
//             cguAcceptees: true
//         });

//         res.status(201).json({
//             success: true,
//             message: 'Sponsor créé avec succès',
//             sponsor: nouveauSponsor
//         });
//     } catch (erreur) {
//         console.error('❌ Erreur création sponsor:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la création',
//             erreur: erreur.message
//         });
//     }
// }

// static async listerSponsors(req, res) {
//     try {
//         const sponsors = await Sponsor.listerTous();
//         res.json({
//             success: true,
//             sponsors
//         });
//     } catch (erreur) {
//         console.error('❌ Erreur liste sponsors:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la récupération',
//             erreur: erreur.message
//         });
//     }
// }

// // ===== GESTION DES ONG =====
// static async creerOng(req, res) {
//     try {
//         const {
//             email, telephone, motDePasse, nomOng,
//             numeroAgrement, domaineIntervention, nomResponsable,
//             adresse, longitude, latitude
//         } = req.body;

//         const existant = await Ong.trouverParEmail(email);
//         if (existant) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Une ONG avec cet email existe déjà'
//             });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const motDePasseHash = await bcrypt.hash(motDePasse, salt);

//         const nouvelleOng = await Ong.creer({
//             email,
//             telephone,
//             motDePasseHash,
//             nomOng,
//             numeroAgrement,
//             domaineIntervention: domaineIntervention ? domaineIntervention.split(',') : [],
//             nomResponsable,
//             adresse,
//             localisation_gps: latitude && longitude ? { lat: latitude, lng: longitude } : null,
//             photoLogoUrl: req.file ? `/uploads/logos/${req.file.filename}` : null,
//             cguAcceptees: true
//         });

//         res.status(201).json({
//             success: true,
//             message: 'ONG créée avec succès',
//             ong: nouvelleOng
//         });
//     } catch (erreur) {
//         console.error('❌ Erreur création ONG:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la création',
//             erreur: erreur.message
//         });
//     }
// }

// // ===== GESTION DES CAMPAGNES =====
// static async creerCampagne(req, res) {
//     try {
//         const {
//             nom, description, dateDebut, dateFin,
//             typesDechets, zonesIntervention, poidsAttendue,
//             prixParKg, statut
//         } = req.body;

//         const nouvelleCampagne = await Campagne.creer({
//             nom,
//             description,
//             dateDebut,
//             dateFin,
//             typesDechets: typesDechets.split(','),
//             zonesIntervention: zonesIntervention ? zonesIntervention.split(',') : [],
//             poidsAttendue: parseFloat(poidsAttendue),
//             prixParKg: parseFloat(prixParKg),
//             statut: statut || 'planifiee',
//             createurId: req.utilisateurId,
//             createurType: 'admin'
//         });

//         res.status(201).json({
//             success: true,
//             message: 'Campagne créée avec succès',
//             campagne: nouvelleCampagne
//         });
//     } catch (erreur) {
//         console.error('❌ Erreur création campagne:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la création',
//             erreur: erreur.message
//         });
//     }
// }

// static async listerCampagnes(req, res) {
//     try {
//         const { statut } = req.query;
//         const campagnes = await Campagne.listerTous({ statut });
        
//         res.json({
//             success: true,
//             campagnes
//         });
//     } catch (erreur) {
//         console.error('❌ Erreur liste campagnes:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la récupération',
//             erreur: erreur.message
//         });
//     }
// }

// // ===== STATISTIQUES AVANCÉES =====
// static async statistiquesAvancees(req, res) {
//     try {
//         const stats = await pool.query(`
//             WITH stats_globales AS (
//                 SELECT 
//                     (SELECT COUNT(*) FROM producteurs) as total_producteurs,
//                     (SELECT COUNT(*) FROM collecteurs) as total_collecteurs,
//                     (SELECT COUNT(*) FROM gestionnaires_points) as total_gestionnaires,
//                     (SELECT COUNT(*) FROM superviseurs) as total_superviseurs,
//                     (SELECT COUNT(*) FROM recycleurs) as total_recycleurs,
//                     (SELECT COUNT(*) FROM sponsors) as total_sponsors,
//                     (SELECT COUNT(*) FROM ongs) as total_ongs,
//                     (SELECT COUNT(*) FROM campagnes) as total_campagnes,
//                     (SELECT COUNT(*) FROM missions) as total_missions,
//                     (SELECT COALESCE(SUM(poids_depose), 0) FROM missions WHERE statut = 'validee') as total_kg_collectes
//             ),
//             evolution_journaliere AS (
//                 SELECT 
//                     date_trunc('day', cree_le) as jour,
//                     COUNT(*) as inscriptions
//                 FROM producteurs
//                 WHERE cree_le >= CURRENT_DATE - INTERVAL '30 days'
//                 GROUP BY date_trunc('day', cree_le)
//             ),
//             top_collecteurs AS (
//                 SELECT 
//                     c.nom_complet,
//                     c.email,
//                     COUNT(m.id) as missions_realisees,
//                     COALESCE(SUM(m.poids_depose), 0) as kg_collectes
//                 FROM collecteurs c
//                 LEFT JOIN missions m ON c.id = m.collecteur_id AND m.statut = 'validee'
//                 GROUP BY c.id, c.nom_complet, c.email
//                 ORDER BY kg_collectes DESC
//                 LIMIT 5
//             )
//             SELECT 
//                 (SELECT row_to_json(stats_globales) FROM stats_globales) as globales,
//                 (SELECT json_agg(evolution_journaliere) FROM evolution_journaliere) as evolution,
//                 (SELECT json_agg(top_collecteurs) FROM top_collecteurs) as top_collecteurs
//         `);

//         res.json({
//             success: true,
//             statistiques: stats.rows[0]
//         });
//     } catch (erreur) {
//         console.error('❌ Erreur statistiques avancées:', erreur);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la récupération',
//             erreur: erreur.message
//         });
//     }
// }
// }

// export default AdminController;



import bcrypt from 'bcrypt';
import Admin from '../models/Admin.js';
import Superviseur from '../models/Superviseur.js';
import Recycleur from '../models/Recycleur.js';
import Sponsor from '../models/Sponsor.js';
import Ong from '../models/Ong.js';
import Campagne from '../models/Campagne.js';
import DemandeSuppression from '../models/DemandeSupression.js';
import Producteur from '../models/Producteur.js';
import { pool } from '../config/database.js';
import jwt from 'jsonwebtoken';

class AdminController {
    // ===== AUTHENTIFICATION =====

    
    static async creerAdmin(req, res) {
        try {
            const { email, telephone, motDePasse, nomComplet, role } = req.body;
            const existant = await Admin.trouverParEmail(email);
            if (existant) {
                return res.status(400).json({
                    success: false,
                    message: 'Un compte   existe déjà avec cet emails '
                });
            }

            const salt = await bcrypt.genSalt(10);
            const motDePasseHash = await bcrypt.hash(motDePasse, salt);

            const nouveauAdmin = await Admin.creer({
                email,
                telephone,
                motDePasseHash,
                nomComplet,
                role
            });

            res.status(201).json({
                success: true,
                message: 'Admin créé avec succès',
                admin: {
                    id: nouveauAdmin.id,
                    email: nouveauAdmin.email,
                    nomComplet: nouveauAdmin.nom_complet,
                    role: nouveauAdmin.role
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur création admin:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création',
                erreur: erreur.message
            });
        }
    }
    static async connexion(req, res) {
        try {
            const { email, motDePasse } = req.body;

            const admin = await Admin.trouverParEmail(email);
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            const valide = await bcrypt.compare(motDePasse, admin.mot_de_passe_hash);
            if (!valide) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            if (!admin.est_actif) {
                return res.status(403).json({
                    success: false,
                    message: 'Compte désactivé'
                });
            }

            await Admin.mettreAJourConnexion(admin.id);

            const token = jwt.sign(
                { id: admin.id, email: admin.email, type: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                token,
                utilisateur: {
                    id: admin.id,
                    email: admin.email,
                    nomComplet: admin.nom_complet,
                    role: admin.role,
                    type: 'admin'
                }
            });

        } catch (erreur) {
            console.error('❌ Erreur connexion admin:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion'
            });
        }
    }




static async tableauBord(req, res) {
    try {
        const stats = await pool.query(`
            WITH stats_globales AS (
                SELECT 
                    (SELECT COUNT(*) FROM superviseurs) as total_superviseurs,
                    (SELECT COUNT(*) FROM recycleurs) as total_recycleurs,
                    (SELECT COUNT(*) FROM collecteurs) as total_collecteurs,
                    (SELECT COUNT(*) FROM gestionnaires_points) as total_gestionnaires,
                    (SELECT COUNT(*) FROM producteurs) as total_producteurs,
                    (SELECT COUNT(*) FROM sponsors) as total_sponsors,
                    (SELECT COUNT(*) FROM ongs) as total_ongs,
                    (SELECT COUNT(*) FROM campagnes) as total_campagnes,
                    (SELECT COUNT(*) FROM campagnes WHERE statut = 'planifiee') as campagnes_actives,
                    (SELECT COUNT(*) FROM missions WHERE statut = 'validee') as missions_validees,
                    (SELECT COALESCE(SUM(poids_depose), 0) FROM missions WHERE statut = 'validee') as total_kg_collectes,
                    (SELECT COALESCE(SUM(gains_attribues), 0) FROM missions WHERE statut = 'validee') as total_credits_distribues
            ),
            stats_superviseurs AS (
                SELECT 
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE est_actif = true) as actifs,
                    COUNT(*) FILTER (WHERE est_actif = false) as inactifs
                FROM superviseurs
            ),
            stats_gestionnaires AS (
                SELECT 
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE est_actif = true) as actifs,
                    COUNT(*) FILTER (WHERE est_actif = false) as inactifs
                FROM gestionnaires_points
            ),
            stats_recycleurs AS (
                SELECT 
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE est_actif = true) as actifs,
                    COUNT(*) FILTER (WHERE est_actif = false) as inactifs
                FROM recycleurs
            ),
            stats_ongs AS (
                SELECT 
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE est_actif = true) as actifs,
                    COUNT(*) FILTER (WHERE est_actif = false) as inactifs
                FROM ongs
            ),
            stats_sponsors AS (
                SELECT 
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE est_actif = true) as actifs,
                    COUNT(*) FILTER (WHERE est_actif = false) as inactifs
                FROM sponsors
            ),
            stats_producteurs AS (
                SELECT 
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE type_compte = 'premium') as premium,
                    COUNT(*) FILTER (WHERE date_part('month', cree_le) = date_part('month', CURRENT_DATE)) as nouveaux_mois
                FROM producteurs
            ),
            stats_collecteurs AS (
                SELECT 
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE statut = 'actif') as actifs,
                    COUNT(*) FILTER (WHERE statut = 'en_attente') as en_attente
                FROM collecteurs
            ),
            top_collecteurs AS (
                SELECT 
                    c.nom_complet,
                    c.email,
                    COUNT(m.id) as missions_realisees,
                    COALESCE(SUM(m.poids_depose), 0) as kg_collectes
                FROM collecteurs c
                LEFT JOIN missions m ON c.id = m.collecteur_id AND m.statut = 'validee'
                GROUP BY c.id, c.nom_complet, c.email
                ORDER BY kg_collectes DESC
                LIMIT 5
            ),
            evolution_30j AS (
                SELECT 
                    date_trunc('day', cree_le) as jour,
                    COUNT(*) as inscriptions
                FROM producteurs
                WHERE cree_le >= CURRENT_DATE - INTERVAL '30 days'
                GROUP BY date_trunc('day', cree_le)
            )
            SELECT 
                (SELECT row_to_json(stats_globales) FROM stats_globales) as globales,
                (SELECT row_to_json(stats_superviseurs) FROM stats_superviseurs) as superviseurs,
                (SELECT row_to_json(stats_gestionnaires) FROM stats_gestionnaires) as gestionnaires,
                (SELECT row_to_json(stats_recycleurs) FROM stats_recycleurs) as recycleurs,
                (SELECT row_to_json(stats_ongs) FROM stats_ongs) as ongs,
                (SELECT row_to_json(stats_sponsors) FROM stats_sponsors) as sponsors,
                (SELECT row_to_json(stats_producteurs) FROM stats_producteurs) as producteurs,
                (SELECT row_to_json(stats_collecteurs) FROM stats_collecteurs) as collecteurs,
                (SELECT json_agg(top_collecteurs) FROM top_collecteurs) as top_collecteurs,
                (SELECT json_agg(evolution_30j) FROM evolution_30j) as evolution
        `);

        res.json({
            success: true,
            statistiques: stats.rows[0]
        });

    } catch (erreur) {
        console.error('❌ Erreur dashboard admin:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération'
        });
    }
}
    // ===== GESTION DES SUPERVISEURS =====
    static async creerSuperviseur(req, res) {
        try {
            const { email, telephone, motDePasse, nomComplet } = req.body;

            const existant = await Superviseur.trouverParEmail(email);
            if (existant) {
                return res.status(400).json({
                    success: false,
                    message: 'Un superviseur avec cet email existe déjà'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const motDePasseHash = await bcrypt.hash(motDePasse, salt);

            const nouveauSuperviseur = await Superviseur.creer({
                email,
                telephone,
                motDePasseHash,
                nomComplet,
                role: 'superviseur',
                est_actif: true
            });

            // Journaliser l'action
            await pool.query(`
                INSERT INTO historique_actions (utilisateur_id, action, details, adresse_ip)
                VALUES ($1, $2, $3, $4)
            `, [req.utilisateurId, 'CREATION_SUPERVISEUR', JSON.stringify({ email, nomComplet }), req.ip]);

            res.status(201).json({
                success: true,
                message: 'Superviseur créé avec succès',
                superviseur: {
                    id: nouveauSuperviseur.id,
                    email: nouveauSuperviseur.email,
                    nomComplet: nouveauSuperviseur.nom_complet
                }
            });

        } catch (erreur) {
            console.error('❌ Erreur création superviseur:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création'
            });
        }
    }


    static async listerSuperviseurs(req, res) {
  try {
    const superviseurs = await Superviseur.listerTous();

    if (!superviseurs.length) {
      return res.json({ success: true, superviseurs: [] });
    }

    const ids = superviseurs.map(s => s.id);

    // Requête unique sans la table points_depot_volontaire (colonne cree_par inexistante)
    const statsResult = await pool.query(`
      SELECT 
        s.id AS superviseur_id,
        COUNT(DISTINCT c.id) FILTER (WHERE c.createur_id = s.id AND c.createur_type = 'superviseur') AS campagnes_creees,
        COUNT(DISTINCT g.id) FILTER (WHERE g.cree_par = s.id) AS gestionnaires_creees,
        COUNT(DISTINCT col.id) FILTER (WHERE col.valide_par = s.id) AS collecteurs_valides,
        COUNT(DISTINCT d.id) FILTER (WHERE d.superviseur_id = s.id AND d.statut = 'en_attente') AS demandes_attente
      FROM unnest($1::uuid[]) AS s(id)
      LEFT JOIN campagnes c ON c.createur_id = s.id AND c.createur_type = 'superviseur'
      LEFT JOIN gestionnaires_points g ON g.cree_par = s.id
      LEFT JOIN collecteurs col ON col.valide_par = s.id
      LEFT JOIN demandes_suppression d ON d.superviseur_id = s.id
      GROUP BY s.id
    `, [ids]);

    const statsMap = {};
    statsResult.rows.forEach(row => {
      statsMap[row.superviseur_id] = {
        campagnes_creees: parseInt(row.campagnes_creees) || 0,
        gestionnaires_creees: parseInt(row.gestionnaires_creees) || 0,
        collecteurs_valides: parseInt(row.collecteurs_valides) || 0,
        demandes_attente: parseInt(row.demandes_attente) || 0
      };
    });

    const superviseursAvecStats = superviseurs.map(sup => ({
      ...sup,
      statistiques: statsMap[sup.id] || {
        campagnes_creees: 0,
        gestionnaires_creees: 0,
        collecteurs_valides: 0,
        demandes_attente: 0
      }
    }));

    res.json({ success: true, superviseurs: superviseursAvecStats });

  } catch (erreur) {
    console.error('❌ Erreur liste superviseurs:', erreur);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des superviseurs'
    });
  }
}
 
    static async detailsSuperviseur(req, res) {
        try {
            const { id } = req.params;
            
            const superviseur = await Superviseur.trouverParId(id);
            if (!superviseur) {
                return res.status(404).json({
                    success: false,
                    message: 'Superviseur non trouvé'
                });
            }

            // Récupérer toutes les activités du superviseur
            const activites = await pool.query(`
                SELECT 
                    (SELECT json_agg(row_to_json(c)) FROM (
                        SELECT * FROM campagnes 
                        WHERE createur_id = $1 AND createur_type = 'superviseur'
                        ORDER BY cree_le DESC
                    ) c) as campagnes,
                    (SELECT json_agg(row_to_json(g)) FROM (
                        SELECT * FROM gestionnaires_points 
                        WHERE cree_par = $1
                        ORDER BY cree_le DESC
                    ) g) as gestionnaires,
                    (SELECT json_agg(row_to_json(p)) FROM (
                        SELECT * FROM points_depot_volontaire 
                        WHERE cree_par = $1
                        ORDER BY cree_le DESC
                    ) p) as points_collecte,
                    (SELECT json_agg(row_to_json(col)) FROM (
                        SELECT * FROM collecteurs 
                        WHERE valide_par = $1
                        ORDER BY valide_le DESC
                    ) col) as collecteurs_valides,
                    (SELECT json_agg(row_to_json(d)) FROM (
                        SELECT * FROM demandes_suppression 
                        WHERE superviseur_id = $1
                        ORDER BY cree_le DESC
                    ) d) as demandes_suppression
            `, [id]);

            res.json({
                success: true,
                superviseur,
                activites: activites.rows[0]
            });

        } catch (erreur) {
            console.error('❌ Erreur détails superviseur:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }

    static async modifierSuperviseur(req, res) {
        try {
            const { id } = req.params;
            const { email, telephone, nomComplet, est_actif } = req.body;

            const superviseur = await Superviseur.trouverParId(id);
            if (!superviseur) {
                return res.status(404).json({
                    success: false,
                    message: 'Superviseur non trouvé'
                });
            }

            const donnees = { email, telephone, nomComplet, est_actif };
            const superviseurModifie = await Superviseur.mettreAJour(id, donnees);

            res.json({
                success: true,
                message: 'Superviseur modifié avec succès',
                superviseur: superviseurModifie
            });

        } catch (erreur) {
            console.error('❌ Erreur modification superviseur:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la modification'
            });
        }
    }

    static async supprimerSuperviseur(req, res) {
        try {
            const { id } = req.params;
            
            // Vérifier si le superviseur a des dépendances
            const dependances = await pool.query(`
                SELECT 
                    (SELECT COUNT(*) FROM campagnes WHERE createur_id = $1 AND createur_type = 'superviseur') as campagnes,
                    (SELECT COUNT(*) FROM gestionnaires_points WHERE cree_par = $1) as gestionnaires,
                    (SELECT COUNT(*) FROM points_depot_volontaire WHERE cree_par = $1) as points,
                    (SELECT COUNT(*) FROM demandes_suppression WHERE superviseur_id = $1 AND statut = 'en_attente') as demandes
            `, [id]);

            if (dependances.rows[0].campagnes > 0 || dependances.rows[0].gestionnaires > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Impossible de supprimer : le superviseur a des dépendances actives'
                });
            }

            await pool.query('DELETE FROM superviseurs WHERE id = $1', [id]);

            res.json({
                success: true,
                message: 'Superviseur supprimé avec succès'
            });

        } catch (erreur) {
            console.error('❌ Erreur suppression superviseur:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression'
            });
        }
    }

    // Dans AdminController.js - méthode creerRecycleur CORRIGÉE
static async creerRecycleur(req, res) {
    try {
        console.log('📦 Données reçues:', req.body);
        console.log('📁 Fichiers reçus:', req.files);

        const {
            email,
            telephone,
            motDePasse,
            nomEntreprise,
            nomResponsable,
            adresse,
            quartier,
            commune,
            numeroIdentite,
            // ⚠️ IMPORTANT: Ces champs sont ajoutés par uploadToSupabase.js
            photoProfilUrl,      // ← URL Supabase
            photoCniRectoUrl,    // ← URL Supabase
            photoCniVersoUrl     // ← URL Supabase
        } = req.body;

        // Validation
        const champsManquants = [];
        if (!email) champsManquants.push('email');
        if (!telephone) champsManquants.push('telephone');
        if (!motDePasse) champsManquants.push('motDePasse');
        if (!nomEntreprise) champsManquants.push('nomEntreprise');
        if (!nomResponsable) champsManquants.push('nomResponsable');

        if (champsManquants.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Champs obligatoires manquants: ${champsManquants.join(', ')}`
            });
        }

        // Vérifier les photos CNI
        if (!photoCniRectoUrl || !photoCniVersoUrl) {
            return res.status(400).json({
                success: false,
                message: 'Les photos recto et verso de la CNI sont requises'
            });
        }

        // Vérifier existence
        const existantEmail = await Recycleur.trouverParEmail(email);
        if (existantEmail) {
            return res.status(400).json({
                success: false,
                message: 'Un recycleur avec cet email existe déjà'
            });
        }

        const existantTel = await Recycleur.trouverParTelephone(telephone);
        if (existantTel) {
            return res.status(400).json({
                success: false,
                message: 'Un recycleur avec ce téléphone existe déjà'
            });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const motDePasseHash = await bcrypt.hash(motDePasse, salt);

        // ✅ Les URLs sont déjà dans req.body, plus besoin de les construire
        console.log('📸 URLs des photos:');
        console.log('  - Profil:', photoProfilUrl || 'non fourni');
        console.log('  - CNI Recto:', photoCniRectoUrl);
        console.log('  - CNI Verso:', photoCniVersoUrl);

        // Créer le recycleur
        const recycleurData = {
            email,
            telephone,
            motDePasseHash,
            nomEntreprise,
            nomResponsable,
            adresse: adresse || null,
            quartier: quartier || null,
            commune: commune || null,
            numeroIdentite: numeroIdentite || null,
            photoProfilUrl: photoProfilUrl || null,  // ← URL Supabase
            photoCniRectoUrl: photoCniRectoUrl,      // ← URL Supabase
            photoCniVersoUrl: photoCniVersoUrl,      // ← URL Supabase
            cguAcceptees: true,
            statut: 'actif',
            est_actif: true,
            valide_par: req.utilisateurId,
            valide_le: new Date()
        };

        const nouveauRecycleur = await Recycleur.creer(recycleurData);

        // Journaliser
        await pool.query(`
            INSERT INTO historique_actions (utilisateur_id, action, details, adresse_ip)
            VALUES ($1, $2, $3, $4)
        `, [req.utilisateurId, 'CREATION_RECYCLEUR', JSON.stringify({ email, nomEntreprise }), req.ip]);

        res.status(201).json({
            success: true,
            message: 'Recycleur créé et activé avec succès',
            recycleur: {
                id: nouveauRecycleur.id,
                email: nouveauRecycleur.email,
                telephone: nouveauRecycleur.telephone,
                nomEntreprise: nouveauRecycleur.nom_entreprise,
                statut: nouveauRecycleur.statut,
                // Retourner aussi les URLs pour vérification
                photos: {
                    profil: photoProfilUrl,
                    cniRecto: photoCniRectoUrl,
                    cniVerso: photoCniVersoUrl
                }
            }
        });

    } catch (erreur) {
        console.error('❌ Erreur création recycleur:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création',
            erreur: erreur.message
        });
    }
}

    // // ===== GESTION DES RECYCLEURS =====
    // static async creerRecycleur(req, res) {
    //     try {
    //         console.log('📦 Données reçues:', req.body);
    //         console.log('📁 Fichiers reçus:', req.files);

    //         const {
    //             email,
    //             telephone,
    //             motDePasse,
    //             nomEntreprise,
    //             nomResponsable,
    //             adresse,
    //             quartier,
    //             commune,
    //             numeroIdentite
    //         } = req.body;

    //         // Validation
    //         const champsManquants = [];
    //         if (!email) champsManquants.push('email');
    //         if (!telephone) champsManquants.push('telephone');
    //         if (!motDePasse) champsManquants.push('motDePasse');
    //         if (!nomEntreprise) champsManquants.push('nomEntreprise');
    //         if (!nomResponsable) champsManquants.push('nomResponsable');

    //         if (champsManquants.length > 0) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: `Champs obligatoires manquants: ${champsManquants.join(', ')}`
    //             });
    //         }

    //         // Vérifier existence
    //         const existantEmail = await Recycleur.trouverParEmail(email);
    //         if (existantEmail) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Un recycleur avec cet email existe déjà'
    //             });
    //         }

    //         const existantTel = await Recycleur.trouverParTelephone(telephone);
    //         if (existantTel) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Un recycleur avec ce téléphone existe déjà'
    //             });
    //         }

    //         // Hasher le mot de passe
    //         const salt = await bcrypt.genSalt(10);
    //         const motDePasseHash = await bcrypt.hash(motDePasse, salt);

    //         // Récupérer les URLs des fichiers
    //         let photoProfilUrl = null;
    //         let photoCniRectoUrl = null;
    //         let photoCniVersoUrl = null;

    //         if (req.files) {
    //             if (req.files.photoProfil) {
    //                 photoProfilUrl = `/uploads/profils/${req.files.photoProfil[0].filename}`;
    //             }
    //             if (req.files.photoCniRecto) {
    //                 photoCniRectoUrl = `/uploads/cnis/${req.files.photoCniRecto[0].filename}`;
    //             }
    //             if (req.files.photoCniVerso) {
    //                 photoCniVersoUrl = `/uploads/cnis/${req.files.photoCniVerso[0].filename}`;
    //             }
    //         }

    //         // Créer le recycleur (actif directement car créé par admin)
    //         const recycleurData = {
    //             email,
    //             telephone,
    //             motDePasseHash,
    //             nomEntreprise,
    //             nomResponsable,
    //             adresse: adresse || null,
    //             quartier: quartier || null,
    //             commune: commune || null,
    //             numeroIdentite: numeroIdentite || null,
    //             photoProfilUrl,
    //             photoCniRectoUrl,
    //             photoCniVersoUrl,
    //             cguAcceptees: true,
    //             statut: 'actif',
    //             est_actif: true,
    //             valide_par: req.utilisateurId,
    //             valide_le: new Date()
    //         };

    //         const nouveauRecycleur = await Recycleur.creer(recycleurData);

    //         // Journaliser
    //         await pool.query(`
    //             INSERT INTO historique_actions (utilisateur_id, action, details, adresse_ip)
    //             VALUES ($1, $2, $3, $4)
    //         `, [req.utilisateurId, 'CREATION_RECYCLEUR', JSON.stringify({ email, nomEntreprise }), req.ip]);

    //         res.status(201).json({
    //             success: true,
    //             message: 'Recycleur créé et activé avec succès',
    //             recycleur: {
    //                 id: nouveauRecycleur.id,
    //                 email: nouveauRecycleur.email,
    //                 telephone: nouveauRecycleur.telephone,
    //                 nomEntreprise: nouveauRecycleur.nom_entreprise,
    //                 statut: nouveauRecycleur.statut
    //             }
    //         });

    //     } catch (erreur) {
    //         console.error('❌ Erreur création recycleur:', erreur);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Erreur lors de la création'
    //         });
    //     }
    // }

    // Dans AdminController.js
static async supprimerRecycleur(req, res) {
    try {
        const { id } = req.params;
        
        // Vérifier si le recycleur existe
        const recycleur = await pool.query('SELECT * FROM recycleurs WHERE id = $1', [id]);
        
        if (recycleur.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Recycleur non trouvé'
            });
        }

        // Supprimer d'abord les dépendances
        await pool.query('DELETE FROM missions WHERE collecteur_id = $1', [id]);
        await pool.query('DELETE FROM collecteurs_points WHERE collecteur_id = $1', [id]);
        await pool.query('DELETE FROM historique_recycleur WHERE recycleur_id = $1', [id]);
        
        // Supprimer le recycleur
        await pool.query('DELETE FROM recycleurs WHERE id = $1', [id]);

        res.json({
            success: true,
            message: 'Recycleur supprimé avec succès'
        });

    } catch (erreur) {
        console.error('❌ Erreur suppression recycleur:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du recycleur',
            erreur: erreur.message
        });
    }
}

// Dans AdminController.js
static async supprimerRecycleurDirect(req, res) {
    try {
        const { id } = req.params;
        
        // Vérifier si le recycleur existe
        const recycleur = await pool.query('SELECT * FROM recycleurs WHERE id = $1', [id]);
        
        if (recycleur.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Recycleur non trouvé'
            });
        }

        // Commencer une transaction
        await pool.query('BEGIN');

        try {
            // 1. Supprimer les missions du recycleur
            await pool.query('DELETE FROM missions WHERE collecteur_id = $1', [id]);
            
            // 2. Supprimer les associations aux points de collecte
            await pool.query('DELETE FROM collecteurs_points WHERE collecteur_id = $1', [id]);
            
            // 3. Supprimer l'historique
            await pool.query('DELETE FROM historique_recycleur WHERE recycleur_id = $1', [id]);
            
            // 4. Supprimer le recycleur
            await pool.query('DELETE FROM recycleurs WHERE id = $1', [id]);

            await pool.query('COMMIT');

            res.json({
                success: true,
                message: 'Recycleur supprimé avec succès'
            });

        } catch (error) {
            await pool.query('ROLLBACK');
            throw error;
        }

    } catch (erreur) {
        console.error('❌ Erreur suppression recycleur:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du recycleur',
            erreur: erreur.message
        });
    }
}

    static async listerRecycleurs(req, res) {
        try {
            const { statut } = req.query;
            const recycleurs = await Recycleur.listerTous({ statut });
            
            // Ajouter des statistiques
            for (let r of recycleurs) {
                const stats = await pool.query(`
                    SELECT 
                        COUNT(de.id) as total_demandes,
                        COUNT(de.id) FILTER (WHERE de.statut = 'validee') as demandes_validees,
                        COUNT(de.id) FILTER (WHERE de.statut = 'realisee') as demandes_realisees,
                        COUNT(dr.id) as total_declarations,
                        COALESCE(SUM(dr.quantite_recyclee), 0) as total_kg_recycles,
                        MAX(dr.date_recyclage) as derniere_declaration
                    FROM recycleurs rec
                    LEFT JOIN demandes_enlevement de ON rec.id = de.recycleur_id
                    LEFT JOIN declarations_recyclage dr ON rec.id = dr.recycleur_id
                    WHERE rec.id = $1
                    GROUP BY rec.id
                `, [r.id]);
                
                r.statistiques = stats.rows[0] || {
                    total_demandes: 0,
                    demandes_validees: 0,
                    demandes_realisees: 0,
                    total_declarations: 0,
                    total_kg_recycles: 0
                };
            }

            res.json({
                success: true,
                recycleurs
            });

        } catch (erreur) {
            console.error('❌ Erreur liste recycleurs:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }

    static async detailsRecycleur(req, res) {
        try {
            const { id } = req.params;
            
            const recycleur = await Recycleur.trouverParId(id);
            if (!recycleur) {
                return res.status(404).json({
                    success: false,
                    message: 'Recycleur non trouvé'
                });
            }

            // Récupérer les demandes d'enlèvement
            const demandes = await Recycleur.getDemandesEnlevement(id);
            
            // Récupérer les déclarations de recyclage
            const declarations = await Recycleur.getDeclarationsRecyclage(id);
            
            // Récupérer les statistiques
            const stats = await Recycleur.getDashboard(id);

            res.json({
                success: true,
                recycleur,
                demandes,
                declarations,
                statistiques: stats
            });

        } catch (erreur) {
            console.error('❌ Erreur détails recycleur:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }

    
// Supprimer un recycleur (admin seulement)
static async supprimerRecycleur(req, res) {
    try {
        const { id } = req.params;

        const recycleur = await Recycleur.trouverParId(id);
        if (!recycleur) {
            return res.status(404).json({
                success: false,
                message: 'Recycleur non trouvé'
            });
        }

        // Supprimer les fichiers associés si nécessaire
        // ...

        await pool.query('DELETE FROM recycleurs WHERE id = $1', [id]);

        res.json({
            success: true,
            message: 'Recycleur supprimé avec succès'
        });

    } catch (erreur) {
        console.error('❌ Erreur suppression recycleur:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression',
            erreur: erreur.message
        });
    }
}

    static async modifierRecycleur(req, res) {
        try {
            const { id } = req.params;
            const {
                email, telephone, nomEntreprise, nomResponsable,
                adresse, quartier, commune, numeroIdentite
            } = req.body;

            const recycleur = await Recycleur.trouverParId(id);
            if (!recycleur) {
                return res.status(404).json({
                    success: false,
                    message: 'Recycleur non trouvé'
                });
            }

            const donnees = {
                email, telephone, nomEntreprise, nomResponsable,
                adresse, quartier, commune, numeroIdentite
            };

            // Gérer les nouvelles photos si fournies
            if (req.files) {
                if (req.files.photoProfil) {
                    donnees.photoProfilUrl = `/uploads/profils/${req.files.photoProfil[0].filename}`;
                }
                if (req.files.photoCniRecto) {
                    donnees.photoCniRectoUrl = `/uploads/cnis/${req.files.photoCniRecto[0].filename}`;
                }
                if (req.files.photoCniVerso) {
                    donnees.photoCniVersoUrl = `/uploads/cnis/${req.files.photoCniVerso[0].filename}`;
                }
            }

            const recycleurModifie = await Recycleur.mettreAJour(id, donnees);

            res.json({
                success: true,
                message: 'Recycleur modifié avec succès',
                recycleur: recycleurModifie
            });

        } catch (erreur) {
            console.error('❌ Erreur modification recycleur:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la modification'
            });
        }
    }
static async  validerRecycleur (req, res)  {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const adminId = req.utilisateurId; // L'admin connecté

        // Appeler la méthode valider du modèle Recycleur
        const recycleur = await Recycleur.valider(id, adminId, notes);

        res.json({
            success: true,
            message: 'Recycleur validé avec succès',
            recycleur
        });
    } catch (erreur) {
        console.error('❌ Erreur validation recycleur:', erreur);
        res.status(500).json({
            success: false,
            message: erreur.message || 'Erreur lors de la validation'
        });
    }
};

// Réactiver un recycleur
static async  reactiverRecycleur (req, res){
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const adminId = req.utilisateurId;

        const recycleur = await Recycleur.reactiver(id, adminId, notes);

        res.json({
            success: true,
            message: 'Recycleur réactivé avec succès',
            recycleur
        });
    } catch (erreur) {
        console.error('❌ Erreur réactivation recycleur:', erreur);
        res.status(500).json({
            success: false,
            message: erreur.message || 'Erreur lors de la réactivation'
        });
    }
};
    static async suspendreRecycleur(req, res) {
        try {
            const { id } = req.params;
            const { raison } = req.body;

            if (!raison) {
                return res.status(400).json({
                    success: false,
                    message: 'La raison de la suspension est requise'
                });
            }

            const recycleur = await Recycleur.suspendre(id, raison);

            res.json({
                success: true,
                message: 'Recycleur suspendu avec succès',
                recycleur
            });

        } catch (erreur) {
            console.error('❌ Erreur suspension recycleur:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suspension'
            });
        }
    }

    static async demanderSuppressionRecycleur(req, res) {
        try {
            const { id } = req.params;
            const { raison } = req.body;

            if (!raison) {
                return res.status(400).json({
                    success: false,
                    message: 'La raison de la suppression est requise'
                });
            }

            const demande = await DemandeSuppression.creer({
                superviseurId: req.utilisateurId,
                typeEntite: 'recycleur',
                entiteId: id,
                raison,
                statut: 'en_attente'
            });

            res.json({
                success: true,
                message: 'Demande de suppression envoyée',
                demande
            });

        } catch (erreur) {
            console.error('❌ Erreur demande suppression:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la demande'
            });
        }
    }

 static async creerSponsor(req, res) {
    try {
        const {
            email, telephone, motDePasse, nomOrganisation,
            typeOrganisation, nomResponsable, adresse
        } = req.body;

        const existant = await Sponsor.trouverParEmail(email);
        if (existant) {
            return res.status(400).json({
                success: false,
                message: 'Un sponsor avec cet email existe déjà'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const motDePasseHash = await bcrypt.hash(motDePasse, salt);

        // plus de photoLogoUrl
        const nouveauSponsor = await Sponsor.creer({
            email,
            telephone,
            motDePasseHash,
            nomOrganisation,
            typeOrganisation,
            nomResponsable,
            adresse,
            cguAcceptees: true,
            est_actif: true
        });

        res.status(201).json({
            success: true,
            message: 'Sponsor créé avec succès',
            sponsor: {
                id: nouveauSponsor.id,
                email: nouveauSponsor.email,
                nomOrganisation: nouveauSponsor.nom_organisation
            }
        });

    } catch (erreur) {
        console.error('❌ Erreur création sponsor:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création'
        });
    }
}
    static async listerSponsors(req, res) {
    try {
        const sponsors = await Sponsor.listerTous();
        // Ajouter les campagnes associées...
        for (let s of sponsors) {
            const campagnes = await Sponsor.getCampagnes(s.id);
            s.nb_campagnes = campagnes.length;
            s.campagnes = campagnes;
            const dashboard = await Sponsor.getDashboard(s.id);
            s.statistiques = dashboard;
        }
        res.json({
            success: true,
            sponsors
        });
    } catch (erreur) {
        console.error('❌ Erreur liste sponsors:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération'
        });
    }
}
    static async detailsSponsor(req, res) {
        try {
            const { id } = req.params;
            
            const sponsor = await Sponsor.trouverParId(id);
            if (!sponsor) {
                return res.status(404).json({
                    success: false,
                    message: 'Sponsor non trouvé'
                });
            }

            const campagnes = await Sponsor.getCampagnes(id);
            const dashboard = await Sponsor.getDashboard(id);

            res.json({
                success: true,
                sponsor,
                campagnes,
                statistiques: dashboard
            });

        } catch (erreur) {
            console.error('❌ Erreur détails sponsor:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }
static async modifierSponsor(req, res) {
    try {
        const { id } = req.params;
        const {
            nomOrganisation, typeOrganisation, nomResponsable,
            telephone, adresse
        } = req.body;

        const sponsor = await Sponsor.trouverParId(id);
        if (!sponsor) {
            return res.status(404).json({
                success: false,
                message: 'Sponsor non trouvé'
            });
        }

        const donnees = {
            nomOrganisation, typeOrganisation, nomResponsable,
            telephone, adresse
        };

        // Supprimé : if (req.file) { donnees.photoLogoUrl = ... }

        const sponsorModifie = await Sponsor.mettreAJour(id, donnees);

        res.json({
            success: true,
            message: 'Sponsor modifié avec succès',
            sponsor: sponsorModifie
        });

    } catch (erreur) {
        console.error('❌ Erreur modification sponsor:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la modification'
        });
    }
}
    static async supprimerSponsor(req, res) {
        try {
            const { id } = req.params;
            
            // Vérifier si le sponsor participe à des campagnes actives
            const campagnes = await pool.query(`
                SELECT pc.* FROM promoteurs_campagne pc
                JOIN campagnes c ON pc.campagne_id = c.id
                WHERE pc.promoteur_id = $1 AND pc.promoteur_type = 'sponsor'
                AND c.statut = 'active'
            `, [id]);

            if (campagnes.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Impossible de supprimer : le sponsor participe à des campagnes actives'
                });
            }

            await pool.query('DELETE FROM sponsors WHERE id = $1', [id]);

            res.json({
                success: true,
                message: 'Sponsor supprimé avec succès'
            });

        } catch (erreur) {
            console.error('❌ Erreur suppression sponsor:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression'
            });
        }
    }

    static async activerSponsor(req, res) {
        try {
            const { id } = req.params;
            
            const sponsor = await Sponsor.activer(id);

            res.json({
                success: true,
                message: 'Sponsor activé avec succès',
                sponsor
            });

        } catch (erreur) {
            console.error('❌ Erreur activation sponsor:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'activation'
            });
        }
    }

    static async desactiverSponsor(req, res) {
        try {
            const { id } = req.params;
            const { raison } = req.body;

            if (!raison) {
                return res.status(400).json({
                    success: false,
                    message: 'La raison de la désactivation est requise'
                });
            }

            const sponsor = await Sponsor.desactiver(id, raison);

            res.json({
                success: true,
                message: 'Sponsor désactivé avec succès',
                sponsor
            });

        } catch (erreur) {
            console.error('❌ Erreur désactivation sponsor:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la désactivation'
            });
        }
    }
static async creerOng(req, res) {
    try {
        const {
            email, telephone, motDePasse, nomOng,
            numeroAgrement, domaineIntervention, nomResponsable, adresse
        } = req.body;

        const existant = await Ong.trouverParEmail(email);
        if (existant) {
            return res.status(400).json({
                success: false,
                message: 'Une ONG avec cet email existe déjà'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const motDePasseHash = await bcrypt.hash(motDePasse, salt);

        // Supprimé : const photoLogoUrl = req.file ? ...;

        const nouvelleOng = await Ong.creer({
            email,
            telephone,
            motDePasseHash,
            nomOng,
            numeroAgrement,
            domaineIntervention: domaineIntervention ? domaineIntervention.split(',') : [],
            nomResponsable,
            adresse,
            // photoLogoUrl supprimé
            cguAcceptees: true,
            est_actif: true
        });

        res.status(201).json({
            success: true,
            message: 'ONG créée avec succès',
            ong: {
                id: nouvelleOng.id,
                email: nouvelleOng.email,
                nomOng: nouvelleOng.nom_ong
            }
        });

    } catch (erreur) {
        console.error('❌ Erreur création ONG:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création'
        });
    }
}

    static async listerOngs(req, res) {    
        try {
            const ongs = await Ong.listerTous();
            
            // Ajouter les rapports et campagnes
            for (let o of ongs) {
                const rapports = await pool.query(
                    'SELECT COUNT(*) as total FROM rapports_ong WHERE ong_id = $1',
                    [o.id]
                );
                o.nb_rapports = rapports.rows[0].total;
                
                const campagnes = await Ong.getCampagnes(o.id);
                o.nb_campagnes = campagnes.length;
                o.campagnes = campagnes;
                
                const dashboard = await Ong.getDashboard(o.id);
                o.statistiques = dashboard;
            }

            res.json({
                success: true,
                ongs
            });

        } catch (erreur) {
            console.error('❌ Erreur liste ONG:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }

    static async detailsOng(req, res) {
        try {
            const { id } = req.params;
            
            const ong = await Ong.trouverParId(id);
            if (!ong) {
                return res.status(404).json({
                    success: false,
                    message: 'ONG non trouvée'
                });
            }

            const campagnes = await Ong.getCampagnes(id);
            const rapports = await pool.query(
                'SELECT * FROM rapports_ong WHERE ong_id = $1 ORDER BY cree_le DESC',
                [id]
            );
            const dashboard = await Ong.getDashboard(id);

            res.json({
                success: true,
                ong,
                campagnes,
                rapports: rapports.rows,
                statistiques: dashboard
            });

        } catch (erreur) {
            console.error('❌ Erreur détails ONG:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }
static async modifierOng(req, res) {
    try {
        const { id } = req.params;
        const {
            nomOng, numeroAgrement, domaineIntervention,
            nomResponsable, telephone, adresse
        } = req.body;

        const ong = await Ong.trouverParId(id);
        if (!ong) {
            return res.status(404).json({
                success: false,
                message: 'ONG non trouvée'
            });
        }

        const donnees = {
            nomOng, numeroAgrement,
            domaineIntervention: domaineIntervention ? domaineIntervention.split(',') : [],
            nomResponsable, telephone, adresse
        };

        // Supprimé : if (req.file) { donnees.photoLogoUrl = ... }

        const ongModifiee = await Ong.mettreAJour(id, donnees);

        res.json({
            success: true,
            message: 'ONG modifiée avec succès',
            ong: ongModifiee
        });

    } catch (erreur) {
        console.error('❌ Erreur modification ONG:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la modification'
        });
    }
}
    // ===== GESTION DES CAMPAGNES =====
    static async creerCampagne(req, res) {
        try {
            const {
                nom, description, dateDebut, dateFin,
                typesDechets, zonesIntervention, poidsAttendue,
                prixParKg, statut, promoteurs
            } = req.body;

            // Créer la campagne
            const nouvelleCampagne = await Campagne.creer({
                nom,
                description,
                dateDebut,
                dateFin,
                typesDechets: Array.isArray(typesDechets) ? typesDechets : typesDechets.split(','),
                zonesIntervention: zonesIntervention ? (Array.isArray(zonesIntervention) ? zonesIntervention : zonesIntervention.split(',')) : [],
                poidsAttendue: parseFloat(poidsAttendue),
                prixParKg: parseFloat(prixParKg),
                statut: statut || 'planifiee',
                createurId: req.utilisateurId,
                createurType: 'admin'
            });

            // Ajouter ECOCOLLECT comme promoteur par défaut
            await Campagne.ajouterPromoteur(nouvelleCampagne.id, req.utilisateurId, 'ecocollect', 0, 'Promoteur principal');

            // Ajouter les promoteurs supplémentaires si fournis
            if (promoteurs && Array.isArray(promoteurs)) {
                for (const p of promoteurs) {
                    await Campagne.ajouterPromoteur(
                        nouvelleCampagne.id,
                        p.id,
                        p.type,
                        p.contribution || null,
                        p.objectif || null
                    );
                }
            }

            res.status(201).json({
                success: true,
                message: 'Campagne créée avec succès',
                campagne: nouvelleCampagne
            });

        } catch (erreur) {
            console.error('❌ Erreur création campagne:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création'
            });
        }
    }

    static async listerCampagnes(req, res) {
        try {
            const { statut } = req.query;
            const campagnes = await Campagne.lister({ statut });
            
            // Ajouter les promoteurs et statistiques
            for (let c of campagnes) {
                const promoteurs = await Campagne.getPromoteurs(c.id);
                c.promoteurs = promoteurs;
                
                const stats = await Campagne.getStatistiques(c.id);
                c.statistiques = stats;
            }

            res.json({
                success: true,
                campagnes
            });

        } catch (erreur) {
            console.error('❌ Erreur liste campagnes:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }

    static async detailsCampagne(req, res) {
        try {
            const { id } = req.params;
            
            const campagne = await Campagne.trouverParId(id);
            if (!campagne) {
                return res.status(404).json({
                    success: false,
                    message: 'Campagne non trouvée'
                });
            }

            const promoteurs = await Campagne.getPromoteurs(id);
            const suivi = await Campagne.getSuivi(id);
            const statistiques = await Campagne.getStatistiques(id);
            const rapport = await Campagne.getRapportComplet(id);

            res.json({
                success: true,
                campagne,
                promoteurs,
                suivi,
                statistiques,
                rapport
            });

        } catch (erreur) {
            console.error('❌ Erreur détails campagne:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }

    static async modifierCampagne(req, res) {
        try {
            const { id } = req.params;
            const {
                nom, description, dateDebut, dateFin,
                typesDechets, zonesIntervention, poidsAttendue,
                prixParKg, statut
            } = req.body;

            const campagne = await Campagne.trouverParId(id);
            if (!campagne) {
                return res.status(404).json({
                    success: false,
                    message: 'Campagne non trouvée'
                });
            }

            const donnees = {
                nom, description, dateDebut, dateFin,
                typesDechets: Array.isArray(typesDechets) ? typesDechets : typesDechets?.split(','),
                zonesIntervention: zonesIntervention ? (Array.isArray(zonesIntervention) ? zonesIntervention : zonesIntervention.split(',')) : [],
                poidsAttendue: poidsAttendue ? parseFloat(poidsAttendue) : undefined,
                prixParKg: prixParKg ? parseFloat(prixParKg) : undefined,
                statut
            };

            const campagneModifiee = await Campagne.mettreAJour(id, donnees);

            res.json({
                success: true,
                message: 'Campagne modifiée avec succès',
                campagne: campagneModifiee
            });

        } catch (erreur) {
            console.error('❌ Erreur modification campagne:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la modification'
            });
        }
    }

    static async ajouterPromoteurCampagne(req, res) {
        try {
            const { id } = req.params;
            const { promoteurId, promoteurType, contribution, objectif } = req.body;

            const campagne = await Campagne.trouverParId(id);
            if (!campagne) {
                return res.status(404).json({
                    success: false,
                    message: 'Campagne non trouvée'
                });
            }

            const promoteur = await Campagne.ajouterPromoteur(id, promoteurId, promoteurType, contribution, objectif);

            res.json({
                success: true,
                message: 'Promoteur ajouté avec succès',
                promoteur
            });

        } catch (erreur) {
            console.error('❌ Erreur ajout promoteur:', erreur);
            res.status(500).json({
                success: false,
                message: erreur.message || 'Erreur lors de l\'ajout du promoteur'
            });
        }
    }

    static async retirerPromoteurCampagne(req, res) {
        try {
            const { id, promoteurId, promoteurType } = req.params;

            const campagne = await Campagne.trouverParId(id);
            if (!campagne) {
                return res.status(404).json({
                    success: false,
                    message: 'Campagne non trouvée'
                });
            }

            await Campagne.retirerPromoteur(id, promoteurId, promoteurType);

            res.json({
                success: true,
                message: 'Promoteur retiré avec succès'
            });

        } catch (erreur) {
            console.error('❌ Erreur retrait promoteur:', erreur);
            res.status(500).json({
                success: false,
                message: erreur.message || 'Erreur lors du retrait du promoteur'
            });
        }
    }

    static async ajouterSuiviCampagne(req, res) {
        try {
            const { id } = req.params;
            const { dateSuivi, poidsCollecte, montantUtilise, pointsConcernes, details } = req.body;

            const campagne = await Campagne.trouverParId(id);
            if (!campagne) {
                return res.status(404).json({
                    success: false,
                    message: 'Campagne non trouvée'
                });
            }

            const suivi = await Campagne.ajouterSuivi({
                campagneId: id,
                dateSuivi,
                poidsCollecte,
                montantUtilise,
                pointsConcernes,
                details
            });

            res.json({
                success: true,
                message: 'Suivi ajouté avec succès',
                suivi
            });

        } catch (erreur) {
            console.error('❌ Erreur ajout suivi:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'ajout du suivi'
            });
        }
    }

    static async rapportCampagne(req, res) {
        try {
            const { id } = req.params;
            const { format = 'json' } = req.query;

            const campagne = await Campagne.trouverParId(id);
            if (!campagne) {
                return res.status(404).json({
                    success: false,
                    message: 'Campagne non trouvée'
                });
            }

            const rapport = await Campagne.getRapportComplet(id);

            if (format === 'json') {
                res.json({
                    success: true,
                    rapport
                });
            } else if (format === 'pdf' || format === 'excel') {
                // Implémenter la génération PDF/Excel ici
                res.json({
                    success: true,
                    message: `Génération ${format} à implémenter`,
                    rapport
                });
            }

        } catch (erreur) {
            console.error('❌ Erreur rapport campagne:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la génération du rapport'
            });
        }
    }

    // ===== GESTION DES PRODUCTEURS PREMIUM =====
    static async convertirEnPremium(req, res) {
        try {
            const { producteurId } = req.params;
            const {
                typeAbonnement,
                frequenceCollecte,
                montantAbonnement,
                stripeCustomerId,
                stripeSubscriptionId
            } = req.body;

            const producteur = await Producteur.trouverParId(producteurId);
            if (!producteur) {
                return res.status(404).json({
                    success: false,
                    message: 'Producteur non trouvé'
                });
            }

            // Vérifier s'il est déjà premium
            const dejaPremium = await pool.query(
                'SELECT * FROM producteurs_premium WHERE producteur_id = $1 AND statut = $2',
                [producteurId, 'actif']
            );

            if (dejaPremium.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce producteur est déjà premium'
                });
            }

            // Calculer les dates
            const dateDebut = new Date();
            const dateFin = new Date();
            
            switch(typeAbonnement) {
                case 'mensuel':
                    dateFin.setMonth(dateFin.getMonth() + 1);
                    break;
                case 'trimestriel':
                    dateFin.setMonth(dateFin.getMonth() + 3);
                    break;
                case 'annuel':
                    dateFin.setFullYear(dateFin.getFullYear() + 1);
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Type d\'abonnement invalide'
                    });
            }

            // Calculer la prochaine collecte
            const prochaineCollecte = new Date();
            switch(frequenceCollecte) {
                case 'hebdomadaire':
                    prochaineCollecte.setDate(prochaineCollecte.getDate() + 7);
                    break;
                case 'bi-mensuelle':
                    prochaineCollecte.setDate(prochaineCollecte.getDate() + 15);
                    break;
                case 'mensuelle':
                    prochaineCollecte.setMonth(prochaineCollecte.getMonth() + 1);
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Fréquence de collecte invalide'
                    });
            }

            // Créer l'abonnement premium
            const abonnement = await pool.query(`
                INSERT INTO producteurs_premium (
                    producteur_id, type_abonnement, frequence_collecte,
                    date_debut, date_fin, montant_abonnement,
                    stripe_customer_id, stripe_subscription_id, statut,
                    prochaine_collecte
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *
            `, [
                producteurId, typeAbonnement, frequenceCollecte,
                dateDebut, dateFin, montantAbonnement,
                stripeCustomerId, stripeSubscriptionId, 'actif',
                prochaineCollecte
            ]);

            // Mettre à jour le type de compte du producteur
            await pool.query(
                'UPDATE producteurs SET type_compte = $1, stripe_customer_id = $2 WHERE id = $3',
                ['premium', stripeCustomerId, producteurId]
            );

            // Journaliser l'action
            await pool.query(`
                INSERT INTO historique_actions (utilisateur_id, action, details, adresse_ip)
                VALUES ($1, $2, $3, $4)
            `, [req.utilisateurId, 'CONVERSION_PREMIUM', JSON.stringify({ 
                producteurId, 
                typeAbonnement, 
                montantAbonnement 
            }), req.ip]);

            res.json({
                success: true,
                message: 'Producteur converti en premium avec succès',
                abonnement: abonnement.rows[0]
            });

        } catch (erreur) {
            console.error('❌ Erreur conversion premium:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la conversion'
            });
        }
    }

    static async listerProducteursPremium(req, res) {
        try {
            const resultat = await pool.query(`
                SELECT 
                    p.*,
                    pp.type_abonnement,
                    pp.frequence_collecte,
                    pp.date_debut,
                    pp.date_fin,
                    pp.montant_abonnement,
                    pp.statut as abonnement_statut,
                    pp.prochaine_collecte,
                    pp.cree_le as abonnement_cree_le,
                    (SELECT COUNT(*) FROM declarations_dechets WHERE producteur_id = p.id) as total_declarations,
                    (SELECT COUNT(*) FROM missions m 
                     JOIN declarations_dechets d ON m.declaration_id = d.id 
                     WHERE d.producteur_id = p.id AND m.statut = 'validee') as collectes_effectuees
                FROM producteurs p
                JOIN producteurs_premium pp ON p.id = pp.producteur_id
                ORDER BY pp.date_fin ASC
            `);

            res.json({
                success: true,
                producteurs: resultat.rows
            });

        } catch (erreur) {
            console.error('❌ Erreur liste producteurs premium:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }

    static async detailsProducteurPremium(req, res) {
        try {
            const { id } = req.params;

            const resultat = await pool.query(`
                SELECT 
                    p.*,
                    pp.type_abonnement,
                    pp.frequence_collecte,
                    pp.date_debut,
                    pp.date_fin,
                    pp.montant_abonnement,
                    pp.statut as abonnement_statut,
                    pp.prochaine_collecte,
                    pp.cree_le as abonnement_cree_le,
                    pp.modifie_le as abonnement_modifie_le
                FROM producteurs p
                JOIN producteurs_premium pp ON p.id = pp.producteur_id
                WHERE p.id = $1
            `, [id]);

            if (resultat.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Producteur premium non trouvé'
                });
            }

            // Récupérer l'historique des collectes
            const collectes = await pool.query(`
                SELECT 
                    m.*,
                    d.date_declaration,
                    d.type_dechet,
                    d.quantite
                FROM missions m
                JOIN declarations_dechets d ON m.declaration_id = d.id
                WHERE d.producteur_id = $1
                ORDER BY m.date_validation DESC
                LIMIT 20
            `, [id]);

            res.json({
                success: true,
                producteur: resultat.rows[0],
                collectes: collectes.rows
            });

        } catch (erreur) {
            console.error('❌ Erreur détails producteur premium:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }

    static async resilierAbonnement(req, res) {
        try {
            const { id } = req.params;
            const { raison } = req.body;

            const abonnement = await pool.query(
                'SELECT * FROM producteurs_premium WHERE producteur_id = $1 AND statut = $2',
                [id, 'actif']
            );

            if (abonnement.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Abonnement actif non trouvé'
                });
            }

            // Mettre à jour l'abonnement
            await pool.query(`
                UPDATE producteurs_premium 
                SET statut = $1, modifie_le = CURRENT_TIMESTAMP
                WHERE id = $2
            `, ['resilie', abonnement.rows[0].id]);

            // Mettre à jour le producteur
            await pool.query(
                'UPDATE producteurs SET type_compte = $1 WHERE id = $2',
                ['standard', id]
            );

            // Journaliser
            await pool.query(`
                INSERT INTO historique_actions (utilisateur_id, action, details, adresse_ip)
                VALUES ($1, $2, $3, $4)
            `, [req.utilisateurId, 'RESILIATION_ABONNEMENT', JSON.stringify({ 
                producteurId: id, 
                raison 
            }), req.ip]);

            res.json({
                success: true,
                message: 'Abonnement résilié avec succès'
            });

        } catch (erreur) {
            console.error('❌ Erreur résiliation abonnement:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la résiliation'
            });
        }
    }

    // ===== GESTION DES DEMANDES DE SUPPRESSION =====
    static async listerDemandesSuppression(req, res) {
        try {
            const { statut } = req.query;
            const demandes = await DemandeSuppression.lister({ statut });
            
            // Ajouter les statistiques
            const stats = await DemandeSuppression.getStats();

            res.json({
                success: true,
                demandes,
                statistiques: stats
            });

        } catch (erreur) {
            console.error('❌ Erreur liste demandes:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }

    static async detailsDemandeSuppression(req, res) {
        try {
            const { id } = req.params;
            
            const demande = await DemandeSuppression.trouverParId(id);
            if (!demande) {
                return res.status(404).json({
                    success: false,
                    message: 'Demande non trouvée'
                });
            }

            res.json({
                success: true,
                demande
            });

        } catch (erreur) {
            console.error('❌ Erreur détails demande:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }

    static async traiterDemandeSuppression(req, res) {
        try {
            const { demandeId } = req.params;
            const { statut, notes } = req.body;

            if (!statut || !['approuvee', 'rejetee'].includes(statut)) {
                return res.status(400).json({
                    success: false,
                    message: 'Statut invalide'
                });
            }

            const demande = await DemandeSuppression.traiter(demandeId, statut, req.utilisateurId, notes);

            res.json({
                success: true,
                message: `Demande ${statut === 'approuvee' ? 'approuvée' : 'rejetée'} avec succès`,
                demande
            });

        } catch (erreur) {
            console.error('❌ Erreur traitement demande:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du traitement'
            });
        }
    }

    // ===== HISTORIQUE COMPLET =====
    static async historiqueComplet(req, res) {
        try {
            const { type, dateDebut, dateFin, limit = 100, page = 1 } = req.query;
            const offset = (page - 1) * limit;

            let requete = `
                SELECT * FROM historique_actions 
                WHERE 1=1
            `;
            const valeurs = [];
            let index = 1;

            if (type) {
                requete += ` AND action LIKE $${index++}`;
                valeurs.push(`%${type}%`);
            }

            if (dateDebut) {
                requete += ` AND cree_le >= $${index++}`;
                valeurs.push(dateDebut);
            }

            if (dateFin) {
                requete += ` AND cree_le <= $${index++}`;
                valeurs.push(dateFin);
            }

            // Compter le total
            const countQuery = requete.replace('SELECT *', 'SELECT COUNT(*) as total');
            const countResult = await pool.query(countQuery, valeurs);
            const total = parseInt(countResult.rows[0].total);

            requete += ` ORDER BY cree_le DESC LIMIT $${index} OFFSET $${index + 1}`;
            valeurs.push(parseInt(limit), offset);

            const resultat = await pool.query(requete, valeurs);

            // Ajouter les statistiques
            const stats = await pool.query(`
                SELECT 
                    COUNT(*) as total_actions,
                    COUNT(*) FILTER (WHERE cree_le >= CURRENT_DATE) as aujourd_hui,
                    COUNT(*) FILTER (WHERE cree_le >= CURRENT_DATE - INTERVAL '7 days') as cette_semaine,
                    COUNT(*) FILTER (WHERE cree_le >= CURRENT_DATE - INTERVAL '30 days') as ce_mois,
                    COUNT(DISTINCT utilisateur_id) as utilisateurs_actifs
                FROM historique_actions
            `);

            res.json({
                success: true,
                historique: resultat.rows,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                },
                statistiques: stats.rows[0]
            });

        } catch (erreur) {
            console.error('❌ Erreur historique:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }

    // ===== STATISTIQUES AVANCÉES =====
    static async statistiquesAvancees(req, res) {
        try {
            const stats = await pool.query(`
                WITH stats_globales AS (
                    SELECT 
                        (SELECT COUNT(*) FROM producteurs) as total_producteurs,
                        (SELECT COUNT(*) FROM collecteurs) as total_collecteurs,
                        (SELECT COUNT(*) FROM gestionnaires_points) as total_gestionnaires,
                        (SELECT COUNT(*) FROM superviseurs) as total_superviseurs,
                        (SELECT COUNT(*) FROM recycleurs) as total_recycleurs,
                        (SELECT COUNT(*) FROM sponsors) as total_sponsors,
                        (SELECT COUNT(*) FROM ongs) as total_ongs,
                        (SELECT COUNT(*) FROM campagnes) as total_campagnes,
                        (SELECT COUNT(*) FROM missions) as total_missions,
                        (SELECT COALESCE(SUM(poids_depose), 0) FROM missions WHERE statut = 'validee') as total_kg_collectes,
                        (SELECT COALESCE(SUM(gains_attribues), 0) FROM missions WHERE statut = 'validee') as total_gains_collecteurs,
                        (SELECT COALESCE(SUM(points), 0) FROM producteurs) as total_points_producteurs
                ),
                evolution_journaliere AS (
                    SELECT 
                        date_trunc('day', cree_le) as jour,
                        COUNT(*) as inscriptions
                    FROM producteurs
                    WHERE cree_le >= CURRENT_DATE - INTERVAL '30 days'
                    GROUP BY date_trunc('day', cree_le)
                ),
                repartition_producteurs AS (
                    SELECT 
                        type_producteur,
                        COUNT(*) as nombre
                    FROM producteurs
                    GROUP BY type_producteur
                ),
                repartition_collecteurs AS (
                    SELECT 
                        statut,
                        COUNT(*) as nombre
                    FROM collecteurs
                    GROUP BY statut
                ),
                top_producteurs AS (
                    SELECT 
                        p.nom_complet,
                        p.email,
                        p.points,
                        COUNT(d.id) as declarations,
                        COALESCE(SUM(d.quantite), 0) as kg_declares
                    FROM producteurs p
                    LEFT JOIN declarations_dechets d ON p.id = d.producteur_id
                    GROUP BY p.id, p.nom_complet, p.email, p.points
                    ORDER BY p.points DESC
                    LIMIT 10
                ),
                top_collecteurs AS (
                    SELECT 
                        c.nom_complet,
                        c.email,
                        c.gains_total,
                        COUNT(m.id) as missions_realisees,
                        COALESCE(SUM(m.poids_depose), 0) as kg_collectes
                    FROM collecteurs c
                    LEFT JOIN missions m ON c.id = m.collecteur_id AND m.statut = 'validee'
                    GROUP BY c.id, c.nom_complet, c.email, c.gains_total
                    ORDER BY kg_collectes DESC
                    LIMIT 10
                ),
                statistiques_campagnes AS (
                    SELECT 
                        AVG(CURRENT_DATE - date_debut) as duree_moyenne_jours,
                        AVG(poids_attendue) as poids_moyen,
                        COUNT(*) FILTER (WHERE statut = 'active') as actives,
                        COUNT(*) FILTER (WHERE statut = 'terminee') as terminees
                    FROM campagnes
                )
                SELECT 
                    (SELECT row_to_json(stats_globales) FROM stats_globales) as globales,
                    (SELECT json_agg(evolution_journaliere) FROM evolution_journaliere) as evolution,
                    (SELECT json_agg(repartition_producteurs) FROM repartition_producteurs) as repartition_producteurs,
                    (SELECT json_agg(repartition_collecteurs) FROM repartition_collecteurs) as repartition_collecteurs,
                    (SELECT json_agg(top_producteurs) FROM top_producteurs) as top_producteurs,
                    (SELECT json_agg(top_collecteurs) FROM top_collecteurs) as top_collecteurs,
                    (SELECT row_to_json(statistiques_campagnes) FROM statistiques_campagnes) as campagnes
            `);

            res.json({
                success: true,
                statistiques: stats.rows[0]
            });

        } catch (erreur) {
            console.error('❌ Erreur statistiques avancées:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération'
            });
        }
    }

    static async supprimerCampagne(req, res) {
    try {
        const { id } = req.params;
        
        // Vérifier si la campagne existe
        const campagne = await Campagne.trouverParId(id);
        
        if (!campagne) {
            return res.status(404).json({
                success: false,
                message: 'Campagne non trouvée'
            });
        }

        // Supprimer directement (les relations seront supprimées automatiquement si CASCADE est configuré)
        const query = 'DELETE FROM campagnes WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        res.json({
            success: true,
            message: 'Campagne supprimée avec succès',
            campagne: result.rows[0]
        });

    } catch (erreur) {
        console.error('❌ Erreur suppression campagne:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la campagne',
            erreur: erreur.message
        });
    }
}
}

export default AdminController;