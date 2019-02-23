const User = require('../models/User');

//middlewares
const authenticate = require('../middlewares/user_auth');
const requireJWTHeaderToken = require('../middlewares/require_header_token');
const checkValidationErrors = require('../middlewares/check_validation_errors');

//sendgird
const Mailer = require('../config/sendgrid');
const templateTypes = require('../config/sendgrid/_templateTypes');
const formatEmail = require('../config/sendgrid/_emailTemplates');

const validations = require('../validations');

const get_user_from_token = async (req, res) => {
	try {
		const user = await User.findByToken('auth', req.token);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Unable to authenticate your request'
			});
		}

		return res.json({
			success: true,
			token: req.token,
			user: user.toAuthProfile()
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while reverifying your request'
		});
	}
};

const delete_token = async (req, res) => {
	try {
		await req.user.removeToken(req.token);
		return res.status(200).json({
			success: true,
			message: 'You logged out successfully'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while logging you out.'
		});
	}
};

const get_my_profile = async (req, res) => {
	return res.status(200).json({
		success: true,
		profile: req.user.toMyProfile()
	});
};

const get_a_user_profile = async (req, res) => {
	try {
		const userId = req.params.id;

		const user = await User.findProfile(userId);

		if (!user) {
			status(404).json({
				success: false,
				message: 'Cannot find the selected profile'
			});
		}

		return res.status(200).json({
			success: true,
			profile: user.toPublicProfile()
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while logging you out.'
		});
	}
};

const get_dashboard = (req, res) => {
	return res.status(200).json({
		success: true,
		content: [
			{
				name: 'Tasks',
				items:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis egestas maecenas pharetra convallis posuere. Diam volutpat'
			}
		]
	});
};

const login_fetch_account = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await User.findByCredentials(email, password);

		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Invalid Credentials'
			});
		}

		req.user = user;
		return next();
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while signing you in'
		});
	}
};

const post_login = async (req, res) => {
	try {
		if (!req.user.isVerified) {
			return res.status(403).json({
				success: false,
				message: 'Your account is not activated yet'
			});
		}

		if (req.user.isBlocked) {
			return res.status(403).json({
				success: false,
				message: 'Your account is currently blocked. Please reset your password to gain access'
			});
		}

		const token = await req.user.generateToken('auth');

		if (!token) {
			return res.status(500).json({
				success: false,
				message: 'Unable to log you in'
			});
		}
		return res.status(200).json({
			success: true,
			token,
			user: req.user.toAuthProfile()
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while signing you in'
		});
	}
};

const post_signup = async (req, res) => {
	try {
		const { firstname, lastname, email, password, phoneNumber } = req.body;

		const existingUser = await User.findOne({
			email
		});

		if (!existingUser) {
			const newUser = new User({
				firstname,
				lastname,
				email,
				phoneNumber,
				password
			});

			const activationToken = await newUser.generateToken('activation');

			const emailHeader = {
				title: 'Confirm Your Account',
				subject: 'Confirm Your Account',
				recipients: [ newUser ]
			};

			const emailBody = {
				firstname,
				lastname,
				token: activationToken
			};

			const mailer = new Mailer(emailHeader, formatEmail(templateTypes.ACCOUNT_ACTIVATION_URL_EMAIL, emailBody));

			try {
				mailer.send();
			} catch (error) {
				console.log(error);
			}
		}

		return res.status(200).json({
			success: true,
			message:
				'A confirmation email will be sent to the email address you provided. If you do not received it, you probably cannot signup with that email address. Use another one and try again. Thank you'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while signing you up'
		});
	}
};

const post_account_recovery = async (req, res) => {
	try {
		const email = req.body.email;

		const user = await User.findOne({
			email,
			isVerified: true,
			isClosed: false
		});

		if (user) {
			const resetToken = await user.generateToken('reset');

			const emailHeader = {
				title: 'Account Recovery',
				subject: 'Account Recovery',
				recipients: [ user ]
			};

			const emailBody = {
				resetToken,
				email: user.email
			};

			const mailer = new Mailer(emailHeader, formatEmail(templateTypes.RESET_LINK, emailBody));

			try {
				mailer.send();
			} catch (error) {
				console.log(error);
			}
		}

		return res.status(200).json({
			success: true,
			message: 'Reset email sent'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request.'
		});
	}
};

const get_verify_reset_token = async (req, res) => {
	try {
		const id = req.params.id;

		const user = await User.findByToken('reset', id);

		if (!user) {
			return res.status(403).json({
				success: false,
				message: 'This link seems to be expired'
			});
		}

		const newPwdToken = await user.generateToken('new_pwd');

		const newEmail = {
			title: 'Account Activated',
			subject: 'Account Activated',
			recipients: [ user ]
		};

		const emailBody = {
			firstname: user.firstname,
			lastname: user.lastname
		};

		const mailer = new Mailer(newEmail, formatEmail(templateTypes.CONFIRM_ACTIVATION, emailBody));

		try {
			mailer.send();
		} catch (error) {
			console.log(error);
		}

		return res.status(200).json({
			success: true,
			token: newPwdToken,
			message: 'Enter your new password to continue'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request'
		});
	}
};

const post_pwd_reset = async (req, res) => {
	try {
		const password = req.body.password;

		const resetToken = req.token;

		const user = await User.findByToken('new_pwd', resetToken);

		if (!user) {
			return res.status(403).json({
				success: false,
				message: 'Unable to update your password. Your session must have expired.'
			});
		}
		user.updatePassword(password);

		const emailHeader = {
			title: 'Password Changed',
			subject: 'Password Changed',
			recipients: [ user ]
		};

		const emailBody = {
			firstname: user.firstname,
			lastname: user.lastname
		};

		const mailer = new Mailer(emailHeader, formatEmail(templateTypes.PASSWORD_CHANGED, emailBody));

		try {
			mailer.send();
		} catch (error) {
			console.log(error);
		}
		return res.status(200).json({
			success: true,
			message: 'Password updated successfully'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request'
		});
	}
};

const get_activate_account = async (req, res) => {
	try {
		const id = req.params.id;

		const user = await User.findByToken('activation', id);

		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'This link seems to be expired'
			});
		}

		if ((user.tokens && user.tokens.length !== 1) || !user.tokens[0].expiration > Date.now()) {
			const activationToken = await user.generateToken('activation');

			const emailHeader = {
				title: 'Confirm Your Account',
				subject: 'Confirm Your Account',
				recipients: [ user ]
			};

			const emailBody = {
				firstname,
				lastname,
				token: activationToken
			};

			const mailer = new Mailer(emailHeader, formatEmail(templateTypes.ACCOUNT_ACTIVATION_URL_EMAIL, emailBody));

			try {
				mailer.send();
			} catch (error) {
				console.log(error);
			}

			return res.status(403).json({
				success: false,
				message: 'Please activate your account via that we just sent to you.'
			});
		}

		user.activateAccount();

		const newEmail = {
			title: 'Account Activated',
			subject: 'Account Activated',
			recipients: [ user ]
		};

		const emailBody = {
			firstname: user.firstname,
			lastname: user.lastname
		};

		const mailer = new Mailer(newEmail, formatEmail(templateTypes.CONFIRM_ACTIVATION, emailBody));

		try {
			mailer.send();
		} catch (error) {
			console.log(error);
		}

		return res.status(200).json({
			success: true,
			message: 'Account Activation completed'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request'
		});
	}
};

const post_update_profile = async (req, res) => {
	try {
		const { password, email } = req.body;

		req.user.comparePassword(password, async (err, isMatch) => {
			if (err) {
				return res.status(500).json({
					success: false,
					message: 'An error occured while verifying your passwords.'
				});
			}

			if (!isMatch) {
				return res.status(400).json({
					success: false,
					message: 'The confirmation password is not correct'
				});
			}

			const existingUser = await User.findOne({
				email
			});

			if (!existingUser || existingUser._id.toHexString() === req.user._id.toHexString()) {
				req.user = await req.user.updateProfile(req.body);

				const emailHeader = {
					title: 'Account Updated',
					subject: 'Account Updated',
					recipients: [ req.user ]
				};

				const emailBody = {
					firstname: req.user.firstname,
					lastname: req.user.lastname
				};

				const mailer = new Mailer(emailHeader, formatEmail(templateTypes.ACCOUNT_UPDATED, emailBody));

				try {
					mailer.send();
				} catch (error) {
					console.log(error);
				}

				return res.status(200).json({
					success: true,
					user: req.user.toAuthProfile(),
					message: 'Your profile has been updated successfully.'
				});
			}

			return res.status(401).json({
				success: false,
				message: 'The entered email address is already taken.'
			});
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request'
		});
	}
};

const post_change_password = async (req, res) => {
	try {
		const { password, currentPassword } = req.body;

		req.user.comparePassword(currentPassword, async (err, isMatch) => {
			if (err) {
				return res.status(500).json({
					success: false,
					message: 'An error occured while verifying your passwords.'
				});
			}

			if (!isMatch) {
				return res.status(400).json({
					success: false,
					message: 'The confirmation password is not correct'
				});
			}

			req.user.updatePassword(password);

			const newEmail = {
				title: 'Password Changed',
				subject: 'Password Changed',
				recipients: [ req.user ]
			};
			
			const emailBody = {
				firstname: req.user.firstname,
				lastname: req.user.lastname
			};

			const mailer = new Mailer(newEmail, formatEmail(templateTypes.PASSWORD_CHANGED, emailBody));

			try {
				mailer.send();
			} catch (error) {
				console.log(error);
			}

			return res.status(200).json({
				success: true,
				message: 'Your password has been changed successfully.'
			});
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request'
		});
	}
};

module.exports = (app) => {
	app.get(`/api/v1/users/account/auth`, authenticate, get_user_from_token);
	app.get(`/api/v1/users/account/dashboard`, authenticate, get_dashboard);
	app.get(`/api/v1/users/account/my-profile`, authenticate, get_my_profile);
	app.get(`/api/v1/users/account/user-profile`, authenticate, get_a_user_profile);
	app.post(`/api/v1/users/account/signup`, validations.USER_SIGNUP, checkValidationErrors, post_signup);
	app.get(
		`/api/v1/users/account/activate/:id`,
		validations.USER_ACTIVATE_ACCOUNT,
		checkValidationErrors,
		get_activate_account
	);

	app.get(
		`/api/v1/users/account/verify-reset/:id`,
		validations.USER_VERIFY_TOKEN,
		checkValidationErrors,
		get_verify_reset_token
	);

	app.post(`/api/v1/users/account/recovery`, validations.USER_RECOVERY, checkValidationErrors, post_account_recovery);

	app.post(
		`/api/v1/users/account/reset-account`,
		requireJWTHeaderToken,
		validations.USER_RESET_NEW_PWD,
		checkValidationErrors,
		post_pwd_reset
	);
	app.post(
		`/api/v1/users/account/update-profile`,
		authenticate,
		validations.USER_UPDATE_PROFILE,
		checkValidationErrors,
		post_update_profile
	);
	app.post(
		`/api/v1/users/account/change-password`,
		authenticate,
		validations.USER_RESET_NEW_PWD,
		checkValidationErrors,
		post_change_password
	);
	app.post(`/api/v1/users/account/login`, validations.USER_SIGNIN, checkValidationErrors, login_fetch_account, post_login);
	app.post(`/api/v1/users/account/logout`, authenticate, delete_token);
};
