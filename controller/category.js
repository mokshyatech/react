const { findCategory, addCategory } = require("./helper/category");

// for all user
exports.getCategory = (req, res) => {
  findCategory((err, category) => {
    if (!err) {
      return res.json(category);
    }
    return res.status(500).json({ err: "Internal Server Error" });
  });
};
// add to database
//  all user
// field
// image
//  name
exports.createCategory = (req, res) => {
  const userId = req.user._id;
  const imageUrl = req.body.image;
  const name = req.body.name;
  addCategory({ name: name, imageUrl: imageUrl, user: userId }, (err, data) => {
    if (!err && data === "exists") {
      res.status(400).json({ err: "Category name already exists" });
    } else if (!err) {
      return res.json(data);
    } else {
      return res.status(500).json(data);
    }
  });
};

// only admin can access this method
// check the product for this category
// warn if product exists
// delete all the product associate with this category
exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id;
  const userId = req.user._id;
  const userRole = req.user.role.name;
  deleteCategory(userId, userRole, categoryId, (err, data) => {
    if (err && err == "notExists") {
      res.status(400).json({ err: "Category doesn't found" });
    } else if (err) {
      res.status(500).json({ err: "internal server error" });
    } else {
      res.json({ success: "successfully deleted category" });
    }
  });
};

// admin and person who create can edit
exports.editCategory = (req, res) => {
  const categoryId = req.body.categoryId;
  const categoryName = req.body.categoryName;
  const userId = req.user._id;
  const userRole = req.user.role.name;
  editCategory(userId, role, categoryId, categoryName, (err, success) => {
    if (err && err === "notExists") {
      res.status(400).json({ err: "Category doesn't exists" });
    } else if (err) {
      res.status(500).json({ err: "Internal server ERROR" });
    } else {
      res.json(success);
    }
  });
};
