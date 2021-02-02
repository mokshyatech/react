const Router = require("express").Router;
const router = Router();
const { verifyUser } = require("../controller/auth");

router.get("/:token", verifyUser);

module.exports = router;
