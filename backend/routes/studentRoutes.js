const express = require('express');
const router = express.Router();
const { getStudentProfile, updateStudentProfile } = require('../controllers/studentController');

router.post('/login', getStudentProfile);
router.put('/:id', updateStudentProfile);

module.exports = router;
