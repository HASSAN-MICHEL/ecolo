


import express from 'express';
import {
  createSale,
  confirmSale,
  cancelSale,
  updateSaleItems,  getTopClientsByMonth ,  getClientSalesDetail , getClientAnalytics,
  getSaleDetails, 
  getAllSales, 
  updatedeSale,
  downloadInvoice,
  getSalesStatistics,
  getRevenue,
  getLastFiveSales,
  getDashboardData ,
  getSalesByDateRange,
  getSalesByCategory,
  getMonthlyComparison,
  getProductMovement,
  getSalesAnalytics
} from '../controllers/SaleController.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Routes existantes
router.post('/', createSale);
router.get('/', getAllSales);
router.get('/:id', getSaleDetails);
// Ajoutez cette route pour servir les fichiers PDF
router.get('/invoices/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../invoices', filename);
  
  // Vérifier si le fichier existe
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Facture non trouvée' });
  }
});

// Gardez votre route existante pour générer le PDF
router.get('/:id/invoice', downloadInvoice);

router.put('/:id/confirm', confirmSale);
router.put('/:id/cancel', cancelSale);
router.put('/:id', updatedeSale);

// Nouvelles routes pour les statistiques et analyses
router.get('/analytics/statistics', getSalesStatistics);
router.get('/analytics/revenue', getRevenue);
router.get('/analytics/latest-sales', getLastFiveSales);
router.get('/analytics/dashboard', getDashboardData);
router.get('/analytics/top-clients', getTopClientsByMonth);
router.get('/analytics/clients/:clientName/sales', getClientSalesDetail);

router.get('/analytics/clients/analysis', getClientAnalytics);
router.get('/analytics/sales-by-date-range', getSalesByDateRange);
router.get('/analytics/sales-by-category', getSalesByCategory);
router.get('/analytics/monthly-comparison', getMonthlyComparison);
router.get('/analytics/product-movement', getProductMovement);
router.get('/analytics/sales-analytics', getSalesAnalytics);


router.get('/analytics/top-clients', getTopClientsByMonth);
router.get('/analytics/client/:clientId/sales', getClientSalesDetail);
router.get('/analytics/sales-stats', getSalesAnalytics);



export default router;