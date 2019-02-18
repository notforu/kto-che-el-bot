const { dbUser, dbPass, TOKEN: token } = process.env;
const User = require('./models/user');
const Message = require('./models/message');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const { getRandomDishAbbreviation } = require('./helpers');

const Bot = require('node-telegram-bot-api');
let bot;

if (process.env.NODE_ENV === 'production') {
  	bot = new Bot(token);
  	bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  	bot = new Bot(token, { polling: true });
}

mongoose.connect(`mongodb://cheelUser:${encodeURIComponent(process.env.db_pass)}@cheel-shard-00-00-nuead.mongodb.net:27017,cheel-shard-00-01-nuead.mongodb.net:27017,cheel-shard-00-02-nuead.mongodb.net:27017/test?ssl=true&replicaSet=cheel-shard-0&authSource=admin&retryWrites=true`)
	.then(() => {
		console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

		bot.on('message', async (msg) => {
			console.log(msg);

			if (!await User.findOne({ id: msg.from.id, chat_id: msg.chat.id })) {
				await User.create({ ...msg.from, chat_id: msg.chat.id });
			}
			await Message.create({ id: msg.message_id, userId: msg.from.id, date: msg.date, text: msg.text, chat_id: msg.chat.id });
		});
	})

 
const leafOfShameRule = new schedule.RecurrenceRule();
leafOfShameRule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
leafOfShameRule.hour = 19;
leafOfShameRule.minute = 00;
// leafOfShameRule.second = 10;
 
schedule.scheduleJob(leafOfShameRule, async function() {
	const chatIds = await User.getAllChatIds();
	for (const chatId of chatIds) {
		const leafOfShame = await User.generateLeafOfShame(chatId);
		bot.sendMessage(chatId, leafOfShame);
	}
});

const cheElRule = new schedule.RecurrenceRule();
cheElRule.hour = 9;
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

module.exports = bot;

