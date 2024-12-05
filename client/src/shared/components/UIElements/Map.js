import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {
  const mapRef = useRef();

  const { center, zoom } = props;

  useEffect(() => {
    const map = new window.google.maps.Map(
      mapRef.current, //hold a pointer,
      {             //object that can configer the map and can be controled by the outside of this compounet
        center: center,
        zoom: zoom
      }
    );

    //render a marker
    new window.google.maps.Marker(
      {
        position: center, //An object which has a positon key
        map: map//point at are map object 
      });
  }, [center, zoom])



  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;