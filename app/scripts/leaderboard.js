import React from 'react';
import $ from 'jquery';
import '../css/base.css';
import tableCSS from '../css/table.css'

/** Leaderboard Component
* 
*/
module.exports = React.createClass({
    getInitialState: function() {
        return { _isMounted: false};
    },
    render: function() {
        var float = { float: 'right'}
        var players = this.props.topPlayers.map(player => {
            //Add Table tab - Add CSS
            return (
                <tr>
                <td>{ player.username }</td><td> { player.wins } </td></tr>
                );
            });
            return (
            <div style = { float } >
                <h3>Leaderboard</h3>
                <table className={tableCSS.blueTable}>
                <tbody>
                <tr>
                <td> Username</td><td> # of Wins</td></tr>
                {players}
                </tbody>
                </table>

            </div>
            );
        }
    });