import React, { useEffect, useState } from "react";
import { useParams } from "react-router";


import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

// The `UserPlaces` component filters and displays a list of places created by a specific user,
// using the userId obtained from the route parameters and the TEMP_PLACES data.
const UserPlaces = () => {

    const { isLoading, error, sendRequest, errorHandler } = useHttpClient(); //Custom http hook
    const userId = useParams().uid;  //recive the user id 
    const [dataList, setDataList] = useState(null); //state for the user list of places

    useEffect(() => {
        const requestHandller = async () => {
            try {
                //Request that retrieve a list of all places by its user ID 
                const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
                setDataList(data.place);
            } catch { }
        };
        requestHandller();
    }, [sendRequest, userId]);


    //A function that be called once a place is delete and update the list
    const placeDeleteHandler = deletedPlaceId => {
        setDataList(placeList =>
            placeList.filter(place => place.id !== deletedPlaceId)
        );
    }

    return (
        <React.Fragment>
            {/* <ErrorModal error={error} onClear={errorHandler} /> */}


            <ErrorModal error={error} onClear={errorHandler} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && dataList && <PlaceList items={dataList} onDeletePlace={placeDeleteHandler} />}
        </React.Fragment>
    );
}

export default UserPlaces;

