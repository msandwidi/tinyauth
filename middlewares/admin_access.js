module.exports = async (req, res, next) => {
	if (!req.user.isSuperAdmin) {
		return res.status(403).json({
			success: false,
			message: "You don't have the privilege to access the requested resource."
		});
	}
	return next();
};
