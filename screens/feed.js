import React, { Component, Fragment } from 'react';
import {
	StatusBar,
	ActivityIndicator,
	Alert,
	Text,
	View,
	StyleSheet,
	TextInput,
	Image
} from 'react-native';
import {
	StreamApp,
	FlatFeed,
	Activity,
	Avatar,
	LikeButton,
	CommentBox,
	CommentList,
	ReactionIconBar
} from 'expo-activity-feed';
import SafeAreaView from 'react-native-safe-area-view';

import config from '../config';

export default class Feed extends Component {
	constructor(props) {
		super(props);

		this.state = {
			token: null,
			isLoading: true
		};
	}

	componentDidMount() {
		fetch(config.api.tokenUrl, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-API-Key': config.api.key
			},
			body: JSON.stringify({
				user: 'all'
			})
		})
			.then(res => {
				if (res.status >= 400) {
					Alert.alert('Bad response from server');
					return;
				}

				return res.json();
			})
			.then(data => {
				this.setState({
					token: data.token,
					isLoading: false
				});
			});
	}

	render() {
		if (this.state.isLoading) {
			return (
				<SafeAreaView
					style={{ flex: 1 }}
					forceInset={{ top: 'always' }}
				>
					<View style={{ flex: 1, padding: 100 }}>
						<ActivityIndicator />
					</View>
				</SafeAreaView>
			);
		}

		return (
			<SafeAreaView
				style={[{ flex: 1 }, { backgroundColor: '#FFFFFF' }]}
				forceInset={{ top: 'always' }}
			>
				<StatusBar barStyle="dark-content" />
				<StreamApp
					appId={config.stream.app.id}
					apiKey={config.stream.app.key}
					token={this.state.token}
				>
					<FlatFeed
						feedGroup="timeline"
						userId="all"
						Activity={props => (
							<Fragment>
								<Activity
									{...props}
									Footer={
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center'
											}}
										>
											<ReactionIconBar>
												<LikeButton {...props} />
											</ReactionIconBar>
										</View>
									}
								/>
								<CommentList
									reactions={props.activity.latest_reactions}
								/>
								<CommentBoxEdit
									onSubmit={text =>
										props.onAddReaction(
											'comment',
											props.activity,
											{
												data: { text: text }
											}
										)
									}
									avatarProps={{
										source:
											'https://i.imgur.com/T4kO8H2.png'
									}}
									styles={{ container: { height: 80 } }}
								/>
							</Fragment>
						)}
					/>
				</StreamApp>
			</SafeAreaView>
		);
	}
}

export class CommentBoxEdit extends Component {
	static defaultProps = {
		styles: {}
	};

	state = {
		text: ''
	};

	render() {
		return (
			<Fragment>
				<View style={{ height: this.props.height }} />
				<View
					style={{
						flexDirection: 'row',
						borderBottomColor: '#aeaeae',
						borderTopColor: '#aeaeae',
						borderBottomWidth: 1,
						borderTopWidth: 1
					}}
				>
					{this.props.noAvatar || (
						<Avatar
							size={48}
							styles={{ container: { margin: 10 } }}
							{...this.props.avatarProps}
						/>
					)}
					<TextInput
						value={this.state.text}
						style={{ flex: 1 }}
						placeholder="Your comment..."
						underlineColorAndroid="transparent"
						returnKeyType="send"
						onChangeText={text => this.setState({ text })}
						onSubmitEditing={async event => {
							this.setState({ text: '' });
							this.props.onSubmit(event.nativeEvent.text);
						}}
					/>
				</View>
			</Fragment>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	commentBox: {
		marginTop: 100
	}
});
