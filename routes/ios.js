const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("partials/table", 
    {
        type: "ios",
        url: process.env.API_IOS,
        edit: process.env.EDIT_TEST
    });
});

module.exports = router;