 const multer = require('multer')   // multer is a 3rd party library which is a node/express middleware used for multipart data
 const uuid = require('uuid')

 const MIME_TYPE_MAP = {
    'image/png' : 'png' ,
    'image/jpg' : 'jpg' ,
    'image/jpeg' : 'jpeg' 
 }      // multer  extracts the MIME_TYPE of a file

 const fileUpload = multer({
    limits : 500000, // limits the size of file size
    storage : multer.diskStorage({      // multer has a disk storage function 
        destination : (req , file , cb)=>{           // cb is callback
            cb(null , 'uploads/images')         //cb(error,folderName)
        },           
        filename : (req, file ,cb)=>{
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid.v1() + '.' + ext )            // cb(error,filename)
        }      
    }),
    fileFilter : (req,file,cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]; // !! evalutes mime_type
        let error = isValid ? null : new Error("Invalid mime type")
        cb(error, isValid);
    }
 });

 module.exports = fileUpload;