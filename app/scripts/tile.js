import React from 'react';
import $ from 'jquery';

module.exports = React.createClass({
  getInitialState: function() {
    return {value: ""};
 },
 setButtonText: function() {
   this.setState((state) => {
     return {value: state.value};
   });
 },
  handleClick: function() {
    let tileId = "#tileButton" + this.props.index
    this.setButtonText();
    this.props.tileClicked(this.props.index, this.props.user);
  },
  render: function() {
    let identifier = "tileButton" + this.props.index;
    return (
      <button
      id={identifier}
      type="button"
      className="Tile"
      onClick={this.handleClick}
      >{this.state.value}</button>
    );
  }


});
