const express = require('express');
const isAdmin = require("../middlewares/isAdmin");
const isLogin = require("../middlewares/isLogin");
const { addClasses, getClasses, updateClasses, addSection, getSection, updateSection, addStudent, getStudents, getClassById, getSectionbyId } = require("../controller/newcontrollers/newApis");
const newRouter = express.Router();

newRouter.post("/addClass", isLogin, isAdmin, addClasses);
newRouter.get("/getClasses", isLogin, isAdmin, getClasses);
newRouter.get("/getClassbyId", isLogin, isAdmin, getClassById);
newRouter.put("/updateClasses", isLogin, isAdmin, updateClasses);


newRouter.post("/addSection", isLogin, isAdmin, addSection);
newRouter.get("/getSection", isLogin, isAdmin, getSection);
newRouter.get("/getSectionbyId", isLogin, isAdmin, getSectionbyId);
newRouter.put("/updateSection", isLogin, isAdmin, updateSection);


newRouter.post("/addStudent", isLogin, isAdmin, addStudent);
newRouter.get("/getStudents", isLogin, isAdmin, getStudents);

module.exports = newRouter;