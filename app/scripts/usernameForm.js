import React from 'react'
/** UsernameForm Component
* This React Class handles the user logging in to the system
* The input is saved and passed to the parent class, Welcome
* Usage <UsernameForm onUserNameSubmit={ () => someFunction() }
*/
module.exports = React.createClass({
    getInitialState: function() {
        return {username: ''};
    },
    handleUserNameChange: function(e) {
        this.setState({username: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var username = this.state.username.trim();
        console.log(username);
        if (!username) {
            return;
        }
        this.props.onUserNameSubmit({username : username});
        this.setState({username : username});
    },
    render: function() {
        return (
            <div>
                <form className="commentForm" onSubmit={this.handleSubmit}>
                <p> Enter a Username </p>
                <input
                    type="text"
                    onChange={this.handleUserNameChange}
                />
                <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
});

