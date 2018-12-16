const { body, param } = require('express-validator/check');

let validations = {};

validations.ADMIN_SIGNUP = [
	body('firstname', 'First name should be 2-30 characteres').isLength({ min: 2, max: 30 }).escape(),
	body('lastname', 'Last name should be 2-30 characteres').isLength({ min: 2, max: 30 }).escape(),
	body('email', 'A valid email address is required').isEmail().normalizeEmail(),
	body('phoneNumber', 'The phone number provided is not valid').optional({ checkFalsy: true }).isMobilePhone('en-US'),
	body('password', 'Your password is not valid').isLength({ min: 6 })
];

validations.ADMIN_SIGNIN = [
	body('username', 'The username is required').exists().escape(),
	body('password', 'Your password is not valid').exists()
];

validations.ADMIN_CREATE_NEW_USER = [
	body('firstname', 'First name should be 2-30 characteres').isLength({ min: 2, max: 30 }).escape(),
	body('lastname', 'Last name should be 2-30 characteres').isLength({ min: 2, max: 30 }).escape(),
	body('email', 'A valid email address is required').isEmail().normalizeEmail(),
	body('phoneNumber', 'The phone number provided is not valid').optional({ checkFalsy: true }).isMobilePhone('en-US')
];

validations.ADMIN_ACCOUNT_ACTION = [
	body('action', 'Unable to identify the requested action').isString().escape(),
	body('accountId', 'A valid user id is required').isMongoId()
];

validations.ADMIN_UPDATE_PROFILE = [
	body('firstname', 'First name should be 2-30 characteres').isLength({ min: 2, max: 30 }).escape(),
	body('lastname', 'Last name should be 2-30 characteres').isLength({ min: 2, max: 30 }).escape(),
	body('email', 'A valid email address is required').isEmail().normalizeEmail(),
	body('phoneNumber', 'The phone number provided is not valid').optional({ checkFalsy: true }).isMobilePhone('en-US'),
	body('password', 'Your password is not valid').isLength({ min: 6 })
];

validations.ADMIN_CHANGE_PWD = [
	body('newPassword', 'Your new password is not valid').exists(),
	body('currentPassword', 'Your current password is required').exists()
];

validations.ADMIN_ACCOUNT_INFO = [ param('id', 'A valid user must be selected').isMongoId() ];

validations.ADMIN_RECOVERY = [
	body('username', 'Your current username is required').isString().escape(),
	body('email', 'The email address provided is not valid').isEmail()
];

validations.ADMIN_RESET_CODE = [ body('resetCode', 'A valid code is required').isNumeric() ];

validations.ADMIN_RESET_NEW_PWD = [ body('password', 'Your new password is not valid').isLength({ min: 6 }) ];

module.exports = validations;
