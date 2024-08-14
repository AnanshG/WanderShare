const uuid = require("uuid");
const { validationResult } = require("express-validator"); // object destructuring
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const HttpError = require("../models/http-error");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // we can use find({} , "-password") to exclude password from the retrieved documents of users , or we can do find({} , "-password")
  } catch (err) {
    const error = new HttpError("Unable to fetch users , try again later", 500);
    return next(error);
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) }); // find() returns an array of users
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // res.status(422).json(errors)     // you can also do this

    console.log(errors);
    return next(
      new HttpError("provided inputs are invalid , please check you data", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Trouble in signing in , please try again later", 500)
    );
  }

  if (existingUser) {
    const error = new HttpError("User already exist, please login", 422);
    return next(error);
  }

  let hashedPassword; // securing password using hash

  try {
    hashedPassword = await bcrypt.hash(password, 12); // 12 represents the number of salting rounds/salt  (salt represents the strength of the hash)
  } catch (err) {
    return next(
      new HttpError("Could not create user, please try again later", 500)
    );
  }

  const newUser = new User({
    // creating new instance of User Schema for document
    name,
    email,
    image: req.file.path, // path where file is stored
    password: hashedPassword,
    places: [],
  });

  try {
    await newUser.save(); //save is a method which handles all the mongodb logic for storing the document
  } catch (err) {
    const error = new HttpError("User signup failed, try again later", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_KEY,     // secret string
      { expiresIn: "1h" } // this is a good practise
    ); // first 2 parameters are used to define the token , 3rd parameter is optional and provides configuration of the token
  } catch (err) {
    const error = new HttpError("User signup failed, try again later", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: newUser.id , email: newUser.email, token: token }); // used to convert mongoose object to javascript object (_id to id)
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Trouble in logining in , please try again later", 500)
    );
  }

  if (!existingUser) {
    const error = new HttpError("Invalid credentials , try again", 500);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password); // bcrypt has the algorithm to hash the password , so it can check if the plain text password and hashed password match
  } catch (err) {
    return next(
      new HttpError(
        "Cant log you in, check your credentials and try again later"
      )
    );
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid Credentials , please try again"));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,         // private key should be same for login and signup
      { expiresIn: "1h" } // this is a good practise
    ); // first 2 parameters are used to define the token , 3rd parameter is optional and provides configuration of the token
  } catch (err) {
    const error = new HttpError("User login failed, try again later", 500);
    return next(error);
  }

  
  res.json({
    userId: existingUser.id ,
    email : existingUser.email ,
    token : token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
