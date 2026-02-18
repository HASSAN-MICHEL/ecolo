-- Dans l'éditeur SQL de Supabase, exécutez :

-- Permettre l'upload à tout le monde (pour les inscriptions)
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'ecocollect');

-- Permettre la lecture publique
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'ecocollect');

-- Permettre la mise à jour
CREATE POLICY "Allow public updates" ON storage.objects
FOR UPDATE TO public
USING (bucket_id = 'ecocollect')
WITH CHECK (bucket_id = 'ecocollect');



L'erreur Bucket not found indique que vous n'avez pas créé le bucket sur Supabase.

✅ Solution : Créer le bucket sur Supabase
1. 📁 Connectez-vous à Supabase Dashboard
Allez sur app.supabase.com

Sélectionnez votre projet

Dans le menu de gauche, cliquez sur Storage

2. 📁 Créez le bucket 'ecocollect'
Cliquez sur "Create bucket" ou "New bucket"

Remplissez :

Name: ecocollect (exactement comme dans votre code)

Public bucket: ✅ Cochez cette option

Cliquez sur "Create bucket"

3. 📁 Ajoutez les dossiers dans le bucket
Vous devez créer les dossiers qui correspondent à votre structure :

bash
Dans le bucket ecocollect, créez :
├── profils/    # Pour les photos de profil
└── cnis/       # Pour les photos de CNI
Pour créer les dossiers :

Ouvrez le bucket ecocollect

Cliquez sur "Create folder"

Nommez-le profils

Répétez pour créer cnis

4. 📁 Configurez les politiques de sécurité
Pour permettre les uploads, vous devez ajouter des politiques :

sql
-- Dans l'éditeur SQL de Supabase, exécutez :

-- Permettre l'upload à tout le monde (pour les inscriptions)
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'ecocollect');

-- Permettre la lecture publique
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'ecocollect');

-- Permettre la mise à jour
CREATE POLICY "Allow public updates" ON storage.objects
FOR UPDATE TO public
USING (bucket_id = 'ecocollect')
WITH CHECK (bucket_id = 'ecocollect');
Ou via l'interface :

Allez dans Storage → Policies

Cliquez sur "Create policy" pour le bucket ecocollect

Choisissez "Create a policy from scratch"

Pour l'INSERT :

Policy name: public-insert

Allowed operations: ✅ INSERT

Target roles: ✅ public

USING expression: true

CHECK expression: true

Répétez pour SELECT et UPDATE