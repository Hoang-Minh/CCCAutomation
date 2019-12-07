const express = require("express");
const router = express.Router();

router.get("/:platform", (req, res) => {   

    res.render("automationTests/table", { 
        platform: req.params.platform,
        url: req.params.platform === "ios" ? process.env.API_IOS : process.env.API_ANDROID,
        edit: process.env.EDIT_TEST 
    });
})

module.exports = router;