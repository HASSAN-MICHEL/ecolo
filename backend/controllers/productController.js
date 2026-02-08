import Product from '../models/Product.js';
import pool from '../config/bb.js';

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.update(req.params.id, req.body);
//     res.json(product);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };



// export const updateProduct = async (req, res) => {
//   try {
//     const { product, oldStock, newStock, stockDifference } = await Product.update(req.params.id, req.body);
    
//     // Si le stock a été augmenté, mettre à jour le rapport de stock
//     if (stockDifference > 0) {
//       // Ici vous pouvez logger l'augmentation ou la traiter dans vos rapports
//       console.log(`Stock augmenté pour le produit ${product.id}: +${stockDifference} unités`);
//     }
    
//     res.json(product);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


export const updateProduct = async (req, res) => {
  try {
    // Récupérer l'ancien produit AVANT la mise à jour
    const oldProduct = await Product.findById(req.params.id);
    const oldStock = oldProduct ? oldProduct.stock : 0;
    const newStock = req.body.stock;
    const stockDifference = newStock - oldStock;

    console.log(`Ancien stock: ${oldStock}, Nouveau stock: ${newStock}, Différence: ${stockDifference}`);

    // Mettre à jour le produit
    const product = await Product.update(req.params.id, req.body);

    // Enregistrer le changement si différence (seulement après la mise à jour réussie)
    if (stockDifference !== 0) {
      try {
        const auditQuery = `
          INSERT INTO product_stock_changes (product_id, old_stock, new_stock, change_date)
          VALUES ($1, $2, $3, $4)
        `;
        await pool.query(auditQuery, [
          req.params.id, 
          oldStock, 
          newStock, 
          new Date().toISOString().split('T')[0] // Date du jour
        ]);
        
        console.log(`✅ Stock changé enregistré pour le produit ${req.params.id}: ${stockDifference > 0 ? '+' : ''}${stockDifference} unités`);
      } catch (auditError) {
        console.error('❌ Erreur lors de l\'enregistrement de l\'audit:', auditError);
      }
    }
    
    res.json(product);
  } catch (error) {
    console.error('❌ Erreur dans updateProduct:', error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const ruptureStock = async (req, res) => { 
//   try {
//     const product = await Product.rupture(req.params.id);
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   } 
// };

// export const stockEpuise = async (req, res) => { 
//   try {
//     const product = await Product.stock_epuise(req.params.id);
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   } 
// };