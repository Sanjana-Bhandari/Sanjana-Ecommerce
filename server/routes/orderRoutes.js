const express = require('express');
const c = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, c.createOrder);
router.get('/', protect, adminOnly, c.listOrders);
router.get('/mine', protect, c.myOrders); // must stay above '/:id'
router.get('/:id', protect, c.getOrder);
router.post('/:id/pay', protect, c.initPayment);
router.post('/:id/verify-payment', protect, c.verifyPayment);
router.post('/:id/demo-pay', protect, c.demoPay);
router.patch('/:id/status', protect, adminOnly, c.updateStatus);

module.exports = router;
