// Mock implementation of SMSM Payment Gateway

const processPayment = async (amount, currency = 'LKR') => {
    // Simulate API delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const isSuccess = Math.random() > 0.1; // 90% success rate
            if (isSuccess) {
                resolve({
                    success: true,
                    transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    amount,
                    currency,
                    message: 'Payment processed successfully via SMSM'
                });
            } else {
                resolve({
                    success: false,
                    message: 'Payment failed due to mock bank rejection'
                });
            }
        }, 1500);
    });
};

module.exports = { processPayment };
