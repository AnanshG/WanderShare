const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const placeSchema = new Schema({
    title : {type : String , required : true},
    description : {type : String , required : true},
    image : {type : String , required : true},
    location : {
        lat : {type : Number , required : true},
        lng : {type : Number , required : true}
    },
    creator : {type : mongoose.Types.ObjectId , required : true , ref: "User"}  // ref is used to establish relation between User Schema and the entity of place schema
})


module.exports = mongoose.model('Place',placeSchema)       // model accepts 2 parameters one is name of model (should be uppecase + singular) , second is the schema we refer to 
                // we use a constructor of the given model