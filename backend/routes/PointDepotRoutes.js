// import express from 'express';
// import PointDepotController from '../controllers/PointDepotController.js';
// import AuthController from '../controllers/AuthController.js';

// const router = express.Router();

// // Routes publiques (lecture seule)
// router.get('/', PointDepotController.getAll);
// router.get('/:id', PointDepotController.getById);

// // Routes protégées (admin seulement)
// router.use(AuthController.verifierToken);
// router.post('/', PointDepotController.create);
// router.put('/:id', PointDepotController.update);
// router.delete('/:id', PointDepotController.delete);

// export default router;



import express from 'express';
import PointDepotController from '../controllers/PointDepotController.js';

const router = express.Router();

// ✅ CHANGEZ '' en '/'
router.get('/', PointDepotController.getAll);  // ← Maintenant ça correspond à /api/points-depot/
router.get('/:id', PointDepotController.getById);
router.post('/', PointDepotController.create);
router.put('/:id', PointDepotController.update);
router.delete('/:id', PointDepotController.delete);

export default router;