const express = require("express");
const router = express.Router();
const jwtToken = require("../middleware/jwt-token");

const {
  loginValidation,
  signUpValidation,
  signUpValidationBusiness,
  changeProfileValidation,
} = require("../validator/authencation-validation");
const { me, updateProfile, changePassword } = require("../controller/user");
const {
  login,
  signup,
  deleteUser,
  resetPassword,
  verifyOTP,
  verifyToken,
} = require("../controller/auth");

router.post("/login", loginValidation, login);
router.post("/signup", signUpValidation, signup);
router.post("/signup-business", signUpValidationBusiness, signup);
router.get("/me", jwtToken, me);
router.put("/me", jwtToken, changeProfileValidation, updateProfile);
router.put("/change-password", jwtToken, changePassword);
// delete user
router.post("/reset-password", resetPassword);
router.get("/reset-password/:pin", verifyOTP);
router.post("/reset-password/:token", verifyToken);

router.delete("/delete-user/:userId", jwtToken, deleteUser);
// router.delete("/deactivate");
module.exports = router;
