const { body } = require("express-validator");
var mongoose = require("mongoose");
const Category = require("../model/Category");

const nameValidator = body("name")
  .not()
  .isEmpty()
  .withMessage("Name is required")
  .isLength({
    min: 2,
    max: 50,
  })
  .withMessage("Must be between 2 and 50");

// const dateBroughtValidator = body(dateBrought);

const faultDescriptionValidator = body("faultDescription")
  .not()
  .isEmpty()
  .withMessage("Fault description should not be empty")
  .isLength({ max: 500, min: 10 })
  .withMessage("Fault description should be between 10 and 500");

const descriptionValidator = body("description")
  .isLength({ max: 500, min: 10 })
  .withMessage("Description should be between 10 and 500");

const categoryValidation = body("category").custom(async (category) => {
  var isValid = mongoose.Types.ObjectId.isValid(category);
  if (isValid) {
    const cat = await Category.findById(category);
    if (!category) {
      return Promise.reject("Category doesn't exists");
    } else {
      return true;
    }
  } else return Promise.reject("Category is not valid");
});

exports.threadValidation = [
  nameValidator,
  categoryValidation,
  faultDescriptionValidator,
  descriptionValidator,
];
