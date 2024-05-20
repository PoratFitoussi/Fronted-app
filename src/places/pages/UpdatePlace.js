import React,{useEffect,useState} from "react";
import { useParams } from "react-router";

import { VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH } from "../../shared/util/validation";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import './PlaceForm.css'
import { useForm } from "../../shared/hooks/form-hooks";

const TEMP_PALCES = [
    {
        id: 'p1',
        imageURL: 
            'https://www.migdalor-news.co.il/wp-content/uploads/2018/05/%D7%94%D7%A9%D7%98%D7%97-%D7%94%D7%9E%D7%93%D7%95%D7%91%D7%A8-%D7%91-%D7%92%D7%A0%D7%99-%D7%90%D7%9C%D7%95%D7%9F-%D7%A6%D7%99%D7%9C%D7%95%D7%9D-%D7%A4%D7%A8%D7%98%D7%99.jpg',
        title: 'Gani Alon',
        description: 'The neighbarhood that I\'m currently live in',
        address: '32°26\'36.4"N 34°54\'34.4"E',
        location: {
            lat: 32.4434524,
            lng: 34.9107696
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        imageURL: 'https://www.migdalor-news.co.il/wp-content/uploads/2018/05/%D7%94%D7%A9%D7%98%D7%97-%D7%94%D7%9E%D7%93%D7%95%D7%91%D7%A8-%D7%91-%D7%92%D7%A0%D7%99-%D7%90%D7%9C%D7%95%D7%9F-%D7%A6%D7%99%D7%9C%D7%95%D7%9D-%D7%A4%D7%A8%D7%98%D7%99.jpg',
        title: 'Gani Alon',
        description: 'The neighbarhood that I\'m currently live in',
        address: '32°26\'36.4"N 34°54\'34.4"E',
        location: {
            lat: 32.4434524,
            lng: 34.9107696
        },
        creator: 'u2'
    }
];

const UpdatePlace = () => {
    //make a path spesific for all places
    const pid = useParams().pid;
    //To prevent a case wich the user clear an input filed the screen will set to loading
    const [isLoading, setIsLoading] = useState(true);

    const identifieldPlace = TEMP_PALCES.find(p => p.id === pid);

    //that is our wat to make a hook variable to save the info of the current place that we need
    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
        },false
    );

    //we use the useEffect function to avoid infinat loop
    useEffect( () => {
        setFormData({       //set value of the title and the description to the current one
            title: {
                value: identifieldPlace.title,
                isValid: true
            },
            description: {
                value: identifieldPlace.description,
                isValid: true
            }
            },
            true
        );
        setIsLoading(false);
    },[setFormData, identifieldPlace]); //The variable that re-render the useEffect function
    

    //a fucntion that update the change
    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    }

    //in case we didn't find the place
    if(!identifieldPlace){
        return(
            <div className="center">
                <h2>No place found</h2>
            </div>
        );
    }

    //in case the value of formSate is't loaded yet
    if(isLoading){
        return(
            <div className="center">
                <h2>Loaded...</h2>
            </div>
        );
    }

    return (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input 
                id="title"   
                label="Title"  
                element="input" 
                validators={[VALIDATOR_REQUIRE()]} 
                errorText="Please enter a valid title." 
                onInput={inputHandler}
                value={formState.inputs.title.value}
                valid={formState.inputs.title.isValue}/>
            <Input 
                id="description"
                label="Description" 
                element="textarea" 
                validators={[VALIDATOR_MINLENGTH(5)]} 
                errorText="Please enter a valid description (at least 5 character)." 
                onInput={inputHandler}
                value={formState.inputs.description.value}
                valid={formState.inputs.description.isValid}/>
            <Button type="submit" disabled={!formState.isValid}>
                UPDATE PLACE
            </Button>
        </form>
    );
};

export default UpdatePlace;