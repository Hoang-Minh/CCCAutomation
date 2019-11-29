const express = require("express");
const router = express.Router();
const release = require("../public/js/release");

router.get("/", (req, res) => {
    res.render("release");
});

router.post("/", async (req, res) => {
    try {
        // TODO: need to check if planIid or mustTestPlanId is valid or not !!!
        let planId = req.body.release.releaseId;
        let mustTestPlanId = req.body.release.mustTestId;
    
        // 1. Get All Configurations
        let configurations = await release.getConfigurations();
        let locallIp7Configuration = configurations.find(x => x.name == "LocaliPhone7");
        console.log(locallIp7Configuration);
    
        let locallIp6Configuration = configurations.find(x => x.name == "LocaliPhone6");
        console.log(locallIp6Configuration);

        // 2. Get All Test Suites in a test plan        
        let allTestSuites = await release.getAllTestSuitesInTestPlan(planId);

        // 3. Get parent Test Suite
        let parentTestSuite = allTestSuites
                .find(x => x.inheritDefaultConfigurations === false 
                        && x.testCaseCount === 0 
                        && !x.hasOwnProperty("parent"));

        let pattern = /\d+.\d+/;
        let version = parentTestSuite.name.match(pattern).join("");
        console.log("Version is: " + version);
        let prefixAutomatedMustTest = "Automated Must Test"  
        let automatedTestSuiteName = prefixAutomatedMustTest + " " + version;

        // 3. check if there is an existing automated folder
        let existingAutomatedTestSuites = allTestSuites
                .filter(x => x.inheritDefaultConfigurations === true 
                        && x.testCaseCount === 0 
                        && x.hasOwnProperty("parent") 
                        && x.name.includes(prefixAutomatedMustTest));

        // delete existing test suite
        for(let i = 0; i < existingAutomatedTestSuites.length; i++){
            release.deleteTestSuite(planId, existingAutomatedTestSuites[i].id);
        }        

        // 4. Create Automation Must Test folder
        let newlyCreatedAutomatedTestSuites = await release.createTestSuites(planId, parentTestSuite.id, automatedTestSuiteName);

        // 5. Get newly created folder
        let newlyCreatedAutomatedTestSuite = newlyCreatedAutomatedTestSuites.find(x => x.name == automatedTestSuiteName);

        // 6. Get All Test Suites in Automation Must Test Plan
        let allTestSuitesInIosMustTest = await release.getAllTestSuitesInTestPlan(mustTestPlanId);

        // 7. Get All sub Test Suites in Automation Must Test Plan (LocalLab 6 and 7)
        let testsuitesInIosMustTest = allTestSuitesInIosMustTest
                                        .filter(x => x.inheritDefaultConfigurations === false 
                                            && x.testCaseCount === 0 
                                            && x.hasOwnProperty("parent")
                                            && x.name.includes("LocalLab"));

        // 8. Get LocalLab iPhone7 and 6 Test Suite
        let localIphone7TestSuite = testsuitesInIosMustTest.find(x => x.name.includes("7"));
        let localIphone6TestSuite = testsuitesInIosMustTest.find(x => x.name.includes("6"));
        
        // 9. Create LocalLab iPhone 7 annd 6 in the Release Test Plan
        let localLab7TestSuite = await release.createTestSuites(planId, newlyCreatedAutomatedTestSuite.id, localIphone7TestSuite.name);

        let localLab6TestSuite = await release.createTestSuites(planId, newlyCreatedAutomatedTestSuite.id, localIphone6TestSuite.name);

        // 10. Get all the sub test suites inside LocalLab iphone 7 and 6 in the Automation Must Test Plan
        let localIphone7TestSuiteIds = allTestSuitesInIosMustTest.filter(x => x.hasOwnProperty("parent") && x.parent.id == localIphone7TestSuite.id);

        let localIphone6TestSuiteIds = allTestSuitesInIosMustTest.filter(x => x.hasOwnProperty("parent") && x.parent.id == localIphone6TestSuite.id);

        // 11. Populate test for devices
        populateTestForDevice(planId, mustTestPlanId, localIphone7TestSuiteIds, localLab7TestSuite, locallIp7Configuration);
        populateTestForDevice(planId, mustTestPlanId, localIphone6TestSuiteIds, localLab6TestSuite, locallIp6Configuration);
        
        res.send("Bingo");

    } catch (error) {
        console.log(error);
    }
})


async function populateTestForDevice(planId, mustTestPlanId, deviceTestSuitesIds, deviceTestSuite, configuration){

    for(let i = 0; i < deviceTestSuitesIds.length; i++){        

        // 11. Create all sub test suites in the Release plan 
        let testSuites = await release.createTestSuites(planId, deviceTestSuite[0].id, deviceTestSuitesIds[i].name);
        console.log(testSuites);
        let testSuite = testSuites.find(x => x.name == deviceTestSuitesIds[i].name);
        console.log(testSuite);
        
        // 12. Get all the test cases in the sub test suite in the Automation Must Test plan
        let testSuiteAndItsTestCases = await release.getAllTestCasesInATestSuite(deviceTestSuitesIds[i], mustTestPlanId);
        console.log(testSuiteAndItsTestCases);

        // update from here !!!
        console.log(testSuiteAndItsTestCases);
        console.log("test suite id that tests will be added: " + testSuite.id);
        console.log("test ids are added into test suite: " + testSuiteAndItsTestCases.ids);
        
        //13. Add tests into test suite
        await release.addTestsIntoATestSuite(planId, testSuite.id, testSuiteAndItsTestCases.ids);            
        
        // 14. Update test configuration for test suite
        release.updateConfiguration(planId, testSuite.id, testSuiteAndItsTestCases.ids, configuration.id);
    }
}

module.exports = router;
