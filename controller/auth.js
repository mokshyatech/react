const {
  comparePassword,
  createUser,
  validateUser,
} = require("../utility/authencation");
const jwt = require("jsonwebtoken");
const { validationResult, body } = require("express-validator");
const keys = require("../config/keys");
const { deleteUser, listUser } = require("./helper/auth");
const { sendMail } = require("../utility/sendMail");
const otpGenerator = require("otp-generator");
const Otp = require("../model/Otp");
const bcript = require("bcryptjs");

const User = require("../model/User");

exports.login = (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const email = req.body.email;
    const password = req.body.password;
    comparePassword(email, password, (err, user) => {
      if (err) {
        if (err === "notExists") {
          res.json({
            err: "User with this email dosen't exists",
          });
        } else {
          res.status(500).json({ err: "Server Error" });
        }
      } else {
        if (user) {
          if (user.verified === false) {
            res.status(400).json({ err: "Your account is not verified" });
          } else
            jwt.sign(
              {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                role: user.role,
                photo: user.photo,
                role: user.role,
              },
              keys.JWT,
              (err, token) => {
                if (!err) {
                  return res.json({
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    gender: user.gender,
                    photo: user.photo,
                    role: user.role,
                    token: token,
                  });
                }
                return res.status(500).json({ err: "Something went wrong" });
              }
            );
        } else {
          res.json({ err: "Email or password is not correct" });
        }
      }
    });
  } else {
    res.status(300).json({ err: errors.array() });
  }
};

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const userDetails = {
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      phoneNo: req.body.phoneNo,
      country: req.body.country,
      city: req.body.city,
      photo: req.body.photo,
      phoneNo: req.body.phoneNo,
      country: req.body.address,
      city: req.body.city,
    };
    if (req.body.role.toLowerCase() == "business") {
      console.log(req.body.name);
      userDetails["name"] = req.body.name;
    } else {
      userDetails.dateOfBirth = req.body.dateOfBirth;
      userDetails.gender = req.body.gender;
      userDetails.lastName = req.body.lastName;
      userDetails.firstName = req.body.firstName;
    }
    createUser(userDetails, (err, user) => {
      if (user) {
        verification(req, user, (err, token) => {
          if (!err) {
            res.status(200).json({
              success: "Successfully created user",
              message: "mail has been sent to your address",
            });
          } else {
            res.status(500).json({ err: "Unable to send verification  email" });
          }
        });
      } else if (err === "exists") {
        res.status(300).json({
          err: [
            {
              msg: "Email already exists",
              param: "email",
            },
          ],
        });
      } else {
        res.status(500).json({ err: "Internal Server error" });
      }
    });
  } else {
    res.status(300).json({ err: errors.array() });
  }
};

exports.deleteUser = (req, res) => {
  const requestedUser = req.user;
  const userId = req.params.userId;
  if (
    requestedUser.role.toLowerCase() == "admin" ||
    requestedUser._id == userId
  ) {
    deleteUser(userId, (err, succ) => {
      if (err && err == "notExists") {
        res.status(400).json({ err: "User Not exists" });
      } else if (err && err == "isAdmin") {
        res.status(400).json({ err: "Is Admin" });
      } else if (err) {
        console.log(err);
        res.status(500).json({ err: "Internal Server error" });
      } else {
        res.json({ success: "Success" });
      }
    });
  } else {
    res.status(403).json({ err: "unauthorize" });
  }
};

exports.getUser = (req, res) => {
  listUser((err, user) => {
    if (!err) res.json(user);
    else res.status(500).json({ err: "internal server error" });
  });
};

verification = (req, user, cb) => {
  jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      role: user.role,
      photo: user.photo,
    },
    keys.JWT_VERIFICATION,
    async (err, token) => {
      if (err) {
        cb(err);
        return;
      }
      host = req.headers.host;
      const subject = "Verify your email";
      const body = `
      <h1> Someone has requested to sign in from this email</h1>
      <h3>Click link below to verify account </h3>
      ${host}/${token}
      `;
      const mail = await sendMail(user.email, subject, body).catch((err) => {
        cb(err);
        return;
      });
      cb(null, "success");
    }
  );
};

const signOTP = async (user, cb) => {
  otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
  Otp.findOne({ userId: user._id })
    .then(async (otpData) => {
      // console.log(user);
      if (otpData) {
        otpData.otp = otp;
        await otpData.save();
      } else {
        console.log("else");
        otpData = new Otp({
          userId: user._id,
          otp: otp,
        });
        await otpData.save();
      }
      const subject = "Verify user";
      const body = `
    <h1>Someone has request to change password</h1>
    <h3>Use this OTP if you are requesting password change</h3>
    <b>${otp}</b>
  `;
      const mail = await sendMail(user.email, subject, body).catch((err) => {
        cb(err);
        return;
      });
      cb(null, "success");
    })
    .catch((err) => cb(err));
};

exports.verifyUser = (req, res) => {
  const token = req.params.token;
  console.log(token);
  jwt.verify(token, keys.JWT_VERIFICATION, (err, data) => {
    if (!err) {
      const userId = data._id;
      validateUser(userId, (err, user) => {
        if (!err) {
          res.send(`
          <h1> Hello ${user.firstName}</h1>
          <p>Successfully verified your account</p>
          `);
        }
        if (err == "notExists") {
          res.send("Requested USer is not found");
        } else {
          res.send("unexpected Error");
        }
      });
    } else {
      res.send("Unexpected Error");
    }
  });
};

exports.resetPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email, deleted: false })
    .then((user) => {
      if (user) {
        signOTP(user, (err, success) => {
          if (err) {
            console.log(err);
            res.json("unable to send email");
          } else {
            res.json({ success: "success" });
          }
        });
      } else {
        res.json({ err: "Email Address not Exists" });
      }
    })
    .catch((err) => res.status(500).json({ err: "internal server Error" }));
};

exports.verifyOTP = (req, res) => {
  const { pin } = req.params;
  // console.log()
  Otp.findOne({ otp: pin })
    .populate("userId")
    .then((otp) => {
      console.log(otp);
      if (otp) {
        jwt.sign(
          {
            _id: otp.userId._id,
            message: "reset password",
          },
          keys.JWT_VERIFICATION,
          (err, token) => {
            if (!err) {
              res.json({ token: token });
            } else {
              res.status(500).json("Something went wrong");
            }
          }
        );
      } else {
        res.status(400).json("not valid");
      }
    });
};

exports.verifyToken = (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  jwt.verify(token, keys.JWT_VERIFICATION, (err, authData) => {
    if (err) {
      res.status(500).json("Something went wrong with token");
    } else {
      userId = authData._id;

      User.findById(userId)
        .then((user) => {
          if (user) {
            bcript.hash(password, 12, async (err, hashPassword) => {
              if (!err) {
                user.password = hashPassword;
                await user.save();
                res.json("Success");
              } else {
                res.status(500).json("something went wrong");
              }
            });
          } else {
            res.status(400).json("Invalid Token");
          }
        })
        .catch((err) => res.status(500).json("Something went wrong"));
    }
  });
};
