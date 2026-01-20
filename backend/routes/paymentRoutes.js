const express = require('express');
const router = express.Router();
const { payFee } = require('../controllers/paymentController');

router.post('/pay', payFee);

module.exports = router;
