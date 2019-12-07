const util = require("./utility");

let automationTest = {};

automationTest.getAllTests = platform =>{
    let options = {
        url: process.env.AUTOMATION_TEST + "/" + platform,
        method: "GET",
        json: true
    };

    return util.promisify(options, "Status for getting all automation tests: ");
}

module.exports = automationTest;