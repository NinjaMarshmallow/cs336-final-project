import React from 'react';
import Tile from './tile.js';
import $ from 'jquery';
import '../css/base.css';

module.exports = React.createClass ({
  handleTileClick: function(index) {
    let tiles = this.state.tiles;
    tiles[index]=this.props.username;
    //console.log("TILE CLICKED: " + index + "  " + tiles[index]);

    //if it's my turn:
      //if the tile is empty
        //make ajax PUT call to server
        //mark not my turn
      //else don't do anything
    //else, tell the user to wait trn.




  },
  getInitialState: function() {
    return {username:"", tiles: []};
 },
  render: function() {
    //FIXME: get GameGrid to apply CSS
    return (
      <div className="GameGrid">
        <Tile id="tile0" index={0} user={this.props.username} tileClicked={this.handleTileClick}/>
        <Tile id="tile1" index={1} user={this.props.username} tileClicked={this.handleTileClick}/>
        <Tile id="tile2" index={2} user={this.props.username} tileClicked={this.handleTileClick}/>
        <Tile id="tile3" index={3} user={this.props.username} tileClicked={this.handleTileClick}/>
        <Tile id="tile4" index={4} user={this.props.username} tileClicked={this.handleTileClick}/>
        <Tile id="tile5" index={5} user={this.props.username} tileClicked={this.handleTileClick}/>
        <Tile id="tile6" index={6} user={this.props.username} tileClicked={this.handleTileClick}/>
        <Tile id="tile7" index={7} user={this.props.username} tileClicked={this.handleTileClick}/>
        <Tile id="tile8" index={8} user={this.props.username} tileClicked={this.handleTileClick}/>
      </div>
    );
  }
});
