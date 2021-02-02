// admin controller
// only admin can acess this controller

const { listUsers, userDetails } = require("./helper/user");
const { deleteUser, resetPassword } = require("./helper/admin");
exports.deleteUser = (req, res) => deleteUser(req.params.userId);
exports.resetPassword = (req, res) => resetPassword(req.params.userId);

exports.listUsers = (req, res) =>
  listUsers((err, users) => {
    if (err) res.status(500).json({ err: "Internal server error" });
    else res.json(users);
  });

exports.detailUser = (req, res) => {
  const userId = req.params.userId;
  userDetails(userId, (err, users) => {
    if (err) res.status(500).json({ err: "Internal server error" });
    else res.json(users);
  });
};
