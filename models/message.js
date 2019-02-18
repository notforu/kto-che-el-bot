const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true
	},
	userId: {
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	date: {
		type: Number,
		required: true
	},
	chat_id: {
		type: String,
		required: true		
	}
});

module.exports = mongoose.model('Message', MessageSchema);