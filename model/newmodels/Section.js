const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "newStudent",
            },
        ]
    },
    {
        timestamps: true
    }
)

const Section = mongoose.model('newSection', SectionSchema);

module.exports = Section;

