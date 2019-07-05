require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("pulic"));

const port = process.env.PORT || 3000;

app.get("/", function(req, res){
    //GET https://dev.azure.com/{organization}/{project}/_apis/test/runs?buildUri={buildUri}&owner={owner}&tmiRunId={tmiRunId}&planId={planId}&includeRunDetails={includeRunDetails}&automated={automated}&$skip={$skip}&$top={$top}&api-version=5.0
    //GET https://dev.azure.com/{organization}/{project}/_apis/test/runs?minLastUpdatedDate={minLastUpdatedDate}&maxLastUpdatedDate={maxLastUpdatedDate}&api-version=5.0

    let username = "mnguyen1";
    let password = process.env.API_KEY;
    let date = new Date();
    let minLastUpdatedDate = new Date().getDate() - 2;
    let maxLastUpdatedDate = new Date().toLocaleDateString("en-US");

    let baseUrl = "https://" + username + ":" + password + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis/test";
    
      
    // let url = "https://mnguyen1:z3gm5m3wrzt4nk4y2calwalgmk7gqewxjcf7xy2hj3xewshexhoq@dev.azure.com/cccone/0bd70052-94a4-4621-a3f2-fd07b87acdaf/_apis/test/runs?minLastUpdatedDate=2019-06-28&maxLastUpdatedDate=2019-07-03&api-version=5.0&buildDefIds=299";

    //GET https://dev.azure.com/{organization}/{project}/_apis/test/runs?minLastUpdatedDate={minLastUpdatedDate}&maxLastUpdatedDate={maxLastUpdatedDate}&state={state}&planIds={planIds}&isAutomated={isAutomated}&publishContext={publishContext}&buildIds={buildIds}&buildDefIds={buildDefIds}&branchName={branchName}&releaseIds={releaseIds}&releaseDefIds={releaseDefIds}&releaseEnvIds={releaseEnvIds}&releaseEnvDefIds={releaseEnvDefIds}&runTitle={runTitle}&$top={$top}&continuationToken={continuationToken}&api-version=5.0

    
    
    // let url = "https://" + username + ":" + password + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis/test/runs/1156412?includeDetails=true&api-version=5.0";
    //https://dev.azure.com/fabrikam/fabrikam-fiber-tfvc/_apis/test/plans?filterActivePlans=true&api-version=5.0

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

app.listen(port, function(){
    console.log("server is up");
    
    
});