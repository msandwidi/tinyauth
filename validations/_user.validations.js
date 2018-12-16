const { body, param } = require('express-validator/check');

let validations = {};

validations.USER_SIGNIN = [
	body('email', 'A valid email address is required').isEmail(),
	body('password', 'Your password is not valid').exists()
];

validations.USER_SIGNUP = [
	body('firstname', 'First name should be 2-30 characteres').isLength({ min: 2, max: 30 }).escape(),
	body('lastname', 'Last name should be 2-30 characteres').isLength({ min: 2, max: 30 }).escape(),
	body('email', 'A valid email address is required').isEmail().normalizeEmail(),
	body('phoneNumber', 'The phone number provided is not valid').optional({ checkFalsy: true }).isMobilePhone('en-US'),
	body('password', 'Your password is not valid').isLength({ min: 6 })
];

validations.USER_ACTIVATE_ACCOUNT = [ param('id', 'A valid user must be selected').isLength({ min: 20 }) ];

validations.USER_VERIFY_TOKEN = [ param('id', 'A valid user must be selected').exists() ];

validations.USER_RECOVERY = [
	body('email', 'The email address provided is not valid').isEmail()
];

validations.USER_RESET_NEW_PWD = [ body('password', 'Your new password is not valid').isLength({ min: 6 }) ];

validations.USER_UPDATE_PROFILE = [
	body('firstname', 'First name should be 2-30 characteres').isLength({ min: 2, max: 30 }).escape(),
	body('lastname', 'Last name should be 2-30 characteres').isLength({ min: 2, max: 30 }).escape(),
	body('email', 'A valid email address is required').isEmail().normalizeEmail(),
	body('phoneNumber', 'The phone number provided is not valid').optional({ checkFalsy: true }).isMobilePhone('en-US'),
	body('password', 'Your password is not valid').isLength({ min: 6 })
];

validations.USER_CHANGE_PWD = [
	body('password', 'Your new password is not valid').exists(),
	body('currentPassword', 'Your current password is required').exists()
];

module.exports = validations;
