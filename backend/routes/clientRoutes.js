import express from 'express';
import { clientController } from '../controllers/clientController.js';
import { validateClient, validateUpdateClient } from '../middleware/validation.js';

const router = express.Router();

// Routes pour les clients
router.post('/', validateClient, clientController.createClient);
router.get('/', clientController.getAllClients);
router.get('/code/:code', clientController.getClientByCode);
router.put('/:id', validateUpdateClient, clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

export default router;



// import express from 'express';
// import { clientController } from '../controllers/clientController.js';
// import { validateClient, validateUpdateClient } from '../middleware/validation.js';

// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Clients
//  *   description: Gestion des clients et génération de codes alphanumériques
//  */

// /**
//  * @swagger
//  * /clients:
//  *   post:
//  *     summary: Créer un nouveau client
//  *     description: Crée un nouveau client et génère automatiquement un code alphanumérique unique basé sur le nom et prénom
//  *     tags: [Clients]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/ClientInput'
//  *           examples:
//  *             exemple1:
//  *               summary: Client standard
//  *               value:
//  *                 nom: "Dupont"
//  *                 prenom: "Jean"
//  *                 telephone: "0123456789"
//  *             exemple2:
//  *               summary: Client avec chiffres
//  *               value:
//  *                 nom: "Martin2"
//  *                 prenom: "Pierre3"
//  *                 telephone: "+33123456789"
//  *     responses:
//  *       201:
//  *         description: Client créé avec succès
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/SuccessResponse'
//  *             examples:
//  *               success:
//  *                 summary: Client créé
//  *                 value:
//  *                   success: true
//  *                   message: "Client créé avec succès"
//  *                   data:
//  *                     id: 1
//  *                     code_client: "DUPJEABC123xyz"
//  *                     nom: "Dupont"
//  *                     prenom: "Jean"
//  *                     telephone: "0123456789"
//  *                     date_creation: "2024-01-15T10:30:00.000Z"
//  *       400:
//  *         description: Erreur de validation
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Error'
//  *       500:
//  *         description: Erreur serveur
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/responses/ServerError'
//  */
// router.post('/clients', validateClient, clientController.createClient);

// /**
//  * @swagger
//  * /clients:
//  *   get:
//  *     summary: Récupérer tous les clients
//  *     description: Retourne la liste de tous les clients triés par date de création décroissante
//  *     tags: [Clients]
//  *     responses:
//  *       200:
//  *         description: Liste des clients récupérée avec succès
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/Client'
//  *             examples:
//  *               success:
//  *                 summary: Liste des clients
//  *                 value:
//  *                   success: true
//  *                   data:
//  *                     - id: 1
//  *                       code_client: "DUPJEABC123xyz"
//  *                       nom: "Dupont"
//  *                       prenom: "Jean"
//  *                       telephone: "0123456789"
//  *                       date_creation: "2024-01-15T10:30:00.000Z"
//  *                     - id: 2
//  *                       code_client: "MARPIABC456def"
//  *                       nom: "Martin"
//  *                       prenom: "Pierre"
//  *                       telephone: "0678912345"
//  *                       date_creation: "2024-01-15T11:30:00.000Z"
//  *       500:
//  *         $ref: '#/components/responses/ServerError'
//  */
// router.get('/clients', clientController.getAllClients);

// /**
//  * @swagger
//  * /clients/code/{code}:
//  *   get:
//  *     summary: Récupérer un client par son code
//  *     description: Recherche un client spécifique grâce à son code alphanumérique unique
//  *     tags: [Clients]
//  *     parameters:
//  *       - in: path
//  *         name: code
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Code alphanumérique du client
//  *         example: "DUPJEABC123xyz"
//  *     responses:
//  *       200:
//  *         description: Client trouvé
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 data:
//  *                   $ref: '#/components/schemas/Client'
//  *       404:
//  *         $ref: '#/components/responses/NotFoundError'
//  *       500:
//  *         $ref: '#/components/responses/ServerError'
//  */
// router.get('/clients/code/:code', clientController.getClientByCode);

// /**
//  * @swagger
//  * /clients/{id}:
//  *   put:
//  *     summary: Mettre à jour un client
//  *     description: Met à jour les informations d'un client existant
//  *     tags: [Clients]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID du client
//  *         example: 1
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/ClientInput'
//  *     responses:
//  *       200:
//  *         description: Client modifié avec succès
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/SuccessResponse'
//  *       400:
//  *         $ref: '#/components/responses/ValidationError'
//  *       404:
//  *         $ref: '#/components/responses/NotFoundError'
//  *       500:
//  *         $ref: '#/components/responses/ServerError'
//  */
// router.put('/clients/:id', validateUpdateClient, clientController.updateClient);

// /**
//  * @swagger
//  * /clients/{id}:
//  *   delete:
//  *     summary: Supprimer un client
//  *     description: Supprime un client de la base de données
//  *     tags: [Clients]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID du client
//  *         example: 1
//  *     responses:
//  *       200:
//  *         description: Client supprimé avec succès
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Client supprimé avec succès"
//  *       404:
//  *         $ref: '#/components/responses/NotFoundError'
//  *       500:
//  *         $ref: '#/components/responses/ServerError'
//  */
// router.delete('/clients/:id', clientController.deleteClient);

// export default router;