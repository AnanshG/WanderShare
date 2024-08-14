const jwt = require('jsonwebtoken')
const HttpError = require("../models/http-error")

// making authentication middleware
module.exports = (req,res,next) => {

    if(req.method === "OPTIONS"){
        return next();
    }   // only allows the options request but checks post request       

    let token;
    try{
        token = req.headers.authorization.split(" ")[1]  // Authorization : "Bearer Token"  we use bearer to indicate we are bearing something here
        if(!token){
            const error = new HttpError("Request not authenticated",401)
            return next(error)
        }

        const decodedToken = jwt.verify(token , process.env.JWT_KEY)
        req.userData = {userId : decodedToken.userId};  // adding data to the request
        next();
    }
    catch(err){
        throw new HttpError("Authentication failed")
    }

      
}