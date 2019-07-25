import getTestInfo from "./dataTable.js";

$(document).ready(function(){
    getTestInfo("http://ccconeandroidautomationtest.azurewebsites.net/api/testinfo/android");
});