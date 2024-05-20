import React from "react";

import './PlaceList.css'
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";

const PlaceList = props =>{
    //in case there is no places
    if(props.items.length === 0){
        return(
            <div className="place-list center"> 
                <Card>
                    <h2>No places found. Maybe create one?</h2>
                    <button>Share Place</button>
                </Card>
            </div>
        );
    }
    //if we got here there is at list on place
    return(
        <ul className="place-list">
            {props.items.map(place => 
                <PlaceItem 
                    key={place.id}
                    id={place.id}
                    image={place.imageURL}
                    title={place.title}
                    description={place.description}
                    address={place.address}
                    creatoId={place.creator}
                    coordinates={place.location}
            />
            )}
        </ul>
    );
}

export default PlaceList