const router = require("express").Router();

const { getUserPoints } = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);

router.get("/points", getUserPoints);

module.exports = router;
