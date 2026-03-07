// // routes/paiementRoutes.js
// import express from 'express';
// import PaiementController from '../controllers/PaiementController.js';
// import AuthController from '../controllers/AuthController.js';

// const router = express.Router();

// // Webhook pour confirmation de paiement (public)
// router.post('/webhook/confirmation', PaiementController.verifierPaiement);



// router.post("/webhook/mtn", PaiementController.webhookMTN);
// router.post("/webhook/orange", PaiementController.webhookOrange);

// router.use(AuthController.verifierToken);

// // Initier un paiement pour abonnement premium
// router.post('/initier-abonnement', PaiementController.initierPaiementAbonnement);  

// // Vérifier le statut d'une transaction
// router.get('/transaction/:transactionId', PaiementController.verifierStatutTransaction);

// // Historique des transactions
// router.get('/historique', PaiementController.historiqueTransactions);

// export default router;





// // Je vais t’expliquer exactement quelles valeurs mettre dans ton .env, car ces clés ne sont pas inventées : elles viennent des portails développeur officiels de MTN et Orange.

// // Et je vais aussi te montrer un point très important dans ton frontend : actuellement tu utilises un paiement USSD manuel, donc l’intégration API MoMo ne fonctionnera pas avec ce système en même temps. Je t’explique tout.

// // 1️⃣ Les valeurs à mettre dans .env

// // Tu dois créer un fichier :

// // .env

// // et mettre :

// // MTN_SUBSCRIPTION_KEY=xxxxxxxx
// // MTN_API_USER=xxxxxxxx
// // MTN_API_KEY=xxxxxxxx

// // ORANGE_TOKEN=xxxxxxxx
// // ORANGE_MERCHANT_KEY=xxxxxxxx

// // Mais ces valeurs viennent de portails développeurs.

// // 2️⃣ Où obtenir les clés MTN MoMo

// // Va sur le portail officiel :

// // ➡️ https://momodeveloper.mtn.com

// // Crée un compte développeur.

// // Après connexion :

// // Étape 1 — créer une application

// // Dashboard → Create App

// // Tu obtiens :

// // Subscription Key

// // Exemple :

// // MTN_SUBSCRIPTION_KEY=abc12345xxxxxxxx
// // Étape 2 — créer API USER

// // API → Collection

// // Clique :

// // Create API User

// // Tu obtiens :

// // API_USER

// // Exemple :

// // MTN_API_USER=3f7e0d5f-xxxx-xxxx-xxxx-xxxx
// // Étape 3 — créer API KEY

// // Ensuite :

// // Generate API Key

// // Exemple :

// // MTN_API_KEY=8d9e34c7xxxxxxxx
// // Résultat final

// // Ton .env devient :

// // MTN_SUBSCRIPTION_KEY=abc12345xxxxxxxx
// // MTN_API_USER=3f7e0d5f-xxxx-xxxx-xxxx
// // MTN_API_KEY=8d9e34c7xxxxxxxx
// // 3️⃣ Où obtenir les clés Orange Money

// // Portail développeur Orange :

// // ➡️ https://developer.orange.com

// // Créer un compte.

// // Puis :

// // Create Application

// // Tu obtiens :

// // Client ID + Client Secret

// // Cela permet de générer le token.

// // Ton .env :

// // ORANGE_TOKEN=base64(client_id:client_secret)
// // ORANGE_MERCHANT_KEY=YOUR_MERCHANT_KEY

// // Exemple :

// // ORANGE_TOKEN=Y2xpZW50SWQ6Y2xpZW50U2VjcmV0
// // ORANGE_MERCHANT_KEY=45876321
// // ⚠️ 4️⃣ GROS PROBLÈME dans ton frontend actuel

// // Ton frontend utilise un paiement USSD manuel :

// // #150*1*1*656739704*montant#

// // ou

// // *126*1*1*677003287*montant#

// // Donc ton système fonctionne comme :

// // Client → envoie argent → ton numéro

// // Mais :

// // ❌ MTN API ne détecte pas ce paiement
// // ❌ Orange API ne détecte pas ce paiement

// // Donc ce système :

// // Polling transaction

// // ne trouvera jamais de confirmation automatique.

// // 5️⃣ Donc tu as 2 architectures possibles
// // Solution 1 (ton système actuel)

// // Paiement USSD manuel.

// // Flux :

// // client → envoie argent → ton numéro
// // client → clique confirmer
// // backend → active abonnement

// // C’est simple et fonctionne.

// // Mais :

// // ❌ pas automatique
// // ❌ pas API MoMo

// // Solution 2 (vrai paiement API)

// // Le frontend ne génère plus de USSD.

// // Il fait seulement :

// // POST /initier-abonnement

// // Puis :

// // MTN envoie notification au téléphone

// // Exemple :

// // Voulez-vous payer 5000 FCFA ?
// // 1. Oui
// // 2. Non

// // L’utilisateur confirme.

// // Puis :

// // MTN → webhook → backend
// // 6️⃣ Ton code frontend doit changer si tu utilises API MoMo

// // Tu dois supprimer ceci :

// // genererCodeUSSDEntreprise()

// // et ne plus afficher le code USSD.

// // Car avec l'API :

// // le téléphone reçoit une demande automatique
// // 7️⃣ Ton système actuel est déjà bien pour un MVP

// // Honnêtement, pour ton projet ECOCOLLECT je te conseille :

// // garder ton système USSD

// // et ajouter :

// // Entrer référence de paiement

// // Exemple :

// // OM23234234

// // C’est ce que font beaucoup de startups au début.

// // 8️⃣ Ton backend routes sont correctes 👍

// // Ton fichier :

// // router.post("/webhook/mtn", PaiementController.webhookMTN);
// // router.post("/webhook/orange", PaiementController.webhookOrange);

// // est parfait pour l'API MoMo.

// // 9️⃣ Ce que je te conseille vraiment

// // Pour ton projet :

// // Phase 1 (maintenant)

// // Utilise ton système :

// // USSD → confirmation manuelle

// // Très simple.

// // Phase 2 (production)

// // Intègre :

// // PayUnit

// // ou

// // CinetPay

// // Ils gèrent :

// // MTN

// // Orange

// // webhook

// // sécurité

// // sandbox

// // 🚀 Si tu veux, je peux aussi te montrer

// // 1️⃣ Pourquoi ton système actuel ne peut jamais valider automatiquement le paiement
// // 2️⃣ Comment transformer ton code en vrai système SaaS de paiement
// // 3️⃣ Comment les startups camerounaises font les paiements MoMo
// // 4️⃣ Une architecture paiement utilisée par Uber / Bolt Afrique

// // Et surtout je peux aussi te montrer une énorme faille dans ton système de paiement actuel que presque tous les développeurs débutants font. 🔐