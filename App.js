import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import browserPollyfill from 'react-native-browser-polyfill';

import { Welcome, Feed } from './screens';

const RootStack = createStackNavigator({
	Welcome: {
		screen: Welcome,
		navigationOptions: {
			header: null
		}
	},
	Feed: {
		screen: Feed,
		navigationOptions: {
			header: null
		}
	}
});

export default class App extends Component {
	render() {
		return <RootStack />;
	}
}
