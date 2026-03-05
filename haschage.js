import bcrypt from 'bcrypt';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const saltRounds = 10;

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.error('Erreur lors du hashage:', error);
        throw error;
    }
}

INSERT INTO admins (
    id,
    email, 
    telephone, 
    mot_de_passe_hash, 
    nom_complet, 
    role, 
    est_actif,
    cree_le,
    modifie_le
) VALUES (
    uuid_generate_v4(),
    'admin.principal@ecotrace.com',
    '+221771234567',
    '$2b$10$ebz0hUzV8M/XxsYQO9O3qOOcvE.oQ0vnjv.6xXsydTSRgWRwFdXTm', 
    'Mamadou Diallo',
    'admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);



async function main() {
    console.log('🔐 Générateur de hash de mot de passe\n');
    
    rl.question('Entrez le mot de passe à hasher: ', async (password) => {
        if (!password || password.trim() === '') {
            console.log('❌ Le mot de passe ne peut pas être vide');
            rl.close();
            return;
        }

        try {
            console.log('\n⏳ Hashage en cours...');
            const hash = await hashPassword(password);
            
            console.log('\n✅ Mot de passe hashé avec succès !\n');
            console.log('📝 Résultat:');
            console.log('─'.repeat(50));
            console.log(hash);
            console.log('─'.repeat(50));
            console.log('\n💡 Vous pouvez copier ce hash pour l\'insérer dans votre base de données.\n');
            
            // Vérification
            console.log('🔍 Vérification du hash...');
            const isValid = await bcrypt.compare(password, hash);
            if (isValid) {
                console.log('✅ Vérification réussie !\n');
            } else {
                console.log('❌ Échec de la vérification\n');
            }
            
        } catch (error) {
            console.error('❌ Erreur:', error.message);
        } finally {
            rl.close();
        }
    });
}

main();