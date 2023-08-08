// const { errorHandler } = require('../middleware/errrorHandler');
const generateToken = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateId = require("../utils/validateMongoId");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./mailCtrl");

// create a user
const createUser = asyncHandler(async (req, res) => {
  const user = req.body.email;
  const findUser = await User.findOne({ email: user });
  console.log(req.body);
  if (!findUser) {
    // create user
    const newUser = await User.create(req.body);
    // console.log(req.body);
    res.json(newUser);
    // res.send(req.body)
  } else {
    // user already exist
    // res.json({
    //     message:"User Already Exist",
    //     success: false
    // })
    throw new Error("User already exist");
  }
});

// user Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log({email, password});
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    // set cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    res.status(400).json({ message: "Invalid Credentials!" });
    throw new Error("Invalid Credentials!");
  }
});

// handle cookie
const handleCookie = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log(cookie);
  if (!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  // find user
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh Token in db or Not Matched");
  // res.send(user)
  jwt.verify(refreshToken, process.env.JWT, (err, decode) => {
    if (err || user.id !== decode.id) {
      throw new Error("There is something went wromg with refresh token");
    }
    const accessToekn = generateToken(user?._id);
    res.json({ accessToekn });
  });
});

// logout a user
const logOut = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log(cookie);
  if (!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
  const { refreshToken } = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  console.log(user);
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbiden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

// update a user
const updateUser = asyncHandler(async (req, res) => {
  let { _id } = req.user;
  validateId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

// get all users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find();
    res.status(200).json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// get single user
const getUser = asyncHandler(async (req, res) => {
  let { id } = req.params;
  validateId(id);
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: "User not found",
    });
    throw new Error(error);
  }
});

// delete single user
const deleteUser = asyncHandler(async (req, res) => {
  let { id } = req.params;
  validateId(id);
  try {
    const deluser = await User.findByIdAndDelete(id);
    res.status(200).json(deluser);
  } catch (error) {
    res.status(400).json({
      message: "User not found",
    });
    throw new Error(error);
  }
});

// block user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "User Blocked Successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// unblock user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User is Unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// change password
const changePassword = asyncHandler(async (req, res) => {
  console.log("user=>", req.user);
  const { _id } = req.user;
  const { password } = req.body;
  validateId(_id);
  const user = await User.findById(_id);
  if (password) {
    console.log(user.password);
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
  // console.log(user);
});

// forget password
const forgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found with this email");
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const generateUrl = `
    Hi, Please follow this link to forget your password. This link valid for 10 mins <br> <br>
    <b><a href='http://localhost:5000/api/user/reset-password/${token}'>Click here</a></b>
    `;
    const data = {
      to: email,
      subject: " Password Forget Link",
      text: "Hey User, ",
      html: generateUrl,
    };
    sendEmail(data);
    res.send(token);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleCookie,
  logOut,
  changePassword,
  forgetPasswordToken,
};
