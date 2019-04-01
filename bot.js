const { dbUser, dbPass, TOKEN: token } = process.env;
const User = require('./models/user');
const Message = require('./models/message');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const {
	getRandomDishAbbreviation,
	cheEllable,
	getPhrasePrefix,
	isReport,
	getExplanation,
	poyasniable,
	getRandomInt,
	generateRespectMessage,
	generateDisrespectMessage,
	containsBologneze,
	dictionary
} = require('./helpers');

const Bot = require('node-telegram-bot-api');
let bot;

if (process.env.NODE_ENV === 'production') {
  	bot = new Bot(token);
  	bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  	bot = new Bot(token, { polling: true });
}

let lastPhrase = null;

mongoose.connect(`mongodb://cheelUser:${encodeURIComponent(process.env.db_pass)}@cheel-shard-00-00-nuead.mongodb.net:27017,cheel-shard-00-01-nuead.mongodb.net:27017,cheel-shard-00-02-nuead.mongodb.net:27017/test?ssl=true&replicaSet=cheel-shard-0&authSource=admin&retryWrites=true`)
	.then(async () => {
		console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

		bot.on('message', async (msg) => {
			console.log(msg);
			const chat_id = String(msg.chat.id);
			const isBot = msg.from.is_bot;

			if (!await User.findOne({ id: msg.from.id, chat_id })) {
				await User.create({ ...msg.from, chat_id });
			}
			await Message.create({ id: msg.message_id, userId: msg.from.id, date: msg.date, text: msg.text, chat_id });

			if (msg.text.includes('@CheElBot')) {
				if (cheEllable(msg.text)) {
					lastPhrase = getRandomDishAbbreviation();
					let message = `${getPhrasePrefix()} ${lastPhrase.join('')}`;
					if (getRandomInt(0, 2) > 1) {
						message += ' на тарелке';
					}
					bot.sendMessage(chat_id, message);
				}
				if (poyasniable(msg.text) && lastPhrase) {
					bot.sendMessage(chat_id, getExplanation(lastPhrase))
				}
			} else if (!isBot) {
				if (isReport(msg.text) && getRandomInt(0, 20) > 17) {
					bot.sendMessage(chat_id, generateRespectMessage());
				}
				if (containsBologneze(msg)) {
					bot.sendMessage(chat_id, generateDisrespectMessage());
				}
			}
			
		});
	})
 
const listOfShameRule = new schedule.RecurrenceRule();
listOfShameRule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
listOfShameRule.hour = 19;
listOfShameRule.minute = 00;
// listOfShameRule.second = 10;
 
schedule.scheduleJob(listOfShameRule, async function() {
	const chatIds = await User.getAllChatIds();
	for (const chatId of chatIds) {
		const listOfShame = await User.generateListOfShame(chatId);
		bot.sendMessage(chatId, listOfShame);
	}
});

const cheElRule = new schedule.RecurrenceRule();
cheElRule.hour = 12;
cheElRule.minute = 0;
// cheElRule.second = 10;
 
schedule.scheduleJob(cheElRule, async function() {
	const chatIds = await User.getAllChatIds();
	for (const chatId of chatIds) {
		const nonReportedUser = await User.getNonReportedUser(chatId);
		if (nonReportedUser) {
			bot.sendMessage(chatId, nonReportedUser.generateCheElMessage());
		}
	}
});

const randomDishRule = new schedule.RecurrenceRule();
randomDishRule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
randomDishRule.hour = 15;
randomDishRule.minute = 00;
// randomDishRule.second = 10;
 
schedule.scheduleJob(randomDishRule, async function() {
	const chatIds = await User.getAllChatIds();
	for (const chatId of chatIds) {
		bot.sendMessage(chatId, getRandomDishAbbreviation());
	}
});

const http = require("http");
setInterval(function() {
    http.get("http://desolate-headland-13968.herokuapp.com/");
}, 300000);

module.exports = bot;

