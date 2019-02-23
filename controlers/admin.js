const User = require('../models/User');
const Admin = require('../models/Admin');

//middlewares
const authenticateAdmin = require('../middlewares/admin_auth');
const requireJWTHeaderToken = require('../middlewares/require_header_token');
const checkValidationErrors = require('../middlewares/check_validation_errors');

//sengrid
const Mailer = require('../config/sendgrid');
const emailTemplateTypes = require('../config/sendgrid/_templateTypes');
const formatEmail = require('../config/sendgrid/_emailTemplates');

const validations = require('../validations');
const utils = require('../utils');

const get_admin_from_token = async (req, res) => {
	try {
		const user = await Admin.findByToken('auth', req.token);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Your session must be expired'
			});
		}

		return res.status(200).json({
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
			message: 'You are logged out successfully'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while logging you out.'
		});
	}
};

const get_admin_profile = (req, res) => {
	return res.status(200).json({
		success: true,
		user: req.user.toMyProfile()
	});
};

const post_admin_signup = async (req, res) => {
	try {
		const {
			firstname,
			lastname,
			email,
			password,
			phoneNumber
		} = req.body;

		const existingUser = await User.findOne({
			email
		});

		if (!existingUser) {
			const newUser = new Admin({
				firstname,
				lastname,
				email,
				phoneNumber,
				username: email,
				password
			});

			const activationToken = await newUser.generateToken('activation');

			const emailHeader = {
				title: 'Confirm Your Account',
				subject: 'Confirm Your Account',
				recipients: [newUser]
			};

			const emailBody = {
				firstname,
				lastname,
				token: activationToken
			};

			const mailer = new Mailer(
				emailHeader,
				formatEmail(emailTemplateTypes.ACCOUNT_ACTIVATION_URL_EMAIL, emailBody)
			);

			try {
				mailer.send();
			} catch (error) {
				console.log(error);
			}
		}

		return res.status(200).json({
			success: true,
			message: 'A confirmation email will be sent to the email address you provided. If you do not received it, you probably cannot signup with that email address. Use another one and try again. Thank you'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while signing you up'
		});
	}
};

const login_fetch_admin = async (req, res, next) => {
	try {
		const {
			username,
			password
		} = req.body;

		const user = await Admin.findByCredentials(username, password);

		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Invalid Username or/and Password'
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

		return res.json({
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

const get_adminBoard = async (req, res) => {
	const fake_notification = [{
			_id: 1,
			description: 'This is content of notification 1 from server'
		},
		{
			_id: 2,
			description: 'This is content of notification 2 from server'
		},
		{
			_id: 3,
			description: 'This is content of notification 3 from server'
		}
	];
	const fake_fraud_reports = [{
			_id: 1,
			description: 'This is content of fraud report 1 from server'
		},
		{
			_id: 2,
			description: 'This is content of fraud report 2 from server'
		},
		{
			_id: 3,
			description: 'This is content of fraud report 3 from server'
		}
	];
	const fake_error_reports = [{
			_id: 1,
			description: 'This is content of error report 1 from server'
		},
		{
			_id: 2,
			description: 'This is content of error report 2 from server'
		},
		{
			_id: 3,
			description: 'This is content of error report 3 from server'
		}
	];
	const fake_stats = [{
			_id: 1,
			description: 'This is content of account stats 1 from server'
		},
		{
			_id: 2,
			description: 'This is content of account stats 2 from server'
		},
		{
			_id: 3,
			description: 'This is content of account stats 3 from server'
		}
	];

	return res.status(200).json({
		success: true,
		content: [{
				notifications: fake_notification
			},
			{
				fraudReports: fake_fraud_reports
			},
			{
				errorReports: fake_error_reports
			},
			{
				stats: fake_stats
			}
		]
	});
};

const get_account_management = async (req, res) => {
	try {
		const accounts = await User.fetchAccounts();

		return res.status(200).json({
			success: true,
			accounts
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request'
		});
	}
};

const post_create_new_account = async (req, res) => {
	try {
		const {
			firstname,
			lastname,
			phoneNumber,
			email
		} = req.body;

		const existingUser = await User.findOne({
			email
		});

		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'This email address is not available.'
			});
		}

		//const tempPassword = utils.generateRandomToken(null, 24);
		const tempPassword = 123456

		const newUser = new User({
			firstname,
			lastname,
			phoneNumber,
			email,
			isVerified: true,
			forcePwdReset: true,
			createdBy: req.user._id,
			password: tempPassword
		});

		const user = await newUser.save();

		if (!user) {
			return res.status(500).json({
				success: false,
				message: 'An error occured while attempting to save the new account'
			});
		}

		const resetCode = await user.generateToken('reset');

		const emailHeader = {
			title: 'New Account Created',
			subject: 'New Account Created',
			recipients: [user]
		};

		const emailBody = {
			firstname,
			lastname,
			token: resetCode
		};

		const mailer = new Mailer(
			emailHeader,
			formatEmail(emailTemplateTypes.CONFIRM_ACCOUNT_CREATED_BY_ADMIN, emailBody)
		);

		try {
			mailer.send();
		} catch (error) {
			console.log(error);
		}

		const accounts = await User.fetchAccounts();

		return res.status(200).json({
			success: true,
			accounts,
			message: `The account ${email} has been created successfully. ${firstname} will need to reset the account to have a personalized password.`
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request'
		});
	}
};

const get_account_details = async (req, res) => {
	try {
		const accountId = req.params.id;

		const user = await User.findById(accountId);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'The selected account cannot be found.'
			});
		}

		return res.status(200).json({
			success: true,
			account: user.toFullProfile()
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request'
		});
	}
};

const post_account_action = async (req, res) => {
	try {
		const {
			accountId,
			action
		} = req.body;

		const user = await User.findById(accountId);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'The selected user cannot be found'
			});
		}

		let message = 'Done';

		switch (action.trim()) {
			case 'activate':
				await user.activateAccount();
				message = 'Account activated successfully';
				break;

			case 'close':
				await user.closeAccount();
				message = 'Account closed successfully';
				break;

			case 'reopen':
				await user.reopenAccount();
				message = 'Account reopened successfully';
				break;

			case 'setToAdmin':
				await user.setToAdmin();
				message = 'Account set to Admin successfully';
				break;

			case 'revokeAdmin':
				await user.revokeAdmin();
				message = 'Admin privilege revoked successfully';
				break;

			case 'resetPassword':
				const password = utils.generateRandomToken(null, 10);
				user.resetPassword(password);
				message = 'Account reset successfully';

				const emailHeader = {
					title: 'Password Reset',
					subject: 'Password Reset',
					recipients: [user],
				};

				const emailBody = {
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email,
					password
				};

				const mailer = new Mailer(
					emailHeader,
					formatEmail(emailTemplateTypes.PASSWORD_RESET_BY_ADMIN, emailBody)
				);

				try {
					mailer.send();
				} catch (error) {
					console.log(error);
				}
				break;

			default:
				return res.status(403).json({
					success: false,
					message: `Unable to identify the requested action`
				});
		}

		const accounts = await User.fetchAccounts();

		return res.status(200).json({
			success: true,
			accounts,
			message
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request'
		});
	}
};

const post_update_my_profile = async (req, res) => {
	try {
		const {
			password,
			email
		} = req.body;

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

			const existingUser = await Admin.findOne({
				email
			});

			const prevEmail = req.user.email;

			if (!existingUser || existingUser._id.toHexString() === req.user._id.toHexString()) {
				req.user = await req.user.updateProfile(req.body);

				const emailHeader = {
					title: 'Account Updated',
					subject: 'Account Updated',
					recipients: [req.user]
				};

				const emailBody = {
					firstname: req.user.firstname,
					lastname: req.user.lastname
				};

				const mailer = new Mailer(emailHeader, formatEmail(emailTemplateTypes.ACCOUNT_UPDATED, emailBody));

				try {
					mailer.send();

					if (prevEmail !== email) {
						const emailHeader2 = {
							title: 'Account Updated',
							subject: 'Account Updated',
							recipients: [{
								email: prevEmail
							}],
							dateSent: Date.now()
						};

						const emailBody2 = {
							firstname: req.user.firstname,
							lastname: req.user.lastname,
							email: prevEmail
						};

						const mailer2 = new Mailer(
							emailHeader2,
							formatEmail(emailTemplateTypes.ACCOUNT_UPDATED_PREV, emailBody2)
						);

						mailer2.send();
					}
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

const post_change_my_password = async (req, res) => {
	try {
		const {
			newPassword,
			currentPassword
		} = req.body;

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

			req.user.updatePassword(newPassword);

			const newEmail = {
				title: 'Password Changed',
				subject: 'Password Changed',
				recipients: [req.user],
				dateSent: Date.now()
			};

			const emailBody = {
				firstname: req.user.firstname,
				lastname: req.user.lastname
			};

			const mailer = new Mailer(newEmail, formatEmail(emailTemplateTypes.PASSWORD_CHANGED, emailBody));

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

const post_account_recovery = async (req, res) => {
	try {
		const {
			email,
			username
		} = req.body;

		const user = await Admin.findOne({
			username,
			email,
			isVerified: true,
			isClosed: false
		});

		if (!user) {
			return res.status(200).json({
				success: true,
				message: 'Enter your reset code to continue'
			});
		}

		const tokens = await user.generateToken('reset');

		if (typeof tokens !== 'object')
			return res.status(500).json({
				success: false,
				message: 'The provided email address is not valid'
			});

		const resetCode = tokens.resetCode;
		const resetToken = tokens.resetToken;

		const emailHeader = {
			title: 'Account Recovery',
			subject: 'Account Recovery',
			recipients: [user]
		};

		const emailBody = {
			resetCode,
			email: user.email
		};

		const mailer = new Mailer(emailHeader, formatEmail(emailTemplateTypes.ADMIN_RESET_CODE, emailBody));

		try {
			mailer.send();
		} catch (error) {
			console.log(error);
		}

		return res.status(200).json({
			success: true,
			token: resetToken,
			message: 'Enter your reset code to continue'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request.'
		});
	}
};

const post_recovery_code = async (req, res) => {
	try {
		const resetCode = req.body.resetCode;

		const resetToken = req.token;

		const user = await Admin.findByToken('reset', resetToken, resetCode);

		if (!user) {
			return res.status(403).json({
				success: false,
				message: 'Your reset session must be experied'
			});
		}

		const token = await user.generateToken('new_pwd');

		return res.status(200).json({
			success: true,
			token,
			message: 'Code Verified Successfully. Please provide your new password to continue.'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: 'An error occured while processing your request.'
		});
	}
};

const post_pwd_reset = async (req, res) => {
	try {
		const password = req.body.password;

		const resetToken = req.token;

		const user = await Admin.findByToken('new_pwd', resetToken);

		if (!user) {
			return res.status(403).json({
				success: false,
				message: 'Unable to update your password.'
			});
		}
		await user.updatePassword(password);

		const emailHeader = {
			title: 'Password Changed',
			subject: 'Password Changed',
			recipients: [user]
		};

		const emailBody = {
			firstname: user.firstname,
			lastname: user.lastname,
			email: user.email
		};

		const mailer = new Mailer(emailHeader, formatEmail(emailTemplateTypes.PASSWORD_CHANGED, emailBody));

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

module.exports = (app) => {
	//general routes
	app.get('/api/v1/admin/adminBoard', authenticateAdmin, get_adminBoard);

	//admin own routes
	app.get(`/api/v1/admin/my/auth`, authenticateAdmin, get_admin_from_token);
	app.post(`/api/v1/admin/my/recovery`, validations.ADMIN_RECOVERY, checkValidationErrors, post_account_recovery);
	app.post(
		`/api/v1/admin/my/verify-code`,
		requireJWTHeaderToken,
		validations.ADMIN_RESET_CODE,
		checkValidationErrors,
		post_recovery_code
	);
	app.post(
		`/api/v1/admin/my/reset-account`,
		requireJWTHeaderToken,
		validations.ADMIN_RESET_NEW_PWD,
		checkValidationErrors,
		post_pwd_reset
	);
	app.post(`/api/v1/admin/my/signup`, validations.ADMIN_SIGNUP, checkValidationErrors, post_admin_signup);
	app.post(`/api/v1/admin/my/signin`, validations.ADMIN_SIGNIN, checkValidationErrors, login_fetch_admin, post_login);
	app.post(`/api/v1/admin/my/logout`, authenticateAdmin, delete_token);
	app.get(`/api/v1/admin/my/profile`, authenticateAdmin, get_admin_profile);
	app.post(
		`/api/v1/admin/my/update-profile`,
		authenticateAdmin,
		validations.ADMIN_UPDATE_PROFILE,
		checkValidationErrors,
		post_update_my_profile
	);
	app.post(
		`/api/v1/admin/my/change-password`,
		authenticateAdmin,
		validations.ADMIN_CHANGE_PWD,
		checkValidationErrors,
		post_change_my_password
	);

	//accounts related
	app.get('/api/v1/admin/accounts/accounts-management', authenticateAdmin, get_account_management);
	app.post(
		'/api/v1/admin/accounts/create-account',
		authenticateAdmin,
		validations.ADMIN_CREATE_NEW_USER,
		checkValidationErrors,
		post_create_new_account
	);
	app.get(
		'/api/v1/admin/accounts/account-details/:id',
		authenticateAdmin,
		validations.ADMIN_ACCOUNT_INFO,
		checkValidationErrors,
		get_account_details
	);
	app.post(
		'/api/v1/admin/accounts/account-action',
		authenticateAdmin,
		validations.ADMIN_ACCOUNT_ACTION,
		checkValidationErrors,
		post_account_action
	);
};