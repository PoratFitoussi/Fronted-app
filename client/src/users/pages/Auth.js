import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hooks";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validation";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModel from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from "../../shared/hooks/http-hooks";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import "./Auth.css"

// React component for user authentication, allowing login and signup with form validation and dynamic mode switching.
const Auth = () => {

    const [isLoginMode, setIsLoginMode] = useState(true); //Login/Signup mode state
    const { isLoading, error, sendRequest, errorHandler } = useHttpClient();//Destructuring the response from the useHttpClient hook
    const auth = useContext(AuthContext);   //Access the global auth context, allowing us to manage login/logout states and user information across the app

    // Initialize the form state using a custom hook
    const [formState, inputHandler, setFormData] = useForm(
        {   //The value of the state object
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    );

    //Invert the current mode from login user to an login
    const switchModeHandler = () => {
        if (!isLoginMode) { //In case the user signup
            //Set the form_data for the case that the user is'nt in login mode and update the form-state
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined, //drop the name field
                    image: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid //if bouth are valid the fuotere form will be valid
            );
        } else {    //Here we are in the login mode but we are executing switchModeHandler so we are moving to signup mode
            setFormData(
                {
                    ...formState.inputs,    //retain the cuurent form state inputs data
                    name: {                 //add a new name filed now  
                        value: '',
                        isValid: false      //The reson wht the overall form validity will be false
                    },
                    image: {
                        value: null,
                        isValid: false
                    }
                },
                false //the validity of the form will be false because we just added the name and puted field can't be valid yet
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    //A function that that handel with the event that the user want to login
    //after we create the backend something really happen right know it's only print
    const authSubmitHandler = async event => {
        event.preventDefault(); //Prevent anything from happening for now

        //console.log(formState.inputs);

        if (isLoginMode) {
            try {
                //Send a POST requset to the server to login the user
                const data = await sendRequest('http://localhost:5000/api/users/login',
                    'POST',
                    { 'Content-Type': 'application/json' },
                    JSON.stringify(
                        {
                            email: formState.inputs.email.value,
                            password: formState.inputs.password.value
                        }
                    )
                );
                auth.login(data.user.id);   //change the context to login      
            } catch { }
        } else {
            try {
                const formOb = new FormData();
                formOb.append('name', formState.inputs.name.value);
                formOb.append('email', formState.inputs.email.value);
                formOb.append('password', formState.inputs.password.value);
                formOb.append('image', formState.inputs.image.value);
                //Send a POST requset to the server to create a user
                const data = await sendRequest('http://localhost:5000/api/users/signup',
                    'POST',
                    {},
                    formOb
                );
                auth.login(data.user.id);   //change the context to login 
            } catch {
            }
        }
    };


    return (
        <React.Fragment>
            <ErrorModel error={error} onClear={errorHandler} />  {/**in case the error input is'nt null than the user enter unvaild data */}
            <Card className="authentication">
                {isLoading && <LoadingSpinner />}    {/**When the user try to login or signup */}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler}/>}
                    {!isLoginMode && <Input  //The input for user name in case it's a signup mode
                        id="name"
                        label="Your Name"
                        element="input"
                        type="text"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a name."
                        onInput={inputHandler} />}
                    <Input  //The input for the email field
                        id="email"
                        label="Email"
                        element="input"
                        type="email"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email."
                        onInput={inputHandler} /> {/**The function that start once the user put input in the field */}
                    <Input  //The input for the password field
                        id="password"
                        label="Password"
                        element="input"
                        type="password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password, at least 6 characters"
                        onInput={inputHandler} /> {/**The function that start once the user put input in the field */}
                    <Button
                        type='submit'
                        disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}  {/**The text on the button depends on the mode */}

                    </Button>
                </form>
                <Button
                    onClick={switchModeHandler}>  {/**A button to switch betweeen the login and the signup mode */}
                    SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
                </Button>
            </Card>
        </React.Fragment>


    );
}

export default Auth;