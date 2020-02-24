const express = require("express");
const router = express.Router();
const artifacts = require("../../public/js/artifacts");

router.get("/", async (req, res) => {
    let artifact = (await artifacts.getCCCOneArtifact()).value;
    
    res.send(artifact);
})

module.exports = router;