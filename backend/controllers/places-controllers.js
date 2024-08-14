const uuid = require('uuid')
const {validationResult} = require('express-validator')
const mongoose = require('mongoose');
const fs = require('fs')

const HttpError = require("../models/http-error");
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place');
const User = require('../models/user');



// setting up a controller for a route     , can use either controller function or anomynous function
const getPlaceById = async (req,res,next) => {      // using :pid for a variable place id

    const placeId = req.params.pid    // using params function of express to get pid in requesst
    
    // let place;   // we can also do this
    try{
        place = await Place.findById(placeId)   // findById works with constructor of the Place , not with instance , findbyid does not return promise but still await can be used bcz of mongoose
    }catch(err){
            const error = new HttpError('Something went wrong ,could not find place',500)

            return next(error)
    }

    if(!place){
     // return res.status(404).json({message : "Could not find place for the provided id"})   // this does not works in asynchronous process
     
      // using  (user defined) HttpError model to create error 
     const error = new HttpError("Could not find the place for the provided id" , 404); ;        //throwing error cancels function execution
     return next(error);
    }
 
    res.status(200).json({ place : place.toObject( { getters : true})  })       // used to convert place to javascript object

 }  // {place} = {place : place} if property and value have the same name , we can use this


 const getPlacesByUserId = async (req,res,next) => {      // using :uid for a variable user id

    const userId = req.params.uid    // using params function of express to get uid in request
    
    // let places;
    let userWithPlaces;
    try{
        // places = await Place.find({ creator : userId})      // in mongoose find with parameters returns an array of documents while in monogodb library it returns a cursor
    
        userWithPlaces = await User.findById(userId).populate('places')     // mongoose searches places in another collection(places)  
    }
    catch(err){
        return next(new HttpError("Cannot fetch places , please try again later", 500) )
    }
    
    //if(!places || places.length === 0)
    if(!userWithPlaces){
       return next(new HttpError("Could not find the place for the provided user id" , 404));  // next does not cancel function execution
    }
    
    res.status(200).json({places : userWithPlaces.places.map(place => place.toObject({ getters : true}))})       // {place} = {place : place} if property and value have the same name , we can use this
 }

 const createPlace = async (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            // res.status(422).json(errors)     // you can also do this

           console.log(errors)
           return next(new HttpError('provided inputs are invalid , please check you data' , 422))        // throw doesnt with asynchronous function , so have to use next()
        }

        // as bodyparser module has parsed the request and converted the data
        const { title , description , address } =  req.body;

        // using dummy coordinates as currently not having google api
        let coordinates;
        try{
            coordinates = await getCoordsForAddress(address);
        }  catch(error){
            return next(error);
        }

        const placeCreated = new Place({
            title,
            description,
            location : coordinates,
            image : req.file.path ,
            creator : req.userData.userId        // using userId from request so that it is secured and cannot be tempered
        })

        let user;   
        try{
            user = await User.findById(req.userData.userId)
        }
        catch(err){
            const error = new HttpError("Creating place failed, try again later",500)
            return next(error);
        }
        
        if(!user){
            const error = new HttpError("User does not exist , creating place failed",500)
            return next(error)
        }

        // console.log(user);

        try{    // using concept of transaction and session
           const sess = await mongoose.startSession();
           await sess.startTransaction();
           await placeCreated.save({session : sess})    // to add the operation to the session
           user.places.push(placeCreated)    // mongoose creates connectino between the two schemas and pushes the place id in the places array of user
           await user.save({session : sess})  
           await sess.commitTransaction();
            
        }catch(err){
            const error = new HttpError('Creating place failed , try again later',500)
            return next(error);
        }

        res.status(201).json(placeCreated);   // code 201 because we created something new and was successful
 }  

 // there are two ways two export one module.exports = name and other is importing the entity using a pointer 
 // we are using second way to export the entities , all pointers are bundled in one object and exported

const updatePlace = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // res.status(422).json(errors)     // you can also do this

       console.log(errors)
       return next( new HttpError('provided inputs are invalid , please check you data' , 422))
    }

    const { title , description } =  req.body;
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId); 
    }
    catch(err){
        return next(new HttpError('Could not update the place ,try again later',500))
    }

    if(place.creator.toString() !== req.userData.userId){
        return next(new HttpError('Not Allowed to update the place',403))
   
    }

    place.title = title;
    place.description = description;

    try{
        await place.save();     // save() is used to save document in the database 
    }
    catch(err){
        return next(new HttpError('Something went wrong , could not update the place',500))
    }

    res.status(200).json({place : place.toObject({getters : true})})        // we are doing this to convert mongoose object to javascript object like _id to id
}

const deletePlace = async (req,res,next) => {
    const placeId = req.params.pid;

    let place;
    try{
        place = await Place.findById(placeId).populate('creator')   // the populate function is used to search a document in another collection with provided id here searches user with creator id and attaches the document with it
    }                                                      // creator field holds the whole user object
    catch(err){
        return next(new HttpError('Could not delete the place, try again later',500))
    }

    if(!place){
        const error = new HttpError("Cannot find place for the placeid ")
        return next(error);
    }

    if(place.creator.id !== req.userData.userId){
        return next(new HttpError('Not Allowed to delete the place',403))
    }

    const imagePath = place.image;  

     try{    // using concept of transaction and session
           const sess = await mongoose.startSession();
           await sess.startTransaction();
           await place.deleteOne({session : sess})    // to add the operation to the session
           place.creator.places.pull(place)   // mongoose creates connectino between the two schemas and deletes  the place id in the places array of user
           await place.creator.save({session : sess})  
           await sess.commitTransaction();
        }
    catch(err){
        return next(new HttpError('Could not delete the place, please try again later',500))
    }

    fs.unlink(imagePath , (err)=>{         // deletes file and  path from the folder
        console.log(err)
        
    })
    
    res.status(200).json({message : "deleted the place"})
}

 exports.getPlaceById = getPlaceById;
 exports.getPlacesByUserId = getPlacesByUserId;
 exports.createPlace = createPlace;
 exports.updatePlace = updatePlace;
 exports.deletePlace = deletePlace;