const Router = require("express");
const { getCategory } = require("../controller/category");
const { threadValidation } = require("../validator/threadValidation");
// const { upload } = require("../middleware/multer");

const {
  addThread,
  showAllThread,
  showOneThread,
  showOwnThread,
  showUserThread,
  deleteThread,
  updateThread,
} = require("../controller/post");

const { blockUser, listBlock } = require("../controller/user");

const userController = require("../controller/user");

const router = Router();
//
router.get("/category", getCategory);
router.get("/threads", showAllThread);
router.get("/thread/:threadId", showOneThread);
router.post("/thread", threadValidation, addThread);
router.get("/myThread", showOwnThread);
router.delete("/thread/:threadId", deleteThread);
router.get("/userThread/:userId", showUserThread);
router.put("/thread/:id", updateThread);
router.post("/send-email", userController.sendMail);
router.get("/block/:userId", blockUser);
router.get("/list-block", listBlock);

// router.get("/follow-user/:userId", changePassword);
// router.put("/profile-pic", profilePic);
// deactivate user
// router.get("/deactivate");
router.get("/", getCategory);

// router.
module.exports = router;
