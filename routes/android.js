const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("partials/table", 
    {
        type: "android",
        url: "https://ccconeandroidautomationtest.azurewebsites.net/api/testinfo/android"
    });
});

module.exports = router;