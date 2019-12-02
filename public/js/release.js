const request = require("request");

let release = {};

release.getAutomatedReleaseDefinitions = (platform, type) => {
    // upate url
    let url = "https://{{releaseServer}}/{{organization}}/{{project}}/_apis/release/definitions?path=%5CAutomation%5Cios%5CMust%20Tests&searchText=Local&api-version=5.1"

    return promisify(url, "Status code for getting Automated Release Definition: ", "GET");
}

module.exports = release;