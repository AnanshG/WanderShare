const mongoose = require('mongoose')
const uniqueValidator = require("mongoose-unique-validator")

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {type : String , required : true},
    email : {type : String , required : true , unique : true},      //using unique we can querry email faster
    password : {type : String , required : true , minlength : 6},   // minlength makes sure password is min 6 characters
    image : {type : String , required : true},
    places : [{type : mongoose.Types.ObjectId , required : true , ref: "Place"}]  // ref is used to establish relation between Place Schema and the entity of user schema
})

userSchema.plugin(uniqueValidator);     //used to make sure email is unique

module.exports = mongoose.model('User', userSchema);