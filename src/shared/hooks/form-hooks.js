import { useCallback,useReducer } from "react";

//the function that work for the state variable 
const formReducer = (state, action) => {
    switch(action.type){
        case 'INPUT_CHANGE':    //this happen when a user want to create a new place
            let formIsValid = true;
            for(const inputId in state.inputs){
                if(inputId === action.inputId){
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs:{
                    ...state.inputs,
                    [action.inputId]: {value: action.value, isValid: action.isValid}
                },
                isValid: formIsValid
            };
        case 'SET_DATA':    //this used when the user want to edit a place
            return {
                inputs: action.inputs,
                isValid: action.isValid
            };
        default:
            return state;
    }
}

export const useForm = (initialInputs, initialFormValidity) =>{

    //create a state variable that reprisent the state for the input
    const [formState, dispatch] = useReducer(formReducer,{
        inputs: initialInputs,
        isValid: initialFormValidity,
    });

    //the fucntion that work when the user create a new place
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE', 
            value: value,
            isValid: isValid ,
            inputId: id
        });
    }, []);

    //A function that used when the user want to edit a new place so we change the input on the screen
    const setFormData = useCallback((value, isValid) => {
        dispatch({
            type: 'SET_DATA',
            inputs: value,
            isValid: isValid
        });
    },[]);

    //with this return we can use from ever we use useForm all the variable and methods inside that array 
    return [formState, inputHandler,setFormData];
}