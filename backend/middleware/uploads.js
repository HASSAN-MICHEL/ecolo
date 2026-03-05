import multer from 'multer';
import path from 'path';
import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer les dossiers s'ils n'existent pas
const createFolder = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
};

// Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = path.join(__dirname, '../uploads');
        
        // Sous-dossiers selon le type de fichier
        if (file.fieldname === 'photoProfil') {
            uploadPath = path.join(uploadPath, 'profils');
        } else if (file.fieldname.includes('Cni')) {
            uploadPath = path.join(uploadPath, 'cnis');
        }
        
        createFolder(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Générer un nom de fichier unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Filtrer les fichiers (uniquement images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Seules les images sont autorisées'));
    }
};

// Configuration de l'upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max par fichier
    },
    fileFilter: fileFilter
});

const certificatStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/recyclage';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `certificat-${uniqueSuffix}${ext}`);
  }
});

export const uploadCertificat = multer({
  storage: certificatStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez PDF, JPEG ou PNG'));
    }
  }
}).single('certificat');

// Middleware pour gérer plusieurs fichiers
export const uploadCollecteurFiles = upload.fields([
    { name: 'photoProfil', maxCount: 1 },
    { name: 'photoCniRecto', maxCount: 1 },
    { name: 'photoCniVerso', maxCount: 1 }
]);

export const uploadRecycleurFiles = (req, res, next) => {
    console.log('🔍 Middleware uploadRecycleurFiles - Début');
    
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
        console.log('📝 req.body:', req.body);
        
        next();
    });
};

// Upload logo
export const uploadLogo = upload.single('logo');

// Upload rapport
export const uploadRapport = upload.single('fichier');

// Servir les fichiers statiques
export const serveStatic = (app) => {
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
};