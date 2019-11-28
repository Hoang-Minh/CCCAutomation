const express = require("express");
const router = express.Router();
const release = require("../public/js/release");

router.get("/", (req, res) => {
    res.render("release");
});

router.post("/", async (req, res) => {
    try {
        let plandId = req.body.release.releaseId;
        let mustTestPlanId = req.body.release.mustTestId;
    
        // 1. Get All Configurations
        let configurations = await release.getConfigurations();
        let locallIp7Configuration = configurations.find(x => x.name == "LocaliPhone7");
        console.log(locallIp7Configuration);
    
        let locallIp6Configuration = configurations.find(x => x.name == "LocaliPhone6");
        console.log(locallIp6Configuration);

        // 2. Get All Test Suites in a test plan        
        let allTestSuites = await release.getAllTestSuitesInTestPlan(plandId);

        // 3. Get parent Test Suite
        let parentTestSuite = allTestSuites
                .find(x => x.inheritDefaultConfigurations === false 
                        && x.testCaseCount === 0 
                        && !x.hasOwnProperty("parent"));

        let pattern = /\d+.\d+/;
        let version = parentTestSuite.name.match(pattern).join("");
        console.log("Version is: " + version);    
        let automatedTestSuiteName = "Automated Must Test " + version;

        // 3. check if there is an existing automated folder
        let existingAutomatedTestSuite = allTestSuites
                .find(x => x.inheritDefaultConfigurations === true 
                        && x.testCaseCount === 0 
                        && x.hasOwnProperty("parent") 
                        && x.name.includes(automatedMustTest));

        if(typeof existingAutomatedTestSuite !== "undefined") {
            // delete existing test suite
            release.deleteTestSuite(plandId, existingAutomatedTestSuite.id);
        }

    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
