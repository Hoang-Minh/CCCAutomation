const express = require("express");
const router = express();
const moment = require("moment");
const utility = require

router.get("/", (req, res) => {
    res.render("/dashboard/dashboard");
});

router.get("/android-must-test", async (req, res) => {
    // server time is running ahead of 7 hours.
    let today = moment().add(1, "days").format("YYYY-MM-DD");
    let past = moment().subtract(7, "days").format("YYYY-MM-DD");
    let runTitle = "Local Samsung S8";
    let planId = 79389;

    console.log(today);
    console.log(past);


});

module.exports = router;