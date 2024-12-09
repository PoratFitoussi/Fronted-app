import axios from 'axios';

import HttpError from '../models/http-error.js';

const API_KEY = process.env.API_KEY;

async function getCoordsForAddress(address) {

    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${API_KEY}`); //resive the address from the user

    const data = response.data; //the data of the location 

    if (!data || data.status === 'ZERO_RESULTS') {      //in case the address is not valid
        throw new HttpError('Could not find location for the specified address', 422);
    }

    const coordinates = data.results[0].geometry.location;    //extrat the coordinat from the address
    return coordinates;
}

export default getCoordsForAddress;