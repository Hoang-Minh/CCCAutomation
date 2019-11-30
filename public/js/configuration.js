const util = require("util");

let configuration = {};

configuration.getConfigurations = (req, res, next) => {
    let url = baseUrl + "/testplan/configurations?api-version=5.1-preview.1";

    let options = {
        url: url,
        method: "GET",
        json: true
    }

    return util.promisify(options, "Status code for Get All Configurations: ");
};

configuration.updateConfiguration = (planId, suiteId, testCaseIds, id) => {
    let url = baseUrl + "/test/plans/" + planId + "/suites/" + suiteId + "/testcases/" + testCaseIds + "?api-version=5.1";

    let options = {
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
    };

    return util.promisify(options, "Status code for Get All Configurations: ");
};

module.exports = configuration;