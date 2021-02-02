const User = require("../model/User");
exports.isAdmin = (req, res, next) => {
  if (req.user.role.toLowerCase() === "admin") {
    next();
  } else {
    res.status(300).json({ err: "Unauthorize" });
  }
};
