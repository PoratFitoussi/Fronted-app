import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Object that maps MIME types to file extensions
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/webp' : 'webp'
}

const fileUpload = multer({
    limits:   5000000 , // Limit file size to 5MB
    storage: multer.diskStorage({
        // Function to specify the destination folder for file storage
        destination: (req, file, cb) => {
            cb(null,  './uploads/images'); // Use absolute path
        },
        // Function to define the file name
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype]; // Extract file extension based on MIME type
            cb(null, uuidv4() + '.' + ext); // Create a unique file name with the correct extension
        }
    }),
    // Function to filter files based on MIME type
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]; // Check if MIME type is valid
        let error = isValid ? null : new Error('Invalid mime type!'); // Set error if invalid
        cb(error, isValid); // Proceed with file upload if valid
    }
});

export default fileUpload;