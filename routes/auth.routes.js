const router = require("express").Router();

const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");
const { register, login } = require("../controllers/auth.controller");

router.post("/register", registerValidator, register);

router.post("/login", loginValidator, login);

module.exports = router;
