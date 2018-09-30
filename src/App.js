/*global google*/

import React, { Component } from "react";
import "./App.css";
import InputBar from "./components/inputbar";
import MyMap from "./components/map";
require("dotenv").config();

/*Create ref of Map component, so that map can be accessed from App.js file*/
const MapWithRef = React.forwardRef(({ ...props }, ref) => {
  return <MyMap {...props} forwardedRef={ref} />;
});

class App extends Component {
  state = {
    MyMap: null,
    map: 1,
    markers: [],
    directions: {},
    isDirection: false
  };
  constructor(props) {
    super(props);
    this.map = React.createRef();
  }

  /*Following four functions converts Direction object fetched using Google Map Web Services API 
  on backend to compatible with Google Map javascript API. 
  So that directions fetched frombackend can be rendered on frontend using javascript API*/
  asLatLng = latLngObject => {
    return new google.maps.LatLng(latLngObject.lat, latLngObject.lng);
  };

  asPath = encodedPolyObject => {
    return google.maps.geometry.encoding.decodePath(encodedPolyObject.points);
  };

  asBounds = boundsObject => {
    return new google.maps.LatLngBounds(
      this.asLatLng(boundsObject.southwest),
      this.asLatLng(boundsObject.northeast)
    );
  };

  typecastRoutes = routes => {
    routes.forEach(route => {
      route.bounds = this.asBounds(route.bounds);
      route.overview_path = this.asPath(route.overview_polyline);

      route.legs.forEach(leg => {
        leg.start_location = this.asLatLng(leg.start_location);
        leg.end_location = this.asLatLng(leg.end_location);

        leg.steps.forEach(step => {
          step.start_location = this.asLatLng(step.start_location);
          step.end_location = this.asLatLng(step.end_location);
          step.path = this.asPath(step.polyline);
        });
      });
    });
    return routes;
  };

  /*When Input in "From" or "To" input boxes, this event handler is called, which changes center of map*/
  onInputChange = latLng => {
    this.map.current.panTo(latLng);
  };

  /*Helper function to create markers along the route to show weather information.
  It puts markers on route at no less than every 20 km distance
  This function is called from onSubmit event.*/
  setMarkers = directions => {
    this.setState({ markers: [] });
    let distance = 20000;
    directions.routes[0].legs[0].steps.forEach(step => {
      const marker = {
        position: {
          lat: step.start_location.lat(),
          lng: step.start_location.lng()
        },

        weather: {
          temp: step.weather.main.temp,
          desc: step.weather.weather[0].description
        }
      };
      if (distance >= 20000) {
        this.setState(prevState => ({
          markers: [...prevState.markers, marker]
        }));
        distance = 0;
      }
      distance = distance + step.distance.value;
    });
  };

  /*When User submits request by clicking Go Button, this even handler is called.
  It requests to backend server for directions with weather info and 
  update state values according to response received from server*/
  onSubmit = (fromLatLng, toLatLng) => {
    var url = new URL("https://myweatherroute-api.herokuapp.com/");
    var params = {
      fromLat: fromLatLng.lat,
      fromLng: fromLatLng.lng,
      toLat: toLatLng.lat,
      toLng: toLatLng.lng
    };
    url.search = new URLSearchParams(params);

    fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "default",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      redirect: "follow",
      referrer: "no-referrer"
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          directions: {
            routes: this.typecastRoutes(response.json.routes),
            request: {
              origin: fromLatLng,
              destination: toLatLng,
              travelMode: "DRIVING"
            }
          }
        });
        this.setState({ isDirection: true });
        this.setMarkers(response.json);
      })
      .catch(err => console.error(err));
  };

  /*Render all components in browser*/
  render() {
    return (
      <React.Fragment>
        <div className="App">
          <InputBar
            onInputChange={this.onInputChange}
            onSubmit={this.onSubmit}
          />
          <MapWithRef
            ref={this.map}
            markers={this.state.markers}
            isMarkerShown={this.isMarkerShown}
            directions={this.state.directions}
            isDirection={this.state.isDirection}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
