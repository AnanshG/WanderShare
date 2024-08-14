const fs = require('fs')
const path = require('path')
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/users-routes");
const placeRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use('/uploads/images', express.static(path.join('uploads','images')))    //path creates a path with given parameters and static function returns any file request in that folder 

app.use(bodyParser.json()); // use to parse the request data in json format data and then go next middleware (inbuilt)

app.use((req, res, next) => {       // setting headers in resonse to handle CORS issue
  res.setHeader("Access-Control-Allow-Origin", "*"); // * allows all domains to have access
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods" , "GET, POST, PATCH, DELETE")
  
  next();
});

// this is a route filter
app.use("/api/places", placeRoutes); // request coming with url /api/places... well be forwarded to this route middleware
app.use("/api/users", userRoutes); // for user routes

app.use((req, res, next) => {
  //middleware to handle other routes which are not handled

  const error = new HttpError("this route is not found", 404);
  throw error; // can use throw as it is synchronous right now
});

app.use((error, req, res, next) => {
  // middleware function having 4 parameters is considered a speical function called error function

  if(req.file){   // multer adds file to the request body
    fs.unlink(req.file.path,(err)=>{        // deletes the file from folder when error occurs
      console.log(err)
    })   
  }

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

mongoose      // nodemon scirpt injects there values 
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterforplacedb.eo3r1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=ClusterForPlaceDB`)
  .then(() => {
    console.log("Connection is established");
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
