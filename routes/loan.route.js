const express = require("express");
const {
    takeLoan,
    viewLoan,
    viewActiveLoan,
} = require("../controllers/loan.controller");
const router = express.Router();

router.post("/takeLoan", takeLoan);

router.get("/viewActiveLoan", viewActiveLoan);

router.get("/viewLoan", viewLoan);

/*
- - - payback loan
*/

module.exports = router;