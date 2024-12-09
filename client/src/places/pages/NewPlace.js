import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';

import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validation";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hooks";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import './PlaceForm.css'

// The `NewPlace` component allows users to add a new place by filling out a form with title, description, and address.
// It initializes the form state, handles form input, and prints the input values upon submission.
const NewPlace = () => {

    const auth = useContext(AuthContext);   //Access the global auth context, allowing us to get the user id
    const nav = useNavigate(); //Give us acses to re render the route
    // Initialize the form state using a custom hook
    const [formState, inputHandler] = useForm(
        {   //The value of the state object
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            },
            image: {
                value: null,
                isValid: false
            }
        },
        false
    );

    const { isLoading, error, sendRequest, errorHandler } = useHttpClient();

    //A function that that handel with the event that the user submit
    //after we create the backend something really happen right know it's only print
    const placeSubmitHandler = async event => {
        event.preventDefault(); //Prevent anthing from happening for now
        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('creator', auth.userId);
            formData.append('image', formState.inputs.image.value);
            await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places',
                'POST',
                { Authorization: `Beares ${auth.token}` },   //make the server decoding the token 
                formData
            );
            nav('/'); //re-render the route after adding the place
        } catch {

        }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler} />  {/**in case the error input is'nt null than the user enter unvaild data */}
            <form className='place-form' onSubmit={placeSubmitHandler}>
                {isLoading && (
                    <div className="center">    {/**When the user try to enter the place */}
                        <LoadingSpinner />
                    </div>
                )}
                <Input  //the input for the title
                    id="title"
                    label="Title"
                    element="input"
                    type="text"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler} />
                <Input //the input for the description
                    id="description"
                    label="Description"
                    element="textarea"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 character)."
                    onInput={inputHandler} />
                <Input //the input for the address
                    id="address"
                    label="Address"
                    element="input"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler} />
                <ImageUpload
                    center
                    id="image"
                    onInput={inputHandler}
                    errorText="Please provide an image."
                />
                <Button type='submit' disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </React.Fragment>
    );
}

export default NewPlace