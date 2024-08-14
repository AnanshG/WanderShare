const express = require('express')
const  {check} = require('express-validator')

const usersControllers = require('../controllers/users-controllers')
const fileUpload = require('../middleware/file-upload')

const router = express.Router()

router.get('/',usersControllers.getUsers) 

router.post('/signup',                  // running multiple middlewares
    fileUpload.single('image'),          // extracts file with single file having image key       
    [       
    check('name').not().isEmpty(),          // used for validation of inputs from request
    check('email').normalizeEmail().isEmail(),       // normalize email is used convert any uppercase to lowercase in email  Test@test.com => test@test.com
    check('password').isLength({min : 6})
], usersControllers.signup)

router.post('/login', usersControllers.login)


module.exports = router;