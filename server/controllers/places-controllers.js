import { validationResult } from 'express-validator';  //A method that make sure that the user input is valid
import mongoose from 'mongoose';
import fs from 'fs';

import HttpError from '../models/http-error.js'; //error object for dealings with http error
import getCoordsForAddress from '../util/location.js';  //function that get the address and return the location
import Place from '../models/places.js'; //a model to create a documents of place and storing it in the db
import User from '../models/user.js';   //A model to add the place to the User collection

//GET request middleware to fetch a place from the database by the place id
const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId); //Search the place in the db by the place id
    } catch (err) {
        return next(new HttpError('Something went worng during the searching', 500));
    }

    // Check if the place exists with the provided id
    // If no place is found, return a 404 error with a message indicating that no place was found for the given id
    if (!place) { //in case there is'nt place with the pid 
        return next(new HttpError('Could not find a place for the provided id', 404));
    }

    res.json({ place: place.toObject({ getters: true }) });
};

//GET request middleware to fetch all places of a given user id from the database 
const getPlacesByUserId = async (req, res, next) => {

    const userId = req.params.uid;
    let userWithPlaces;

    try {
        userWithPlaces = await User.findById(userId).populate('places');    //search the documents that have the same creator
    } catch (err) { //in case of an error
        console.log(err);
        return next(
            new HttpError(
                'Something went worng during the search',
                500
            )
        );
    }

    if (!userWithPlaces) { //in case there is'nt place with the pid 
        const error = new HttpError('Currently, there are no shared places from this user.', 404); //create an error object that send to the error handler
        return next(error);
    }
    res.json({ place: userWithPlaces.places.map(place => place.toObject({ getters: true })) });   //send a respond that all the documents look as array
};

//POST request middleware to create a place document
const createPlace = async (req, res, next) => {
    const errors = validationResult(req);    //in case the middleware have conditon for the input than we check if the input is valid
    if (!errors.isEmpty()) { //if the variable is empty than it's mean that we have a bad input
        next(new HttpError('Invalid input passed, please check your data', 422));
    }

    const { title, description, address} = req.body;    //Resive the property the of the user from the body of the url requst

    //Put the coordinates of the place by his address
    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    //A model for the documents 'place'
    const newPlace = new Place({
        title,
        description,
        location: coordinates,
        address,
        image: req.file.path, //dummy address url for now
        creator: req.userData.userId
    });

    //Check if the user that create this place is exsit
    let user;
    try {
        user = await User.findById(newPlace.creator);
    } catch (err) {
        return next(new HttpError('Creating a plase faild, try again', 500));
    }
    if (!user) {
        return next(new HttpError('The creator for this place dose not exsit', 404));
    }


    try {//adding the document to the db
        const sess = await mongoose.startSession();     //Start a session
        sess.startTransaction();    //Start a transaction
        await newPlace.save({ session: sess });   //Set the session filed of the new place document that created to the sseion we just create 
        user.places.push(newPlace);     //Set the places value of the document 'user' to be the document of the current place
        await user.save({ session: sess }); //Set the session filed of the user document to the sseion we just create 
        await sess.commitTransaction(); //Confirm all the change that been made by confirm the transaction
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try againg',
            500
        );
        return next(error);
    }

    res.status(201).json({ place: newPlace });    //send a responed that the object was curecly added
};

//PATCH request middleware to update a place document 
const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);    //in case the middleware have conditon for the input than we check if the input is valid
    if (!errors.isEmpty()) { //if the variable is empty than it's mean that we have a bad input
        throw new HttpError('Invalid input passed, please check your data', 422);
    }

    const placeId = req.params.pid;
    const { title, description } = req.body;    //Resive the property the of the user from the body of the url requst

    //Find the place by it's id
    let place;
    try {
        place = await Place.findById(placeId); 
    } catch (err) {
        return next(new HttpError('Something went worng, could not find the place', 500));
    }

    //Check if the one that want to eddit that place is the creator
    if (place.creator.toString() !== req.userData.userId) {
        return next(new HttpError('Could not update that place, you are not the creator', 401))
    }

    //update the value of the document
    place.title = title;
    place.description = description;
    try {
        await place.save();
    } catch (err) {
        return next(new HttpError('Something went worng during the update process', 500));
    }

    res.json({ place: place.toObject({ getters: true }) }); //return the place after the change was made
};

//DELETE request middleware to delete a place document
const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');;    //find the place by the pid
    } catch (err) {
        const error = new HttpError('Something went worng during the delete proccess', 500);
        return next(error)
    }

    if (!place) {
        return next(new HttpError('Could not find a place for that id.', 404));  //in case the user didn't give a valid id
    }

    if(place.creator.id !== req.userData.userId){
        return next(new HttpError('Could not delete that place, you are not the creator', 401))
    }

    //Delete the place and make sure it's also remove from the user document that created that place
    try {
        const sess = await mongoose.startSession(); //start the session
        sess.startTransaction();    //start the transaction       
        await place.deleteOne({ session: sess });//remove the place from the collection and adding it the session property to make sure it's under the session
        if (place.creator) {
            fs.unlink(place.image, () => console.log('the place deleted')); //delete the image of this place
            place.creator.places.pull(place._id); //remove the place from the creator's places array
            await place.creator.save({ session: sess }); //save the updated creator
        } else {
            throw new Error('Creator not found.');
        }
        await sess.commitTransaction(); //confirm the transaction
    } catch (err) {
        console.log(err.message);
        const error = new HttpError('Something went worng during the delete proccess', 500);
        return next(error)
    }

    res.status(200).json({ message: 'Deleted place.' });
};

// Exporting the controllers
const placesControllers = {
    getPlaceById,
    getPlacesByUserId,
    createPlace,
    updatePlace,
    deletePlace
};

export default placesControllers;
