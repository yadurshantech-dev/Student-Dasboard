const Student = require('../models/Student');

const checkAndResetFees = async () => {
    const currentMonth = new Date().getMonth(); // 0-11

    // Find all students whose lastPaidMonth is NOT the current month
    // And whose feeStatus is PAID.
    // We want to reset them to UNPAID if the month has changed.

    try {
        const result = await Student.updateMany(
            {
                lastPaidMonth: { $ne: currentMonth },
                feeStatus: 'PAID'
            },
            {
                $set: { feeStatus: 'UNPAID' }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`Monthly Fee Reset: Reset status for ${result.modifiedCount} students.`);
        }
    } catch (error) {
        console.error('Error resetting monthly fees:', error);
    }
};

module.exports = checkAndResetFees;
