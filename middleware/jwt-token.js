const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../model/User");

module.exports = async (req, res, next) => {
  // get auth header value
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    //   split at the space

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, keys.JWT, async (err, authData) => {
      if (err) {
        return res.status(403).json({ error: "forbidden" });
      }
      try {
        const user = await User.findById(authData._id);
        req.user = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          photo: user.photo,
          blocked: user.blocked,
        };
        next();
      } catch (err) {
        return res.status(403).json({ error: "forbidden" });
      }
    });
  } else {
    // forbiddon
    res.status(403).json({
      error: "Invalid",
    });
  }
};
