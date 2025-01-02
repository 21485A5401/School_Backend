const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        rollno: {
            type: String,
        },
        fatherName: {
            type: String,
        },
        whatsappNumber: {
            type: String,
        },
        gender:{
            type:String,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "newClasses",
            required: true,
        },
        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "newSection",
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    {
        timestamps: true
    }
)

const newStudent = mongoose.model('newStudent', StudentSchema);

module.exports = newStudent;

