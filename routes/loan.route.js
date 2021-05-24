const express = require("express");
const { takeLoan } = require("../controllers/loan.controller");
const router = express.Router();

router.post("/takeLoan", takeLoan);

module.exports = router;