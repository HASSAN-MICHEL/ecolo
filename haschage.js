// hashPassword.js
import bcrypt from 'bcrypt';

const password = 'ousman123'; // Changez par le mot de passe désiré
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) throw err;
    console.log('Hash:', hash);
    // Copiez ce hash dans la requête SQL
});