import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

import placesRoutes from './routes/places-routes.js'; //middleware to the places routes
import usersRoutes from './routes/users-routes.js';  //middleware to the users routes
import HttpError from './models/http-error.js'; //handling error 

const app = express(); //object for express                 

app.use(cors()); 


app.use(bodyParser.json()); //parse the body of the http request 
app.use('/uploads/images', express.static(path.join('uploads','images')));  //Any request for images

//Handling CORS Erros
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/places', placesRoutes); //Any request to paths starting with /api/places will be handle in placeRoutes

app.use('/api/users', usersRoutes); //Any request to paths starting with /api/users will be handle in placeRoutes

app.use((res, req, next) => {   //Handling error for unsupported routes
    const error = new HttpError('Could not find this routes', 404);
    throw error;
});

app.use((error, req, res, next) => { //Error handler

    if(req.file){   //Delete the image in case of an error
        fs.unlink(req.file.path, err => { 
            console.log(err);
        })
    }
    if (res.headerSent) //check if a respond has already send
        return next(error);

    res.status(error.code || 500) //in case there isnt error send by the user
    res.json({ message: error.message || 'unknow error occurred!' }) //check if we have a message on the error object
})

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o6ioe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`) //the mongodb connection to the user named manue with password academ123 to the collection named places
    .then(() => {
        app.listen(5000); //listen to port 5000
    })
    .catch(err => {
        console.log(err); //in case there is any error
    });


