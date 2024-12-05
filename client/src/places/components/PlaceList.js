import React from "react";

import './PlaceList.css'
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";

// The `PlaceList` component displays a list of places passed in as props.
// If no places are provided, it shows a message prompting the user to create a new place.
// If there are places, it maps through the `props.items` array and renders a `PlaceItem` for each place.
const PlaceList = props => {
    //in case there is no places
    if (props.items.length === 0) {
        return (
            <div className="place-list center">
                <Card>
                    <h2>No places found. Maybe create one?</h2>
                    <Button to={"/places/new"} >Share Place</Button>
                </Card>
            </div>
        );
    }
    //if we got here there is at list on place
    return (
        <ul className="place-list">
            {props.items.map(place =>
                <PlaceItem
                    key={place.id}
                    id={place.id}
                    image={place.image}
                    title={place.title}
                    description={place.description}
                    address={place.address}
                    creatorId={place.creator}
                    coordinates={place.location}    //depends on the location of the place 
                    onDelete={props.onDeletePlace}  
                />
            )}
        </ul>
    );
}

export default PlaceList