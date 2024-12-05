import mongoose from "mongoose";

// Define a Mongoose schema for a 'User' collection
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },    // The user's name, a required string
    email: { type: String, required: true, unique: true },   // The user's email, a required and unique string to avoid duplicate emails
    password: { type: String, required: true, minlength: 6 },    // The user's password, a required string with a minimum length of 6 characters
    image: { type: String, required: true },     // The user's profile image URL, a required string
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }]    // A reference to places associated with the user, stored as a required string
});

const model = mongoose.model('Users', userSchema);   // Create a Mongoose model named 'Users' based on the userSchema.

export default model;
