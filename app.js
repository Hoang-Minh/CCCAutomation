require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const indexRoutes = require("./routes/index");
const iosRoutes = require("./routes/ios");
const androidRoutes = require("./routes/android");
const request = require("request");
//const cors = require("cors");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//app.use(cors());

// app.use(indexRoutes);
// app.use("/ios", iosRoutes);
// app.use("/android", androidRoutes);

const port = process.env.PORT || 3000;

// let ids = [131658, 131660, 131659, 131661, 131662,131663, 131665, 131664, 131666, 131667,
//             131670, 131668, 131676, 131673, 131599, 131606, 131567, 131565, 131569, 131570,
//             131571, 131572, 131573, 131574, 131575, 131601, 131602, 131603, 131611, 131613];

app.get("/test", function(req, res){
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

// app.delete('/workitems/:id', (req, res) => {
//     let url = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis/wit/workitems/" + req.params.id + "?api-version=5.0";

//     console.log(url);

//     // request({url: url}, function(error, response, body){
//     //     if(error){
//     //         console.log(error);            
//     //     }

//     //     console.log(response.statusCode);
//     //     // console.log(body);

//     //     console.log(body);
        
        
        
        
//     // });
//     request.del(url, (error, response, body) => {
//         if(error){
//             console.log(error);
//         }

//         console.log(response.statusCode);
//         console.log(body);
//     })
// });

// app.patch('/workitems/:id', (req, res) => { 

//     let removeItems = [{
//         op: "add",
//         path: "/fields/System.AssignedTo",
//         value: ""
//     },
//     {
//         op: "add",
//         path: "/fields/System.Title",
//         value: "[Duplicate]"
//     },
//     {
//         op: "remove",
//         path: "/fields/Microsoft.VSTS.TCM.AutomatedTestName"
//     },
//     {
//         op: "remove",
//         path: "/fields/Microsoft.VSTS.TCM.AutomatedTestStorage"
//     },
//     {
//         op: "remove",
//         path: "/fields/Microsoft.VSTS.TCM.AutomatedTestId"
//     }
//     ,
//     {
//         op: "remove",
//         path: "/fields/Microsoft.VSTS.TCM.AutomationStatus"
//     },
//     {
//         op: "remove",
//         path: "/fields/Microsoft.VSTS.TCM.Steps"
//     },
//     {
//         op: "remove",
//         path: "/relations/0"
//     }];


    
//     let url = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis/wit/workitems/" + req.params.id + "?api-version=5.0";    

//     request.patch(url, 
//         {
//             headers: {
//                 "Content-Type" : "application/json-patch+json"
//             },
//             body: JSON.stringify(removeItems)            
//         }, (error, response, body) => {
//         if(error){
//             console.log(error);
//         }

//         console.log(response.statusCode);
//         console.log(response.body);

//         res.send('OK');
//     })

    
// });

// app.patch('/workitems', (req, res) => { 

//     let removeItems = [{
//         op: "add",
//         path: "/fields/System.AssignedTo",
//         value: ""
//     },
//     {
//         op: "add",
//         path: "/fields/System.Title",
//         value: "[Duplicate]"
//     },
//     {
//         op: "remove",
//         path: "/fields/Microsoft.VSTS.TCM.AutomatedTestName"
//     },
//     {
//         op: "remove",
//         path: "/fields/Microsoft.VSTS.TCM.AutomatedTestStorage"
//     },
//     {
//         op: "remove",
//         path: "/fields/Microsoft.VSTS.TCM.AutomatedTestId"
//     }
//     ,
//     {
//         op: "remove",
//         path: "/fields/Microsoft.VSTS.TCM.AutomationStatus"
//     },
//     {
//         op: "remove",
//         path: "/fields/Microsoft.VSTS.TCM.Steps"
//     },
//     {
//         op: "remove",
//         path: "/relations/0"
//     }];

//     ids.forEach((id) => {
//         let url = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis/wit/workitems/" + id + "?api-version=5.0";    
//         console.log(url);

//         request.patch(url, 
//             {
//                 headers: {
//                     "Content-Type" : "application/json-patch+json"
//                 },
//                 body: JSON.stringify(removeItems)            
//             }, (error, response, body) => {
//             if(error){
//                 console.log(error);
//             }
    
//             if(response.statusCode !== 200){
//                 console.log(response.statusCode);
//             }
//         })
//     });
    
//     res.sendStatus(200);    
// });

app.get("/:planId/testsuites", (req, res) => {
    let planId = req.params.planId;
    console.log(planId);
    let url = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis/test/plans/" + req.params.planId + "/suites?api-version=5.0-preview.2";

    console.log(url);   
    

    request.get(url, (error, response, body) => {
        if(error){
            console.log(error);            
        }

        console.log(response.statusCode);
        let jsonBody = JSON.parse(body);
        let arr = jsonBody.value;
        //console.log(arr);
        //inheritDefaultConfigurations

        let minh = arr.filter(x => x.inheritDefaultConfigurations === false && x.testCaseCount === 0 && x.hasOwnProperty("parent"));
        console.log(minh);

        minh.forEach(element => {
            console.log(element);
            let m = JSON.parse(element);
        });

        

        // var t = arr.filter(x => t.inheritDefaultConfigurations === false);
        
    })

});



app.listen(port, function(){
    console.log("server is up at " + port);
    
    
    
});