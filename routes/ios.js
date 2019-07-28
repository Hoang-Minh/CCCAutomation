const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("partials/table", 
    {
        type: "ios",
        url: "https://ccconeiosautomationtest.azurewebsites.net/api/testinfo/ios"
    });
});

module.exports = router;