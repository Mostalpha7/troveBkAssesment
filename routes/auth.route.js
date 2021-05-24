const express = require("express");
const router = express.Router();
const {
    register,
    login,
    verify2Fauth,
} = require("../controllers/auth.controller");

router.post("/register", register);

router.post("/login", login);

router.post("/verify2Fauth", verify2Fauth);

module.exports = router;