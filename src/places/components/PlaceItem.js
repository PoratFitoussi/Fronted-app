import React,{useState} from "react";

import './PlaceItem.css'
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal.js";
import Map from "../../shared/components/UIElements/Map.js";

const PlaceItem = props =>{
    const [showMap,setShowMap] = useState(false); //the state the we gonna use to set the model component
    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    return(
        <>
            <Modal 
                show={showMap} 
                onCancle={closeMapHandler} 
                header={props.address}
                contentClass="place-item__model-content"
                footerClass="place-item__model-action"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16} />
                </div>                
            </Modal>  

            <li className='place-item'>
                <Card>
                    <div className="place-item__image">
                        <img src={props.image} alt={props.title} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__action">
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        <Button to={`/places/${props.id}`}>EDIT</Button>
                        <Button danger>DELETE</Button>
                    </div>
                </Card>
            </li>
        </>    
    );

}

export default PlaceItem;