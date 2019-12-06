const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {    
    res.render("agent/agent");
});

module.exports = router;