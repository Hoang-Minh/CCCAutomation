const express = require("express");
const router = express.Router();
//const release = require("../public/js/release");
const testSuite = require("../public/js/testSuite");

router.get("/", (req, res) => {
    res.render("release/release");
});

router.post("/", async (req, res) => {
    try {
        
        let planId = req.body.release.releaseId;
        let mustTestPlanId = req.body.release.mustTestId;

        // 1. Get All Test Suites in a Release Test plan        
        let allTestSuites = await testSuite.getAllTestSuitesInTestPlan(planId);

        if(!allTestSuites){
            console.log("Release plan Id is invalid");
            req.flash("error", "Release plan Id is invalid");
            return res.redirect("back");
        }

        // 2. Get All Test Suites in Automation Must Test Plan
        let allTestSuitesInAutomationMustTest = await testSuite.getAllTestSuitesInTestPlan(mustTestPlanId);

        if(!allTestSuitesInAutomationMustTest) {
            console.log("Automation Must Test Plan Id is invalid");
            req.flash("error", "Automation Must Test Plan Id is invalid");
            return res.redirect("back");
        }

        // 3. Get parent Test Suite in Release Test Plan
        let parentTestSuite = allTestSuites
                .find(x => x.inheritDefaultConfigurations === false 
                        && x.testCaseCount === 0 
                        && !x.hasOwnProperty("parent"));

        let parentTestSuiteName = parentTestSuite.name; // get parentTestSuiteName in Release Test Plan
        let pattern = /\d+.\d+/;
        let version = parentTestSuiteName.match(pattern).join("");
        console.log("Version is: " + version);
        let prefixAutomatedMustTest = "Automated Must Test"  
        let automatedTestSuiteName = prefixAutomatedMustTest + " " + version;

        // 4. check if there is an existing automated folder
        let existingAutomatedTestSuites = allTestSuites
                .filter(x => x.inheritDefaultConfigurations === true 
                        && x.testCaseCount === 0 
                        && x.hasOwnProperty("parent") 
                        && x.name.includes(prefixAutomatedMustTest));

        // delete existing test suite
        for(let i = 0; i < existingAutomatedTestSuites.length; i++){
            testSuite.deleteTestSuite(planId, existingAutomatedTestSuites[i].id);
        }        

        // 5. Create Automation Must Test folder in Release Test plan
        let newlyCreatedAutomatedTestSuites = await testSuite.createTestSuites(planId, parentTestSuite.id, automatedTestSuiteName);

        // 6. Get newly created folder in Release Test Plan
        let newlyCreatedAutomatedTestSuite = newlyCreatedAutomatedTestSuites.find(x => x.name == automatedTestSuiteName);

        // 7. Get All sub Test Suites in Automation Must Test Plan (LocalLab 6 and 7)
        // If wants to include Test Object, please modify this query !!!
        let testsuitesInAutomationMustTest = allTestSuitesInAutomationMustTest
                                        .filter(x => x.inheritDefaultConfigurations === false 
                                            && x.testCaseCount === 0 
                                            && x.hasOwnProperty("parent")
                                            && x.name.includes("LocalLab"));        
                                            
        for(let i = 0; i < testsuitesInAutomationMustTest.length; i++){

            // 8. Get all test suites in local lab
            let localTestSuite = await testSuite.createTestSuites(planId, newlyCreatedAutomatedTestSuite.id, testsuitesInAutomationMustTest[i].name);

            // 9. Get all Test Cases in Test Suite that is under Automation Must Test Plan
            let localTestSuiteIds = allTestSuitesInAutomationMustTest.filter(x => x.hasOwnProperty("parent") && x.parent.id == testsuitesInAutomationMustTest[i].id);

            testSuite.populateTestsForDevices(planId, mustTestPlanId, localTestSuiteIds, localTestSuite);            
        }

        req.flash("success", "Your request has been processed. Please allow 10-20 seconds for it to be done.")
        res.redirect("back");

    } catch (error) {
        console.log(error);
        req.flash("error", "Something is wrong. Please try again");
        res.redirect("back");
    }
});

module.exports = router;
