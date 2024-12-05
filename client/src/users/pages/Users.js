import React, { useState, useEffect } from "react";

import UsersList from "../components/UsersList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hooks";

// A functional component that defines an array of users and passes it to the UsersList component for rendering.
const Users = () => {

    const { isLoading, error, sendRequest, errorHandler } = useHttpClient();
      
    const [dataList, setDataList] = useState(null); //The user list object

    //A function that will once the component will appear
    useEffect(() => {
        const requestHandller = async () => {   //the function that send the http get request
            try {
                //Send the GET request and revice the response
                const data = await sendRequest('http://localhost:5000/api/users');
                setDataList(data.usersList);

            } catch (err) { }
        };
        requestHandller();
    }, [sendRequest,])

    //send the user list
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && dataList && <UsersList items={dataList} />}
        </React.Fragment>
    );
}

export default Users