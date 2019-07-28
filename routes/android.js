const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("partials/table", 
    {
        type: "android",
        url: process.env.API_ANDROID,
        edit: process.env.EDIT_TEST
    });
});

module.exports = router;