import React from 'react';
import $ from 'jquery';
import '../css/base.css';
import {API_URL, POLL_INTERVAL, API_CHALLENGES } from './global'
import { browserHistory } from 'react-router'
import Match from "./match"

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
        return {users: [], _isPlaying: false, _isMounted: false, _isChallenging: false};
    },
    loadOnlineUsersFromServer: function() {
        if(this.state._isMounted){
            $.ajax({
                url: API_URL,
                dataType: 'json',
                cache: false,
                success: function(users) {
                    console.log("Success: " + users);
                    this.setState({users: users});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(xhr, API_URL, status, err.toString() + " @ loadOnlineUsersFromServer");
                }.bind(this)
            });
        }
    },
    checkDatabaseForChallenges: function() {
    	console.log("Props: ")
    	console.log(this.props);
    	console.log(this.props.location.state.username.username);
    	var data = {username: this.props.location.state.username.username };
    	console.log("Data: ");
    	console.log(data);
    	if(!this.state._isPlaying) {

	    	$.ajax({
	    		url: API_CHALLENGES,
	    		type: "GET",
	    		contentType:'application/json',
	            dataType: 'json',
	            data: data,
	            cache: false,
	            success: function(res) {
	            	console.log("Response from /api/challenges GET")
	            	console.log(res);
	            	if(res.result != "No Challenges") {
		            	console.log("Challenge Received: ");
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
        window.addEventListener("beforeunload", event => { this.logout() });
        window.onpopstate = event => { this.logout() };
        console.log("Mounted");
        this.state._isMounted = true;
        this.loadOnlineUsersFromServer();
        this.checkDatabaseForChallenges();
        setInterval(this.loadOnlineUsersFromServer, POLL_INTERVAL);
        setInterval(this.checkDatabaseForChallenges, POLL_INTERVAL);
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
    	alert(`${username} is the winner!`);
    	this.deleteChallenges(this.props.location.state.username.username);
    	this.state._isPlaying = false;
    	this.state._isChallenging = false;
    	this.state.opponent = undefined;
    },
    challenge: function(opponentName, first) {
    	this.state._isChallenging = true;
        if(opponentName == this.props.location.state.username.username) {
            console.log("That's you...");
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
        console.log(this.state.opponent);
        var isVisible = this.state.opponent != undefined;
        var onlineUsers = this.state.users.map((user, index) => {
        	var aStyle = { color: '#800000', cursor: 'pointer' };
            return(<div>
                    <a style={aStyle} onClick={() => this.challenge(user.username, user.username)}>{user.username}</a>
                    <br/>
                   </div>);
        });
        //<input id="search" type="text"/>
        return (
            <div>
                <div className="left">
                    <h1 id="title"> Welcome to Tic Tac Toe, {this.props.location.state.username.username}!</h1>
                    <h3 id="usersHeading">Online Users - Click a name to challenge them</h3>

                    <div>
                        {onlineUsers}
                    </div>
                </div>
                <div className="right">
                    <Match username={this.props.location.state.username.username} opponent={this.state.opponent} onWinner={this.winner} show={isVisible}/>
                </div>
            </div>
        );
    }
});