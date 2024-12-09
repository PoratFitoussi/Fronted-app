import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import HttpError from "../models/http-error.js";
import User from "../models/user.js"


//GET request middleware to fetch a list of all users 
const getUsers = async (req, res, next) => {

    let users;
    try {
        users = await User.find({}, '-password');   //resiving all the users documents without their password field
    } catch {
        return next(new HttpError('Something went worng during the proccess', 500));
    }

    //send a respond that all the documents inside the collection will return inside array and will look as an object
    res.json({ usersList: users.map(user => user.toObject({ getters: true })) });
}

//POST request middleware to create a user documents
const signup = async (req, res, next) => {

    // Retrieve validation errors from the request object, and check if it is valid 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid input passed, please check your data', 422));
    }

    //Resive the property the of the user from the body of the url requst
    const { name, email, password } = req.body;

    //Check if a user with the same email is already exist
    let userExists;
    try {
        userExists = await User.findOne({ email: email });   //check if the email is already used
    } catch (err) {
        return next(new HttpError('Something went worng during the proccess', 500))
    }
    if (userExists) {
        return next(new HttpError(`Could not create a user, the email: ${email} already exists`, 422));
    }

    //Encrypt the password
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(new HttpError('Could not encrypt the password', 422));
    }

    //Create an object that hold the property of the new user document
    const newUser = new User({
        name,
        email,
        image: req.file.path, //dummy value
        places: [], //now evry place from this user will be add to this model 
        password: hashedPassword
    });

    try {
        await newUser.save();    //save the document in the collection
    } catch (err) {
        return next(new HttpError('Something went worng during the signup proccess', 500))
    }

    //Create a token
    let token;
    try {
        token = jwt.sign(
            {
                userId: newUser.id,
                email: newUser.email
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );
    } catch (err) {
        return next(new HttpError('Signup has failed, please try again', 500));
    }

    res.status(201).json({ userId: newUser.id, email: newUser.email, token: token, name: newUser.name });
}

//POST request middleware that authenticates user 
const login = async (req, res, next) => {
    const { email, password } = req.body; //Resive the property the of the user login 

    let authUser;
    try {
        authUser = await User.findOne({ email: email }); //Chec if there is a document of user with the same emil and return the document
    } catch {
        return next(new HttpError('Something went worng during the login proccess', 500));
    }

    let userIsValid = false;
    try {
        userIsValid = await bcrypt.compare(password, authUser.password); //Compare the password input and the encrypt password
    } catch (err) {

        return next(new HttpError('Something went worng during the login proccess', 500));
    }

    //Check if the password is valid
    if (!userIsValid) {
        const error = new HttpError('The email or password are worng try again', 401); //create an error object that send to the error handler
        return next(error);
    }

    //Create a token
    let token;
    try {
        token = jwt.sign(
            {
                userId: authUser.id,
                email: authUser.email
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );
    } catch (err) {
        return next(new HttpError('Login has failed, please try again', 500));
    }


    res.status(200).json({ userId: authUser.id, email: authUser.email, token: token, name: authUser.name });
}

const userRoutesHandler = {
    getUsers,
    signup,
    login
}

export default userRoutesHandler;