require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const indexRoutes = require("./routes/index");
const iosRoutes = require("./routes/ios");
const androidRoutes = require("./routes/android");
const request = require("request");
const util = require('util');
//const cors = require("cors");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//app.use(cors());

// app.use(indexRoutes);
// app.use("/ios", iosRoutes);
// app.use("/android", androidRoutes);

const port = process.env.PORT || 3000;

app.get("/test", function(req, res){    
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

app.get("/:planId/:mustTestPlanId/testsuites", async (req, res) => {    

    console.log(req.params.planId);    
    let automatedMustTest = "Automated Must Test";

    // test plan needs to execute
    let allTestSuites = JSON.parse(await GetAllTestSuitesInTestPlan(req.params.planId)).value;

    let parentTestSuite = allTestSuites.find(x => x.inheritDefaultConfigurations === false 
                                && x.testCaseCount === 0 
                                && !x.hasOwnProperty("parent") 
                                && !x.name.includes(automatedMustTest));

    console.log(parentTestSuite.name);

    let pattern = /\d+.\d+/;
    let version = parentTestSuite.name.match(pattern).join("");
    console.log(version); 

    let automatedTestSuiteName = "Automated Must Test " + version;
    
    let newlyCreatedAutomatedTestSuites = await CreateTestSuites(req.params.planId, parentTestSuite.id, automatedTestSuiteName);

    console.log(newlyCreatedAutomatedTestSuites);

    let newlyCreatedAutomatedTestSuite = newlyCreatedAutomatedTestSuites.find(x => x.name == automatedTestSuiteName);
    
    let allTestSuitesInIosMustTest = JSON.parse(await GetAllTestSuitesInTestPlan(req.params.mustTestPlanId)).value;

    let testsuitesInIosMustTest = allTestSuitesInIosMustTest
                                        .filter(x => x.inheritDefaultConfigurations === false 
                                            && x.testCaseCount === 0 
                                            && x.hasOwnProperty("parent")
                                            && x.name.includes("LocalLab"));

    let localIphone7TestSuite = testsuitesInIosMustTest.find(x => x.name.includes("7"));
    let localIphone6TestSuite = testsuitesInIosMustTest.find(x => x.name.includes("6"));

    let localLab7TestSuite = await CreateTestSuites(req.params.planId, newlyCreatedAutomatedTestSuite.id, localIphone7TestSuite.name);

    let localLab6TestSuite = await CreateTestSuites(req.params.planId, newlyCreatedAutomatedTestSuite.id, localIphone6TestSuite.name);

    let localIphone7TestSuiteIds = allTestSuitesInIosMustTest.filter(x => x.hasOwnProperty("parent") && x.parent.id == localIphone7TestSuite.id);

    let localIphone6TestSuiteIds = allTestSuitesInIosMustTest.filter(x => x.hasOwnProperty("parent") && x.parent.id == localIphone6TestSuite.id);  

    for(let i = 0; i < localIphone7TestSuiteIds.length; i++){        

        let testSuites = await CreateTestSuites(req.params.planId, localLab7TestSuite[0].id, localIphone7TestSuiteIds[i].name);
        console.log(testSuites);
        let testSuite = testSuites.find(x => x.name == localIphone7TestSuiteIds[i].name);
        console.log(testSuite);

        let testSuiteAndItsTestCases = await GetAllTestCasesInATestSuite(localIphone7TestSuiteIds[i]);
        console.log(testSuiteAndItsTestCases);
        console.log("test suite id that tests will be added: " + testSuite.id);
        console.log("test ids are added into test suite: " + testSuiteAndItsTestCases.ids);
        await AddTestsIntoATestSuite(testSuite.id, testSuiteAndItsTestCases.ids);        
    }

    for(let i = 0; i < localIphone6TestSuiteIds.length; i++){
        let testSuites = await CreateTestSuites(req.params.planId, localLab6TestSuite[0].id, localIphone6TestSuiteIds[i].name);
        console.log(testSuites);
        let testSuite = testSuites.find(x => x.name == localIphone6TestSuiteIds[i].name);
        console.log(testSuite);

        let testSuiteAndItsTestCases = await GetAllTestCasesInATestSuite(localIphone6TestSuiteIds[i]);
        console.log(testSuiteAndItsTestCases);
        console.log("test suite id that tests will be added: " + testSuite.id);
        console.log("test ids are added into test suite: " + testSuiteAndItsTestCases.ids);
        await AddTestsIntoATestSuite(testSuite.id, testSuiteAndItsTestCases.ids);        
    }

});

async function GetAllTestSuitesInTestPlan(id){
    let url = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis/test/plans/" + id + "/suites?api-version=5.0-preview.2";

    let requestPromise = util.promisify(request);
    let response = await requestPromise(url);

    return response.body;
}

function CreateTestSuites(planId, parentTestSuite, suiteName){
    let url = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis/test/plans/" + planId + "/suites/" + parentTestSuite + "?api-version=5.0";

    console.log(url);
    // let requestPromise = util.promisify(request);
    // let response = await requestPromise(url);
    // console.log(response.statusCode);    

    return new Promise((resolve, reject) => {
        request.post({
            headers: {
                "content-type": "application/json"
            },
            url: url,
            body: {
                "name": suiteName,
	            "suiteType": "StaticTestSuite"
            },
            json: true
        }, (error, response, body) => {
            if(!error && response.statusCode == 200) {
                resolve(body.value);
            } else {
                reject(error);
            }
        })
    });
}

async function GetAllTestCasesInATestSuite(suite){
    let url = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis/test/plans/" + 80002 + "/suites/" + suite.id + "/testcases?api-version=5.0-preview.2";

    let requestPromise = util.promisify(request);
    let response = await requestPromise(url);

    let body = JSON.parse(response.body).value;

    let testCases = body.map(x => {
        return x.testCase.id;
    })

    let testCasesWithComma = testCases.join(",");
    // let val = body.value;

    let rObj = {};
    rObj["name"] = suite.name;
    rObj["ids"] = testCasesWithComma;

    // console.log(rObj);

    return rObj;
}

function AddTestsIntoATestSuite(suiteId, testCasesIds){
    let url = "https://" + process.env.USERNAME + ":" + process.env.API_KEY + "@dev.azure.com/" + process.env.ORGANIZATION + "/" + process.env.PROJECT_ID + "/_apis/test/plans/" + 80002 + "/suites/" + suiteId + "/testcases/"+ testCasesIds + "?api-version=5.0";

    return new Promise((resolve, reject) => {
        request.post({            
            url: url            
        }, (error, response, body) => {
            if(!error && response.statusCode == 200) {
                resolve(body.value);
            } else {
                reject(error);
            }
        })
    });

}

app.listen(port, function(){
    console.log("server is up at " + port);
});