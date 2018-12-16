const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
	const bearer = req.headers['authorization'];
	try {
		if (!bearer || bearer.split(' ')[1].trim() === '') {
			return res.status(401).json({
				success: false,
				message: 'You were not even logged in yet'
			});
		}
		const token = bearer.split(' ')[1].trim();

		const user = await Admin.findByToken('auth', token);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Your session must have expired'
			});
		}

		req.user = user;
		req.token = token;

		return next();
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request'
		});
	}
};
