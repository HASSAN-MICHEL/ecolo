

// import multer from 'multer';
// import path from 'path';
// import express from 'express';
// import fs from 'fs';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Créer les dossiers s'ils n'existent pas
// const createFolder = (folder) => {
//     if (!fs.existsSync(folder)) {
//         fs.mkdirSync(folder, { recursive: true });
//     }
// };

// // Configuration du stockage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let uploadPath = path.join(__dirname, '../uploads');
        
//         // Sous-dossiers selon le type de fichier
//         if (file.fieldname === 'photoProfil') {
//             uploadPath = path.join(uploadPath, 'profils');
//         } else if (file.fieldname.includes('Cni')) {
//             uploadPath = path.join(uploadPath, 'cnis');
//         }
        
//         createFolder(uploadPath);
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         // Générer un nom de fichier unique
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);
//         cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//     }
// });

// // Filtrer les fichiers (uniquement images)
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb(new Error('Seules les images sont autorisées'));
//     }
// };

// // Configuration de l'upload
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 5 * 1024 * 1024, // 5MB max par fichier
//     },
//     fileFilter: fileFilter
// });

// const certificatStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = 'uploads/recyclage';
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, `certificat-${uniqueSuffix}${ext}`);
//   }
// });

// export const uploadCertificat = multer({
//   storage: certificatStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Format de fichier non supporté. Utilisez PDF, JPEG ou PNG'));
//     }
//   }
// }).single('certificat');

// // Middleware pour gérer plusieurs fichiers
// export const uploadCollecteurFiles = upload.fields([
//     { name: 'photoProfil', maxCount: 1 },
//     { name: 'photoCniRecto', maxCount: 1 },
//     { name: 'photoCniVerso', maxCount: 1 }
// ]);

// export const uploadRecycleurFiles = (req, res, next) => {
//     console.log('🔍 Middleware uploadRecycleurFiles - Début');
    
//     upload.fields([
//         { name: 'photoProfil', maxCount: 1 },
//         { name: 'photoCniRecto', maxCount: 1 },
//         { name: 'photoCniVerso', maxCount: 1 }
//     ])(req, res, (err) => {
//         if (err) {
//             console.error('❌ Erreur multer:', err);
//             return res.status(400).json({
//                 success: false,
//                 message: err.message
//             });
//         }
        
//         console.log('✅ Fichiers uploadés avec succès');
//         console.log('📁 req.files:', req.files);
//         console.log('📝 req.body:', req.body);
        
//         next();
//     });
// };

// // Upload logo
// export const uploadLogo = upload.single('logo');

// // Upload rapport
// export const uploadRapport = upload.single('fichier');

// // Servir les fichiers statiques
// export const serveStatic = (app) => {
//     app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// };



import multer from 'multer';
import path from 'path';
import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Déterminer le chemin de base selon l'environnement
const getBaseUploadPath = () => {
    // En production, utiliser le chemin absolu du projet
    if (process.env.NODE_ENV === 'production') {
        // Pour les hébergements comme Hostinger, O2Switch, etc.
        // Le chemin est souvent /home/username/public_html/backend/uploads
        return path.join(process.cwd(), 'uploads');
    }
    // En développement
    return path.join(__dirname, '../uploads');
};

// Créer les dossiers s'ils n'existent pas
const createFolder = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`📁 Dossier créé: ${folder}`);
    }
};

// Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const basePath = getBaseUploadPath();
        let uploadPath = basePath;
        
        // Sous-dossiers selon le type de fichier
        if (file.fieldname === 'photoProfil') {
            uploadPath = path.join(basePath, 'profils');
        } else if (file.fieldname.includes('Cni') || file.fieldname.includes('cni')) {
            uploadPath = path.join(basePath, 'cnis');
        } else if (file.fieldname === 'certificat') {
            uploadPath = path.join(basePath, 'recyclage');
        } else if (file.fieldname === 'logo') {
            uploadPath = path.join(basePath, 'logos');
        } else if (file.fieldname === 'fichier') {
            uploadPath = path.join(basePath, 'rapports');
        }
        
        createFolder(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);
        const uniqueSuffix = `${timestamp}-${random}`;
        const ext = path.extname(file.originalname);
        const fieldname = file.fieldname.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${fieldname}-${uniqueSuffix}${ext}`);
    }
});

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

// Configuration de l'upload avec limites augmentées pour production
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max par fichier (augmenté pour production)
    },
    fileFilter: fileFilter
});

// Configuration pour les certificats
const certificatStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const basePath = getBaseUploadPath();
        const dir = path.join(basePath, 'recyclage');
        createFolder(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `certificat-${timestamp}-${random}${ext}`);
    }
});

// Middleware pour upload de certificat
export const uploadCertificat = multer({
    storage: certificatStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Format de fichier non supporté. Utilisez PDF, JPEG ou PNG'));
        }
    }
}).single('certificat');

// Middleware pour gérer plusieurs fichiers (collecteurs/recycleurs)
export const uploadCollecteurFiles = upload.fields([
    { name: 'photoProfil', maxCount: 1 },
    { name: 'photoCniRecto', maxCount: 1 },
    { name: 'photoCniVerso', maxCount: 1 }
]);

// Middleware pour les recycleurs
export const uploadRecycleurFiles = (req, res, next) => {
    console.log('🔍 Middleware uploadRecycleurFiles - Début');
    console.log('📝 Environnement:', process.env.NODE_ENV);
    console.log('📁 Chemin uploads:', getBaseUploadPath());
    
    // Sauvegarder les données texte AVANT multer
    const textData = { ...req.body };
    
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
        
        console.log('✅ Fichiers uploadés avec succès');
        console.log('📁 req.files:', req.files);
        
        // RESTAURER les données texte (importantes pour production)
        Object.keys(textData).forEach(key => {
            if (!req.body[key]) {
                req.body[key] = textData[key];
            }
        });
        
        console.log('📝 req.body après restauration:', {
            ...req.body,
            motDePasse: req.body.motDePasse ? '[HIDDEN]' : undefined
        });
        
        next();
    });
};

// Upload logo
export const uploadLogo = upload.single('logo');

// Upload rapport
export const uploadRapport = upload.single('fichier');

// Servir les fichiers statiques (avec gestion production)
export const serveStatic = (app) => {
    const uploadPath = getBaseUploadPath();
    console.log(`📁 Servant les fichiers statiques depuis: ${uploadPath}`);
    
    // Vérifier si le dossier existe
    if (!fs.existsSync(uploadPath)) {
        console.log(`⚠️ Dossier uploads non trouvé, création...`);
        createFolder(uploadPath);
    }
    
    // Servir le dossier uploads
    app.use('/uploads', express.static(uploadPath, {
        maxAge: '7d', // Cache pour 7 jours
        etag: true,
        lastModified: true
    }));
    
    // En production, s'assurer que les sous-dossiers existent
    if (process.env.NODE_ENV === 'production') {
        const subFolders = ['profils', 'cnis', 'recyclage', 'logos', 'rapports'];
        subFolders.forEach(folder => {
            const folderPath = path.join(uploadPath, folder);
            createFolder(folderPath);
        });
    }
};