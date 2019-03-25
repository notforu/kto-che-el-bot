const mongoose = require('mongoose');
const Message = require('./message');
const { getRandomArrayElement, containsBologneze } = require('../helpers');

const RESPECT_MESSAGE = 'Таких не заметил. На этот счет сегодня всем едокам респект!';

const printNames = users => users.length > 0 ? users.map(user => user.getFullName()).join('\n') : RESPECT_MESSAGE;

const getStartOfTodayTimestamp = () => {
	const now = new Date();
	const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	return startOfDay / 1000;
}

const UserSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true
	},
	is_bot: {
		type: Boolean,
		required: true
	},
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: false
	},
	username: {
		type: String,
		required: false
	},
	chat_id: {
		type: String,
		required: true,
	}
});

UserSchema.methods.getTodayMessages = async function(chat_id) {
	return Message.find({ chat_id, userId: this.id, date: { $gt: getStartOfTodayTimestamp() } });
};

UserSchema.methods.hasReportedToday = function(todayMessages) {
	return todayMessages.length > 0;
};

UserSchema.methods.getFullName = function() {
	return [this.first_name, this.last_name].join(' ');
}

UserSchema.methods.generateCheElMessage = function() {
	return `${this.getFullName()}, что ел седня?)`;
}

UserSchema.methods.hasEatenBologneze = function(todayMessages) {
	return !!todayMessages.find(message => containsBologneze(message));
}

UserSchema.statics.generateListOfShame = async function(chat_id) {
	const users = await this.find({ chat_id });
	const notReportedUsers = [];
	const bolognezeUsers = [];

	for (const user of users) {
		const todayMessages = await user.getTodayMessages(chat_id);
		if (!user.hasReportedToday(todayMessages)) {
			notReportedUsers.push(user);
		}

		if (user.hasEatenBologneze(todayMessages)) {
			bolognezeUsers.push(user);
		}
	}

	const nonReportedTitle = 'Лист позора\n\nНе отчитались о съеденном:\n';
	const nonReportedBody = printNames(notReportedUsers);
	
	const bolognezeTitle = '\n\nЕли болоньзе:\n';
	const bolognezeBody = printNames(bolognezeUsers);

	return nonReportedTitle + nonReportedBody + bolognezeTitle + bolognezeBody;
}

UserSchema.statics.getNonReportedUser = async function(chat_id) {
	const users = await this.find({ chat_id });
	const notReportedUsers = [];

	for (const user of users) {
		const todayMessages = await user.getTodayMessages(chat_id);
		if (!user.hasReportedToday(todayMessages)) {
			notReportedUsers.push(user);
		}
	}

	return notReportedUsers.length > 0 ? getRandomArrayElement(notReportedUsers) : null;
}

UserSchema.statics.getAllChatIds = async function() {
	const users = await this.find();
	return users.reduce((acc, user) => {
		if (!acc.includes(user.chat_id)) {
			acc.push(user.chat_id);
		}
		return acc;
	}, []);
}

module.exports = mongoose.model('User', UserSchema);
