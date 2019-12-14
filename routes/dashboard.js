const express = require("express");
const router = express();
<<<<<<< HEAD
const dashboard = require("../public/js/dashboard");

router.get("/", (req, res) => {
    res.render("dashboard/dashboard");
});

router.get("/android-must-test", async (req, res) => {   
    let list = (await dashboard.getAndroidMustTest()).value;
        
    list.sort((a, b) => new Date(a.completedDate) - new Date(b.completedDate));

    console.log(list);
=======
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

>>>>>>> 8b36f80ec1e7807ab125f0ed34ab6032a2d3ed06

});

module.exports = router;