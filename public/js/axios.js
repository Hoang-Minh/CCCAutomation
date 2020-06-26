const axios = require("axios");

const baseUrl = `https://dev.azure.com/${process.env.ORGANIZATION}/_apis`;

module.exports = axios.create({
  baseUrl: baseUrl,
  headers: {
    Authorization: {
      username: process.env.USERNAME,
      password: process.env.API_KEY,
    },
  },
});
