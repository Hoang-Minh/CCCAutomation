const request = require("request");

let baseUrl = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis";

let release = {};

release.getConfigurations = (req, res, next) => {
    let url = baseUrl + "/testplan/configurations?api-version=5.1-preview.1";
    return promisify(url, "Status code for Get All Configurations: ");
}

release.getAllTestSuitesInTestPlan = (id) => {
    let url = baseUrl + "/test/plans/" + id + "/suites?api-version=5.0-preview.2";
    return promisify(url, "Status code for Get All Test Suites in Test Plan: ");
}

release.deleteTestSuite = (planId, suiteId) => {
    let url = baseUrl + "/test/plans/" + planId + "/suites/" + suiteId + "?api-version=5.0";

    return new Promise((resolve, reject) =>{
        request.delete({
            url: url
        }, (error, response, body) => {
            if(!error) {
                console.log("Status code to delete a Test Suite is: " + response.statusCode);
                resolve(body);
            } else {
                reject(error);
            }
        });
    });    
}

function promisify(url, message){
    return new Promise((resolve, reject) => {
        request.get({
            uri: url,
            json: true
        }, (error, response, body) => {
            if(!error) {
                console.log(message + response.statusCode);
                resolve(body.value);
            } else {
                reject(error);
            }
        })
    });
}

module.exports = release;