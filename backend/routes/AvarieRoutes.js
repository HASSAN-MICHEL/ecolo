// import express from 'express';
// import DamageController from '../controllers/AvarieController.js';
// import { authMiddleware } from '../middleware/auth.js';
// import { validateDamage } from '../middleware/validation.js';

// const router = express.Router();

// // Routes pour les avaries
// router.post('/damages', authMiddleware, validateDamage, DamageController.createDamage);
// router.get('/damages', authMiddleware, DamageController.getAllDamages);
// router.get('/damages/:id', authMiddleware, DamageController.getDamageById);
// router.put('/damages/:id', authMiddleware, validateDamage, DamageController.updateDamage);
// router.delete('/damages/:id', authMiddleware, DamageController.deleteDamage);
// router.post('/damages/validate', authMiddleware, DamageController.validateDamages);

// // Routes pour les unités de conditionnement
// router.get('/packaging-units', authMiddleware, DamageController.getPackagingUnits);

// // Routes pour les rapports
// router.get('/reports/daily', authMiddleware, DamageController.getDailyReport);
// router.get('/reports/weekly', authMiddleware, DamageController.getWeeklyReport);
// router.get('/reports/monthly', authMiddleware, DamageController.getMonthlyReport);
// router.get('/reports/damage-summary', authMiddleware, DamageController.getDamageSummary);
// router.get('/reports/damage-trends', authMiddleware, DamageController.getDamageTrends);
// router.get('/reports/damage-stats', authMiddleware, DamageController.getDamageStats);

// export default router;


import express from 'express';
import DamageController from '../controllers/AvarieController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { 
  validateDamage, 
  validateUpdateDamage, 
  validateDamageValidation 
} from '../middleware/validation.js';

const router = express.Router();

// Routes pour les avaries - Accessibles aux rôles stock, admin, manager
const stockRoles = ['admin', 'stock', 'manager'];
const adminRoles = ['admin', 'manager'];
const reportRoles = ['admin', 'manager', 'vente', 'caisse', 'stock'];

// Routes pour les avaries
router.post('/damages', 
  authenticateToken, 
  requireRole(stockRoles),
  validateDamage, 
  DamageController.createDamage
);

router.get('/damages', 
  authenticateToken, 
  requireRole(stockRoles),
  DamageController.getAllDamages
);

router.get('/damages/:id', 
  authenticateToken, 
  requireRole(stockRoles),
  DamageController.getDamageById
);

router.put('/damages/:id', 
  authenticateToken, 
  requireRole(stockRoles),
  validateUpdateDamage, 
  DamageController.updateDamage
);

router.delete('/damages/:id', 
  authenticateToken, 
  requireRole(adminRoles),
  DamageController.deleteDamage
);

router.post('/damages/validate', 
  authenticateToken, 
  requireRole(['admin', 'manager']),
  validateDamageValidation,
  DamageController.validateDamages
);

// Routes pour les unités de conditionnement
router.get('/packaging-units', 
  authenticateToken, 
  requireRole(stockRoles),
  DamageController.getPackagingUnits
);

// Routes pour les rapports
router.get('/reports/daily', 
  authenticateToken, 
  requireRole(reportRoles),
  DamageController.getDailyReport
);

router.get('/reports/weekly', 
  authenticateToken, 
  requireRole(reportRoles),
  DamageController.getWeeklyReport
);

router.get('/reports/monthly', 
  authenticateToken, 
  requireRole(reportRoles),
  DamageController.getMonthlyReport
);

router.get('/reports/damage-summary', 
  authenticateToken, 
  requireRole(reportRoles),
  DamageController.getDamageSummary
);

router.get('/reports/damage-trends', 
  authenticateToken, 
  requireRole(reportRoles),
  DamageController.getDamageTrends
);

router.get('/reports/damage-stats', 
  authenticateToken, 
  requireRole(reportRoles),
  DamageController.getDamageStats
);

export default router;