const request = require("request");
const axios = require("./axios");

let util = {};

util.promisify = (options, message) => {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error) {
        console.log(message + response.statusCode);
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
};

util.axiosTest = (agentPoolName) => {
  return axios
    .get(`/distributedtask/pools?poolName=${agentPoolName}&api-version=5.1`)
    .catch((error) => {
      console.log(error);
    });
};

module.exports = util;
