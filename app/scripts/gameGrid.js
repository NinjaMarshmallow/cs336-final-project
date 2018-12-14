import React from 'react';
import Tile from './tile.js';
import $ from 'jquery';

module.exports = React.createClass ({
  getInitialState: function() {
    return {whoseTurn: this.props.first, tiles: []};
  },
  handleTileClick: function(index, user) {
    let tiles = this.state.tiles;
    //FIXME: why isn't user updating the tile?
    if (this.state.whoseTurn == user) {
      let clickedTile = "#tileButton" + index;
      $(clickedTile).setState({value: user});
      tiles[index]=user;
    }
    //if it's my turn:
      //if the tile is empty
        //make ajax PUT call to server
        //mark not my turn
      //else don't do anything
    //else, tell the user to wait trn.
  },
  checkWinner: function() {
    //middle row, middle column, "  \  ", "  /  "
    if (
      (tiles[3] == tiles[4] && tiles[4] == tiles[5] && tiles[4] != null) ||
      (tiles[1] == tiles[4] && tiles[4] == tiles[7] && tiles[4] != null) ||
      (tiles[0] == tiles[4] && tiles[4] == tiles[8] && tiles[4] != null) ||
      (tiles[2] == tiles[4] && tiles[4] == tiles[6] && tiles[4] != null)
    ){
      this.props.onWinner(tiles[4]);
    }
    //top row
    else if (tiles[0] == tiles [1] && tiles[1] == tiles[2] && tiles[1] != null) {
      this.props.onWinner(tiles[1]);
    }
    //bottom row
    else if (tiles[6] == tiles[7] && tiles[7] == tiles[8] && tiles[7] != null) {
      this.props.onWinner(tiles[7]);
    }
    //left column
    else if (tiles[0] == tiles [3] && tiles[3] == tiles[6] && tiles[3] != null) {
      this.props.onWinner(tiles[3]);
    }
    //right column
    else if (tiles[2] == tiles[5] && tiles[5] == tiles[8] && tiles[5] != null) {
      this.props.onWinner(tiles[5]);
    }
  },
  //TODO: eliminate these functions with a simple setState.
  setTurn: function() {
    this.setState((state) => {
      return (whoseTurn: state.whoseTurn, tiles: state.tiles);
    });
  },
  updateTiles: function() {
    this.setState((state) => {
        return (whoseTurn: state.whoseTurn, tiles: state.tiles);
    });
  },
  render: function() {
    return (
      <div>
        <h3>It&rsquo;s {this.state.whoseTurn} turn.</h3>
        <div id="gameGrid" className="GameGrid">
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
      </div>
    );
  }
});
