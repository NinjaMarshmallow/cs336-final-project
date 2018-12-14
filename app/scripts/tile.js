import React from 'react';
import $ from 'jquery';

module.exports = React.createClass({
  getInitialState: function() {
    return {};
 },
 setButtonText: function(json) {
   this.setState(json);
 },
  handleClick: function() {
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
      >{this.props.text}</button>
    );
  }


});
