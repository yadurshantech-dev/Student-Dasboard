const express = require('express');
const router = express.Router();
const {
    loginAdmin,
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    toggleFeeStatus,
    addStudentMark
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.route('/students').get(protect, getStudents).post(protect, createStudent);
router
    .route('/students/:id')
    .put(protect, updateStudent)
    .delete(protect, deleteStudent);
router.put('/students/:id/fee', protect, toggleFeeStatus);
router.post('/students/:id/marks', protect, addStudentMark);

module.exports = router;
