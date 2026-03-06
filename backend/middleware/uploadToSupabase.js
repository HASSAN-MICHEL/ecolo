


// backend/middleware/uploadToSupabase.js
import multer from 'multer';
import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Configuration multer avec stockage en mémoire (pas de disque)
const storage = multer.memoryStorage();

// Filtrer les fichiers (images et PDF)
const fileFilter = (req, file, cb) => {
    // Pour les certificats de recyclage, accepter PDF et images
    if (file.fieldname === 'certificat') {
        const allowedTypes = /jpeg|jpg|png|gif|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf';
        
        if (mimetype && extname) {
            return cb(null, true);
        }
    } else {
        // Pour les autres fichiers (profils, CNI), uniquement images
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        }
    }
    
    cb(new Error('Format de fichier non supporté. Utilisez images ou PDF pour les certificats'));
};

// Configuration de l'upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max par fichier
    },
    fileFilter: fileFilter
});

// Middleware pour gérer plusieurs fichiers (collecteurs/recycleurs)
export const uploadCollecteurFiles = upload.fields([
    { name: 'photoProfil', maxCount: 1 },
    { name: 'photoCniRecto', maxCount: 1 },
    { name: 'photoCniVerso', maxCount: 1 }
]);

// Middleware pour upload de certificat seul (recyclage)
export const uploadCertificat = upload.single('certificat');

// Middleware pour upload de logo
export const uploadLogo = upload.single('logo');

// Middleware pour upload de rapport
export const uploadRapport = upload.single('fichier');

// Fonction pour uploader un fichier vers Supabase Storage
async function uploadToSupabase(file, folder, identifier) {
    if (!file) return null;
    
    try {
        // Générer un nom de fichier unique
        const fileExt = path.extname(file.originalname);
        const fileName = `${folder}/${identifier.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}${fileExt}`;
        
        console.log(`📤 Upload vers Supabase: ${fileName}`);
        
        // Déterminer le contentType en fonction du type de fichier
        let contentType = file.mimetype;
        if (file.mimetype === 'application/pdf') {
            contentType = 'application/pdf';
        }
        
        // Upload vers Supabase
        const { data, error } = await supabase.storage
            .from('ecocollect') // Nom du bucket à créer
            .upload(fileName, file.buffer, {
                contentType: contentType,
                cacheControl: '3600',
                upsert: false
            });
        
        if (error) {
            console.error('❌ Erreur upload Supabase:', error);
            throw error;
        }
        
        // Obtenir l'URL publique
        const { data: { publicUrl } } = supabase.storage
            .from('ecocollect')
            .getPublicUrl(fileName);
        
        console.log(`✅ Fichier uploadé: ${publicUrl}`);
        return publicUrl;
        
    } catch (error) {
        console.error('❌ Erreur upload:', error);
        throw error;
    }
}

// // Middleware pour traiter les uploads de collecteurs/recycleurs
// export const processUploads = async (req, res, next) => {
//     try {
//         if (!req.files) {
//             return next();
//         }
        
//         const email = req.body.email || `temp_${Date.now()}`;
//         const uploadPromises = [];
        
//         // Traiter la photo de profil
//         if (req.files.photoProfil && req.files.photoProfil[0]) {
//             uploadPromises.push(
//                 uploadToSupabase(req.files.photoProfil[0], 'profils', email)
//                     .then(url => {
//                         req.body.photoProfilUrl = url;
//                     })
//             );
//         }
        
//         // Traiter la CNI recto
//         if (req.files.photoCniRecto && req.files.photoCniRecto[0]) {
//             uploadPromises.push(
//                 uploadToSupabase(req.files.photoCniRecto[0], 'cnis', email)
//                     .then(url => {
//                         req.body.photoCniRectoUrl = url;
//                     })
//             );
//         }
        
//         // Traiter la CNI verso
//         if (req.files.photoCniVerso && req.files.photoCniVerso[0]) {
//             uploadPromises.push(
//                 uploadToSupabase(req.files.photoCniVerso[0], 'cnis', email)
//                     .then(url => {
//                         req.body.photoCniVersoUrl = url;
//                     })
//             );
//         }
        
//         // Attendre tous les uploads
//         await Promise.all(uploadPromises);
        
//         console.log('✅ Tous les fichiers uploadés avec succès');
//         next();
        
//     } catch (error) {
//         console.error('❌ Erreur processUploads:', error);
//         next(error);
//     }
// };
export const processUploads = async (req, res, next) => {
    try {
        console.log('🔄 processUploads - req.body avant traitement:', req.body);
        
        if (!req.files) {
            console.log('⚠️ Aucun fichier reçu, passage au suivant');
            return next();
        }
        
        const email = req.body.email || `temp_${Date.now()}`;
        const uploadPromises = [];
        
        // Traiter la photo de profil
        if (req.files.photoProfil && req.files.photoProfil[0]) {
            console.log('📸 Upload photo profil...');
            uploadPromises.push(
                uploadToSupabase(req.files.photoProfil[0], 'profils', email)
                    .then(url => {
                        req.body.photoProfilUrl = url;
                        console.log('✅ Profil URL ajoutée:', url);
                    })
                    .catch(err => {
                        console.error('❌ Erreur upload profil:', err);
                        // Ne pas bloquer pour une photo optionnelle
                    })
            );
        }
        
        // Traiter la CNI recto
        if (req.files.photoCniRecto && req.files.photoCniRecto[0]) {
            console.log('📸 Upload CNI recto...');
            uploadPromises.push(
                uploadToSupabase(req.files.photoCniRecto[0], 'cnis', email)
                    .then(url => {
                        req.body.photoCniRectoUrl = url;
                        console.log('✅ CNI Recto URL ajoutée:', url);
                    })
            );
        }
        
        // Traiter la CNI verso
        if (req.files.photoCniVerso && req.files.photoCniVerso[0]) {
            console.log('📸 Upload CNI verso...');
            uploadPromises.push(
                uploadToSupabase(req.files.photoCniVerso[0], 'cnis', email)
                    .then(url => {
                        req.body.photoCniVersoUrl = url;
                        console.log('✅ CNI Verso URL ajoutée:', url);
                    })
            );
        }
        
        // Attendre tous les uploads
        await Promise.all(uploadPromises);
        
        console.log('✅ Tous les fichiers uploadés avec succès');
        console.log('📦 req.body final:', {
            email: req.body.email,
            telephone: req.body.telephone,
            nomEntreprise: req.body.nomEntreprise,
            nomResponsable: req.body.nomResponsable,
            hasProfil: !!req.body.photoProfilUrl,
            hasCniRecto: !!req.body.photoCniRectoUrl,
            hasCniVerso: !!req.body.photoCniVersoUrl
        });
        
        next();
        
    } catch (error) {
        console.error('❌ Erreur processUploads:', error);
        // En cas d'erreur, on passe quand même pour ne pas bloquer la création
        // mais on log l'erreur
        next();
    }
};
// Middleware pour traiter l'upload de certificat de recyclage
export const processCertificatUpload = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }
        
        console.log('📄 Traitement du certificat de recyclage');
        
        const recycleurId = req.body.recycleurId || req.params.id || `recycleur_${Date.now()}`;
        
        // Uploader le certificat
        const certificatUrl = await uploadToSupabase(
            req.file, 
            'certificats', 
            `recycleur_${recycleurId}`
        );
        
        // Ajouter l'URL au body
        req.body.certificatUrl = certificatUrl;
        
        console.log('✅ Certificat uploadé avec succès');
        next();
        
    } catch (error) {
        console.error('❌ Erreur processCertificatUpload:', error);
        next(error);
    }
};

// Middleware combiné pour les déclarations de recyclage
export const uploadDeclarationsRecyclage = (req, res, next) => {
    console.log('🔍 Upload déclaration recyclage - Début');
    
    uploadCertificat(req, res, (err) => {
        if (err) {
            console.error('❌ Erreur multer:', err);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        
        console.log('✅ Fichier reçu, traitement...');
        console.log('📁 req.file:', req.file);
        console.log('📝 req.body:', req.body);
        
        // Traiter l'upload vers Supabase
        processCertificatUpload(req, res, next);
    });
};
export const uploadRecycleurFiles = (req, res, next) => {
    console.log('🔍 Middleware uploadRecycleurFiles - Début');
    console.log('📝 req.body AVANT multer:', req.body); // Pour voir si les données arrivent
    
    // Sauvegarder les données texte AVANT multer
    const textData = { ...req.body };
    console.log('💾 Données texte sauvegardées:', textData);
    
    upload.fields([
        { name: 'photoProfil', maxCount: 1 },
        { name: 'photoCniRecto', maxCount: 1 },
        { name: 'photoCniVerso', maxCount: 1 }
    ])(req, res, (err) => {
        if (err) {
            console.error('❌ Erreur multer:', err);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        
        console.log('✅ Fichiers reçus, traitement vers Supabase...');
        console.log('📁 req.files:', req.files);
        console.log('📝 req.body APRÈS multer (AVANT restauration):', req.body);
        
        // ⚠️ RESTAURER les données texte
        Object.keys(textData).forEach(key => {
            req.body[key] = textData[key];
        });
        
        console.log('📝 req.body APRÈS restauration:', req.body);
        
        // Traiter les uploads vers Supabase
        processUploads(req, res, next);
    });
};


// Middleware pour les ONG (logo)
export const uploadOngLogo = (req, res, next) => {
    console.log('🔍 Upload logo ONG - Début');
    
    upload.single('logo')(req, res, async (err) => {
        if (err) {
            console.error('❌ Erreur multer:', err);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        
        if (req.file) {
            try {
                const email = req.body.email || `ong_${Date.now()}`;
                const logoUrl = await uploadToSupabase(req.file, 'logos', email);
                req.body.logoUrl = logoUrl;
                console.log('✅ Logo uploadé:', logoUrl);
            } catch (error) {
                console.error('❌ Erreur upload logo:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de l\'upload du logo'
                });
            }
        }
        
        next();
    });
};

// Middleware pour les rapports ONG
export const uploadOngRapport = (req, res, next) => {
    console.log('🔍 Upload rapport ONG - Début');
    
    upload.single('fichier')(req, res, async (err) => {
        if (err) {
            console.error('❌ Erreur multer:', err);
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        
        if (req.file) {
            try {
                const ongId = req.body.ongId || `ong_${Date.now()}`;
                const rapportUrl = await uploadToSupabase(req.file, 'rapports', `rapport_${ongId}`);
                req.body.fichierUrl = rapportUrl;
                console.log('✅ Rapport uploadé:', rapportUrl);
            } catch (error) {
                console.error('❌ Erreur upload rapport:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de l\'upload du rapport'
                });
            }
        }
        
        next();
    });
};

// Supprimer l'ancien serveStatic car on n'utilise plus de fichiers locaux
// export const serveStatic = (app) => {
//     console.log('📁 Les fichiers sont servis via Supabase Storage');
//     // Optionnel: Ajouter une route pour vérifier la configuration
//     app.get('/api/storage/status', (req, res) => {
//         res.json({
//             success: true,
//             message: 'Storage configuré avec Supabase',
//             bucket: 'ecocollect'
//         });
//     });
// };

export const serveStatic = (app) => {
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
};
