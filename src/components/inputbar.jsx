/*This is main component which mounts all user input components - From and To input Box and Button.*/

import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import AutoComplete from "./autocomplete";

class InputBar extends Component {
  state = {
    from: "",
    to: "",
    fromLatLnd: {},
    toLatLng: {}
  };

  /*This event handler is called from  AutoComplete Component whenever value of input boxes(from / To) changes.
  It simply changes state values according to input change.*/
  onChange = (type, value) => {
    if (type === "from") {
      this.setState({ from: value });
    } else {
      this.setState({ to: value });
    }
  };

  /*This event handler is called from AutoComplete component when user selects location from Autocomplete suggestions 
  It sets Latitude and Longitude values according to Selected location.*/
  onSelect = (type, location) => {
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        if (type === "from") {
          this.setState({ from: location });
          this.setState({ fromLatLng: latLng });
        } else {
          this.setState({ to: location });
          this.setState({ toLatLng: latLng });
        }
        return latLng;
      })
      .then(latLng => this.props.onInputChange(latLng))
      .catch(error => console.error("Error", error));
  };

  /*This event handler is be called when user submits request by clicking Go Button. It calls onSubmit event handler in App.js Component. */
  onSubmit = () => {
    this.props.onSubmit(this.state.fromLatLng, this.state.toLatLng);
  };

  /*Render Component */
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <AutoComplete
          type={"from"}
          onChange={this.onChange}
          onSelect={this.onSelect}
          location={this.state.from}
        />
        <AutoComplete
          type={"to"}
          onChange={this.onChange}
          onSelect={this.onSelect}
          location={this.state.to}
        />
        <button
          className="btn btn-outline-success my-2 my-sm-0"
          onClick={this.onSubmit}
        >
          Go !
        </button>
      </nav>
    );
  }
}

export default InputBar;
