const util = require("./utility");

let agent = {};

//https://{{coreServer}}/{{organization}}/_apis/distributedtask/pools?poolName=AutomationUI&api-version=5.1

let baseUrl = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/_apis/distributedtask/pools";

//let baseUrl = "https://" + process.env.USERNAME + process.env.AZURE + "/" + process.env.ORGANIZATION + "/_apis/distributedtask/pools";

agent.getAgentPoolName = (agentPoolName) => {

    let url = baseUrl + "?poolName=" + process.env.AGENT_POOL_NAME + "&api-version=5.1";

    let options = {
        url: url,
        method: "GET",
        json: true
    };

    return util.promisify(options, "Status code for getting Agent pool name: ");
}

agent.getAgents = (agentPoolNameId) => {
    //https://{{coreServer}}/{{organization}}/_apis/distributedtask/pools/{{poolId}}/agents?api-version=5.1
    let url = baseUrl + "/" + agentPoolNameId + "/agents?api-version=5.1";

    let options = {
        url: url,
        method: "GET",
        json: true
    };

    return util.promisify(options, "Status code for getting Agent pool name: ");
}

module.exports = agent;