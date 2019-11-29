const request = require("request");

let baseUrl = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis";

let release = {};

release.getConfigurations = (req, res, next) => {
    let url = baseUrl + "/testplan/configurations?api-version=5.1-preview.1";
    return promisify(url, "Status code for Get All Configurations: ", "GET");
}

release.getAllTestSuitesInTestPlan = (id) => {
    let url = baseUrl + "/test/plans/" + id + "/suites?api-version=5.0-preview.2";
    return promisify(url, "Status code for Get All Test Suites in Test Plan: ", "GET");
}

release.deleteTestSuite = (planId, suiteId) => {
    let url = baseUrl + "/test/plans/" + planId + "/suites/" + suiteId + "?api-version=5.0";
    return promisify(url, "Status code for Deleting a Test Suites in Test Plan: ", "DELETE");    
}

release.createTestSuites = (planId, parentTestSuite, suiteName) => {
    let url = baseUrl + "/test/plans/" + planId + "/suites/" + parentTestSuite + "?api-version=5.0";

    return new Promise((resolve, reject) => {
        request.post({
            headers: {
                "content-type": "application/json"
            },
            url: url,
            body: {
                "name": suiteName,
	            "suiteType": "StaticTestSuite"
            },
            json: true
        }, (error, response, body) => {
            if(!error) {
                console.log("Satus code for Creating a new test suite: " + response.statusCode);
                resolve(body.value);
            } else {
                reject(error);
            }
        })
    });
}

release.getAllTestCasesInATestSuite = (suite, mustTestPlanId) => {
    let url = baseUrl + "/test/plans/" + mustTestPlanId + "/suites/" + suite.id + "/testcases?api-version=5.0-preview.2";
    return promisify(url, "Status code for Geting All Test Cases In a Test Suite", "GET");    
}

release.addTestsIntoATestSuite = (planId, suiteId, testCasesIds) => {
    let url = baseUrl + "/test/plans/" + planId + "/suites/" + suiteId + "/testcases/"+ testCasesIds + "?api-version=5.0";

    return promisify(url, "Status code for Adding Tests into a Test Suite: ", "POST");
};

release.addTestsIntoATestSuite1 = (planId, suiteId, testCaseId, configuration) => {
    //https://dev.azure.com/{{organization}}/{{project}}/_apis/testplan/Plans/{{planId}}/suites/{{suiteId}}/TestCase?api-version=5.1-preview.2
    let url = baseUrl + "/testplan/plans/" + planId + "/suites/" + suiteId + "/testcase?api-version=5.1-preview.2";

    return new Promise((resolve, reject) => {
        request.post({
            url: url,
            body: [{
                "pointAssignments": [{
                    "configurationId": configuration.id
                }],
                "workItem": {
                    "id": testCaseId
                }
            }],
            json: true
        }, (error, response, body) => {
            if(!error) {
                console.log("add Tests with specification: " + response.statusCode);

                if(typeof body !== "undefined"){
                    resolve(body.value);
                }
            } else {
                reject(error);
            }
        })
    });
};

release.updateConfiguration = (planId, suiteId, testCaseIds, id) => {
    let url = baseUrl + "/test/plans/" + planId + "/suites/" + suiteId + "/testcases/" + testCaseIds + "?api-version=5.1";
    
    return new Promise((resolve, reject) => {
        request.patch({
            headers: {
                "content-type": "application/json"
            },
            url: url,
            body: {
                "configurations": [{
                    "id": id
                }]
            },
            json: true
        }, (error, response, body) => {
            if(!error) {
                resolve(body);
            } else {
                reject(error);
            }
        })
    });
}

// get, post and delete request
function promisify(url, message, method){
    return new Promise((resolve, reject) => {
        request({
            method: method,
            uri: url,
            json: true
        }, (error, response, body) => {
            if(!error || response.statusCode == 200 || response.statusCode == 204) {
                console.log(message + response.statusCode);

                if(typeof body !== "undefined"){
                    resolve(body.value);
                }
            } else {
                reject(error);
            }
        });
    });
}

module.exports = release;