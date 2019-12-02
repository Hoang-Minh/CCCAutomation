const express = require("express");
const router = express.Router();
const agent = require("../public/js/agent");

router.get("/", async (req, res) => {
    let agentPoolName = await agent.getAgentPoolName(process.env.AGENT_POOL_NAME);
    let id = agentPoolName[0].id;
    // console.log(id);

    let agents = await agent.getAgents(id);
    
    res.render("agent/agent", 
    {        
        agents : agents         
    });
});

module.exports = router;