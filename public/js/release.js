const request = require("request");
const util = require('util');

let baseUrl = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis";

let release = {};

release.getConfigurations = function(req, res, next) {
    let url = baseUrl + "/testplan/configurations?api-version=5.1-preview.1";

    return new Promise((resolve, reject) => {
        request.get({
            uri: url
        }, (error, response, body) => {
            if(!error) {                
                resolve(body);
            } else {
                reject(error);
            }
        })
    })
}

module.exports = release;