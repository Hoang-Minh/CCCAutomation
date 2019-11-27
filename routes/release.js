const express = require("express");
const router = express.Router();
const release = require("../public/js/release");

router.get("/", (req, res) => {
    res.render("release");
});

router.post("/", async (req, res) => {
    console.log(req.body.release.releaseId);
    console.log(req.body.release.mustTestId);

    let configurations = JSON.parse(await release.getConfigurations()).value;

    // let configurations = JSON.parse(await release.getConfigurations()).value;    
    let locallIp7Configuration = configurations.find(x => x.name == "LocaliPhone7");
    console.log(locallIp7Configuration);

    let locallIp6Configuration = configurations.find(x => x.name == "LocaliPhone6");
    console.log(locallIp6Configuration);
})

module.exports = router;
