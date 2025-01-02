const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolAdmin",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: false
    },
    phonenumber: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

//model
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
