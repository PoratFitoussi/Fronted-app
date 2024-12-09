import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "../../shared/hooks/form-hooks";

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validation";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import './PlaceForm.css'

// The `UpdatePlace` component allows users to edit the details of an existing place.
// It retrieves the place data using the `pid` from the URL, initializes a form state, 
// and updates the place information upon form submission.
const UpdatePlace = () => {
    const { pid } = useParams(); // Extract the `pid` from the URL params

    const auth = useContext(AuthContext);   //to resive the user id for the redirect
    const nav = useNavigate(); //To send the user to the home page at the end
    // Initialize the form state using a custom hook
    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false
    );

    const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
    const [loadPlace, setLoadPlace] = useState(null);

    // const identifieldPlace = TEMP_PALCES.find(p => p.id === pid);

    useEffect(() => {
        //Request to get the user pid
        const fetchRequest = async () => {
            try {
                const getRespondData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${pid}`);
                setLoadPlace(getRespondData.place);
                setFormData({       //set value of the title and the description to the current one
                    title: {
                        value: getRespondData.place.title,
                        isValid: true
                    },
                    description: {
                        value: getRespondData.place.description,
                        isValid: true
                    }
                },
                    true
                );
            } catch { }
        }
        fetchRequest();
    }, [sendRequest, pid, setFormData])  //The variable that re-render the useEffect function


    if (isLoading && !error) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    //in case we didn't find the place
    if (!loadPlace) {
        return (
            <div className="center">
                <Card>
                    <h2>No place found</h2>
                </Card>

            </div>
        );
    }

    //in case the value of formSate is't loaded yet

    //a fucntion that update the change
    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${pid}`,
                'PATCH',
                {
                    'Content-Type': 'application/json',
                    Authorization: `Beares ${auth.token}`, //make the server decoding the token 
                },
                JSON.stringify(
                    {
                        title: formState.inputs.title.value,
                        description: formState.inputs.description.value
                    }
                )
            )

            nav('/' + auth.userId + '/places');   //send to the home page after the update
        } catch { }
    }
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler} />

            {!isLoading && loadPlace && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>

                <Input
                    id="title"
                    label="Title"
                    element="input"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                    value={loadPlace.title}
                    valid={true} />
                <Input
                    id="description"
                    label="Description"
                    element="textarea"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 character)."
                    onInput={inputHandler}
                    value={loadPlace.description}
                    valid={true} />
                <Button type="submit" disabled={!formState.isValid}>
                    UPDATE PLACE
                </Button>
            </form>}
        </React.Fragment>
    );

}
export default UpdatePlace;