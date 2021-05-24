const express = require("express");
const router = express.Router();

const {
    updateBasicProfile,
    updateNokDetails,
    updateBankInfo,
    updatePassword,
    getUser,
} = require("../controllers/user.controller");

router.get("/", getUser);

router.put("/updateBasicProfile", updateBasicProfile);

router.put("/udpateNokDetails", updateNokDetails);

router.put("/updateBankInfo", updateBankInfo);

router.put("/updatePassword", updatePassword);
module.exports = router;