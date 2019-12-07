require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const indexRoutes = require("./routes/index");
const automationTestsRoutes = require("./routes/automationTests");
const releaseRoutes = require("./routes/release");
const mappingRoutes = require("./routes/mapping");
const agentRoutes = require("./routes/agents");

const automationTestApiRoutes = require("./routes/api/automationTests");
const agentApiRoutes = require("./routes/api/agents");
const dashboardRoutes = require("./routes/dashboard");
const request = require("request");
const flash = require("connect-flash");
const session = require("express-session");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(flash());
app.locals.moment = require("moment");

app.use(session({
    secret: "I am Minh",
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(indexRoutes);
app.use("/platform", automationTestsRoutes);
app.use("/mapping", mappingRoutes);
app.use("/release", releaseRoutes);
app.use("/agent", agentRoutes);
app.use("/dashboard", dashboardRoutes);
    
app.use("/api/tests", automationTestApiRoutes);
app.use("/api/agents", agentApiRoutes);

const port = process.env.PORT || 3000;

app.get("/test", function(req, res){    
    let username = "mnguyen1";
    let password = process.env.API_KEY;
    let date = new Date();
    let minLastUpdatedDate = new Date().getDate() - 2;
    let maxLastUpdatedDate = new Date().toLocaleDateString("en-US");

    let baseUrl = "https://" + username + ":" + password + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis/test";
    
      
    let url = baseUrl + "/plans?filterActivePlans=true&api-version=5.0";

    // let url = baseUrl + "/runs?minLastUpdatedDate=" + "2019-07-04" + "&maxLastUpdatedDate=" + "2019-07-05" + "&runTitle=Local Samsung S8" + "&api-version=5.0";  ===> WORKS !!!

    console.log(url);
    
    request({url: url}, function(error, response, body){
        if(error){
            console.log(error);            
        }

        console.log(response.statusCode);
        // console.log(body);

        const list = JSON.parse(body);
        
        const t = list.value.filter(x => x.name === 'iOS Must Tests - Master' && x.area.name === 'CCC ONE\\RF-IA Automation');

        res.send(t);
        
    });
});


app.get("/workitems/:id", (req, res) => {
    let url = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis/wit/workitems/" + req.params.id + "?api-version=5.0";

    console.log(url);   
    

    request.get(url, (error, response, body) => {
        if(error){
            console.log(error);            
        }

        console.log(response.statusCode);
        console.log(response.body);
    })

});

app.listen(port, function(){
    console.log("server is up at " + port);
});