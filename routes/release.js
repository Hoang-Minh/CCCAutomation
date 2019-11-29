const express = require("express");
const router = express.Router();
const release = require("../public/js/release");

router.get("/", (req, res) => {
    res.render("release/release");
});

router.post("/", async (req, res) => {
    try {
        
        let planId = req.body.release.releaseId;
        let mustTestPlanId = req.body.release.mustTestId;

        // 1. Get All Test Suites in a test plan        
        let allTestSuites = await release.getAllTestSuitesInTestPlan(planId);

        if(!allTestSuites){
            console.log("Release plan Id is invalid");
            req.flash("error", "Release plan Id is invalid");
            return res.redirect("back");
        }

        // 2. Get All Test Suites in Automation Must Test Plan
        let allTestSuitesInAutomationMustTest = await release.getAllTestSuitesInTestPlan(mustTestPlanId);

        if(!allTestSuitesInAutomationMustTest) {
            console.log("Automation Must Test Plan Id is invalid");
            req.flash("error", "Automation Must Test Plan Id is invalid");
            return res.redirect("back");
        }

        // 3. Get parent Test Suite In Release Test Plan
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
            release.deleteTestSuite(planId, existingAutomatedTestSuites[i].id);
        }        

        // 5. Create Automation Must Test folder
        let newlyCreatedAutomatedTestSuites = await release.createTestSuites(planId, parentTestSuite.id, automatedTestSuiteName);

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
            let localTestSuite = await release.createTestSuites(planId, newlyCreatedAutomatedTestSuite.id, testsuitesInAutomationMustTest[i].name);

            // 9. Get all Test Cases in Test Suite that is under Automation Must Test Plan
            let localTestSuiteIds = allTestSuitesInAutomationMustTest.filter(x => x.hasOwnProperty("parent") && x.parent.id == testsuitesInAutomationMustTest[i].id);

            // 10. Populate Test Cases in the Release Test Plan
            populateTestForDevice(planId, mustTestPlanId, localTestSuiteIds, localTestSuite);
        }

        req.flash("success", "Your request has been processed. Please allow 10-20 seconds for it to be done.")
         res.redirect("back");
    } catch (error) {
        console.log(error);
        req.flash("error", "Something is wrong. Please try again");
        res.redirect("back");
    }
})


async function populateTestForDevice(planId, mustTestPlanId, deviceTestSuitesIds, deviceTestSuite){

    for(let i = 0; i < deviceTestSuitesIds.length; i++){        

        // 11. Create all sub test suites in the Release plan 
        let testSuites = await release.createTestSuites(planId, deviceTestSuite[0].id, deviceTestSuitesIds[i].name);
        console.log(testSuites);
        let testSuite = testSuites.find(x => x.name == deviceTestSuitesIds[i].name);
        console.log(testSuite);
        
        // 12. Get all the test cases in the sub test suite in the Automation Must Test plan
        let testSuiteAndItsTestCases = await release.getAllTestCasesInATestSuite(deviceTestSuitesIds[i], mustTestPlanId);

        // 13. Add tests with specified configuration into the test suite in release test plan
        for(let j = 0; j < testSuiteAndItsTestCases.length; j++) {
            await release.addTestsIntoATestSuite1(planId, testSuite.id, testSuiteAndItsTestCases[j].testCase.id, testSuiteAndItsTestCases[j].pointAssignments[0].configuration);
        }
    }
}

module.exports = router;
