const express = require("express");
const {
    sendMessage,
} = require("../../controller/academics/Campaign.js");
const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");
const campaignRouter = express.Router();

// academicTerRouter.post("/", isLogin, isAdmin, createAcademicYear);
// academicTerRouter.get("/", isLogin, isAdmin, getAcademicYears);

campaignRouter.post("/sendMessage",
    // isLogin,
    // isAdmin,
    sendMessage);

module.exports = campaignRouter;