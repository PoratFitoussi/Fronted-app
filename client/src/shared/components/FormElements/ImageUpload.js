import { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css'

//A component for upload an image
const ImageUpload = props => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    const filePickeRef = useRef();

    //A function that start in case the file state is change
    useEffect(() => {
        if (!file) { //in case the user remove the file
            return;
        }
        const fileReader = new FileReader(); //using this variable to read the file data and later to change him to img 
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    //A functuin that start when the user choose an image he want to upload
    const pickHandler = event => {
        let pickedFile;
        let fileIsValid = isValid; //to keep the current value because the state variable dose not allways set in time
        if (event.target.files || event.target.files.length === 1) { //make sure that the file is exists and there is only one
            pickedFile = event.target.files[0]; //extract the file
            setFile(pickedFile); //set the image to be seen
            setIsValid(true);   //set the image state to be true
            fileIsValid = true;
            
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);   //check if the process of enter the image is ok 
    }
    //A function that start when the user click the button to add the image, that utelize the input element so the user can choose a file
    const pickImageHandler = () => {
        filePickeRef.current.click();   //make the input element to be choose so the user can upload an image
    };

    return (
        <div className="form-control" > {/** The main div */}
            <input      //this is input for the file for the image, it'll be invisibale for the user to see because there is a button to use
                id={props.id}
                ref={filePickeRef}
                style={{ display: 'none' }}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}> {/**allow us to control how the image preview */}
                <div className="image-upload__preview">{/**to show a priverw of the uplaod image */}
                    {previewUrl && <img src={previewUrl} alt="Preview" />}   {/**the preview image */}
                    {!previewUrl && <p>Please pick an image. </p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>
                    PICK IMAGE
                </Button> {/**A button that upload the image */}
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );

};

export default ImageUpload;