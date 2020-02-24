const util = require("./utility");

let artifacts = {};

let baseUrl = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/_apis/build/builds/99180/artifacts";

artifacts.getArtifact = () => {
    let url = baseUrl + "?artifactName=CCCONE&api-version=5.1";

    let options = {
        url: url,
        method: "GET",
        json: true
    };

    return util.promisify(options, "Status code for getting Agent pool name: ");
}