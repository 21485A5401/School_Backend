const mongoose = require('mongoose');

const MessagesSchema = new mongoose.Schema(
    {
        textMessage: {
            type: String,
            required: true,
        },
        count: {
            type: String,
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

module.exports = mongoose.model('Messages', MessagesSchema);

