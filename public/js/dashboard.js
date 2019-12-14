const util = require("./utility");
const moment = require("moment");

let dashboard = {};

let baseUrl = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis";

dashboard.getAndroidMustTest = function(){

    // server time is running ahead of 7 hours.
    let today = moment().add(1, "days").format("YYYY-MM-DD");
    let past = moment().subtract(5, "days").format("YYYY-MM-DD");
    let runTitle = "Local Samsung S8";    

    console.log(today);
    console.log(past);

    let url = baseUrl + "/test/runs?minLastUpdatedDate=" + past + "&maxLastUpdatedDate=" + today + "&runTitle=" + runTitle + "&api-version=5.1";

    let options = {
        url: url,
        method: "GET",
        json: true
    }

    return util.promisify(options, "Status for Getting list of Android Must Test Run: ");
}

module.exports = dashboard;