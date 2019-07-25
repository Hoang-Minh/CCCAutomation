const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("partials/table", {type: "android"});
});

module.exports = router;