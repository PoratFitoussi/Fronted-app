import express from 'express';
import { check } from 'express-validator';

import usersControllers from '../controllers/users-controllers.js'
import fileUpload from '../middleware/file-upload.js';
//Create a router object
const router = express.Router();    

//Define a GET route to retrieve a list of all user 
router.get('/', usersControllers.getUsers); 

//Define a POST route that create a new user & log the user in
router.post('/signup',  
    fileUpload.single('image'),     //to upload an image of the user
    [check('name')      //Validate that the name is not empty, email is in a valid format and password is at least 5 characters long
        .not()
        .isEmpty(),
    check('email')
        .isEmail(),
    check('password').isLength({ min: 5 })
    ],
    usersControllers.signup)  

//Define a POST route that log user in
router.post('/login',  
    [check('email')     //Validate that the email is in a valid format and password is at least 5 characters long
        .isEmail(),
    check('password').isLength({ min: 5 })
    ]
    , usersControllers.login)  

export default router;