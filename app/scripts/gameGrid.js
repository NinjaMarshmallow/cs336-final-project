import React from 'react';
import Tile from './tile.js';
import $ from 'jquery';
import {API_MOVES, POLL_INTERVAL} from './global'

module.exports = React.createClass ({
  getInitialState: function() {
    return {whoseTurn: "", tiles: [], _isMounted: false};
  },
  componentDidMount: function() {
    this.setState({whoseTurn: this.props.first, _isMounted: true})
    this.loadTilesFromServer();
    setInterval(this.loadTilesFromServer, POLL_INTERVAL);
  },
  loadTilesFromServer: function() {
      if(this.state._isMounted){
          $.ajax({
              url: API_MOVES,
              dataType: 'json',
              cache: false,
              success: function(moves) {
                  //build a local copy of the server's move state.
                  let dbTiles = [];
                  moves.forEach(move => {
                    let index = move["square"];
                    let moveOwner = move["username"];
                    dbTiles[index] = moveOwner;
                  })

                  //if a change has been made, that means the opponent made a move. (FIXME: does it?? only if you update local state before pushing)
                  //turn will become "mine" if a change has been made.

                  //check the local server copy against the current state for a change.
                  let changed = false;
                  let tiles = this.state.tiles;
                  if (dbTiles.length != tiles.length) changed = true;
                  else {
                    for (var i = dbTiles.length; i--;) {
                      if (dbTiles[i]!=tiles[i]) changed=true;
                    }
                  }

                  //if a change has been made, that means the opponent made a move. (FIXME: does it?? only if you update local state before pushing)
                  //turn will become "mine" if a change has been made.
                  if (changed) {
                    console.log("old: " + tiles);
                    console.log("DB: " + dbTiles);
                    this.setState({whoseTurn: this.props.username, tiles: dbTiles});
                    this.checkWinner();
                  }
                  //else, no change was made. Keep waiting
              }.bind(this),
              error: function(xhr, status, err) {
                  console.error(xhr, API_URL, status, err.toString() + " @ loadOnlineUsersFromServer");
              }.bind(this)
          });
      }
  },
  checkWinner: function() {
    //middle row, middle column, "  \  ", "  /  "
    let tiles = this.state.tiles;
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
    else if (tiles.length == 9) {
      let tieGame = true;
      for (var i = tiles.length; i--;) {
        let tile = tiles[i];
        if (tile == null || tile == "") tieGame=false;
      }
      if (tieGame) this.props.onLoser(null);
      //else, tile 8 was clicked but not all the tiles are full.
      //no winner, loser, or tie, as the game is still in progress.
    }
    else {
      //some tiles remain to be clicked.
    }
  },
  handleTileClick: function(index, user) {
    //if it's my turn:
    if (this.state.whoseTurn == user) {
      //if the tile is empty
      if (this.state.tiles[index] == null) {

        //update local Game state. includes tiles and turn.
        this.state.tiles[index]=user;
        this.setState({whoseTurn: this.props.opponent, tiles: this.state.tiles}) //switch turn and leave updated state alone

        //then post the tile to the database.
        this.postMoveToServer(this.props.username, this.props.opponent, 0, index);
        this.checkWinner();
      }
    }
  },
  postMoveToServer: function(user, opp, board, tile) {
    let move = {username: user, opponent: opp, board: board, square: tile};
    $.ajax({
      url: API_MOVES,
      type: 'POST',
      dataType: "json",
      data: move,
      success: function(moves) {
      }.bind(this),
      error: function(xhr, status, err) {
          console.error(xhr, API_MOVES, status, err.toString() + " @ move");
      }.bind(this)
    });
  },
  render: function() {
    if (this.state.whoseTurn == "") this.state.whoseTurn = this.props.first;
    return (
      <div>
        <h3>It&rsquo;s {this.state.whoseTurn}&rsquo;s turn.</h3>
        <div id="gameGrid" className="GameGrid">
          <Tile id="tile0" index={0} user={this.props.username} text={this.state.tiles[0]} tileClicked={this.handleTileClick}/>
          <Tile id="tile1" index={1} user={this.props.username} text={this.state.tiles[1]}  tileClicked={this.handleTileClick}/>
          <Tile id="tile2" index={2} user={this.props.username} text={this.state.tiles[2]}  tileClicked={this.handleTileClick}/>
          <Tile id="tile3" index={3} user={this.props.username} text={this.state.tiles[3]}  tileClicked={this.handleTileClick}/>
          <Tile id="tile4" index={4} user={this.props.username} text={this.state.tiles[4]}  tileClicked={this.handleTileClick}/>
          <Tile id="tile5" index={5} user={this.props.username} text={this.state.tiles[5]}  tileClicked={this.handleTileClick}/>
          <Tile id="tile6" index={6} user={this.props.username} text={this.state.tiles[6]}  tileClicked={this.handleTileClick}/>
          <Tile id="tile7" index={7} user={this.props.username} text={this.state.tiles[7]}  tileClicked={this.handleTileClick}/>
          <Tile id="tile8" index={8} user={this.props.username} text={this.state.tiles[8]}  tileClicked={this.handleTileClick}/>
        </div>
      </div>
    );
  }
});
