import mongoose from "mongoose";

// Define a Mongoose schema for a "place" collection, which represents a specific location with relevant details.
const placeSchema = new mongoose.Schema({
    title: { type: String, required: true },       // The title or name of the place (e.g., "Eiffel Tower").
    description: { type: String, required: true }, // A detailed description of the place.
    image: { type: String, required: true },       // A URL or path to an image representing the place.
    address: { type: String, required: true },     // The physical address of the place.
    location: {                                     
        lat: { type: Number, required: true },     // The latitude coordinate of the place.
        lng: { type: Number, required: true }      // The longitude coordinate of the place.
    },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'Users' }      // The ID or reference to the user who created this place.
});

const model = mongoose.model('Place', placeSchema); // Create a Mongoose model named 'Place' based on the placeSchema.

export default model;