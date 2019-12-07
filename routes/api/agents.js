const express = require("express");
const router = express.Router();
const agent = require("../../public/js/agent");

router.get("/", async (req, res) => {
    let agentPoolName = (await agent.getAgentPoolName(process.env.AGENT_POOL_NAME)).value;
    let id = agentPoolName[0].id;    

    let agents = (await agent.getAgents(id)).value;
    res.send(agents);
})

module.exports = router;