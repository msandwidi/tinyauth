const utils = require('../utils');

module.exports = async (req, res, next) => {
	const bearer = req.headers['authorization'];
	try {
		if (!bearer || bearer.split(' ')[1].trim() === '') {
			return res.status(403).json({
				success: false,
				message: 'Unable to authenticate your request'
			});
		}

		const token = bearer.split(' ')[1].trim();
		const decoded = utils.verifyToken(token);

		if (!decoded) {
			return res.status(403).json({
				success: false,
				message: 'Your session must have expired'
			});
		}

		req.token = token;
		req.decodedToken = decoded;

		return next();
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request'
		});
	}
};