/*This is AutoComplete Component which provides autocomplete suggestions to user. 
It also mounts From and To input boxes.*/

import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import PlacesAutocomplete from "react-places-autocomplete";

class AutoComplete extends Component {
  /*This event handler is called when value of input boxe(from / To) changes.
  It calls onChange event handler defined in Inputbar Component*/
  onChange = location => {
    this.props.onChange(this.props.type, location);
  };
  /*This event handler is called from AutoComplete component when user selects location from Autocomplete suggestions.
  It calls onSelect event handler defined in Inputbar Component*/
  onSelect = location => {
    this.props.onSelect(this.props.type, location);
  };
  /*Render Component */
  render() {
    return (
      <PlacesAutocomplete
        value={this.props.location}
        onChange={this.onChange}
        onSelect={this.onSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: this.props.type,
                className: "form-control mr-sm-2"
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default AutoComplete;
