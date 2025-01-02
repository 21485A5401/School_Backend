const mongoose = require("mongoose");

const { Schema } = mongoose;

const ClassSchema = new Schema(
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
    sections: [
      {
        type: Schema.Types.ObjectId,
        ref: "newSection",
      },
    ],
  },
  { timestamps: true }
);

const Classes = mongoose.model("newClasses", ClassSchema);

module.exports = Classes;
