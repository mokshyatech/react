const Router = require("express").Router;

const router = Router();
const { followUserAccount, profilePic } = require("../controller/user");

router.get("/follow-user/:userId", followUserAccount);
router.put("/profile-pic", profilePic);

module.exports = router;
