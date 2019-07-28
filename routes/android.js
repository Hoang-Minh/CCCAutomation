const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("partials/table", 
    {
        type: "android",
        file: "/js/androidTable.js"
    });
});

module.exports = router;