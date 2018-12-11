import React from 'react';
import $ from 'jquery';
import UserNameForm from './usernameForm'
import { API_URL, POLL_INTERVAL } from './global';
import {browserHistory} from 'react-router'
/** Welcome Component
* This React Class is the component attached to the home route.
* This is the first screen the user will see upon reaching the URL of the game
* There is a child component UsernameForm, which allows the user to sign in
* Once the user enters their username, the application checks if there already
* exists a user online with that username. If the username is not being used,
* then the user is directed by the React Router to the Lobby route, else
* the user is prompted to use a different name.
*/
module.exports = React.createClass({
    getInitialState: function() {
        return {username: "", errorMessage: ""};
    },
    handleUserNameSubmit: function(username) {
        this.setState({username: username});
        console.log("username object");
        console.log(username);
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
