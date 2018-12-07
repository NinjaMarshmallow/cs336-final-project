import React from 'react';
import $ from 'jquery';
import '../css/base.css';
import {API_URL, POLL_INTERVAL } from './global'
import { browserHistory } from 'react-router'
import Match from "./match"
var API_CHALLENGES = "/api/challenges"

module.exports = React.createClass({
    getInitialState: function() {
        return {users: [], _isPlaying: false, _isMounted: false, _wins: false};
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
	            	console.log(res);
	            	if(res.result != "No Challenges") {
		            	console.log("Challenge Received: ");
		            	var accept = confirm(`${res.result} has challenged you. Accept?`);
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
    	} else {
    		this.deleteChallenges(this.props.location.state.username.username);
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
    	this._isPlaying = false;
    },
    challenge: function(opponentName, first) {
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
                    <h1 id="title"> Tic Tac Toe Lobby</h1>
                    <h3 id="usersHeading">Online Users - Click a name to challenge them</h3>

                    <div>
                        {onlineUsers}
                    </div>
                </div>
                <div className="right">
                    <Match username={this.props.location.state.username.username} opponent={this.state.opponent} show={isVisible}/>
                </div>
            </div>
        );
    }
});