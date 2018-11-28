import React from 'react';
import $ from 'jquery';
import '../css/base.css';
import {API_URL, POLL_INTERVAL } from './global'

module.exports = React.createClass({
    getInitialState: function() {
        return {users: [], _isMounted: false};
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
    componentDidMount: function() {
        window.addEventListener("beforeunload", event => { this.logout() });
        window.onpopstate = event => { this.logout() };
        console.log("Mounted");
        this.state._isMounted = true;
        this.loadOnlineUsersFromServer();
        setInterval(this.loadOnlineUsersFromServer, POLL_INTERVAL);
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
    },
    render: function() {
        var onlineUsers = this.state.users.map(user => {
            return(<p>{user.username}</p>);
        });
        //<input id="search" type="text"/>
        return (
            <div>
                <h1 id="title"> Tic Tac Toe Lobby</h1>
                <h3 id="usersHeading">Online Users</h3>

                <div>
                    {onlineUsers}
                </div>
                <input type="button" onClick={this.logout} value="Logout"/>
            </div>
        );
    }
});