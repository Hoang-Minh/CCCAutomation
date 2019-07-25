require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const indexRoutes = require("./routes/index");
const iosRoutes = require("./routes/ios");
const androidRoutes = require("./routes/android");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(indexRoutes);
app.use("/ios", iosRoutes);
app.use("/android", androidRoutes);

const port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("server is up at " + port);
});