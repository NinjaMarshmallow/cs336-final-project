import React from 'react';
import $ from 'jquery';
import '../css/base.css';

module.exports = React.createClass({
  getInitialState: function() {
    return {};
 },
  handleClick: function() {
    //FIXME: set button value
    //FIXME: get button to change with CSS
    $( "#tileButton" ).innerHTML = this.props.user
    this.props.tileClicked(this.props.index);
  },
  render: function() {
    return (
      <button
      id="tileButton"
      type="button"
      className="Tile"
      onClick={this.handleClick}
      ></button>
    );
  }


});
