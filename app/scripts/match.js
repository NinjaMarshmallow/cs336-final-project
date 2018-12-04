import React from 'react';
import $ from 'jquery';
import '../css/base.css';

module.exports = React.createClass({
    getInitialState: function() {
        return {username: "", opponent: "", _isMounted: false};
    },
    render: function() {
        if(this.props.show) {
        return (
            <div>
                <h1 id="title">{this.props.username} VS. {this.props.opponent}</h1>
            </div>
        );
        } else {
            return(<div></div>);
        }
    }
});