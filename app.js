//Packages
const express = require("express");

//Middleware
const morgan = require("morgan");
const path = require("node:path");

//init the app and the port
const app = express();
const PORT = process.env.PORT || 8000; //port change to minimize server clashes
const cors = require("cors"); //define cors after the port 

app.use(morgan("dev")); //combined
//----------------------------------------------------
//J-SON Derulo 
app.use(express.json());

//encode forms 
app.use(express.urlencoded({ extended: true }));

//false - querystring library
//true- the qs library, default is true

//use the public directory
app.use(express.static(path.join(__dirname, "public")));

//use cors - please disable until auth unit. It will prevent the server from running.
//app.use(cors); 

//----------------------------------------------------
const siteData = require('./data/siteData'); //pull from mock database
app.get("/", (req, res, next) => {
   res.status(200).json({success: {message: "Index successful. Keep this route always for the apps you make."},  data: {siteData},  statusCode: 200});
});

const foo = require('./controller/siteCtrl')
app.get("/test", foo)

const bar = require('./controller/apiCtrl')
app.get("/api", bar)

//----------------------------------------------------
//Server
app.listen(PORT, () => {
   //SEND A MESSAGE
   console.log(`Podcast server is listening on port ${PORT}`);
   //go to localhost 
   console.log(`http://localhost:${PORT}/`);

});