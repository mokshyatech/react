const Category = require("../../model/Category");
exports.findCategory = (cb) => {
  Category.find({ active: true })
    .select("_id name imageUrl")
    .then((data) => cb(null, data))
    .catch((err) => cb(err, null));
};

exports.checkCategoryExists = (name, cb) => {
  Category.findOne({ name: name })
    .then((category) => {
      if (category) {
        cb(null, false);
      } else {
        cb(null, true);
      }
    })
    .catch((err) => cb(err, null));
};

exports.addCategory = ({ name, imageUrl, user }, cb) => {
  this.checkCategoryExists(name, async (err, success) => {
    if (!err && !success) {
      cb(null, "exists");
    } else if (!err && success) {
      const today = Date.now();
      let category = new Category({
        name: name,
        imageUrl: imageUrl,
        createdDate: today,
        createdBy: user,
      });
      await category.save();
      return cb(null, category);
    } else {
      return cb(err, null);
    }
  });
};

exports.deleteCategory = (userId, role, categoryId, cb) => {
  if (role.toLowerCase() === "admin") {
    Category.findById(categoryId)
      .then(async (category) => {
        if (category) {
          category.active = false;
          await category.save();
          cb(null, "success");
        } else {
          cb("notExists", null);
        }
      })
      .catch((err) => {
        cb(err, null);
      });
  }
};

exports.editCategory = (userId, role, categoryId, categoryName, cb) => {
  if (role.toLowerCase() === "admin") {
    Category.findById(categoryId)
      .then(async (category) => {
        if (category) {
          category.name = categoryName;
          await category.save();
          cb(null, category);
        } else {
          cb("notExists", null);
        }
      })
      .catch((err) => {
        cb(err, null);
      });
  }
};
