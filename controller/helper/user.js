const User = require("../../model/User");
exports.getProfile = async (userId, cb) => {
  try {
    let user = User.findById(userId).select(
      "firstName lastName email dateOfBirth gender role accountStatus photo createdAt modifiedDate BusinessName "
    );
    cb(null, user);
  } catch (err) {
    cb(err);
  }
};
// const updateProfile = () => {};

exports.uploadProfilePicture = (id, imageUrl, cb) => {
  User.findById(id)
    .then(async (user) => {
      if (user) {
        user.photo = imageUrl;
        await user.save();
        cb(null, "success");
      } else {
        cb("notExists");
      }
    })
    .catch((err) => cb(err));
};

// const followUser = (userId, me) => {
//   User.findById(userId).then(async (user) => {});
// };

exports.listUsers = (cb) => {
  User.find()
    .where({ deleted: false })
    .populate({
      path: "followers",
      select: "firstName lastName name email photo gender role",
    })
    .populate({
      path: "blocked",
      select: "firstName lastName name email photo gender role",
    })
    .select(
      "firstName lastName email dateOfBirth gender role photo createdAt name phoneNo followers blocked city country workAt aboutMe"
    )
    .then((users) => cb(null, users))
    .catch((err) => cb(err));
};

exports.userDetails = async (userId, cb) => {
  const uu = await User.find({ followers: userId }).select(
    "firstName lastName name email photo role gender"
  );

  User.findById(userId)

    .populate({
      path: "followers",
      select: "name firstName lastName email photo gender",
    })
    .select(
      "firstName lastName email dateOfBirth gender role photo createdAt name workAt aboutMe phoneNo city country followers"
    )

    .then((users) => {
      users = { ...users._doc, followed: uu };
      cb(null, users);
    })
    .catch((err) => cb(err));
};

exports.followUser = (targetUser, user, follow, cb) => {
  User.findById(targetUser, { followers: user })
    .then(async (u) => {
      if (follow) {
        if (u.followers.length != 0) {
          cb("AlreadyFollowed");
        } else {
          u.followers.push(user);
          await u.save();
          cb(null, "success");
        }
      } else {
        console.log("yes");
        if (u.followers.length != 0) {
          u.followers.pop();
          await u.save();
          cb(null, "unFollowed");
        } else {
          cb("notFollowing");
        }
      }
    })
    .catch((err) => {
      console.log(err);
      cb(err);
    });
};
