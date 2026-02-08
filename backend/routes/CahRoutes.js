import express from 'express';
import {
  createDisbursement,
  getDisbursementsByDate,
  updateDisbursement,
  deleteDisbursement,
  setInitialBalance,
  getCashStateReport
} from '../controllers/CashController.js';

const router = express.Router();

router.post('/disbursements', createDisbursement);
router.get('/disbursements', getDisbursementsByDate);
router.put('/disbursements/:id', updateDisbursement);
router.delete('/disbursements/:id', deleteDisbursement);

router.post('/daily-balance', setInitialBalance);
router.get('/cash-state', getCashStateReport);

export default router;