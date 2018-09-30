/*This is main Map component, on which directions and markers are mounted.*/

import React from "react";
import {
  /*  withScriptjs,*/
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from "react-google-maps";
import { compose, withProps } from "recompose";
import MarkerWithInfo from "./marker";
const MyMap = compose(
  withProps({
    googleMapURL: "",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `530px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withGoogleMap
)(({ forwardedRef, ...props }) => (
  <GoogleMap
    ref={forwardedRef}
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    {props.isDirection && <DirectionsRenderer directions={props.directions} />}
    {props.markers.map(marker => {
      return (
        <MarkerWithInfo
          key={marker.position.lat}
          position={marker.position}
          weather={marker.weather}
          address={marker.address}
        />
      );
    })}
  </GoogleMap>
));

export default MyMap;
