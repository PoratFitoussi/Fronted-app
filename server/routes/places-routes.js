import express from 'express';
import { check } from 'express-validator';  //A method that make sure that the user input is valid

import placesControllers from '../controllers/places-controllers.js' //A model that represents the middleware function
import fileUpload from '../middleware/file-upload.js';
import checkToken from '../middleware/check-auth.js'; 
const router = express.Router(); //Create a router object

//Define a GET route to retrieve a place by its ID 
router.get('/:pid', placesControllers.getPlaceById); 

//Define a GET route to retrieve a list of all places by its user ID 
router.get('/user/:uid', placesControllers.getPlacesByUserId); 

//A middleware that check if the request is valid
router.use(checkToken);

//Define a POST route that create a new place on the db
router.post('/',   
    fileUpload.single('image'),  //to upload an image for the place
    [check('title')  //Validate that the title and the address is not empty, and the description is at least 5 characters long
        .not()
        .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
        .not()
        .isEmpty()
    ],
    placesControllers.createPlace);

//Define a PATCH route that update a place by its ID
router.patch('/:pid',     
    [check('title')     //Validate that the title is not empty, and the description is at least 5 characters long
        .not()
        .isEmpty(),
    check('description').isLength({ min: 5 })
    ], placesControllers.updatePlace);

//Define a DELETE route that delete a place by its ID
router.delete('/:pid', placesControllers.deletePlace);

export default router;