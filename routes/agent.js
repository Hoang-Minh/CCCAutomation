const express = require("express");
const router = express.Router();
const agent = require("../public/js/agent");

router.get("/", (req, res) => {    
    res.render("agent/agent");
});

router.get("/findAll", async(req, res) => {
    let agentPoolName = await agent.getAgentPoolName(process.env.AGENT_POOL_NAME);
    let id = agentPoolName[0].id;    

    let agents = await agent.getAgents(id);
    res.send(agents);
})

module.exports = router;