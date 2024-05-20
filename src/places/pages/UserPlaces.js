import React from "react";
import { useParams } from "react-router";

import PlaceList from "../components/PlaceList";

const TEMP_PALCES = [{
    id: 'p1',
    imageURL: 'https://www.migdalor-news.co.il/wp-content/uploads/2018/05/%D7%94%D7%A9%D7%98%D7%97-%D7%94%D7%9E%D7%93%D7%95%D7%91%D7%A8-%D7%91-%D7%92%D7%A0%D7%99-%D7%90%D7%9C%D7%95%D7%9F-%D7%A6%D7%99%D7%9C%D7%95%D7%9D-%D7%A4%D7%A8%D7%98%D7%99.jpg',
    title: 'Gani Alon',
    description: 'The neighbarhood that I\'m currently live in',
    address: '32°26\'36.4"N 34°54\'34.4"E',
    location: {
        lat: 32.4434524,
        lng: 34.9107696
    },
    creator: 'u1'
    },
    {
        id: 'p2',
        imageURL: 'https://www.migdalor-news.co.il/wp-content/uploads/2018/05/%D7%94%D7%A9%D7%98%D7%97-%D7%94%D7%9E%D7%93%D7%95%D7%91%D7%A8-%D7%91-%D7%92%D7%A0%D7%99-%D7%90%D7%9C%D7%95%D7%9F-%D7%A6%D7%99%D7%9C%D7%95%D7%9D-%D7%A4%D7%A8%D7%98%D7%99.jpg',
        title: 'Gani Alon',
    description: 'The neighbarhood that I\'m currently live in',
    address: '32°26\'36.4"N 34°54\'34.4"E',
    location: {
        lat: 32.4434524,
        lng: 34.9107696
    },
    creator: 'u2'
    }];

const UserPlaces = () =>{

    const userId = useParams().userId;
    const loadedPlace = TEMP_PALCES.filter(place => place.creator === userId);
    return(
        <PlaceList items={loadedPlace} />
    );
}

export default UserPlaces

