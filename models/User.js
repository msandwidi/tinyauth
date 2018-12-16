const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');

const utils = require('../utils');
const config = require('../config');

const UserSchema = new Schema({
	firstname: {
		type: String,
		trim: true,
		required: true
	},

	lastname: {
		type: String,
		trim: true,
		required: true
	},

	email: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},

	password: {
		type: String,
		trim: true,
		required: true
	},

	oldPasswords: [ String ],

	phoneNumber: Number,

	isAdmin: {
		type: Boolean,
		default: false
	},

	tokens: [
		{
			access: String,
			token: String,
			expiration: Date
		}
	],

	isBlocked: {
		type: Boolean,
		default: false
	}, // is locked by user or user's action

	isVerified: {
		type: Boolean,
		default: false
	}, // is verified after sign up

	isClosed: {
		type: Boolean,
		default: false
	}, // is suspended by admin

	forcePwdReset: {
		type: Boolean,
		default: false
	},

	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

UserSchema.plugin(timestamps);

UserSchema.pre('save', function(next) {
	let user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(10, function(err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);
			const pwdLength = user.oldPasswords.length;
			if (pwdLength >= 15) {
				// save only the last 15 passwords
				user.oldPasswords = user.oldPasswords.slice(pwdLength - 14);
			}
			user.oldPasswords = user.oldPasswords.concat([ hash ]);
			user.password = hash;

			return next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, cb);
};

UserSchema.methods.toJSON = function() {
	const userObject = this.toObject();

	return pick(userObject, [
		'_id',
		'email',
		'firstname',
		'middlename',
		'lastname',
		'phoneNumber',
		'isAdmin',
		'isVerified',
		'isActivated',
		'isClosed'
	]);
};

UserSchema.methods.toFullProfile = function() {
	const userObject = this.toObject();

	return pick(userObject, [
		'_id',
		'email',
		'firstname',
		'lastname',
		'phoneNumber',
		'isAdmin',
		'isVerified',
		'isBlocked',
		'isClosed'
	]);
};

UserSchema.methods.toAuthProfile = function() {
	const userObject = this.toObject();

	return pick(userObject, [
		'_id',
		'email',
		'firstname',
		'lastname',
		'phoneNumber',
		'isAdmin',
		'isVerified',
		'isBlocked',
		'isClosed'
	]);
};

UserSchema.methods.toPublicProfile = function() {
	const userObject = this.toObject();

	return pick(userObject, [ 'firstname', 'lastname' ]);
};

UserSchema.methods.toMyProfile = function() {
	const userObject = this.toObject();

	return pick(userObject, [
		'email',
		'firstname',
		'lastname',
		'phoneNumber',
		'isAdmin',
		'isVerified',
		'isBlocked',
		'isClosed'
	]);
};

UserSchema.methods.updatePassword = function(newPassword) {
	let user = this;
	user.password = newPassword;
	user.isBlocked = false;
	user.tokens = [];
	return user.save();
};

UserSchema.methods.updateProfile = function(data) {
	let user = this;
	user.firstname = data.firstname;
	user.lastname = data.lastname;
	user.email = data.email;
	user.phoneNumber = data.phoneNumber;
	return user.save();
};

UserSchema.methods.activateAccount = function() {
	let user = this;

	user.isVerified = true;
	user.isClosed = false;
	user.isBlocked = false;
	user.tokens = [];
	return user.save();
};

UserSchema.methods.resetPassword = function(password) {
	let user = this;

	user.isVerified = true;
	user.isBlocked = false;
	user.isClosed = false;
	user.tokens = [];
	user.password = password;
	return user.save();
};

UserSchema.methods.closeAccount = function() {
	let user = this;

	user.isClosed = true;
	user.tokens = [];
	user.password = utils.generateRandomToken(null, 24);
	return user.save();
};

UserSchema.methods.reopenAccount = function() {
	let user = this;

	user.isVerified = true;
	user.isBlocked = true;
	user.isClosed = false;
	user.tokens = [];
	user.password = utils.generateRandomToken(null, 24);
	return user.save();
};

UserSchema.methods.setToAdmin = function() {
	let user = this;

	user.isAdmin = true;
	user.isVerified = true;
	user.isBlocked = true;
	user.isClosed = false;
	user.tokens = [];
	return user.save();
};

UserSchema.methods.revokeAdmin = function() {
	let user = this;

	user.isAdmin = false;
	user.isVerified = true;
	user.isBlocked = true;
	user.isClosed = false;
	user.tokens = [];
	return user.save();
};

UserSchema.methods.blockAccount = function() {
	let user = this;

	user.isBlocked = true;
	user.isClosed = false;
	user.tokens = [];
	return user.save();
};

UserSchema.methods.generateToken = function(access) {
	let user = this;

	switch (access) {
		case 'auth':
			const authToken = jwt
				.sign(
					{
						_id: user._id.toHexString(),
						access
					},
					config.JWT_SECRET_KEY,
					{
						expiresIn: 60 * 60 * 12 // 12h max
					}
				)
				.toString();

			if (user.tokens && user.tokens.length >= 5) {
				const tokensSize = user.tokens.length;
				// no more than 5 devices
				user.tokens = user.tokens.slice(tokensSize - 4);
			}

			user.tokens = user.tokens.concat([
				{
					access,
					token: authToken,
					expiration: Date.now() + 1000 * 60 * 60 * 8 //8h
				}
			]);

			return user
				.save()
				.then((user) => {
					if (!user) return Promise.resolve();
					return new Promise((resolve) => resolve(authToken));
				})
				.catch((e) => {
					console.log(e);
					return Promise.resolve();
				});

		case 'reset':
			const resetToken = utils.generateRandomToken(null, 32);
			user.tokens = [];
			user.tokens = user.tokens.concat([
				{
					access,
					token: resetToken,
					expiration: Date.now() + 1000 * 60 * 30 // 30mn do not change
				}
			]);
			return user
				.save()
				.then((user) => {
					if (!user) return Promise.resolve();
					return new Promise((resolve) => resolve(resetToken));
				})
				.catch((e) => {
					console.log(e);
					return Promise.resolve();
				});

		case 'new_pwd':
			const newPwdToken = jwt
				.sign(
					{
						_id: user._id.toHexString(),
						access
					},
					config.JWT_SECRET_KEY,
					{
						expiresIn: 60 * 5 // 5minutes
					}
				)
				.toString();

			user.tokens = [];
			user.tokens = user.tokens.concat([
				{
					access,
					token: newPwdToken,
					expiration: Date.now() + 1000 * 60 * 5 //5mn
				}
			]);
			user.isBlocked = true;

			return user
				.save()
				.then((user) => {
					if (!user) return Promise.resolve();
					return new Promise((resolve) => resolve(newPwdToken));
				})
				.catch((e) => {
					console.log(e);
					return Promise.resolve();
				});
		case 'activation':
			const activationToken = utils.generateRandomToken(null, 32);
			user.tokens = [];

			user.tokens = user.tokens.concat([
				{
					access,
					token: activationToken,
					expiration: Date.now() + 1000 * 60 * 30 //30mn do not modify
				}
			]);

			return user
				.save()
				.then((user) => {
					if (!user) return Promise.resolve();
					return new Promise((resolve) => resolve(activationToken));
				})
				.catch((e) => {
					console.log(e);
					return Promise.resolve();
				});

		default:
			return Promise.resolve();
	}
};

UserSchema.statics.findByToken = function(access, token) {
	const User = this;

	let decoded;
	switch (access) {
		case 'auth':
			decoded = utils.verifyToken(token);
			if (!decoded) return Promise.resolve();

			return User.findOne({
				_id: decoded._id,
				'tokens.token': token,
				'tokens.access': access,
				isVerified: true,
				isBlocked: false,
				isClosed: false
			});

		case 'reset':
			return User.findOne({
				'tokens.token': token,
				'tokens.access': access,
				isVerified: true,
				isClosed: false
			});

		case 'activation':
			return User.findOne({
				'tokens.token': token,
				'tokens.access': access,
				isClosed: false,
				isVerified: false
			});

		case 'new_pwd':
			decoded = utils.verifyToken(token);
			if (!decoded) return Promise.resolve();

			return User.findOne({
				_id: decoded._id,
				'tokens.token': token,
				'tokens.access': access,
				isVerified: true,
				isBlocked: true,
				isClosed: false
			});

		default:
			return Promise.resolve();
	}
};

UserSchema.methods.removeToken = function(token) {
	var user = this;

	return user.updateOne({
		$pull: {
			tokens: {
				token
			}
		}
	});
};

UserSchema.methods.clearAccessToken = function() {
	var user = this;

	user.tokens = [];
	return user.save();
};

UserSchema.statics.findByCredentials = function(email, password) {
	const User = this;

	return User.findOne({
		email,
		isClosed: false
	}).then((user) => {
		if (!user) {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (err || !isMatch) return resolve();
				return resolve(user);
			});
		});
	});
};

UserSchema.statics.fetchAccounts = function() {
	const Accounts = this;
	return Accounts.find().select('-password -oldPasswords -tokens -_v');
};

module.exports = mongoose.model('User', UserSchema);
