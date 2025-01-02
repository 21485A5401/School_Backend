const AysncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const Admin = require("../../model/Staff/Admin");
const generateToken = require("../../utils/generateToken");
const verifyToken = require("../../utils/verifyToken");
const { hashPassword, isPassMatched } = require("../../utils/helpers");

//@desc Register admin
//@route POST /api/admins/register
//@acess  Private
exports.registerAdmCtrl = AysncHandler(async (req, res) => {
  const { name, email, address, phonenumber, password } = req.body;
  //Check if email exists
  const adminFound = await Admin.findOne({ email });
  if (adminFound) {
    return res.status(400).json({ status: 'false', message: "Admin Already Exist" });
  }

  //register
  const user = await Admin.create({
    name,
    email,
    address,
    phonenumber,
    password: await hashPassword(password),
    createdBy: req?.userAuth?._id
  });
  res.status(201).json({
    status: "success",
    data: user,
    message: "Admin registered successfully",
  });
});

exports.updateAdmCtrl = AysncHandler(async (req, res) => {
  const { name, email, address, phonenumber } = req.body;
  const adminId = req.query.id;
  //Check if email exists
  console.log(adminId);

  const adminFound = await Admin.findOne({ _id: adminId });
  if (!adminFound) {
    return res.status(400).json({ status: 'false', message: "Admin Not Found" });
  }

  adminFound.name = name || adminFound.name;
  adminFound.email = email || adminFound.email;
  adminFound.address = address || adminFound.address;
  adminFound.phonenumber = phonenumber || adminFound.phonenumber;
  adminFound.save();
  //register
  // const user = await Admin.findByIdAndUpdate({ adminId }, {
  //   name,
  //   email,
  //   address,
  //   phonenumber,
  // }, { new: true });
  res.status(200).json({
    success: true,
    data: adminFound,
    message: "Admin Updated successfully",
  });
});

exports.updateToagleAdmCtrl = AysncHandler(async (req, res) => {
  const adminId = req.query.id;
  //Check if email exists
  const adminFound = await Admin.findOne({ _id: adminId });
  if (!adminFound) {
    return res.status(400).json({ status: 'false', message: "Admin Not Found" });
  }

  adminFound.status = !adminFound.status;
  adminFound.save();
  //register
  // const user = await Admin.findByIdAndUpdate({ adminId }, {
  //   name,
  //   email,
  //   address,
  //   phonenumber,
  // }, { new: true });
  res.status(200).json({
    success: true,
    data: adminFound,
    message: "Admin status Updated successfully",
  });
});

//@desc     login admins
//@route    POST /api/v1/admins/login
//@access   Private
exports.loginAdminCtrl = AysncHandler(async (req, res) => {
  const { email, password } = req.body;
  //find user
  const user = await Admin.findOne({ email });
  if (!user) {
    return res.json({ success: false, message: "Invalid login crendentials" });
  }
  if (user.status === false) {
    return res.json({ success: false, message: "Admin is Inactive, Please Contact SuperAdmin" });
  }
  //verify password
  const isMatched = await isPassMatched(password, user.password);

  if (!isMatched) {
    return res.status(400).json({ success: false, message: "Invalid login crendentials" });
  } else {
    return res.json({
      data: generateToken(user._id),
      message: "Admin logged in successfully",
      Role: user.role,
      success: true
    });
  }
});

//@desc     Get all admins
//@route    GET /api/v1/admins
//@access   Private

exports.getAdminsCtrl = AysncHandler(async (req, res) => {
  const schooladmin = req?.userAuth?._id;
  // if(schooladmin){
  //   return res.status(200).json({success:"fai"})
  // }
  const admins = await Admin.find();
  const filteredAdmins = admins.filter(admin => admin.createdBy.toString() === schooladmin.toString());
  if (filteredAdmins.length > 0) {
    res.status(200).json({
      status: "success",
      message: "Admins fetched successfully",
      data: filteredAdmins,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "No admins found for the school",
      data: ["There is No Admin"],
    });
  }
});
//@desc     Get single admin
//@route    GET /api/v1/admins/:id
//@access   Private

exports.getAdminProfileCtrl = AysncHandler(async (req, res) => {
  const admin = await Admin.findById(req.userAuth._id)
    .select("-password -createdAt -updatedAt")
    .populate("academicYears");
  if (!admin) {
    throw new Error("Admin Not Found");
  } else {
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin Profile fetched  successfully",
    });
  }
});
// getting Admin Details from params single Admin
exports.getAdminDeatails = AysncHandler(async (req, res) => {
  const adminId = req.params.adminId;
  //find the teacher
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new Error("Admin not found");
  }
  res.status(200).json({
    status: "success",
    message: "Admin fetched successfully",
    data: admin,
  });
});

//@desc    update admin
//@route    UPDATE /api/v1/admins/:id
//@access   Private
exports.updateAdminCtrl = AysncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  //if email is taken
  const emailExist = await Admin.findOne({ email });
  if (emailExist) {
    throw new Error("This email is taken/exist");
  }

  //hash password
  //check if user is updating password

  if (password) {
    //update
    const admin = await Admin.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await hashPassword(password),
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin updated successfully",
    });
  } else {
    //update
    const admin = await Admin.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: admin,
      message: "Admin updated successfully",
    });
  }
});

//@desc     Delete admin
//@route    DELETE /api/v1/admins/:id
//@access   Private
exports.deleteAdminCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: "delete admin",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//@desc     admin suspends a teacher
//@route    PUT /api/v1/admins/suspend/teacher/:id
//@access   Private

exports.adminSuspendTeacherCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: " admin suspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};
//@desc     admin unsuspends a teacher
//@route    PUT /api/v1/admins/unsuspend/teacher/:id
//@access   Private
exports.adminUnSuspendTeacherCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: " admin Unsuspend teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};
//@desc     admin withdraws a teacher
//@route    PUT /api/v1/admins/withdraw/teacher/:id
//@access   Private
exports.adminWithdrawTeacherCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: " admin withdraw teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};
//@desc     admin Unwithdraws a teacher
//@route    PUT /api/v1/admins/withdraw/teacher/:id
//@access   Private
exports.adminUnWithdrawTeacherCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: " admin Unwithdraw teacher",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};
//@desc     admin publich exam result
//@route    PUT /api/v1/admins/publish/exam/:id
//@access   Private
exports.adminPublishResultsCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: " admin publish exam",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};

//@desc     admin unpublish exam result
//@route    PUT /api/v1/admins/unpublish/exam/:id
//@access   Private
exports.adminUnPublishResultsCtrl = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      data: " admin unpublish exam",
    });
  } catch (error) {
    res.json({
      status: "failed",
      error: error.message,
    });
  }
};
