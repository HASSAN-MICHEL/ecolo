// import express from "express";
// import {
//   getAll,
//   getById,
//   create,
//   update,
//   updatePassword,
//   login,
//   deleteUser,
// } from "../controllers/userController.js"; // Importation des fonctions du contrôleur

// const router = express.Router();

// // Route pour l'authentification (login)
// router.post("/login", login);

// // Route pour récupérer tous les utilisateurs
// router.get("/", getAll);

// // Route pour récupérer un utilisateur par son ID
// router.get("/:id", getById);

// // Route pour créer un nouvel utilisateur
// router.post("/", create);

// // Route pour mettre à jour les informations d'un utilisateur
// router.put("/:id", update);

// // Route pour mettre à jour le mot de passe d'un utilisateur
// router.put("/:id/password", updatePassword);

// // Route pour supprimer un utilisateur
// router.delete("/:id", deleteUser);

// export default router;


import express from 'express';
import {
  getAllUsers, createUser,
  getUserById,
  updateUser,
  deleteUser , getUserLoginHistory ,  getUserLoginStats , getAllLoginHistory
} from '../controllers/userController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Seuls les administrateurs peuvent gérer les utilisateurs
router.get('/', requireRole(['admin']), getAllUsers);
router.get('/:id', requireRole(['admin']), getUserById);
router.put('/:id', requireRole(['admin']), updateUser);
router.delete('/:id', requireRole(['admin']), deleteUser);
router.post('/', requireRole(['admin']), createUser); 

router.get('/:id/login-history', requireRole(['admin']), getUserLoginHistory);   
router.get('/:id/login-stats', requireRole(['admin']), getUserLoginStats);
router.get('/history/logins', requireRole(['admin']), getAllLoginHistory);

export default router;