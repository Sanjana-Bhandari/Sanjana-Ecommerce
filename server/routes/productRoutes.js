const express = require('express');
const c = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', c.listProducts);
router.get('/:id', c.getProduct);
router.post('/', protect, adminOnly, c.createProduct);
router.put('/:id', protect, adminOnly, c.updateProduct);
router.delete('/:id', protect, adminOnly, c.deleteProduct);

module.exports = router;
