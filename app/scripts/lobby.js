import React from 'react';
import $ from 'jquery';
import '../css/base.css';
import {API_URL, POLL_INTERVAL, API_CHALLENGES, API_TOP_USERS } from './global'
import { browserHistory } from 'react-router'
import Match from "./match"
import Leaderboard from "./leaderboard"

/**
* The Lobby Class handles most of the core functionality of the application
* There exists a child class called Match, which handles the game logic after
* two players have already argeed to play a game. Once the user logs in, they can
* see all of the other users that are currently online. By clicking on another
* name, the application sends a challenge request to the user with that name. If
* the user accepts, the Match component is set to visible and given the usernames of
* both the user and the opponent. Upon the user either closing the window, or
* pressing the back button, the user is considered offline and deleted from the
* list of online users.
*/
module.exports = React.createClass({
    getInitialState: function() {
        return {users: [], _isPlaying: false, _isMounted: false, _isChallenging: false, errorMessage: "", topPlayers: []};
    },
    loadOnlineUsersFromServer: function() {
        if(this.state._isMounted){
            $.ajax({
                url: API_URL,
                dataType: 'json',
                cache: false,
                success: function(users) {
                    this.setState({users: users});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(xhr, API_URL, status, err.toString() + " @ loadOnlineUsersFromServer");
                }.bind(this)
            });
        }
    },
    loadTopPlayersFromServer: function() {
    	if(this.state._isMounted){
            $.ajax({
                url: API_TOP_USERS,
                dataType: 'json',
                cache: false,
                success: function(users) {
                    var top10 = users.result;
                    top10.sort( (user1, user2) => user2.wins - user1.wins);
                    if(top10.length > 10) {
                    	top10 = top10.slice(0, 10);
                    }
                    this.setState({topPlayers: top10});

                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(xhr, API_URL, status, err.toString() + " @ loadTopPlayersFromServer");
                }.bind(this)
            });
        }
    },
    checkDatabaseForChallenges: function() {
    	var data = {username: this.props.location.state.username.username };
    	if(!this.state._isPlaying) {
	    	$.ajax({
	    		url: API_CHALLENGES,
	    		type: "GET",
	    		contentType:'application/json',
	            dataType: 'json',
	            data: data,
	            cache: false,
	            success: function(res) {
	            	if(res.result != "No Challenges") {
		            	var popuptext = `${res.result} has challenged you. Accept?`;
		            	if(this.state._isChallenging) {
	            			popuptext = `${res.result} has accepted. Start Game?`;
		            	}
		            	var accept = confirm(popuptext);
		            	if (accept) {
		            		console.log("You accepted the challenge");
		            		this.state._isPlaying = true;
		            		this.setState({opponent: res.result});
		            		this.challenge(res.result, this.props.location.state.username.username);
		            	} else {
		            		this.deleteChallenges(res.result);
		            	}

	            	}
	            }.bind(this),
	            error: function(xhr, status, err) {
	                console.error(xhr, API_URL, status, err.toString() + " @ checkDatabaseForChallenges");
	            }.bind(this)
	    	});
    	}
    },
    componentDidMount: function() {
    	// Listeners for if the user exits the page
        window.addEventListener("beforeunload", event => { this.logout() });
        window.onpopstate = event => { this.logout() };
        console.log("Mounted");
        this.state._isMounted = true;
        this.loadOnlineUsersFromServer();
        this.checkDatabaseForChallenges();
        this.loadTopPlayersFromServer();
        setInterval(this.loadOnlineUsersFromServer, POLL_INTERVAL);
        setInterval(this.checkDatabaseForChallenges, POLL_INTERVAL);
        setInterval(this.loadTopPlayersFromServer, POLL_INTERVAL);
    },
    logout: function() {
        console.log("Logout!");
        console.log(this.props.location.state.username.username);
        $.ajax({
            url: API_URL,
            type: 'DELETE',
            dataType: "json",
            data: {"username": `${this.props.location.state.username.username}`},
            success: function(users) {
                console.log("Delete Success")
                this.setState({});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(xhr, API_URL, status, err.toString() + " @ logout");
            }.bind(this)
        });
        this.deleteChallenges(this.props.location.state.username.username);

    },
    winner: function(username) {
    	if(username != null) {
    		alert(`${username} is the winner!`);
    		this.winGame(username);
    	} else {
    		alert("The game was a tie :/");
    	}
    	this.clearGame();
    },
    loser: function(username) {
    	if(username != null) {
    		alert(`${username} lost :<`);
    	} else {
    		alert("The game was a tie :/");
    	}
    	this.clearGame();
    },
    winGame: function(username) {
      if(username == this.props.location.state.username.username) {
      var user = this.state.topPlayers.find(user => user.username == username);
      if(user == undefined) {
        user = { username: username, wins: 0};
      }
      console.log("User has won a game");
      console.log(user);
      this.updateLeaderboard(user.username, Number(user.wins) + 1);
      }
    },
    clearGame: function() {
      this.deleteChallenges(this.props.location.state.username.username);
    	this.state._isPlaying = false;
    	this.state._isChallenging = false;
    	this.state.opponent = undefined;
    },
    updateLeaderboard: function(username, wins) {
    	$.ajax({
    		url: API_TOP_USERS,
            type: 'PUT',
            dataType: "json",
            data: {"username": username, "wins": wins},
            success: function(users) {
                console.log("Leaderboard Updated")
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(xhr, API_URL, status, err.toString() + " @ updateLeaderboard");
            }.bind(this)
    	})
    },
    challenge: function(opponentName, first) {
    	this.state._isChallenging = true;
        if(opponentName == this.props.location.state.username.username) {
            this.state.errorMessage = "That's you, ya stupid...";
            setTimeout(() => this.state.errorMessage = "", 2000);
        } else {
            $.ajax({
            	url: API_CHALLENGES,
	            type: 'POST',
	            dataType: "json",
	            data: {"username": `${this.props.location.state.username.username}`,
        				"opponent": `${opponentName}`,
        				"first": first},
	            success: function(users) {
	                console.log("Issuing challenge to: " + opponentName);
	            }.bind(this),
	            error: function(xhr, status, err) {
	                console.error(xhr, API_CHALLENGES, status, err.toString() + " @ challenge");
	            }.bind(this)
            })
        }
    },
    deleteChallenges : function(username) {
    	$.ajax({
        	url: API_CHALLENGES,
            type: 'DELETE',
            dataType: "json",
            data: {"username": username},
            success: function(users) {
                console.log("Delete Success")
                this.setState({});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(xhr, API_CHALLENGES, status, err.toString() + " @ logout");
            }.bind(this)
        })
    },
    render: function() {
        var isVisible = this.state.opponent != undefined;
        var messageStyle = { color: '#333333' };
        var onlineUsers = this.state.users.map((user, index) => {
        	var aStyle = { color: '#800000', cursor: 'pointer' };
            return(<div>
                    <a style={aStyle} onClick={() => this.challenge(user.username, user.username)}>{user.username}</a>
                    <br/>
                   </div>);
        });
        //randomly determine who gets to make the first move.
        let firstPlayer = Math.floor(Math.random() * Math.floor(2)); //expected output: 0 or 1
        let whoPlaysFirst;
        if (firstPlayer == 0) whoPlaysFirst = this.props.location.state.username.username;
        else whoPlaysFirst = this.state.opponent;
        return (
            <div>
                <div className="left">
                    <h1 id="title"> Welcome to Tic Tac Toe, {this.props.location.state.username.username}!</h1>
                    <Leaderboard topPlayers={ this.state.topPlayers }/>
                    <h3 id="usersHeading">Online Users - Click a name to challenge them</h3>
                    <i id="message" style={ messageStyle }>{ this.state.errorMessage }</i>
                    <div>
                        {onlineUsers}
                    </div>
                </div>
                <div className="right">
                    <Match username={this.props.location.state.username.username} opponent={this.state.opponent} first={whoPlaysFirst} onWinner={this.winner} onLoser={this.loser} show={isVisible}/>
                </div>
            </div>
        );
    }
});
