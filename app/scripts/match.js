import React from 'react';
import GameGrid from "./gameGrid.js"
import $ from 'jquery';

/** Match Component
* This React Class is a mediator between the Lobby Class,
* the main parent component of the application, and the Game Component
* The parameters of the component are username (a String), opponent (a String), and onWinner (a function)
* username is the client's entered username
* opponent is the username of the other player that the client is currently playing against
* onWinner is a function that should be called when one of the players wins the game
* Usage: <Match username="Player1" opponent="Player2" onWinner={ () => someFunction() }
*/
module.exports = React.createClass({
    getInitialState: function() {
        return {username: "", opponent: "", _isMounted: false};
    },
    render: function() {
        if(this.props.show) {
            return (
                <div>
                    <h1 id="title">{this.props.username} VS. {this.props.opponent}</h1>
                    <br></br>
                    <button onClick={() => this.props.onWinner(this.props.username)}>Click this button to Win!! </button>
                    <GameGrid tiles={[]} username={this.props.username} opponent={this.props.opponent} first={this.props.first} onWinner={this.props.onWinner} onLoser={this.props.onLoser}/>
                </div>
            );
        } else {
            return(<div></div>);
        }
    }
});
