import { useCallback, useReducer } from "react";

/**
 * A function that update the values in the form (the web page) 
 * @param {*} state - the current value of the variable formState
 * @param {*} action - the data of the change the user make, send by the function 'dispatch'
 * @returns - the current state
 */
const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':    //This action is used when a user want to create a new place
            let formIsValid = true;
            //Go through all the inputs (title, description and address) in the form-state to find out if they inputs are valid 
            for (const inputId in state.inputs) {
                //Check if the value is undefine then continue    
                if (!state.inputs[inputId]) {
                    continue;
                }
                //Checking  if the input it's currently looking at is the input which is getting updated in this current action
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid; // make sure if the inputs the user put is valid or not
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid; // update the value of the flag depends on the current input it's currently looking at
                }
            }
            return {    //return the current state 
                ...state,
                inputs: {    //Dynamically update one of our input field in this input without change the others
                    ...state.inputs,   //the current input state
                    [action.inputId]: { value: action.value, isValid: action.isValid }    //Override the input state for the input we're updating with this action
                },
                isValid: formIsValid
            };
        case 'SET_DATA':    //This action is used when the user want to edit a place
            return {
                inputs: action.inputs,
                isValid: action.formIsValid
            };
        default:    //Default for unchangeg state
            return state;
    }
}

//A function that is used as a state function cases we will have to manage state in a more complex way
export const useForm = (initialInputs, initialFormValidity) => {

    /**
     * A useReduce variable that used to create a basic state_variable 
     * @param {state} formState - A state variable
     * @param {Function} dispatch - A dispatch function that send to the formReducer the value of the param 'action'
     * -
     * @param {Function} formReducer - A function that return the current state of the variable formState
     * @param {Object} anonymous_object - The default value of the variable, defined with the param of the useFrom function
     */
    //create a state_variable that represent a spesiphic state for the input
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity,
    });

    //the fucntion that work when the user create a new place
    //The varialbe of the callback come from the componet that call the function inputHandler
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        });
    }, []);

    //Updates form data and validity when editing a place. happend when the user want to eddit a place
    //The varialbe of the callback come from the componet that call the function setFormData
    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formValidity: formValidity
        });
    }, []);


    //with this return we can use from ever we use useForm all the variable and methods inside that array 
    return [formState, inputHandler, setFormData];
}