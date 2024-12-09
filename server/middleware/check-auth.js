import jwt from 'jsonwebtoken';
import HttpError from '../models/http-error.js';

//A function that check if the token is valid
const checkToken = (req, res, next) => {
     //Ensure that option request is not blocked
     if(req.method === 'OPTIONS'){
          return next();
     }
     try {
          const token = req.headers.authorization.split(' ')[1]; //take the tolken from the http request
          if (!token) {
               throw new HttpError('Authorization failed, try againg!', 401);
          }
          const decodedToken = jwt.verify(token, process.env.SECRET_KEY); //Check if the secret key that the user send in the token is valid 
          req.userData = { userId: decodedToken.userId };  //Add to the request the id of the user
          next();
     } catch (err) {
          return next(new HttpError('Something went worng.', 500));
     }
}

export default checkToken;