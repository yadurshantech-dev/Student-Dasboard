const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const Student = require('../models/Student');

// @desc    Auth or Register Admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body;

    // Password check removed: any mobile number is allowed
    // if (password !== '1234') {
    //     res.status(401);
    //     throw new Error('Invalid password');
    // }

    let admin = await Admin.findOne({ mobile });

    if (!admin) {
        admin = await Admin.create({ mobile });
    }

    // Return a mock token for the frontend to store
    res.json({
        _id: admin._id,
        mobile: admin.mobile,
        token: '1234-admin-token',
    });
});

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private
const getStudents = asyncHandler(async (req, res) => {
    const students = await Student.find({});
    res.json(students);
});

// @desc    Create a student
// @route   POST /api/admin/students
// @access  Private
const createStudent = asyncHandler(async (req, res) => {
    const { index, name, school, badge, grade, examType, description } = req.body;

    const studentExists = await Student.findOne({ index });

    if (studentExists) {
        res.status(400);
        throw new Error('Student already exists');
    }

    const student = await Student.create({
        index,
        name,
        school,
        badge,
        grade,
        examType,
        description,
        feeStatus: 'UNPAID'
    });

    if (student) {
        res.status(201).json(student);
    } else {
        res.status(400);
        throw new Error('Invalid student data');
    }
});

// @desc    Update a student
// @route   PUT /api/admin/students/:id
// @access  Private
const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (student) {
        student.name = req.body.name || student.name;
        student.school = req.body.school || student.school;
        student.badge = req.body.badge || student.badge;
        student.grade = req.body.grade || student.grade;
        student.examType = req.body.examType || student.examType;
        student.description = req.body.description || student.description;

        // Can also manually update marks or fee status here if needed

        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Delete a student
// @route   DELETE /api/admin/students/:id
// @access  Private
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (student) {
        await student.deleteOne();
        res.json({ message: 'Student removed' });
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Manually toggle fee status
// @route   PUT /api/admin/students/:id/fee
// @access  Private
const toggleFeeStatus = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (student) {
        student.feeStatus = req.body.feeStatus; // PAID or UNPAID
        if (student.feeStatus === 'PAID') {
            student.lastPaidMonth = new Date().getMonth();
        }
        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Add a mark for a student
// @route   POST /api/admin/students/:id/marks
// @access  Private
const addStudentMark = asyncHandler(async (req, res) => {
    const { term, subject, score } = req.body;
    const student = await Student.findById(req.params.id);

    if (student) {
        const newMark = {
            term,
            subject,
            score: Number(score)
        };

        student.marks.push(newMark);
        await student.save();

        res.status(201).json(student.marks);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

module.exports = {
    loginAdmin,
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    toggleFeeStatus,
    addStudentMark
};
