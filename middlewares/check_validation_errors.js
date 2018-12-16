const { validationResult } = require('express-validator/check');

module.exports = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const message = errors.array()[0].msg;
		return res.status(400).json({
			success: false,
			message
		});
	}

	return next();
};
