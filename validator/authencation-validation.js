const { body } = require("express-validator");
const { checkUserExists } = require("../utility/authencation");

emailValidation = body("email")
  .isEmail()
  .withMessage("Emails should be in someone@something.com");

emailValidationLogin = body("email")
  .isEmail()
  .withMessage("Emails should be in someone@something.com")
  .normalizeEmail();

passwordValidation = body("password")
  .isLength({
    min: 5,
    max: 15,
  })
  .withMessage("Password must be of length between 5 and 15");

firstNameValidation = body("firstName")
  .isString()
  .trim()
  .not()
  .isEmpty()
  .withMessage("Dont leave First Name field empty")
  .isString()
  .withMessage("FirstName Must Be String")
  .isLength({ min: 2, max: 10 })
  .withMessage("Name should between 2 and 10");

businessNameValidation = body("name")
  .isString()
  .trim()
  .not()
  .isEmpty()
  .withMessage("Don't leave  Name field empty")
  .isString()
  .withMessage("Name Must Be String")
  .isLength({ min: 2, max: 10 })
  .withMessage("Name should between 2 and 10");

lastNameValidation = body("lastName")
  .isString()
  .trim()
  .not()
  .isEmpty()
  .withMessage("Dont leave Last Name Fiend Empty")
  .isString()
  .withMessage("First Name Must Be String")
  .isLength({ min: 2, max: 10 })
  .withMessage("Last Name should between 2 and 10");

roleValidation = body("role").custom((role) => {
  if (
    role.toLowerCase() != "admin" &&
    role.toLowerCase() != "business" &&
    role.toLowerCase() != "user"
  )
    return Promise.reject("Role is not valid");
  else return true;
});

exports.signUpValidation = [
  emailValidation,
  passwordValidation,
  firstNameValidation,
  lastNameValidation,
  roleValidation,
];

exports.signUpValidationBusiness = [
  businessNameValidation,
  emailValidation,
  passwordValidation,
  roleValidation,
];
exports.changeProfileValidation = [firstNameValidation, lastNameValidation];

exports.loginValidation = [emailValidationLogin, passwordValidation];
