import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal.js";
import Map from "../../shared/components/UIElements/Map.js";
import { AuthContext } from "../../shared/context/auth-context.js";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner.js";
import ErrorModal from "../../shared/components/UIElements/ErrorModal.js";
import './PlaceItem.css'

// The `PlaceItem` component displays the details of a single place, including its image, title, description, and address.
// It conditionally renders options like "EDIT" and "DELETE" buttons based on the user's login status.
// It also includes modals for showing the place on a map and confirming the deletion of the place.
const PlaceItem = props => {
    const [showMap, setShowMap] = useState(false); //the state that we gonna use to set the model component
    const auth = useContext(AuthContext); //An object that determent if the button of eddit and delet can appear
    const { isLoading, error, sendRequest, errorHandler } = useHttpClient(); //A cusom hook for delete a place
    const [showConfirmModal, setShowConfirmModal] = useState(false); //state for the delete modal

    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    const showDeleteWarningHandler = () => {    //A function that change the value of the modal delete state to true
        setShowConfirmModal(true);
    }
    const cancelDeleteHandler = () => {     //A function that change the value of the modal delete state to fasle
        setShowConfirmModal(false);
    }
    const confirmDeleteHandler = async () => {    //A function that delete the place, for now there is no backend to do this so we just print to the screen
        setShowConfirmModal(false);
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
                'DELETE',
                { Authorization: `Beares ${auth.token}` }  //make the server decoding the token 
            );
            props.onDelete(props.id); //send the pid of the deleted place to re-render the page without him
        } catch { }

    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>)}
            <Modal
                show={showMap}
                onCancle={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >   {/* A Model for the map */}
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16} />
                </div>
            </Modal>
            <Modal
                show={showConfirmModal} //decide if the Modal can be seen
                onCancle={cancelDeleteHandler}  //in case the user exit the modal in a diffrent way than press the CANCEL button
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <div className="place-item__modal-actions-cancel">
                            <Button inverse onClick={cancelDeleteHandler}>
                                CANCEL
                            </Button>
                        </div>
                        <div className="place-item__modal-actions-danger">
                            <Button onClick={confirmDeleteHandler}>
                                DELETE
                            </Button>
                        </div>

                    </React.Fragment>
                }
            > {/*A modal for the delete button */}
                <p className="message">
                Are you sure you want to delete this place? This action cannot be undone, and the data will be permanently lost.
                </p>
            </Modal>

            <li className='place-item'>
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="place-item__image">
                        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>
                            VIEW ON MAP
                        </Button>
                        {auth.userId === props.creatorId && ( //Make sure that the link is vissable only if the user in login
                            <Button to={`/places/${props.id}`}>
                                EDIT
                            </Button>
                        )}
                        {auth.userId === props.creatorId && ( //Make sure that the link is vissable only if the user in login
                            <Button danger onClick={showDeleteWarningHandler} >
                                DELETE
                            </Button>
                        )}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    );
}

export default PlaceItem;