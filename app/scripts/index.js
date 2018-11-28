import React from 'react';
import ReactDOM from 'react-dom';
import Remarkable from 'remarkable';
import $ from 'jquery';
import { Router, Route, browserHistory } from 'react-router';

import '../css/base.css';

import Welcome from './welcome';
import Lobby from './lobby'

ReactDOM.render((
	
	<Router history={browserHistory}>
		<Route path="/" component={Welcome}/>
		<Route path="/lobby" component={Lobby}/>
		
	</Router>
    ),
    document.getElementById('content')
);
