import React, { Component } from 'react';
import { StatusBar, StyleSheet, Text, View, Image } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { NavigationActions } from 'react-navigation';

export default class Welcome extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		setTimeout(() => {
			this.props.navigation.navigate('Feed');
		}, 1000);
	}

	render() {
		return (
			<SafeAreaView
				style={[{ flex: 1 }, { backgroundColor: '#108151' }]}
				forceInset={{ top: 'always' }}
			>
				<StatusBar barStyle="light-content" />
				<View style={styles.content}>
					<Image
						source={require('../assets/aviato-logo-white.png')}
						style={styles.logo}
					/>
				</View>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		alignItems: 'center',
		marginTop: 160
	},
	logo: {
		width: '75%',
		resizeMode: 'contain'
	}
});
