const express = require('express');
const { createReturn, listReturns } = require('../controllers/returnController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);
router.post('/', createReturn);
router.get('/', listReturns);

module.exports = router;
