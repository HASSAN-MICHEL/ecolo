# Configuration serveur
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecocollect_db
DB_USER=postgres
DB_PASSWORD=HASSAN237
DB_SSL=false  # Désactive explicitement SSL

JWT_SECRET=ytr-è-çàçè&éhfgvbnsdrecocollectù!
JWT_EXPIRE=7d

# Application
APP_URL=http://localhost:3000
FRONTEND_URL=http://127.0.0.1:5500






# ========= ENVIRONNEMENT =========
NODE_ENV=development
PORT=3000

# ========= DATABASE =========
# PostgreSQL Local (Développement)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecocollect_db
DB_USER=postgres
DB_PASSWORD=HASSAN237

# Neon.tech (Production/Test)
NEON_DB_URL=postgresql://neondb_owner:npg_kG6v7gxTNIRH@ep-ancient-term-aigb9rph-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require

# ========= SECURITY =========
JWT_SECRET=votre_super_secret_jwt
JWT_EXPIRE=7d

# ========= URLS =========
APP_URL=http://localhost:3000
FRONTEND_URL=http://127.0.0.1:5500/




-- Insertion simplifiée (l'UUID se génère automatiquement)
INSERT INTO superviseurs (
    email, 
    telephone, 
    mot_de_passe_hash, 
    nom_complet, 
    role
) VALUES 
(
    'superviseur.principal@ecocollect.com',
    '+221771234567',
    '$2b$10$Zh4CzlgtC7ymDb/BUZlmyez5qjtXymCpUC4B5.9Y00qiCMXPeZ/jy',
    'Mamadou Diop',
    'superviseur_principal'
),
(
    'superviseur.adjoint@ecocollect.com',
    '+221778765432',
    '$2b$10$bZMmQPHPB0hIe4br9koMbuzNDoJOFaxjJypmG2cQcLBZ.gYIUtiYu',
    'Aïssatou Ndiaye',
    'superviseur_adjoint'
);