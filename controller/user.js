const { changePassword } = require("./helper/auth");
const {
  userDetails,
  followUser,
  uploadProfilePicture,
} = require("./helper/user");

const { sendMail } = require("../utility/sendMail");

const { block } = require("../controller/blockuser");

const User = require("../model/User");
console.log("yes");

exports.updateProfile = async (req, res) => {
  userId = req.body.userId;

  if (userId == req.user._id || req.user.role.toLowerCase() == "admin") {
    try {
      const userId = req.user._id;
      let user = await User.findById(userId);
      if (user.role.toLowerCase() == "business") {
        user.name = req.body.name;
      } else {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.aboutMe = req.body.aboutMe;
        user.gender = req.body.gender;
        user.workAt = req.body.workAt;
      }
      user.phoneNo = req.body.phoneNo;
      user.country = req.body.country;
      user.city = req.body.city;
      await user.save();

      res.redirect("/api/auth/me");
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: "Internal server error" });
    }
  } else {
    res.status(400).json({ err: "Unauthorize" });
  }
};

exports.changePassword = (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const email = req.body.email;
  if (email === req.user.email)
    changePassword(email, oldPassword, newPassword, (err, user) => {
      if (!err) {
        res.json({ success: "success" });
      } else if (err === "PasswordNotMatch") {
        res.status(400).json({ err: "Password Not Match" });
      } else if (err == "notExists")
        res.status(400).json({ err: "Email not exists" });
      else res.status(500).json({ err: "Server Error" });
    });
  else res.status(400).json({ err: "Email address is not valid" });
};

exports.me = (req, res) => {
  const userId = req.user._id;
  userDetails(userId, (err, user) => {
    if (!err) res.json(user);
    else res.status(500).json({ err: "Internal server Error" });
  });
};

exports.followUserAccount = (req, res) => {
  targetUser = req.params.userId;
  userId = req.user._id;
  let follow = req.query.follow ? req.query.follow : "true";
  if (follow == "true") {
    follow = true;
  } else {
    follow = false;
  }
  console.log(follow);

  followUser(targetUser, userId, follow, (err, succ) => {
    console.log(succ);
    if (err && err == "AlreadyFollowed") {
      res.json({ err: "Already Followed" });
    } else if (err && err == "notFollowing") {
      res.json({ err: "Not following" });
    } else if (err) {
      res.status(500).json({ err: "Server Error" });
    } else if (succ == "unFollowed") {
      res.json({ success: "Successfully unFollowed" });
    } else {
      res.json({ success: "Successfully Followed" });
    }
  });
};

exports.profilePic = (req, res) => {
  const userId = req.body.userId;
  const pic = req.body.profile;
  uploadProfilePicture(userId, pic, (err, success) => {
    if (err && err == "notExists") {
      res.json({ err: "User not Exists" });
    } else if (err) {
      res.status(500).json({ err: "Internal Server Error" });
    } else {
      res.json({ success: "Success" });
    }
  });
};

exports.sendMail = async (req, res) => {
  const { body, subject, to } = req.body;
  try {
    await sendMail(to, subject, body);
    res.json({ success: "successfully sent mail" });
  } catch {
    res.json({ err: "Unable to send mail" });
  }
};

exports.blockUser = async (req, res) => {
  let isBlock = true;
  isBlock = req.query.block == "true" ? true : false;
  const loggedUser = req.user._id;
  const targetUser = req.params.userId;
  block(loggedUser, targetUser, isBlock, (err, success) => {
    if (success) res.json({ success: "success" });
    else if (err && err == "already blocked")
      res.json({ err: "Already blocked" });
    else if (err && err == "User Not found")
      res.json({ err: "Already blocked" });
    else if (err && err == "Admin User") res.json({ err: "User not valid" });
    else if (err && err == "blocked user not found")
      res.json({ err: "User not found" });
    else if (err && err == "Not blocked") res.json({ err: "Not blocked" });
    else if (err) res.status(500).json({ err: "Something went wrong" });
  });
};

exports.listBlock = (req, res) => {
  User.findById(req.user._id)
    .populate({
      path: "blocked",
      select: "name email firstName lastName photo",
    })
    .then((user) => {
      res.json(user.blocked);
    });
};
