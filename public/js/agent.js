const util = require("./utility");

let agent = {};

let baseUrl =
  "https://" +
  process.env.USERNAME +
  ":" +
  process.env.API_KEY +
  "@dev.azure.com/" +
  process.env.ORGANIZATION +
  "/_apis/distributedtask/pools";

agent.getUrl = () => {
  return (
    baseUrl + "?poolName=" + process.env.AGENT_POOL_NAME + "&api-version=5.1"
  );
};

agent.getAgentPoolName = async (agentPoolName) => {
  return util.axiosTest(agentPoolName);
};

agent.getAgents = (agentPoolNameId) => {
  let url =
    baseUrl +
    "/" +
    agentPoolNameId +
    "/agents?includeAssignedRequest=true&includeLastCompletedRequest=true&api-version=5.1";

  let options = {
    url: url,
    method: "GET",
    json: true,
  };

  return util.promisify(options, "Status code for getting Agent pool name: ");
};

module.exports = agent;
