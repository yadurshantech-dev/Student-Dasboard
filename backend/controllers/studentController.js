const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');

// @desc    Get student profile by Index Number
// @route   POST /api/student/login 
// @access  Public
const getStudentProfile = asyncHandler(async (req, res) => {
    const { index } = req.body;

    const student = await Student.findOne({ index });

    if (student) {
        res.json({
            _id: student._id,
            index: student.index,
            name: student.name,
            school: student.school,
            badge: student.badge,
            grade: student.grade,
            examType: student.examType,
            marks: student.marks, // Only showing marks, details hidden by frontend if needed or filter here
            feeStatus: student.feeStatus,
            email: student.email,
            aboutMe: student.aboutMe
        });
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Update student profile (Email, About Me)
// @route   PUT /api/student/:id
// @access  Public (protected by simple logic for now)
const updateStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (student) {
        student.email = req.body.email || student.email;
        student.aboutMe = req.body.aboutMe || student.aboutMe;

        const updatedStudent = await student.save();

        res.json({
            _id: updatedStudent._id,
            index: updatedStudent.index,
            name: updatedStudent.name,
            school: updatedStudent.school,
            badge: updatedStudent.badge,
            grade: updatedStudent.grade,
            examType: updatedStudent.examType,
            marks: updatedStudent.marks,
            feeStatus: updatedStudent.feeStatus,
            email: updatedStudent.email,
            aboutMe: updatedStudent.aboutMe
        });
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

module.exports = { getStudentProfile, updateStudentProfile };
