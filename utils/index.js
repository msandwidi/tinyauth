const jwt = require('jsonwebtoken');
const { uid } = require('rand-token');

const config = require('../config');

let utils = {};

const generateRandomNumber = (size) => {
	const semiRandomizer = () => {
		return Math.random().toString().slice(2, size + 2);
	};
	let token = semiRandomizer();
	let counter = 5;
	while (/(.)\1\1/.test(token) && counter > 0) {
		token = semiRandomizer();
		counter--;
	}
	return token;
};

utils.verifyToken = (token) => {
	if (!token) return null;

	let decoded;
	try {
		decoded = jwt.verify(token, config.JWT_SECRET_KEY);
		return decoded;
	} catch (e) {
		console.log(e);
		return null;
	}
};

utils.generateRandomToken = (type, length = 7) => {
	if (type === 'number') {
		return generateRandomNumber(length);
	}
	return uid(length);
};

module.exports = utils;
