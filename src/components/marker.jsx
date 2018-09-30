/*This is Marker Compnent. Each marker component has its own InfoWindow.*/

import { Marker, InfoWindow } from "react-google-maps";

import React, { Component } from "react";

class MarkerWithInfo extends Component {
  state = {
    isOpen: false
  };

  /*To toggle open and close InfoWindow*/
  onToggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  /*Render Marker with InfoWindow*/
  render() {
    return (
      <Marker
        key={this.props.position.lat}
        position={this.props.position}
        weather={this.props.weather}
        onMouseOver={this.onToggleOpen}
        onMouseOut={this.onToggleOpen}
      >
        {this.state.isOpen && (
          <InfoWindow onCloseClick={this.onToggleOpen}>
            <div>
              {this.props.weather.desc} <br />
              Temp : {this.props.weather.temp} C
            </div>
          </InfoWindow>
        )}
      </Marker>
    );
  }
}

export default MarkerWithInfo;
