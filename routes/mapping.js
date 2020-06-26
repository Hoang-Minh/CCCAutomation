const express = require("express");
const router = express.Router();
const testSuite = require("../public/js/testSuite");

router.get("/", (req, res) => {
  res.render("mapping/mapping");
});

router.post("/", async (req, res) => {
  try {
    let planId = req.body.mapping.releaseId;
    let mustTestPlanId = req.body.mapping.mustTestId;

    // 1. Get All Test Suites in a Release Test plan
    let allTestSuites = (await testSuite.getAllTestSuitesInTestPlan(planId))
      .value;

    if (!allTestSuites) {
      console.log("Release plan Id is invalid");
      req.flash("error", "Release plan Id is invalid");
      return res.redirect("back");
    }

    // 2. Get All Test Suites in Automation Must Test Plan
    let allTestSuitesInAutomationMustTest = (
      await testSuite.getAllTestSuitesInTestPlan(mustTestPlanId)
    ).value;

    if (!allTestSuitesInAutomationMustTest) {
      console.log("Automation Must Test Plan Id is invalid");
      req.flash("error", "Automation Must Test Plan Id is invalid");
      return res.redirect("back");
    }

    // 3. Get parent Test Suite in Release Test Plan
    let parentTestSuite = allTestSuites.find(
      (x) =>
        x.inheritDefaultConfigurations === false &&
        x.testCaseCount === 0 &&
        !x.hasOwnProperty("parent")
    );

    // 4. Get parent Test Suite in Release Test Plan
    let parentTestSuiteInAutomation = allTestSuitesInAutomationMustTest.find(
      (x) =>
        x.inheritDefaultConfigurations === false &&
        x.testCaseCount === 0 &&
        !x.hasOwnProperty("parent")
    );
    let parentTestSuiteNameInRelease = parentTestSuite.name; // get parentTestSuiteName in Release Test Plan
    let parentTestSuiteNameInAutomation = parentTestSuiteInAutomation.name;

    let platformPattern = /(iOS|Android)/g;
    let platformInReleaseTestPlan = parentTestSuiteNameInRelease.match(
      platformPattern
    );

    if (!platformInReleaseTestPlan) {
      let error = "Platform in Release Test Plan is invalid";
      console.log(error);
      req.flash("error", error);
      return res.redirect("back");
    }
    console.log(
      "Platform in Release Test Plan: " + platformInReleaseTestPlan[0]
    );

    let platformInMustTestPlan = parentTestSuiteNameInAutomation.match(
      platformPattern
    );

    if (!platformInMustTestPlan) {
      let error = "Platform in Must Test Plan is invalid";
      console.log(error);
      req.flash("error", error);
      return res.redirect("back");
    }
    console.log("Platform in Must Test Plan: " + platformInMustTestPlan[0]);

    // check if platform (ios or android) are the same in release and automation must test plan
    if (platformInReleaseTestPlan[0] !== platformInMustTestPlan[0]) {
      let error = `Release Test Plan is ${platformInReleaseTestPlan[0]} while Automation Must Test Plan is ${platformInMustTestPlan[0]}. Please check your plan Id`;

      console.log(error);
      req.flash("error", error);
      return res.redirect("back");
    }

    let pattern = /\d+.\d+/;
    let version = parentTestSuiteNameInRelease.match(pattern).join("");
    console.log("Version is: " + version);
    let prefixAutomatedMustTest = "Automated Must Test";
    let automatedTestSuiteName = prefixAutomatedMustTest + " " + version;

    // 4. check if there is an existing automated folder
    let existingAutomatedTestSuites = allTestSuites.filter(
      (x) =>
        x.inheritDefaultConfigurations === true &&
        x.testCaseCount === 0 &&
        x.hasOwnProperty("parent") &&
        x.name.includes(prefixAutomatedMustTest)
    );

    // delete existing test suite
    existingAutomatedTestSuites.map(
      async (x) => await testSuite.deleteTestSuite(planId, x.id)
    );

    // 5. Create Automation Must Test folder in Release Test plan
    let newlyCreatedAutomatedTestSuites = (
      await testSuite.createTestSuites(
        planId,
        parentTestSuite.id,
        automatedTestSuiteName
      )
    ).value;

    // 6. Get newly created folder in Release Test Plan
    let newlyCreatedAutomatedTestSuite = newlyCreatedAutomatedTestSuites.find(
      (x) => x.name == automatedTestSuiteName
    );

    // 7. Get All sub Test Suites in Automation Must Test Plan (LocalLab 6 and 7)
    // If wants to include Test Object, please modify this query !!!
    let testsuitesInAutomationMustTest = allTestSuitesInAutomationMustTest.filter(
      (x) =>
        x.inheritDefaultConfigurations === false &&
        x.testCaseCount === 0 &&
        x.hasOwnProperty("parent") &&
        x.name.includes("LocalLab")
    );

    // 8. clone
    testsuitesInAutomationMustTest.map((x) => {
      testSuite
        .deepClone(x, newlyCreatedAutomatedTestSuite)
        .then((response) => {
          console.log(
            `State of clone operation response: ${response.cloneOperationResponse.state}`
          );
        })
        .catch((error) => {
          console.log(error);
        });
    });

    req.flash("success", "Your request has been processed.");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Something is wrong. Please try again");
    res.redirect("back");
  }
});

module.exports = router;
