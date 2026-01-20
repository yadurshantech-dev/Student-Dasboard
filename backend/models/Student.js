const mongoose = require('mongoose');

const studentSchema = mongoose.Schema(
    {
        index: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        school: {
            type: String,
            required: true,
        },
        badge: {
            type: String,
            required: true,
        },
        grade: {
            type: String,
            required: true,
        },
        examType: {
            type: String, // 'OL' or 'AL'
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        marks: [
            {
                term: String,
                subject: String,
                score: Number,
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        feeStatus: {
            type: String, // 'PAID', 'UNPAID'
            default: 'UNPAID',
        },
        lastPaidMonth: {
            type: Number, // 0-11 (Month index)
            required: false,
        },
        email: {
            type: String,
            required: false
        },
        aboutMe: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Student', studentSchema);
