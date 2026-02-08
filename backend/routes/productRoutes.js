import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct, 
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
// router.get('/rupture', ruptureStock);
// router.get('/epuise', stockEpuise);

export default router;