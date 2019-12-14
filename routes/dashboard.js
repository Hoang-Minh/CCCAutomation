const express = require("express");
const router = express();
const dashboard = require("../public/js/dashboard");

router.get("/", (req, res) => {
    res.render("dashboard/dashboard");
});

router.get("/android-must-test", async (req, res) => {   
    let list = (await dashboard.getAndroidMustTest()).value;
        
    list.sort((a, b) => new Date(a.completedDate) - new Date(b.completedDate));

    console.log(list);

});

module.exports = router;