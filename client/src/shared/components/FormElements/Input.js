import React, { useReducer, useEffect } from "react";

import './Input.css'
import { validate } from "../../util/validation";

//a function that used a hook for the input of the user
const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            }
        case 'TOUCH': //In case the user touch the input filed 
            return {
                ...state,
                isTouch: true
            }
        default:
            return state;

    }
}

const Input = props => {

    //the reducer state
    const [inputState, dispatch] = useReducer(
        inputReducer, {
        value: props.value || '',           //in case the value is come for edditing
        isValid: props.valid || false,
        isTouch: false
    });

    const eventHandler = event => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators
        })
    }

    //function in case the user put something in the input
    const touchHandler = () => {
        dispatch({ type: 'TOUCH' })
    }

    //setting aside the variables to make sure there will not be infinite loop in case of useEffect
    const { id, onInput } = props;
    const { value, isValid } = inputState;

    //re-render in case the user put some input
    useEffect(() => {
        onInput(id, value, isValid)
    }, [id, value, isValid, onInput]);

    //checking what type of input we need
    const element =
        props.element === "input" ? (
            <input
                id={props.id}
                type={props.type}
                placeholder={props.placeholder}
                onChange={eventHandler}
                value={inputState.value}
                onBlur={touchHandler} />
        ) : (
            <textarea
                id={props.id}
                row={props.rows || 3}
                onChange={eventHandler}
                value={inputState.value}
                onBlur={touchHandler} />
        );

    return (
        <div className={`form-control ${!inputState.isValid //dynemc className , ... , ,meaning that the user pres the field
            && 'form-control--invalid'
            && inputState.isTouch}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouch && <p>{props.errorText}</p>}
        </div>
    );
}

export default Input;