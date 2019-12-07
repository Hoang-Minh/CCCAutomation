const express = require("express");
const router = express.Router();
const automationTest = require("../../public/js/automationTest");

router.get("/:platform", async (req, res) => {
    try {
        let tests = await automationTest.getAllTests(req.params.platform);    
        res.send(tests);     
    } catch (error) {
        console.log(error);        
    }
});

module.exports = router;