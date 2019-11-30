const request = require("request");

let util = {};

util.promisify = (options, message) => {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if(!error) {
                console.log(message + response.statusCode);

                if(typeof body !== "undefined"){
                    resolve(body.value);
                }
            } else {
                reject(error);
            }
        });
    });
};

module.exports = util;