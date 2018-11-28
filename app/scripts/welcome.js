import React from 'react';
import $ from 'jquery';
import '../css/base.css';
import UserNameForm from './usernameForm'
import { API_URL, POLL_INTERVAL } from './global';
import {browserHistory} from 'react-router'

module.exports = React.createClass({
    getInitialState: function() {
        return {username: "", errorMessage: ""};
    },
    handleUserNameSubmit: function(username) {
        this.setState({username: username});
        $.ajax({
            url: API_URL,
            dataType: 'json',
            type: 'POST',
            data: username,
            success: function(data) {
                console.log("Username Accepted");
                this.enterLobby();
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({username: "", errorMessage: "Sorry, that username is being used at the moment"});
                console.error(API_URL, status, err.toString());
            }.bind(this)
        });
    },
    enterLobby: function() {
        browserHistory.push({
            pathname:"/lobby", 
            state: {username: this.state.username}
        });
    },
    render: function() {
        return (
            <div>
                <h1 id="title">
                    Welcome to Tic Tac Toe!
                </h1>
                <UserNameForm onUserNameSubmit={this.handleUserNameSubmit}/>
                <p id="errorMessage">{this.state.errorMessage}</p>
            </div>
        );
    }
});