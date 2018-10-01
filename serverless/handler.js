'use strict';

const stream = require('getstream');
const Twit = require('twit');
const moment = require('moment');

const config = require('./config');

const streamClient = stream.connect(
	config.stream.app.key,
	config.stream.app.secret
);

const twitterClient = new Twit({
	consumer_key: config.twitter.consumer.key,
	consumer_secret: config.twitter.consumer.secret,
	access_token: config.twitter.access.token,
	access_token_secret: config.twitter.access.secret,
	strictSSL: config.twitter.ssl.strictSSL
});

module.exports.token = (event, context, callback) => {
	const data = JSON.parse(event.body);

	const token = streamClient.createUserSessionToken(data.user);

	const response = {
		statusCode: 200,
		body: JSON.stringify({ token: token })
	};

	callback(null, response);
};

module.exports.crawl = () => {
	twitterClient.get(
		'search/tweets',
		{ q: '@FlyFrontier', count: 100 },
		(err, data, res) => {
			data.statuses.map(status => {
				streamClient
					.feed('timeline', 'all')
					.addActivity({
						actor: streamClient.collections.createUserReference(
							status.user.screen_name
						),
						verb: 'tweet',
						object: status.text,
						attachments: {
							og: {
								title: status.text,
								description: 'via Aviato for Twitter',
								url: `https://twitter.com/${
									status.user.screen_name
								}/status/${status.id_str}`,
								images: [
									{
										image:
											'https://pbs.twimg.com/profile_images/700447615062642688/fXsrshge_400x400.jpg'
									}
								]
							}
						},
						time: moment(
							status.created_at,
							'ddd MMM DD HH:mm:ss ZZ YYYY'
						).toISOString(),
						foreign_id: status.id_str
					})
					.then(res => {
						streamClient.collections
							.upsert('user', {
								id: status.user.screen_name,
								name: '@' + status.user.screen_name,
								profileImage:
									status.user.profile_image_url_https
							})
							.then(res => {
								callback(null, res);
							})
							.catch(err => {
								callback(err);
							});
					})
					.catch(err => {
						callback(err);
					});
			});
		}
	);
};
