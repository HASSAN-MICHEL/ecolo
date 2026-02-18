// backend/middleware/uploadToSupabase.js
import multer from 'multer';
import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Configuration multer avec stockage en mémoire (pas de disque)
const storage = multer.memoryStorage();

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

// Middleware pour gérer plusieurs fichiers
export const uploadCollecteurFiles = upload.fields([
    { name: 'photoProfil', maxCount: 1 },
    { name: 'photoCniRecto', maxCount: 1 },
    { name: 'photoCniVerso', maxCount: 1 }
]);

// Fonction pour uploader un fichier vers Supabase Storage
async function uploadToSupabase(file, folder, email) {
    if (!file) return null;
    
    try {
        // Générer un nom de fichier unique
        const fileExt = path.extname(file.originalname);
        const fileName = `${folder}/${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}${fileExt}`;
        
        console.log(`📤 Upload vers Supabase: ${fileName}`);
        
        // Upload vers Supabase
        const { data, error } = await supabase.storage
            .from('ecocollect') // Nom du bucket à créer
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
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

// Middleware pour traiter les uploads après multer
export const processUploads = async (req, res, next) => {
    try {
        if (!req.files) {
            return next();
        }
        
        const email = req.body.email || `temp_${Date.now()}`;
        const uploadPromises = [];
        
        // Traiter la photo de profil
        if (req.files.photoProfil && req.files.photoProfil[0]) {
            uploadPromises.push(
                uploadToSupabase(req.files.photoProfil[0], 'profils', email)
                    .then(url => {
                        req.body.photoProfilUrl = url;
                    })
            );
        }
        
        // Traiter la CNI recto
        if (req.files.photoCniRecto && req.files.photoCniRecto[0]) {
            uploadPromises.push(
                uploadToSupabase(req.files.photoCniRecto[0], 'cnis', email)
                    .then(url => {
                        req.body.photoCniRectoUrl = url;
                    })
            );
        }
        
        // Traiter la CNI verso
        if (req.files.photoCniVerso && req.files.photoCniVerso[0]) {
            uploadPromises.push(
                uploadToSupabase(req.files.photoCniVerso[0], 'cnis', email)
                    .then(url => {
                        req.body.photoCniVersoUrl = url;
                    })
            );
        }
        
        // Attendre tous les uploads
        await Promise.all(uploadPromises);
        
        console.log('✅ Tous les fichiers uploadés avec succès');
        next();
        
    } catch (error) {
        console.error('❌ Erreur processUploads:', error);
        next(error);
    }
};

// Supprimer l'ancien serveStatic car on n'utilise plus de fichiers locaux
export const serveStatic = (app) => {
    // Rien à servir en local maintenant
    console.log('📁 Les fichiers sont servis via Supabase Storage');
};