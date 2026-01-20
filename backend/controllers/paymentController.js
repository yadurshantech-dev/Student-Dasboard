const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const { processPayment } = require('../services/smsmService');

// @desc    Pay Fee
// @route   POST /api/payment/pay
// @access  Public (Student)
const payFee = asyncHandler(async (req, res) => {
    const { index, amount } = req.body;

    const student = await Student.findOne({ index });

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Call mock payment gateway
    const paymentResult = await processPayment(amount);

    if (paymentResult.success) {
        student.feeStatus = 'PAID';
        student.lastPaidMonth = new Date().getMonth();
        await student.save();

        res.json({
            success: true,
            message: 'Payment Successful',
            transactionId: paymentResult.transactionId,
            student: {
                index: student.index,
                feeStatus: student.feeStatus
            }
        });
    } else {
        res.status(400);
        throw new Error(paymentResult.message);
    }
});

module.exports = { payFee };
