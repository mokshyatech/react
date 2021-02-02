const User = require("../model/User");
exports.block = async (LogInUser, toBlock, isBlock, cb) => {
  try {
    let user = await User.findById(LogInUser);
    let toBlockUser = await User.findById(toBlock);
    if (!toBlock) {
      cb("blocked user not found");
    } else if (toBlockUser.role == "admin") {
      cb("Admin User");
    } else if (user) {
      let blocked = user.blocked;
      if (blocked.filter((x) => x == toBlock).length == 0 && isBlock) {
        blocked.push(toBlock);
        user.blocked = blocked;
        await user.save();
        cb(null, "success");
      } else if (blocked.filter((x) => x == toBlock).length == 1 && !isBlock) {
        blocked = blocked.filter((x) => x != toBlock);
        user.blocked = blocked;
        await user.save();
        cb(null, "success");
      } else if (isBlock) {
        cb("already blocked");
      } else {
        cb("Not blocked");
      }
    } else {
      cb("User not found");
    }
  } catch (err) {
    cb(err);
  }
};
