// backend/config/supabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Extraire les informations de DATABASE_URL pour Supabase Storage
// DATABASE_URL = "postgresql://postgres:Hassan236@Aàç*@db.cyjgsbdchsarsyrobbal.supabase.co:6543/ecocollect_db"

// L'URL de Supabase Storage est dérivée de l'URL de la base de données
const supabaseUrl = 'https://cyjgsbdchsarsyrobbal.supabase.co'; // Partie après @ et avant .co

// La clé service doit être ajoutée dans les variables d'environnement
// Allez dans Supabase Dashboard → Project Settings → API → service_role secret
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Configuration Supabase manquante');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);