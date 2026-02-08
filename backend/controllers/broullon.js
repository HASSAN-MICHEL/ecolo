import pool from '../config/bb.js';
import Product from '../models/Product.js';
import Sale from '../models/Sale.js';
import SaleItem from '../models/SaleItem.js';
import { body, query, validationResult } from 'express-validator';
// import { 
//   generateDailyReportPDF,
//   generateMonthlyReportPDF
// } from '../services/reportService.js';

import { generateDailyReport, generateMonthlyReport } from '../services/reportService.js'



// export const getDailyReport = async (req, res) => {
//   try {
//     const { date } = req.query;
    
//     // Get sales for the day
//     const salesQuery = `
//       SELECT * FROM sales 
//       WHERE DATE(created_at) = $1 and status = 'confirmed'
//       ORDER BY created_at DESC
//     `;
//     const { rows: sales } = await pool.query(salesQuery, [date]);

//     // Get stock movements
//     const stockQuery = `
      
//  SELECT 
//         p.id as product_id,
//         p.name as product_name,
//         COALESCE((
//           SELECT SUM(si.quantity) 
//           FROM sale_items si
//           JOIN sales s ON si.sale_id = s.id
//           WHERE si.product_id = p.id 
//           AND si.status != 'cancelled'
//           AND DATE(s.created_at) = $1
//         ), 0) as sold_quantity,
//         COALESCE((
//           SELECT SUM(si.quantity) 
//           FROM sale_items si
//           JOIN sales s ON si.sale_id = s.id
//           WHERE si.product_id = p.id 
//           AND si.status = 'cancelled'
//           AND DATE(s.created_at) = $1
//         ), 0) as returned_quantity , p.stock as disponible
//       FROM products p

//     `;
//     const { rows: stockMovements } = await pool.query(stockQuery, [date]);

//     res.json({ sales, stockMovements });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const validateDailyReport = [
  query('date').isISO8601().withMessage('La date doit être au format YYYY-MM-DD')
];

export const validateMonthlyReport = [
  query('year').isInt({ min: 2000, max: 2100 }).withMessage('L\'année doit être entre 2000 et 2100'),
  query('month').isInt({ min: 1, max: 12 }).withMessage('Le mois doit être entre 1 et 12')
];


export const getStockReport = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const getDayReport = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'La date est requise' });
    }
    
    // Option 1: Retourner les données JSON
    if (req.query.format === 'json') {
      const reportData = await getDailyReportData(date);
      return res.json(reportData);
    }
    
    // Option 2: Générer et retourner le PDF
    const report = await generateDailyReportPDF(date);
    
    res.json({
      success: true,
      downloadUrl: report.path,
      fileName: report.name
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ error: 'L\'année et le mois sont requis' });
    }
    
    // Option 1: Retourner les données JSON
    if (req.query.format === 'json') {
      const reportData = await getMonthlyReportData(year, month);
      return res.json(reportData);
    }
    
    // Option 2: Générer et retourner le PDF
    const report = await generateMonthlyReportPDF(parseInt(year), parseInt(month));
    
    res.json({
      success: true,
      downloadUrl: report.path,
      fileName: report.name
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const downloadReport = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../public/reports', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Rapport non trouvé' });
    }
    
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement:', err);
        res.status(500).json({ error: 'Erreur lors du téléchargement' });
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const getDailySalesReport = async (req, res) => {
  try {
    const { date } = req.query;

    // Validation manuelle supplémentaire
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        error: "Format de date invalide. Utilisez YYYY-MM-DD"
      });
    }

    const [salesData, dailyTotal] = await Promise.all([
      SaleItem.getDailySalesReport(date),
      Sale.getDailyTotal(date)
    ]);

    res.json({
      success: true,
      date,
      daily_total: dailyTotal || 0,
      sales_count: salesData.reduce((sum, item) => sum + item.quantity, 0),
      products: salesData
    });

  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erreur serveur"
    });
  }
};



// AU DESSUS ORIGINAL
export const getMonthlySalesReport = async (req, res) => {
  try {
    // Validation des entrées
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { year, month } = req.query;
    
    // Nouvelle méthode pour un rapport mensuel complet
    const salesData = await SaleItem.getMonthlySalesReport(year, month);
    const monthlyTotal = await Sale.getMonthlyTotal(year, month) || 0;
    
    // Calculer les statistiques supplémentaires
    const topProduct = salesData.reduce((max, item) => 
      item.total_quantity > max.total_quantity ? item : max, 
      { total_quantity: 0 }
    );
    
    res.json({ 
      success: true,
      year, 
      month, 
      monthly_total: monthlyTotal,
      sales_count: salesData.reduce((sum, item) => sum + item.total_quantity, 0),
      top_product: topProduct.total_quantity > 0 ? {
        name: topProduct.product_name,
        quantity: topProduct.total_quantity
      } : null,
      products: salesData.map(item => ({
        name: item.product_name,
        quantity: item.total_quantity,
        unit_price: item.unit_price,
        total: item.total_amount
      })),
      isEmpty: salesData.length === 0
    });
    
  } catch (error) {
    console.error('Error in getMonthlySalesReport:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la génération du rapport mensuel',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



export const downloadDailyReport = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date } = req.query;
    
    // Récupérer les données
    const report = await Sale.getEnhancedDailyReport(date);
    
    // Générer le PDF
    const reportPath = await generateDailyReport({
      date,
      dailyTotal: report.daily_total,
      salesCount: report.sales_count,
      topCategory: report.top_category,
      products: report.products
    });
    
    // Envoyer le fichier
    res.download(reportPath, `rapport_journalier_${date}.pdf`, (err) => {
      if (err) {
        console.error('Erreur lors de l\'envoi du rapport:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Erreur lors de l\'envoi du fichier'
        });
      }
      
      // Nettoyer le fichier temporaire
      fs.unlink(reportPath, (unlinkErr) => {
        if (unlinkErr) console.error('Erreur lors de la suppression du fichier:', unlinkErr);
      });
    });
    
  } catch (error) {
    console.error('Error in downloadDailyReport:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la génération du PDF',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const downloadMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month parameters are required' });
    }

    const salesData = await SaleItem.getMonthlySalesReport(year, month);
    const monthlyTotal = await Sale.getMonthlyTotal(year, month) || 0;
    
    const reportPath = await generateMonthlyReport(year, month, salesData, monthlyTotal);
    
    res.download(reportPath, `rapport_mensuel_${year}_${month}.pdf`, (err) => {
      if (err) console.error('Error sending report:', err);
      fs.unlink(reportPath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting report file:', unlinkErr);
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getDailyCustomerSalesReport = async (req, res) => {
  try {
    const { date } = req.query;
    
    // Validation de la date
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        error: "Format de date invalide. Utilisez YYYY-MM-DD"
      });
    }

    // Requête pour obtenir les ventes par client avec montant total
    const customerSalesQuery = `
      SELECT 
        c.id as client_id,
        c.name as client_name,
        c.phone as client_phone,
        COUNT(DISTINCT s.id) as nombre_ventes,
        SUM(si.quantity * si.unit_price) as montant_total,
        SUM(si.quantity) as total_articles,
        MIN(s.created_at) as premiere_vente,
        MAX(s.created_at) as derniere_vente
      FROM sales s
      INNER JOIN sale_items si ON s.id = si.sale_id
      INNER JOIN clients c ON s.client_id = c.id
      WHERE DATE(s.created_at) = $1 
        AND s.status = 'confirmed'
        AND si.status != 'cancelled'
      GROUP BY c.id, c.name, c.phone
      ORDER BY montant_total DESC
    `;

    const { rows: customerSales } = await pool.query(customerSalesQuery, [date]);

    // Requête pour le total général de la journée
    const totalQuery = `
      SELECT 
        COUNT(DISTINCT s.id) as total_ventes,
        COUNT(DISTINCT s.client_id) as total_clients,
        SUM(si.quantity * si.unit_price) as chiffre_affaire_total,
        SUM(si.quantity) as total_articles_vendus
      FROM sales s
      INNER JOIN sale_items si ON s.id = si.sale_id
      WHERE DATE(s.created_at) = $1 
        AND s.status = 'confirmed'
        AND si.status != 'cancelled'
    `;

    const { rows: totals } = await pool.query(totalQuery, [date]);
    const totalGeneral = totals[0] || {
      total_ventes: 0,
      total_clients: 0,
      chiffre_affaire_total: 0,
      total_articles_vendus: 0
    };

    res.json({
      success: true,
      date,
      total_general: totalGeneral,
      clients: customerSales.map(client => ({
        id: client.client_id,
        nom: client.client_name,
        telephone: client.client_phone,
        nombre_ventes: parseInt(client.nombre_ventes),
        montant_total: parseFloat(client.montant_total),
        total_articles: parseInt(client.total_articles),
        premiere_vente: client.premiere_vente,
        derniere_vente: client.derniere_vente,
        panier_moyen: parseFloat(client.montant_total) / parseInt(client.nombre_ventes)
      })),
      isEmpty: customerSales.length === 0
    });

  } catch (error) {
    console.error("Error in getDailyCustomerSalesReport:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erreur serveur lors de la génération du rapport clients"
    });
  }
};


export const validateDailyCustomerReport = [
  query('date')
    .isISO8601()
    .withMessage('La date doit être au format YYYY-MM-DD')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      if (date > now) {
        throw new Error('La date ne peut pas être dans le futur');
      }
      return true;
    })
];

export const downloadDailyCustomerReport = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'La date est requise' });
    }

    // Récupérer les données
    const reportData = await getDailyCustomerSalesReportData(date);
    
    // Générer le PDF (vous devrez créer cette fonction dans reportService.js)
    const reportPath = await generateDailyCustomerReportPDF(date, reportData);
    
    res.download(reportPath, `rapport_clients_${date}.pdf`, (err) => {
      if (err) {
        console.error('Erreur lors de l\'envoi du rapport:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Erreur lors de l\'envoi du fichier'
        });
      }
    });
    
  } catch (error) {
    console.error('Error in downloadDailyCustomerReport:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la génération du PDF',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



//SaleController.js






// import Sale from '../models/Sale.js';
// import SaleItem from '../models/SaleItem.js';
// import Product from '../models/Product.js';
// import Invoice from '../models/Invoice.js';
// import fs from 'fs';

// import { generateInvoice } from '../services/pdfService.js';

// export const createSale = async (req, res) => {
//   try {
//     const { client_name, items, packaging_included } = req.body;
    
//     // Calculate total amount
//     let total_amount = 0;
//     for (const item of items) {
//       const product = await Product.findById(item.product_id);
//       total_amount += product.price * item.quantity;
//     }

//     // Create sale
//     const sale = await Sale.create({ client_name, total_amount, packaging_included });

//     // Create sale items
//     for (const item of items) {
//       const product = await Product.findById(item.product_id);
//       await SaleItem.create({
//         sale_id: sale.id,
//         product_id: item.product_id,
//         quantity: item.quantity,
//         unit_price: product.price,
//       });
      
//       // Update stock (temporarily reserved)
//       await Product.updateStock(item.product_id, -item.quantity);
//     }

//     res.status(201).json(sale);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };




// // Dans saleController.js
// export const updateSaleItems = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { items } = req.body;

//     // Supprimez les anciens items
//     await SaleItem.deleteBySaleId(id);

//     // Ajoutez les nouveaux items
//     for (const item of items) {
//       const product = await Product.findById(item.product_id);
//       await SaleItem.create({
//         sale_id: id,
//         product_id: item.product_id,
//         quantity: item.quantity,
//         unit_price: product.price,
//       });
      
//       // Mettez à jour le stock
//       await Product.updateStock(item.product_id, -item.quantity);
//     }

//     // Recalculez le total
//     const updatedItems = await SaleItem.findBySaleId(id);
//     const total_amount = updatedItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
//     await Sale.updateTotal(id, total_amount);

//     const sale = await Sale.findById(id);
//     res.json(sale);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// export const updatedeSale = async (req, res) => {
//   try {
//     const sale_id = req.params.id;
//     const { items } = req.body;

//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ error: 'Aucun article fourni.' });
//     }

//     // Obtenir les anciens items de la vente
//     const existingItems = await SaleItem.findBySaleId(sale_id);

//     // Supprimer les produits qui ne sont plus dans la nouvelle liste
//     const incomingProductIds = items.map(item => item.product_id);
//     for (const oldItem of existingItems) {
//       if (!incomingProductIds.includes(oldItem.product_id)) {
//         await SaleItem.deleteItem(sale_id, oldItem.product_id);
//         await Product.updateStock(oldItem.product_id, oldItem.quantity); // retour en stock
//       }
//     }

//     const updatedItems = [];

//     for (const item of items) {
//       const existing = existingItems.find(i => i.product_id === item.product_id);
//       const product = await Product.findById(item.product_id);
//       const newQty = item.quantity;
//       const unitPrice = product.price;

//       if (existing) {
//         const qtyDiff = newQty - existing.quantity;
//         await SaleItem.updatesale(sale_id, item.product_id, newQty);
//         await Product.updateStock(item.product_id, -qtyDiff);
//         updatedItems.push({ ...existing, quantity: newQty });
//       } else {
//         await SaleItem.create({
//           sale_id,
//           product_id: item.product_id,
//           quantity: newQty,
//           unit_price: unitPrice,
//         });
//         await Product.updateStock(item.product_id, -newQty);
//         updatedItems.push({ product_id: item.product_id, quantity: newQty });
//       }
//     }

//     // Recalcul du montant total
//     let total_amount = 0;
//     for (const item of updatedItems) {
//       const product = await Product.findById(item.product_id);
//       total_amount += product.price * item.quantity;
//     }

//     // Mettre à jour le total_amount de la vente
//     await Sale.updateAmount(sale_id, total_amount);

//     res.json({
//       message: 'Vente mise à jour avec succès.',
//       total_amount,
//       items: updatedItems
//     });

//   } catch (error) {
//     console.error('Erreur mise à jour vente :', error);
//     res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la vente.' });
//   }
// };


// export const confirmSale = async (req, res) => {
//   try {
//     const sale = await Sale.confirmSale(req.params.id);
    
//     // Generate invoice
//     const invoice_number = `FCT${String(sale.id).padStart(6, '0')}`;
//     const invoicePath = await generateInvoice(sale.id);
    
//     await Invoice.create({
//       sale_id: sale.id,
//       invoice_number,
//       total_amount: sale.total_amount,
//       file_path: invoicePath,
//     });

//     res.json(sale);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// export const cancelSale = async (req, res) => {
//   try {
//     const sale = await Sale.cancelSale(req.params.id);
    
//     // Return products to stock
//     const items = await SaleItem.findBySaleId(sale.id);
//     for (const item of items) {
//       if (item.status !== 'cancelled') {
//         await Product.updateStock(item.product_id, item.quantity);
//         await SaleItem.cancelItem(item.id);
//       }
//     }

//     res.json(sale);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };



// export const getSaleDetails = async (req, res) => {
//   try {
//     const sale = await Sale.findById(req.params.id);
//     if (!sale) {
//       return res.status(404).json({ error: 'Sale not found' });
//     }

//     const items = await SaleItem.findBySaleId(sale.id);
//     res.json({ sale, items });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getAllSales = async (req, res) => {
//   try {
//     const sales = await Sale.findAll();
//     res.json(sales);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// export const downloadInvoice = async (req, res) => {
//   try {
//     const saleId = req.params.id;
//     const invoicePath = await generateInvoice(saleId);

//     // Extraire juste le nom du fichier
//     const fileName = path.basename(invoicePath);

//     // ✅ Rediriger le navigateur vers le lien HTTP public
//     res.redirect(`/invoices/${fileName}`);
//   } catch (error) {
//     console.error('Erreur génération de la facture:', error);
//     res.status(500).json({ error: error.message });
//   }
// };





// import Sale from '../models/Sale.js';
// import SaleItem from '../models/SaleItem.js';
// import Product from '../models/Product.js';
// import Invoice from '../models/Invoice.js';
// import { generateInvoice } from '../services/pdfService.js';
// import fs from 'fs';
// import path from 'path';


// export const createSale = async (req, res) => {
//   try {
//     const { client_name, items, packaging_included } = req.body;
    
//     // Calculate total amount
//     let total_amount = 0;
//     for (const item of items) {
//       const product = await Product.findById(item.product_id);
//       total_amount += product.price * item.quantity;
//     }

//     // Create sale
//     const sale = await Sale.create({ client_name, total_amount, packaging_included });

//     // Create sale items
//     for (const item of items) {
//       const product = await Product.findById(item.product_id);
//       await SaleItem.create({
//         sale_id: sale.id,
//         product_id: item.product_id,
//         quantity: item.quantity,
//         unit_price: product.price,
//       });
      
//       // Update stock (temporarily reserved)
//       await Product.updateStock(item.product_id, -item.quantity);
//     }

//     res.status(201).json(sale);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };



// export const updateSaleItems = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const { items } = req.body;

//     await SaleItem.deleteBySaleId(id);

//     for (const item of items) {
//       const product = await Product.findById(item.product_id);
//       await SaleItem.create({
//         sale_id: id,
//         product_id: item.product_id,
//         quantity: item.quantity,
//         unit_price: product.price,
//       });
//       await Product.updateStock(item.product_id, -item.quantity);
//     }

//     const updatedItems = await SaleItem.findBySaleId(id);
//     const total_amount = updatedItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
//     await Sale.updateTotal(id, total_amount);

//     const sale = await Sale.findById(id);
//     res.json(sale);
//   } catch (error) {
//     console.error('Erreur updateSaleItems :', error);
//     res.status(400).json({ error: error.message });
//   }
// };


// export const updatedeSale = async (req, res) => {
//   try {
//     const sale_id = req.params.id;
//     const { items} = req.body;

//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ error: 'Aucun article fourni.' });
//     }

//     const existingItems = await SaleItem.findBySaleId(sale_id);
//     const incomingProductIds = items.map(item => item.product_id);

//     for (const oldItem of existingItems) {
//       if (!incomingProductIds.includes(oldItem.product_id)) {
//         await SaleItem.deleteItem(sale_id, oldItem.product_id);
//         await Product.updateStock(oldItem.product_id, oldItem.quantity);
//       }
//     }


    
//     let total_amount = 0;
//     const packaging_price = 3500;

//     for (const item of items) {
//       const product = await Product.findById(item.product_id);
//       total_amount += product.price * item.quantity;
//     }

//     if (packaging_included && packaging_count > 0) {
//       total_amount += packaging_count * packaging_price;
//       await Sale.updatePackaging(sale_id, packaging_count, packaging_price, true);
//     } else {
//       await Sale.updatePackaging(sale_id, 0, 0, false);
//     }

//     await Sale.updateAmount(sale_id, total_amount);

//     res.json({
//       message: 'Vente mise à jour avec succès.',
//       total_amount,
//       items: updatedItems
//     });

//   } catch (error) {
//     console.error('Erreur mise à jour vente :', error);
//     res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la vente.' });
//   }
// };


// //     let packaging_count = 0;
// //     const packaging_price = 3500;
// //     let total_amount = 0;

// //     const updatedItems = [];

// //     for (const item of items) {
// //       const existing = existingItems.find(i => i.product_id === item.product_id);
// //       const product = await Product.findById(item.product_id);
// //       const newQty = item.quantity;
// //       const unitPrice = product.price;

// //       if (['casier-12', 'casier-24'].includes(product.unit)) {
// //         packaging_count += newQty;
// //       }

// //       if (existing) {
// //         const qtyDiff = newQty - existing.quantity;
// //         await SaleItem.updateQuantity(sale_id, item.product_id, newQty);
// //         await Product.updateStock(item.product_id, -qtyDiff);
// //       } else {
// //         await SaleItem.create({
// //           sale_id,
// //           product_id: item.product_id,
// //           quantity: newQty,
// //           unit_price: unitPrice,
// //         });
// //         await Product.updateStock(item.product_id, -newQty);
// //       }

// //       updatedItems.push({ product_id: item.product_id, quantity: newQty });
// //       total_amount += unitPrice * newQty;
// //     }

// //     const sale = await Sale.findById(sale_id);

// //     if (sale.packaging_included) {
// //       total_amount += packaging_count * packaging_price;
// //       await Sale.updatePackaging(sale_id, packaging_count, packaging_price, true);
// //     }

// //     await Sale.updateAmount(sale_id, total_amount);

// //     res.json({
// //       message: 'Vente mise à jour avec succès.',
// //       total_amount,
// //       items: updatedItems
// //     });

// //   } catch (error) {
// //     console.error('Erreur mise à jour vente :', error);
// //     res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la vente.' });
// //   }
// // };

// export const confirmSale = async (req, res) => {
//   try {
//     const sale = await Sale.confirmSale(req.params.id);
//     const invoice_number = `FCT${String(sale.id).padStart(6, '0')}`;
//     const invoicePath = await generateInvoice(sale.id);

//     await Invoice.create({
//       sale_id: sale.id,
//       invoice_number,
//       total_amount: sale.total_amount,
//       file_path: invoicePath,
//     });

//     res.json(sale);
//   } catch (error) {
//     console.error('Erreur confirmSale :', error);
//     res.status(400).json({ error: error.message });
//   }
// };

// export const cancelSale = async (req, res) => {
//   try {
//     const sale = await Sale.cancelSale(req.params.id);
//     const items = await SaleItem.findBySaleId(sale.id);

//     for (const item of items) {
//       if (item.status !== 'cancelled') {
//         await Product.updateStock(item.product_id, item.quantity);
//         await SaleItem.cancelItem(item.id);
//       }
//     }

//     res.json(sale);
//   } catch (error) {
//     console.error('Erreur cancelSale :', error);
//     res.status(400).json({ error: error.message });
//   }
// };

// export const getSaleDetails = async (req, res) => {
//   try {
//     const sale = await Sale.findById(req.params.id);
//     if (!sale) {
//       return res.status(404).json({ error: 'Vente introuvable' });
//     }

//     const items = await SaleItem.findBySaleId(sale.id);
//     res.json({ sale, items });
//   } catch (error) {
//     console.error('Erreur getSaleDetails :', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getAllSales = async (req, res) => {
//   try {
//     const sales = await Sale.findAll();
//     res.json(sales);
//   } catch (error) {
//     console.error('Erreur getAllSales :', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// export const downloadInvoice = async (req, res) => {
//   try {
//     const saleId = req.params.id;
//     const invoicePath = await generateInvoice(saleId);
//     const fileName = path.basename(invoicePath);
//     res.redirect(`/invoices/${fileName}`);
//   } catch (error) {
//     console.error('Erreur downloadInvoice :', error);
//     res.status(500).json({ error: error.message });
//   }
// };



// export const getSalesStatistics = async (req, res) => {
//   try {
//     const { period = 'month', startDate, endDate } = req.query;
    
//     // Obtenir les statistiques des ventes
//     const salesStats = await Sale.getSalesStatistics(period, startDate, endDate);
    
//     // Obtenir les produits les plus vendus
//     const topProducts = await SaleItem.getTopProducts(5, startDate, endDate);
    
//     // Obtenir le chiffre d'affaires
//     const revenue = await Sale.getRevenue(startDate, endDate);
    
//     // Obtenir le nombre de ventes
//     const salesCount = await Sale.getSalesCount(startDate, endDate);
    
//     // Obtenir la valeur moyenne des ventes
//     const averageSale = await Sale.getAverageSale(startDate, endDate);
    
//     res.json({
//       salesStats,
//       topProducts,
//       revenue,
//       salesCount,
//       averageSale
//     });
//   } catch (error) {
//     console.error('Erreur getSalesStatistics :', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getRevenue = async (req, res) => {
//   try {
//     const { period = 'month', startDate, endDate } = req.query;
    
//     const revenue = await Sale.getRevenue(startDate, endDate);
//     const revenueByPeriod = await Sale.getRevenueByPeriod(period, startDate, endDate);
    
//     res.json({
//       totalRevenue: revenue,
//       revenueByPeriod
//     });
//   } catch (error) {
//     console.error('Erreur getRevenue :', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getLastFiveSales = async (req, res) => {
//   try {
//     const lastFiveSales = await Sale.findLastSales(5);
    
//     // Récupérer les détails de chaque vente
//     const salesWithDetails = await Promise.all(
//       lastFiveSales.map(async (sale) => {
//         const items = await SaleItem.findBySaleId(sale.id);
//         return {
//           ...sale,
//           items
//         };
//       })
//     );
    
//     res.json(salesWithDetails);
//   } catch (error) {
//     console.error('Erreur getLastFiveSales :', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getDashboardData = async (req, res) => {
//   try {
//     // Récupérer les 5 dernières ventes
//     const lastFiveSales = await Sale.findLastSales(5);
    
//     // Récupérer les statistiques du mois en cours
//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
//     const monthlyRevenue = await Sale.getRevenue(startOfMonth, endOfMonth);
//     const monthlySalesCount = await Sale.getSalesCount(startOfMonth, endOfMonth);
//     const monthlyAverageSale = await Sale.getAverageSale(startOfMonth, endOfMonth);
    
//     // Récupérer les produits les plus vendus du mois
//     const topMonthlyProducts = await SaleItem.getTopProducts(5, startOfMonth, endOfMonth);
    
//     res.json({
//       lastFiveSales,
//       monthlyStats: {
//         revenue: monthlyRevenue,
//         salesCount: monthlySalesCount,
//         averageSale: monthlyAverageSale
//       },
//       topMonthlyProducts
//     });
//   } catch (error) {
//     console.error('Erreur getDashboardData :', error);
//     res.status(500).json({ error: error.message });
//   }
// };




import Sale from '../models/Sale.js';
import SaleItem from '../models/SaleItem.js';
import Product from '../models/Product.js';
import Invoice from '../models/Invoice.js';
import { generateInvoice } from '../services/pdfService.js';
import fs from 'fs';
import path from 'path';


export const createSale = async (req, res) => {
  try {
    const { client_name, items, packaging_included } = req.body;
    
    // Calculate total amount
    let total_amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      total_amount += product.price * item.quantity;
    }

    // Create sale
    const sale = await Sale.create({ client_name, total_amount, packaging_included });

    // Create sale items
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      await SaleItem.create({
        sale_id: sale.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
      });
      
      // Update stock (temporarily reserved)
      await Product.updateStock(item.product_id, -item.quantity);
    }

    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSaleItems = async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    await SaleItem.deleteBySaleId(id);

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      await SaleItem.create({
        sale_id: id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
      });
      await Product.updateStock(item.product_id, -item.quantity);
    }

    const updatedItems = await SaleItem.findBySaleId(id);
    const total_amount = updatedItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    await Sale.updateTotal(id, total_amount);

    const sale = await Sale.findById(id);
    res.json(sale);
  } catch (error) {
    console.error('Erreur updateSaleItems :', error);
    res.status(400).json({ error: error.message });
  }
};





export const updatedeSale = async (req, res) => {
  try {
    const sale_id = req.params.id;
    const { items} = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Aucun article fourni.' });
    }

    const existingItems = await SaleItem.findBySaleId(sale_id);
    const incomingProductIds = items.map(item => item.product_id);

    for (const oldItem of existingItems) {
      if (!incomingProductIds.includes(oldItem.product_id)) {
        await SaleItem.deleteItem(sale_id, oldItem.product_id);
        await Product.updateStock(oldItem.product_id, oldItem.quantity);
      }
    }


    
    let total_amount = 0;
    const packaging_price = 3500;

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      total_amount += product.price * item.quantity;
    }

    if (packaging_included && packaging_count > 0) {
      total_amount += packaging_count * packaging_price;
      await Sale.updatePackaging(sale_id, packaging_count, packaging_price, true);
    } else {
      await Sale.updatePackaging(sale_id, 0, 0, false);
    }

    await Sale.updateAmount(sale_id, total_amount);

    res.json({
      message: 'Vente mise à jour avec succès.',
      total_amount,
      items: updatedItems
    });

  } catch (error) {
    console.error('Erreur mise à jour vente :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la vente.' });
  }
};




export const confirmSale = async (req, res) => {
  try {
    const sale = await Sale.confirmSale(req.params.id);
    const invoice_number = `FCT${String(sale.id).padStart(6, '0')}`;
    const invoicePath = await generateInvoice(sale.id);

    await Invoice.create({
      sale_id: sale.id,
      invoice_number,
      total_amount: sale.total_amount,
      file_path: invoicePath,
    });

    res.json(sale);
  } catch (error) {
    console.error('Erreur confirmSale :', error);
    res.status(400).json({ error: error.message });
  }
};

export const cancelSale = async (req, res) => {
  try {
    const sale = await Sale.cancelSale(req.params.id);
    const items = await SaleItem.findBySaleId(sale.id);

    for (const item of items) {
      if (item.status !== 'cancelled') {
        await Product.updateStock(item.product_id, item.quantity);
        await SaleItem.cancelItem(item.id);
      }
    }

    res.json(sale);
  } catch (error) {
    console.error('Erreur cancelSale :', error);
    res.status(400).json({ error: error.message });
  }
};

export const getSaleDetails = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: 'Vente introuvable' });
    }

    const items = await SaleItem.findBySaleId(sale.id);
    res.json({ sale, items });
  } catch (error) {
    console.error('Erreur getSaleDetails :', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll();
    res.json(sales);
  } catch (error) {
    console.error('Erreur getAllSales :', error);
    res.status(500).json({ error: error.message });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const saleId = req.params.id;
    const invoicePath = await generateInvoice(saleId);
    const fileName = path.basename(invoicePath);
    
    // Envoyer le fichier directement
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.sendFile(invoicePath);
  } catch (error) {
    console.error('Erreur downloadInvoice :', error);
    res.status(500).json({ error: error.message });
  }
};


export const getSalesStatistics = async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;
    
    // Obtenir les statistiques des ventes
    const salesStats = await Sale.getSalesStatistics(period, startDate, endDate);
    
    // Obtenir les produits les plus vendus
    const topProducts = await SaleItem.getTopProducts(5, startDate, endDate);
    
    // Obtenir le chiffre d'affaires
    const revenue = await Sale.getRevenue(startDate, endDate);
    
    // Obtenir le nombre de ventes
    const salesCount = await Sale.getSalesCount(startDate, endDate);
    
    // Obtenir la valeur moyenne des ventes
    const averageSale = await Sale.getAverageSale(startDate, endDate);
    
    res.json({
      salesStats,
      topProducts,
      revenue,
      salesCount,
      averageSale
    });
  } catch (error) {
    console.error('Erreur getSalesStatistics :', error);
    res.status(500).json({ error: error.message });
  }
};

export const getRevenue = async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;
    
    const revenue = await Sale.getRevenue(startDate, endDate);
    const revenueByPeriod = await Sale.getRevenueByPeriod(period, startDate, endDate);
    
    res.json({
      totalRevenue: revenue,
      revenueByPeriod
    });
  } catch (error) {
    console.error('Erreur getRevenue :', error);
    res.status(500).json({ error: error.message });
  }
};

export const getLastFiveSales = async (req, res) => {
  try {
    const lastFiveSales = await Sale.findLastSales(5);
    
    // Récupérer les détails de chaque vente
    const salesWithDetails = await Promise.all(
      lastFiveSales.map(async (sale) => {
        const items = await SaleItem.findBySaleId(sale.id);
        return {
          ...sale,
          items
        };
      })
    );
    
    res.json(salesWithDetails);
  } catch (error) {
    console.error('Erreur getLastFiveSales :', error);
    res.status(500).json({ error: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    // Récupérer les 5 dernières ventes
    const lastFiveSales = await Sale.findLastSales(5);
    
    // Récupérer les statistiques du mois en cours
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const monthlyRevenue = await Sale.getRevenue(startOfMonth, endOfMonth);
    const monthlySalesCount = await Sale.getSalesCount(startOfMonth, endOfMonth);
    const monthlyAverageSale = await Sale.getAverageSale(startOfMonth, endOfMonth);
    
    // Récupérer les produits les plus vendus du mois
    const topMonthlyProducts = await SaleItem.getTopProducts(5, startOfMonth, endOfMonth);
    
    res.json({
      lastFiveSales,
      monthlyStats: {
        revenue: monthlyRevenue,
        salesCount: monthlySalesCount,
        averageSale: monthlyAverageSale
      },
      topMonthlyProducts
    });
  } catch (error) {
    console.error('Erreur getDashboardData :', error);
    res.status(500).json({ error: error.message });
  }
};










// export const updatedeSale = async (req, res) => {
//   try {
//     const sale_id = req.params.id;
//     const { items} = req.body;

//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ error: 'Aucun article fourni.' });
//     }

//     const existingItems = await SaleItem.findBySaleId(sale_id);
//     const incomingProductIds = items.map(item => item.product_id);

//     for (const oldItem of existingItems) {
//       if (!incomingProductIds.includes(oldItem.product_id)) {
//         await SaleItem.deleteItem(sale_id, oldItem.product_id);
//         await Product.updateStock(oldItem.product_id, oldItem.quantity);
//       }
//     }


    
//     let total_amount = 0;
//     const packaging_price = 3500;

//     for (const item of items) {
//       const product = await Product.findById(item.product_id);
//       total_amount += product.price * item.quantity;
//     }

//     if (packaging_included && packaging_count > 0) {
//       total_amount += packaging_count * packaging_price;
//       await Sale.updatePackaging(sale_id, packaging_count, packaging_price, true);
//     } else {
//       await Sale.updatePackaging(sale_id, 0, 0, false);
//     }

//     await Sale.updateAmount(sale_id, total_amount);

//     res.json({
//       message: 'Vente mise à jour avec succès.',
//       total_amount,
//       items: updatedItems
//     });

//   } catch (error) {
//     console.error('Erreur mise à jour vente :', error);
//     res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la vente.' });
//   }
// };
