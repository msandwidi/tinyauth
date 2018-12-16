const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');

const utils = require('../utils');
const config = require('../config');

const AdminSchema = new Schema({
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
		required: true
	},

	username: {
		type: String,
		trim: true,
		required: true,
		unique: true
	},

	password: {
		type: String,
		trim: true,
		required: true
	},

	oldPasswords: [ String ],

	phoneNumber: Number,

	isSuperAdmin: {
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
	}, // is suspended by superAdmin

	forcePwdReset: {
		type: Boolean,
		default: false
	},

	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'Admin'
	}
});

AdminSchema.plugin(timestamps);

AdminSchema.pre('save', function(next) {
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

AdminSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, cb);
};

AdminSchema.methods.toAuthProfile = function() {
	const userObject = this.toObject();

	return pick(userObject, [
		'email',
		'firstname',
		'lastname',
		'phoneNumber',
		'isSuperAdmin',
		'isVerified',
		'isClosed',
		'isBlocked'
	]);
};

AdminSchema.methods.toMyProfile = function() {
	const userObject = this.toObject();

	return pick(userObject, [
		'email',
		'firstname',
		'lastname',
		'phoneNumber',
		'isSuperAdmin',
		'isVerified',
		'isClosed',
		'isBlocked'
	]);
};

AdminSchema.methods.toPublicProfile = function() {
	const userObject = this.toObject();

	return pick(userObject, [ 'firstname', 'lastname' ]);
};

AdminSchema.methods.updatePassword = function(newPassword) {
	let user = this;
	user.password = newPassword;
	user.isVerified = true;
	user.isClosed = false;
	user.isBlocked = false;
	user.forcePwdReset = false;
	user.tokens = [];
	return user.save();
};

AdminSchema.methods.updateProfile = function(data) {
	let user = this;
	user.firstname = data.firstname;
	user.lastname = data.lastname;
	user.email = data.email;
	user.phoneNumber = data.phoneNumber;
	return user.save();
};

AdminSchema.methods.activateAccount = function() {
	let user = this;

	user.isVerified = true;
	user.forcePwdReset = false;
	user.isClosed = false;
	user.isBlocked = false;
	user.tokens = [];
	return user.save();
};

AdminSchema.methods.resetPassword = function(password) {
	let user = this;

	user.isVerified = true;
	user.forcePwdReset = true;
	user.isBlocked = false;
	user.isClosed = false;
	user.tokens = [];
	user.password = password;
	return user.save();
};

AdminSchema.methods.closeAccount = function() {
	let user = this;

	user.isClosed = true;
	user.tokens = [];
	user.password = utils.generateRandomToken(null, 24);
	return user.save();
};

AdminSchema.methods.reopenAccount = function() {
	let user = this;

	user.isVerified = true;
	user.forcePwdReset = true;
	user.isBlocked = false;
	user.isClosed = false;
	user.tokens = [];
	user.password = utils.generateRandomToken(null, 24);
	return user.save();
};

AdminSchema.methods.setToSuperAdmin = function() {
	let user = this;

	user.isSuperAdmin = true;
	user.isVerified = true;
	user.forcePwdReset = true;
	user.isBlocked = false;
	user.isClosed = false;
	user.tokens = [];
	user.password = utils.generateRandomToken(null, 24);
	return user.save();
};

AdminSchema.methods.revokeAdmin = function() {
	let user = this;

	user.isSuperAdmin = false;
	user.isVerified = true;
	user.isBlocked = false;
	user.isClosed = false;
	user.forcePwdReset = false;
	user.tokens = [];
	return user.save();
};

AdminSchema.methods.blockAccount = function() {
	let user = this;

	user.isBlocked = true;
	user.isClosed = false;
	user.tokens = [];
	return user.save();
};

AdminSchema.methods.generateToken = function(access) {
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
					token: authToken
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
			const resetCode = utils.generateRandomToken('number');
			const resetToken = jwt
				.sign(
					{
						_id: user._id.toHexString(),
						token: resetCode.toString(),
						access
					},
					config.JWT_SECRET_KEY,
					{
						expiresIn: 60 * 5 // 5minutes
					}
				)
				.toString();

			user.tokens = user.tokens.concat([
				{
					access,
					token: resetToken
				}
			]);

			return user
				.save()
				.then((user) => {
					if (!user) return Promise.resolve();
					return new Promise((resolve) =>
						resolve({
							resetCode,
							resetToken
						})
					);
				})
				.catch((e) => {
					console.log(e);
					return Promise.resolve();
				});

		case 'new_pwd':
			const newPWdToken = jwt
				.sign(
					{
						_id: user._id.toHexString(),
						access
					},
					config.JWT_SECRET_KEY,
					{
						expiresIn: 60 * 5 // 5 mn
					}
				)
				.toString();

			user.tokens = [];
			user.tokens = user.tokens.concat([
				{
					access,
					token: newPWdToken,
					expiration: Date.now() + 1000 * 60 * 5 // 5mn
				}
			]);
			user.isBlocked = true;

			return user
				.save()
				.then((user) => {
					if (!user) return Promise.resolve();
					return new Promise((resolve) => resolve(newPWdToken));
				})
				.catch((e) => {
					console.log(e);
					return Promise.resolve();
				});

		case 'activation':
			const userToken = utils.generateRandomToken('number');
			const signedToken = jwt
				.sign(
					{
						_id: user._id.toHexString(),
						access,
						token: userToken
					},
					config.JWT_SECRET_KEY,
					{
						expiresIn: 60 * 30 // 30 minutes
					}
				)
				.toString();

			user.tokens = user.tokens.concat([
				{
					access,
					token: signedToken,
					expiration: Date.now() + 1000 * 60 * 30
				}
			]);

			return user
				.save()
				.then((user) => {
					if (!user) return Promise.resolve();
					return new Promise((resolve) => resolve(userToken));
				})
				.catch((e) => {
					console.log(e);
					return Promise.resolve();
				});

		default:
			return Promise.resolve();
	}
};

AdminSchema.statics.findByToken = function(access, token, code) {
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
			decoded = utils.verifyToken(token);
			if (!decoded || (decoded.token && decoded.token !== code)) return Promise.resolve();

			return User.findOne({
				_id: decoded._id,
				'tokens.token': token,
				'tokens.access': access,
				isClosed: false,
				isVerified: true
			});

		case 'activation':
			decoded = utils.verifyToken(token);
			if (!decoded || decoded.token !== code) return Promise.resolve();

			return User.findOne({
				_id: decoded._id,
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
				isClosed: false,
				isVerified: true,
				isBlocked: true
			});

		default:
			return Promise.resolve();
	}
};

AdminSchema.methods.removeToken = function(token) {
	let user = this;
	return user.updateOne({
		$pull: {
			tokens: {
				token
			}
		}
	});
};

AdminSchema.methods.clearAccessToken = function() {
	let user = this;
	user.tokens = [];
	return user.save();
};

AdminSchema.statics.findByCredentials = function(username, password) {
	const User = this;

	return User.findOne({
		username,
		isClosed: false,
		isVerified: true
	}).then((user) => {
		if (!user) return Promise.resolve();
		return new Promise((resolve) => {
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (err || !isMatch) return resolve();
				return resolve(user);
			});
		});
	});
};

module.exports = mongoose.model('Admin', AdminSchema);
