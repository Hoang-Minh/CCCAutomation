import getTestInfo from "./dataTable.js";

$(document).ready(function(){
    getTestInfo("http://ccconeiosautomationtest.azurewebsites.net/api/testinfo/ios");
});