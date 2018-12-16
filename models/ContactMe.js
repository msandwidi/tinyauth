const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MessageSchema = new Schema({
	author: String,
	email: String,
	phoneNumber: String,
	subject: String,
	body: String,
	isDeleted: {
		type: Boolean,
		default: false
	},
	isProcessed: {
		type: Boolean,
		default: false
	},
	isFlagged: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	updatedAt: {
		type: Date,
		default: Date.now()
	}
});

MessageSchema.statics.findMessages = function () {
	let Message = this;
	return Message.find({
		isDeleted: false
	});
};

MessageSchema.statics.findAndFlag = function (list) {
	let Message = this;

	return Message.updateMany({
		_id: {
			$in: list
		},
		isFlagged: false,
		isDeleted: false
	}, {
		isFlagged: true
	});
};

MessageSchema.statics.findAndUnFlag = function (list) {
	let Message = this;

	return Message.updateMany({
		_id: {
			$in: list
		},
		isDeleted: false,
		isFlagged: true
	}, {
		isFlagged: false
	});
};

MessageSchema.statics.deleteMessages = function (list) {
	let Message = this;

	return Message.updateMany({
		_id: {
			$in: list
		},
		isDeleted: false
	}, {
		isDeleted: true
	});
};

MessageSchema.methods.checkAsProcessed = function () {
	let message = this;

	message.isProcessed = true;
	message.updatedAt = Date.now();

	return message.save();
};

module.exports = mongoose.model('Message', MessageSchema);