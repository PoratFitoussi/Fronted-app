import { useState, useCallback, useRef, useEffect } from "react";

//A custom http hook
export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);  //Loading/Not-Loading state
    const [error, setError] = useState(null);    //Error case for the route list

    let activeHttpRequests = useRef([]); //Save the active request

    //A function that send the http request and used by useCallback create only once
    const sendRequest = useCallback(async (url, method = 'GET', headers = {}, body = null) => {
        setIsLoading(true);  //The page is loading because of the request

        // if(!activeHttpRequests.current){
        //     console.log("check")
        //     activeHttpRequests.current.abort();
        // }

        //check if a controller is already exist and if he does than we abort
        // controllerRef.current = new AbortController();
        // const signal = controllerRef.current.signal;

        //storge that abort controller in the controler array
        //siganl for every http request
        const httpController = new AbortController(); //An object that allow us to control the canceling of the request
        activeHttpRequests.current.push(httpController); //Keep the object in the array so it can be refernce later

        //Send the http request to the server
        try {
            const respond = await fetch(url, {
                method,
                headers,
                body,
                signal: activeHttpRequests.current.signal
            });
            const dataRespond = await respond.json(); //A variable that resive the response 

            //Remove the current HTTP request's from the array, by this we ensures the controller is no longer tracked once the request is completed or aborted
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpController
            );

            //Fetch dos'nt throw error in case the status of the responde is 400-500 than we check alon and thorw in case there is an error
            if (!respond.ok) {
                throw new Error(dataRespond.message);
            }
            // controllerRef.current.abort();
            setIsLoading(false);    //The http request ended here
            return dataRespond;
        } catch (err) {
            setError(err.message); //Change the value of error 
            setIsLoading(false);     //The http request ended here
            console.log({ err })
            throw err;
        }
    }, []);

    //Set the value of the error state to null
    const errorHandler = () => {
        setError(null);
    }

    //Stop the open request and stop them once the component disconect from the DOM
    useEffect(() => {

        return () => {
            activeHttpRequests.current.forEach(controller => controller.abort());
        }
    },);

    return { isLoading, error, sendRequest, errorHandler };
}