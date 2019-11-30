const util = require("./utility");

let baseUrl = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis";

let testSuite = {};

testSuite.getAllTestSuitesInTestPlan = (id) => {
    let url = baseUrl + "/test/plans/" + id + "/suites?api-version=5.0-preview.2";

    let options = {
        url: url,
        method: "GET",
        json: true
    }

    return util.promisify(options, "Status code for Get All Test Suites in Test Plan: ");
};

testSuite.deleteTestSuite = (planId, suiteId) => {
    let url = baseUrl + "/test/plans/" + planId + "/suites/" + suiteId + "?api-version=5.0";

    let options = {
        url: url,
        method: "DELETE",
        json: true
    }

    return util.promisify(options, "Status code for Deleting a Test Suites in Test Plan: ");    
};

testSuite.createTestSuites = (planId, parentTestSuite, suiteName) => {
    let url = baseUrl + "/test/plans/" + planId + "/suites/" + parentTestSuite + "?api-version=5.0";

    let options = {
        headers: {
            "content-type": "application/json"
        },
        method: "POST",
        url: url,
        body: {
            "name": suiteName,
            "suiteType": "StaticTestSuite"
        },
        json: true
    };

    return util.promisify(options, "Satus code for Creating a new test suite: ");    
};

testSuite.getAllTestCasesInATestSuite = (suite, mustTestPlanId) => {
    let url = baseUrl + "/test/plans/" + mustTestPlanId + "/suites/" + suite.id + "/testcases?api-version=5.0-preview.2";

    let options = {
        url: url,
        method: "GET",
        json: true
    }

    return util.promisify(options, "Status code for Geting All Test Cases In a Test Suite: ");    
};

testSuite.addTestsIntoATestSuite = (planId, suiteId, testCaseId, configuration) => {    
    let url = baseUrl + "/testplan/plans/" + planId + "/suites/" + suiteId + "/testcase?api-version=5.1-preview.2";

    let options = {
        url: url,
        method: "POST",
        body: [{
            "pointAssignments": [{
                "configurationId": configuration.id
            }],
            "workItem": {
                "id": testCaseId
            }
        }],
        json: true
    };

    return util.promisify(options, "Status code for adding Tests with specification:: ");    
};

module.exports = testSuite;