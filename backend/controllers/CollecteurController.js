
import bcrypt from 'bcrypt';
import Collecteur from '../models/Collecteur.js';
import DeclarationDechets from '../models/DeclarationDechets.js';
import Mission from '../models/Mission.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';  
import Notification from '../models/Notification.js';
import { pool } from '../config/database.js';


class CollecteurController {


    static async inscription(req, res) {
    try {
        // Récupérer les fichiers uploadés via multer
        const files = req.files || {};
        
        // Extraire les fichiers
        const photoProfilFile = files.photoProfil?.[0];
        const photoCniRectoFile = files.photoCniRecto?.[0];
        const photoCniVersoFile = files.photoCniVerso?.[0];
        
        // Générer les URLs accessibles publiquement (chemin relatif pour le serveur statique)
        const photoProfilUrl = photoProfilFile ? `/uploads/profils/${photoProfilFile.filename}` : null;
        const photoCniRectoUrl = photoCniRectoFile ? `/uploads/cnis/${photoCniRectoFile.filename}` : null;
        const photoCniVersoUrl = photoCniVersoFile ? `/uploads/cnis/${photoCniVersoFile.filename}` : null;
        
        // Récupérer les champs texte
        const {
            email, telephone, motDePasse, nomComplet,
            typeCollecteur, numeroIdentite, zoneInterventionNom,
            quartiersHabituels, communesIntervention, cguAcceptees
        } = req.body;
        
        // Vérifications des champs obligatoires
        if (!email || !telephone || !motDePasse || !nomComplet || !typeCollecteur || !zoneInterventionNom) {
            CollecteurController.cleanupUploadedFiles(files);
            return res.status(400).json({
                success: false,
                message: 'Tous les champs obligatoires doivent être remplis'
            });
        }
        
        // Vérifier que les photos CNI sont présentes (fichiers uploadés)
        if (!photoCniRectoFile || !photoCniVersoFile) {
            CollecteurController.cleanupUploadedFiles(files);
            return res.status(400).json({
                success: false,
                message: 'Les photos recto et verso de la CNI sont requises'
            });
        }
        
        // Vérifier l'unicité de l'email
        const collecteurExistant = await Collecteur.trouverParEmail(email);
        if (collecteurExistant) {
            CollecteurController.cleanupUploadedFiles(files);
            return res.status(400).json({
                success: false,
                message: 'Un compte avec cet email existe déjà'
            });
        }
        
        // Vérifier l'unicité du téléphone
        const telephoneExistant = await Collecteur.trouverParTelephone(telephone);
        if (telephoneExistant) {
            CollecteurController.cleanupUploadedFiles(files);
            return res.status(400).json({
                success: false,
                message: 'Un compte avec ce numéro existe déjà'
            });
        }
        
        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const motDePasseHash = await bcrypt.hash(motDePasse, salt);
        
        // Traiter les tableaux (quartiers, communes)
        const quartiersArray = quartiersHabituels ? 
            quartiersHabituels.split(',').map(q => q.trim()).filter(q => q) : [];
        const communesArray = communesIntervention ? 
            communesIntervention.split(',').map(c => c.trim()).filter(c => c) : [];
        
        // Données du collecteur (zone par défaut si non fournie)
        const collecteurData = {
            email,
            telephone,
            motDePasseHash,
            nomComplet,
            typeCollecteur,
            numeroIdentite: numeroIdentite || null,
            zoneIntervention: {
                type: "Polygon",
                coordinates: [[
                    [2.3522, 48.8566],
                    [2.3622, 48.8566],
                    [2.3622, 48.8666],
                    [2.3522, 48.8666],
                    [2.3522, 48.8566]
                ]]
            },
            zoneInterventionNom,
            quartiersHabituels: quartiersArray,
            communesIntervention: communesArray,
            photoProfilUrl,
            photoCniRectoUrl,
            photoCniVersoUrl,
            cguAcceptees: cguAcceptees === 'true' || cguAcceptees === true
        };
        
        const nouveauCollecteur = await Collecteur.creer(collecteurData);
        
        // Notification au superviseur
        await pool.query(
            `INSERT INTO notifications (utilisateur_id, type_utilisateur, titre, message, type_notification)
             VALUES ((SELECT id FROM superviseurs LIMIT 1), 'superviseur', 
                     'Nouveau collecteur en attente', 
                     $1 || ' demande à rejoindre la plateforme. Documents CNI fournis.',
                     'info')`,
            [nomComplet]
        );
        
        res.status(201).json({
            success: true,
            message: 'Inscription réussie. En attente de validation par un superviseur.',
            collecteur: {
                id: nouveauCollecteur.id,
                email: nouveauCollecteur.email,
                nomComplet: nouveauCollecteur.nom_complet,
                statut: nouveauCollecteur.statut
            }
        });
        
    } catch (erreur) {
        console.error('❌ Erreur inscription collecteur:', erreur);
        // Nettoyer les fichiers uploadés en cas d'erreur
        if (req.files) {
            CollecteurController.cleanupUploadedFiles(req.files);
        }
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'inscription',
            erreur: erreur.message
        });
    }
}

    // Helper pour nettoyer les fichiers uploadés en cas d'erreur
    static cleanupUploadedFiles(files) {
        if (!files) return;
        
        Object.values(files).forEach(fileArray => {
            fileArray.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                    console.log(`🧹 Fichier supprimé: ${file.path}`);
                } catch (err) {
                    console.error('❌ Erreur lors de la suppression du fichier:', err);
                }
            });
        });
    }

    // Connexion
    static async connexion(req, res) {
        try {
            const { identifiant, motDePasse } = req.body;

            let collecteur = await Collecteur.trouverParEmail(identifiant);
            if (!collecteur) {
                collecteur = await Collecteur.trouverParTelephone(identifiant);
            }

            if (!collecteur) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            const motDePasseValide = await bcrypt.compare(motDePasse, collecteur.mot_de_passe_hash);
            if (!motDePasseValide) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }

            if (collecteur.statut !== 'actif') {
                return res.status(403).json({
                    success: false,
                    message: 'Votre compte est en attente de validation ou a été suspendu'
                });
            }

            await Collecteur.mettreAJourConnexion(collecteur.id);

            const token = jwt.sign(
                { 
                    id: collecteur.id, 
                    email: collecteur.email, 
                    type: 'collecteur' 
                },
                process.env.JWT_SECRET || 'votre_cle_secrete',
                { expiresIn: process.env.JWT_EXPIRE || '7d' }
            );

            res.json({
                success: true,
                message: 'Connexion réussie',
                token,
                collecteur: {
                    id: collecteur.id,
                    email: collecteur.email,
                    telephone: collecteur.telephone,
                    nomComplet: collecteur.nom_complet,
                    typeCollecteur: collecteur.type_collecteur,
                    statut: collecteur.statut,
                    points: collecteur.points_total,
                    gains: collecteur.gains_total,
                    photoProfilUrl: collecteur.photo_profil_url
                }
            });
        } catch (erreur) {
            console.error('❌ Erreur connexion:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion',
                erreur: erreur.message
            });
        }
    }

    // Obtenir le profil complet
    static async monProfil(req, res) {
        try {
            const collecteurId = req.utilisateurId;
            const collecteur = await Collecteur.trouverParId(collecteurId);

            if (!collecteur) {
                return res.status(404).json({
                    success: false,
                    message: 'Collecteur non trouvé'
                });
            }

            delete collecteur.mot_de_passe_hash;

            res.json({
                success: true,
                collecteur
            });
        } catch (erreur) {
            console.error('❌ Erreur profil:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du profil',
                erreur: erreur.message
            });
        }
    }

    // Mettre à jour les infos personnelles
    static async mettreAJourInfosPersonnelles(req, res) {
        try {
            const collecteurId = req.utilisateurId;
            const {
                nomComplet,
                telephone,
                numeroIdentite,
                zoneInterventionNom,
                quartiersHabituels,
                communesIntervention,
                zoneIntervention
            } = req.body;

            // Vérifier téléphone unique
            if (telephone) {
                const collecteurExistant = await Collecteur.trouverParTelephone(telephone);
                if (collecteurExistant && collecteurExistant.id !== collecteurId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Ce numéro de téléphone est déjà utilisé'
                    });
                }
            }

            const donnees = {
                nomComplet,
                telephone,
                numeroIdentite,
                zoneInterventionNom,
                quartiersHabituels: quartiersHabituels ? 
                    quartiersHabituels.split(',').map(q => q.trim()).filter(q => q) : undefined,
                communesIntervention: communesIntervention ? 
                    communesIntervention.split(',').map(c => c.trim()).filter(c => c) : undefined,
                zoneIntervention
            };

            const collecteur = await Collecteur.mettreAJourInfosPersonnelles(collecteurId, donnees);

            if (!collecteur) {
                return res.status(400).json({
                    success: false,
                    message: 'Aucune donnée à mettre à jour'
                });
            }

            res.json({
                success: true,
                message: 'Informations personnelles mises à jour avec succès',
                collecteur
            });
        } catch (erreur) {
            console.error('❌ Erreur mise à jour:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour',
                erreur: erreur.message
            });
        }
    }

    // Changer mot de passe
    static async changerMotDePasse(req, res) {
        try {
            const collecteurId = req.utilisateurId;
            const { ancienMotDePasse, nouveauMotDePasse } = req.body;

            const ancienHash = await Collecteur.verifierMotDePasse(collecteurId);
            const motDePasseValide = await bcrypt.compare(ancienMotDePasse, ancienHash);

            if (!motDePasseValide) {
                return res.status(401).json({
                    success: false,
                    message: 'Ancien mot de passe incorrect'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const nouveauMotDePasseHash = await bcrypt.hash(nouveauMotDePasse, salt);

            await Collecteur.changerMotDePasse(collecteurId, nouveauMotDePasseHash);

            res.json({
                success: true,
                message: 'Mot de passe modifié avec succès'
            });
        } catch (erreur) {
            console.error('❌ Erreur changement mot de passe:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du changement de mot de passe',
                erreur: erreur.message
            });
        }
    }

 
// Méthode pour obtenir le profil complet
 static async monProfil(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        const collecteur = await Collecteur.trouverParId(collecteurId);

        if (!collecteur) {
            return res.status(404).json({
                success: false,
                message: 'Collecteur non trouvé'
            });
        }

        // Ne pas renvoyer les informations sensibles
        delete collecteur.mot_de_passe_hash;

        res.json({
            success: true,
            collecteur
        });
    } catch (erreur) {
        console.error('Erreur récupération profil:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du profil',
            erreur: erreur.message
        });
    }
}

    // Connexion
   // Dans collecteurController.js - méthode connexion
 static async connexion(req, res) {
    try {
        const { identifiant, motDePasse } = req.body;

        let collecteur = await Collecteur.trouverParEmail(identifiant);
        if (!collecteur) {
            collecteur = await Collecteur.trouverParTelephone(identifiant);
        }

        if (!collecteur) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }

        // Vérifier le mot de passe
        const motDePasseValide = await bcrypt.compare(motDePasse, collecteur.mot_de_passe_hash);
        if (!motDePasseValide) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects'
            });
        }

        // Vérifier le statut
        if (collecteur.statut !== 'actif') {
            return res.status(403).json({
                success: false,
                message: 'Votre compte est en attente de validation ou a été suspendu'
            });
        }

        // Mettre à jour la connexion
        await Collecteur.mettreAJourConnexion(collecteur.id);

        // ✅ CORRECTION: Générer token JWT directement avec jwt.sign
        const token = jwt.sign(
            { 
                id: collecteur.id, 
                email: collecteur.email, 
                type: 'collecteur' 
            },
            process.env.JWT_SECRET || 'votre_cle_secrete',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            success: true,
            message: 'Connexion réussie',
            token,
            collecteur: {
                id: collecteur.id,
                email: collecteur.email,
                telephone: collecteur.telephone,
                nomComplet: collecteur.nom_complet,
                typeCollecteur: collecteur.type_collecteur,
                statut: collecteur.statut,
                points: collecteur.points_total,
                gains: collecteur.gains_total
            }
        });
    } catch (erreur) {
        console.error('Erreur connexion collecteur:', erreur);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion',
            erreur: erreur.message
        });
    }
  }

    // Obtenir les missions disponibles
    static async missionsDisponibles(req, res) {
        try {
            const collecteurId = req.utilisateurId;
            const missions = await Mission.disponiblesPourCollecteur(collecteurId);

            res.json({
                success: true,
                missions
            });
        } catch (erreur) {
            console.error('Erreur récupération missions:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des missions',
                erreur: erreur.message
            });
        }
    }

    // Accepter une mission
    static async accepterMission(req, res) {
        try {
            const { missionId } = req.params;
            const collecteurId = req.utilisateurId;

            // Vérifier si le collecteur a déjà une mission en cours
            const missionsEnCours = await Mission.obtenirParCollecteur(collecteurId, 'en_cours');
            if (missionsEnCours.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Vous avez déjà une mission en cours'
                });
            }

            const mission = await Mission.attribuer(missionId, collecteurId);

            res.json({
                success: true,
                message: 'Mission acceptée avec succès',
                mission
            });
        } catch (erreur) {
            console.error('Erreur acceptation mission:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'acceptation de la mission',
                erreur: erreur.message
            });
        }
    }

    // Démarrer une collecte
    static async demarrerCollecte(req, res) {
        try {
            const { missionId } = req.params;
            const collecteurId = req.utilisateurId;

            const mission = await Mission.demarrerCollecte(missionId, collecteurId);

            res.json({
                success: true,
                message: 'Collecte démarrée',
                mission
            });
        } catch (erreur) {
            console.error('Erreur démarrage collecte:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du démarrage de la collecte',
                erreur: erreur.message
            });
        }
    }

    // Terminer une collecte (avant dépôt)
    static async terminerCollecte(req, res) {
        try {
            const { missionId } = req.params;
            const collecteurId = req.utilisateurId;
            const { photoPreuveUrl, codeConfirmation, notes, conformiteTri } = req.body;

            const mission = await Mission.terminerCollecte(missionId, collecteurId, {
                photoPreuveUrl,
                codeConfirmation,
                notes,
                conformiteTri
            });

            res.json({
                success: true,
                message: 'Collecte terminée. En attente de dépôt au point de collecte.',
                mission
            });
        } catch (erreur) {
            console.error('Erreur fin collecte:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la fin de la collecte',
                erreur: erreur.message
            });
        }
    }

    // Choisir point de dépôt
    static async choisirPointDepot(req, res) {
        try {
            const { missionId } = req.params;
            const { pointDepotId } = req.body;
            const collecteurId = req.utilisateurId;

            const mission = await Mission.deposerAuPoint(missionId, collecteurId, pointDepotId);

            res.json({
                success: true,
                message: 'Point de dépôt sélectionné',
                mission
            });
        } catch (erreur) {
            console.error('Erreur choix point dépôt:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du choix du point de dépôt',
                erreur: erreur.message
            });
        }
    }

    // Ajouter une photo preuve
    static async ajouterPhoto(req, res) {
        try {
            const { missionId } = req.params;
            const collecteurId = req.utilisateurId;
            const { url, type } = req.body;

            const photo = await Mission.ajouterPhoto(missionId, collecteurId, url, type);

            res.json({
                success: true,
                message: 'Photo ajoutée avec succès',
                photo
            });
        } catch (erreur) {
            console.error('Erreur ajout photo:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'ajout de la photo',
                erreur: erreur.message
            });
        }
    }

    // Modifier le profil
    static async modifierProfil(req, res) {
        try {
            const collecteurId = req.utilisateurId;
            const donnees = req.body;

            const collecteur = await Collecteur.mettreAJour(collecteurId, donnees);

            res.json({
                success: true,
                message: 'Profil mis à jour avec succès',
                collecteur
            });
        } catch (erreur) {
            console.error('Erreur modification profil:', erreur);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la modification du profil',
                erreur: erreur.message
            });
        }
    }

    // ✅ Obtenir mes missions avec détails
static async mesMissions(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        const { statut } = req.query;

        const missions = await Collecteur.missionsAvecDetails(collecteurId, statut);

        // Grouper par statut pour faciliter l'affichage
        const grouped = {
            enCours: missions.filter(m => m.statut === 'en_cours'),
            acceptees: missions.filter(m => m.statut === 'acceptee'),
            deposees: missions.filter(m => m.statut === 'deposee'),
            validees: missions.filter(m => m.statut === 'validee'),
            autres: missions.filter(m => !['en_cours', 'acceptee', 'deposee', 'validee'].includes(m.statut))
        };

        res.json({
            success: true,
            missions,
            grouped,
            total: missions.length
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération missions:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// ✅ Obtenir mes gains avec détails
static async mesGains(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        
        const gains = await Collecteur.gainsAvecDetails(collecteurId);
        const statistiques = await Collecteur.statistiquesGains(collecteurId);

        // Grouper par type
        const grouped = {
            collecte: gains.filter(g => g.type_gain === 'collecte'),
            bonus: gains.filter(g => g.type_gain === 'bonus')
        };

        res.json({
            success: true,
            gains,
            grouped,
            statistiques,
            total: gains.length
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération gains:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// ✅ Tableau de bord amélioré
static async tableauBord(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        
        const dashboard = await Collecteur.tableauBord(collecteurId);
        const missions = await Collecteur.missionsAvecDetails(collecteurId);
        const statistiquesGains = await Collecteur.statistiquesGains(collecteurId);

        // Compter par statut
        const compteurs = {
            disponibles: missions.filter(m => m.statut === 'disponible').length,
            acceptees: missions.filter(m => m.statut === 'acceptee').length,
            enCours: missions.filter(m => m.statut === 'en_cours').length,
            deposees: missions.filter(m => m.statut === 'deposee').length,
            validees: missions.filter(m => m.statut === 'validee').length
        };

        // Dernière mission
        const derniereMission = missions
            .filter(m => m.statut === 'validee')
            .sort((a, b) => new Date(b.date_validation) - new Date(a.date_validation))[0];

        res.json({
            success: true,
            dashboard,
            compteurs,
            derniereMission,
            statistiquesGains,
            missionEnCours: missions.find(m => m.statut === 'en_cours') || null
        });
    } catch (erreur) {
        console.error('❌ Erreur tableau bord:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// ✅ Obtenir mes missions (version améliorée)
static async mesMissions(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        const { statut } = req.query;

        const missions = await Collecteur.missionsAvecDetails(collecteurId, statut);

        // Grouper par statut pour faciliter l'affichage
        const grouped = {
            enCours: missions.filter(m => m.statut === 'en_cours'),
            acceptees: missions.filter(m => m.statut === 'acceptee'),
            deposees: missions.filter(m => m.statut === 'deposee'),
            validees: missions.filter(m => m.statut === 'validee'),
            autres: missions.filter(m => !['en_cours', 'acceptee', 'deposee', 'validee'].includes(m.statut))
        };

        res.json({
            success: true,
            missions,
            grouped,
            total: missions.length
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération missions:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// ✅ Obtenir mes gains (version améliorée)
static async mesGains(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        
        const gains = await Collecteur.gainsAvecDetails(collecteurId);
        const statistiques = await Collecteur.statistiquesGains(collecteurId);

        // Grouper par type
        const grouped = {
            collecte: gains.filter(g => g.type_gain === 'collecte'),
            bonus: gains.filter(g => g.type_gain === 'bonus')
        };

        // Calcul des totaux
        const totalCollecte = grouped.collecte.reduce((sum, g) => sum + parseFloat(g.montant), 0);
        const totalBonus = grouped.bonus.reduce((sum, g) => sum + parseFloat(g.montant), 0);

        res.json({
            success: true,
            gains,
            grouped,
            statistiques,
            totals: {
                collecte: totalCollecte,
                bonus: totalBonus,
                global: totalCollecte + totalBonus
            },
            total: gains.length
        });
    } catch (erreur) {
        console.error('❌ Erreur récupération gains:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}


// Tableau de bord 
static async tableauBord(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        
        const dashboard = await Collecteur.tableauBord(collecteurId);
        
        // Récupérer la mission en cours
        const missionEnCours = await pool.query(`
            SELECT m.*, 
                   d.type_dechet, d.quantite, d.unite,
                   p.nom_complet as producteur_nom,
                   p.adresse as producteur_adresse,
                   p.telephone as producteur_telephone
            FROM missions m
            JOIN declarations_dechets d ON m.declaration_id = d.id
            JOIN producteurs p ON d.producteur_id = p.id
            WHERE m.collecteur_id = $1 AND m.statut = 'en_cours'
            LIMIT 1
        `, [collecteurId]);

        res.json({
            success: true,
            dashboard: dashboard.statistiques || {},
            gains: dashboard.gains || {},
            historique: dashboard.historique || [],
            missionEnCours: missionEnCours.rows[0] || null
        });
        
    } catch (erreur) {
        console.error('❌ Erreur tableau bord:', erreur);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la récupération du tableau de bord' 
        });
    }
}


static async mesGains(req, res) {
    try {
        const collecteurId = req.utilisateurId;
        
        const gains = await Collecteur.gainsAvecDetails(collecteurId);
        
        // Statistiques
        const totalCollecte = gains
            .filter(g => g.type_gain === 'collecte')
            .reduce((sum, g) => sum + parseFloat(g.montant), 0);
            
        const totalBonus = gains
            .filter(g => g.type_gain === 'bonus')
            .reduce((sum, g) => sum + parseFloat(g.montant), 0);
            
        const totalValide = gains
            .filter(g => g.statut === 'valide')
            .reduce((sum, g) => sum + parseFloat(g.montant), 0);

        res.json({
            success: true,
            gains,
            resume: {
                total: totalValide,
                collecte: totalCollecte,
                bonus: totalBonus,
                enAttente: gains.filter(g => g.statut === 'en_attente').length
            }
        });
        
    } catch (erreur) {
        console.error('❌ Erreur récupération gains:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

// controllers/CollecteurController.js

static async declarationsAnnexesDisponibles(req, res) {
    try {
        const declarations = await DeclarationDechets.getDeclarationsAnnexesDisponibles();
        res.json({ success: true, declarations });
    } catch (erreur) {
        console.error('❌ Erreur récupération:', erreur);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
}

static async accepterDeclarationAnnexe(req, res) {
    try {
        const { declarationId } = req.params;
        const collecteurId = req.utilisateurId;
        const mission = await DeclarationDechets.accepterDeclarationAnnexe(declarationId, collecteurId);
        res.json({
            success: true,
            message: 'Déclaration annexe acceptée. Vous pouvez démarrer la collecte.',
            mission
        });
    } catch (erreur) {
        console.error('❌ Erreur acceptation:', erreur);
        res.status(500).json({ success: false, message: erreur.message });
    }
}

}

export default CollecteurController;