import React from 'react';
import Tile from './tile.js';
import $ from 'jquery';
import {API_MOVES, POLL_INTERVAL} from './global'

module.exports = React.createClass ({
  getInitialState: function() {
    return {whoseTurn: this.props.first, tiles: []};
  },
  loadTilesFromServer: function() {
      if(this.state._isMounted){
          $.ajax({
              url: API_MOVES,
              dataType: 'json',
              cache: false,
              success: function(moves) {
                  //todo: determine if change in tiles, then set whose turn.
                  //build a local copy of the server's move state.
                  let dbTiles = [];
                  for (move in moves) {
                    let index = move["square"];
                    let moveOwner = move["username"];
                    dbTiles[idex] = moveOwner;
                  }
                  //check the local server copy against the current state for a change.
                  let changed = false;;
                  for (tile in dbTiles) {
                    if (! this.state.tiles.includes(tile)) {
                      changed = true;
                    }
                  }
                  //if a change has been made, that means the opponent made a move. (FIXME: does it?? only if you update local state before pushing)
                  //turn will become "mine" if a change has been made.
                  if (changed) {
                    this.setState({whoseTurn: this.props.username, tiles: dbTiles});
                    this.checkWinner();
                  }
                  //else, no change was made. It's still opponent's turn. Keep waiting.
              }.bind(this),
              error: function(xhr, status, err) {
                  console.error(xhr, API_URL, status, err.toString() + " @ loadOnlineUsersFromServer");
              }.bind(this)
          });
      }
  },
  checkWinner: function() {
    //middle row, middle column, "  \  ", "  /  "
    if (
      (tiles[3] == tiles[4] && tiles[4] == tiles[5] && tiles[4] != null) ||
      (tiles[1] == tiles[4] && tiles[4] == tiles[7] && tiles[4] != null) ||
      (tiles[0] == tiles[4] && tiles[4] == tiles[8] && tiles[4] != null) ||
      (tiles[2] == tiles[4] && tiles[4] == tiles[6] && tiles[4] != null)
    ){
      let winner = tiles[4];
      if (winner == this.props.username) this.props.onWinner(winner);
      else this.props.onLoser(this.props.username);
    }
    //top row
    else if (tiles[0] == tiles [1] && tiles[1] == tiles[2] && tiles[1] != null) {
      let winner = tiles[1];
      if (winner == this.props.username) this.props.onWinner(winner);
      else this.props.onLoser(this.props.username);
    }
    //bottom row
    else if (tiles[6] == tiles[7] && tiles[7] == tiles[8] && tiles[7] != null) {
      let winner = tiles[7];
      if (winner == this.props.username) this.props.onWinner(winner);
      else this.props.onLoser(this.props.username);
    }
    //left column
    else if (tiles[0] == tiles [3] && tiles[3] == tiles[6] && tiles[3] != null) {
      let winner = tiles[3];
      if (winner == this.props.username) this.props.onWinner(winner);
      else this.props.onLoser(this.props.username);
    }
    //right column
    else if (tiles[2] == tiles[5] && tiles[5] == tiles[8] && tiles[5] != null) {
      let winner = tiles[5];
      if (winner == this.props.username) this.props.onWinner(winner);
      else this.props.onLoser(this.props.username);
    }
    //if a tie game, declare a tie. I'm calling onLoser for slight optimization purposes.
    else if (this.state.tiles.length == 9) {
      this.props.onLoser(null)
    }
    else {
      //no winner, loser, or tie, as the game is still in progress.
    }
  },
  componentDidMount: function() {
    this.loadTilesFromServer();
    setInterval(this.loadTilesFromServer, POLL_INTERVAL);
  },
  handleTileClick: function(index, user) {
    let tiles = this.state.tiles;
    //FIXME: why isn't user updating the tile?
    console.log("whoseTurn: " + this.state.whoseTurn);
    console.log("user: " + user);
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
