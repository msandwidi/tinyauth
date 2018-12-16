const {
	USER_RESET_LINK,
	ADMIN_RESET_CODE,
	PASSWORD_CHANGED,
	WELCOME_MESSAGE,
	CONFIRM_ACTIVATION,
	ACCOUNT_UPDATED,
	ACCOUNT_UPDATED_PREV,
	CONFIRM_SIGNUP,
	CONFIRM_ACCOUNT_CREATED_BY_ADMIN,
	PASSWORD_RESET_BY_ADMIN,
	ACCOUNT_ACTIVATION_URL_EMAIL
} = require('./_templateTypes');
const {
	CLIENT_BASE_URL,
	APP_NAME
} = require('..');

const admin_reset_code = ({
		resetCode,
		email
	}) =>
	`You have requested to reset your ${APP_NAME} account <b>${email}</b> on ${new Date(Date.now())}. Your reset code is <b>${resetCode}</b>. This code will expire in <b>5 minutes</b>. If you have not made this request, please ignore this email. Thank you`;

const user_reset_link = ({
		resetToken,
		email
	}) =>
	`
A request was made reset the ${APP_NAME} account <b>${email}</b> on ${new Date(Date.now())}. Use the following link to reset your account. <a href="${CLIENT_BASE_URL}/activate/${resetToken}">Reset Password</a> This link will expire in 30 mn. If you have not made this request, please ignore this email. Thank you`;

const password_changed = ({
		firstname,
		lastname
	}) =>
	`Dear ${firstname} ${lastname}, the password of your ${APP_NAME} account has been changed on ${new Date(	Date.now())}. If you have not made this change, <a href="#!"><b>click here to report a fraud</b></a>. Otherwise you can ignore this email. Thank you`;

const welcome_message = ({
		firstname,
		lastname
	}) =>
	`Welcome ${firstname} ${lastname}. This is just a welcome message.`;

const confirm_signup = ({
		firstname,
		lastname,
		userToken
	}) =>
	`Dear ${firstname} ${lastname}. Use the following code to activate your ${APP_NAME} account: <b>${userToken}<b>. This code is valid for 30 minutes</b>. <a href="${CLIENT_BASE_URL}/activate">Activate your account here</a>. Thank you`;

const activation_url = ({
		firstname,
		lastname,
		token
	}) =>
	`Dear ${firstname} ${lastname}. Use the link below to activate your ${APP_NAME} account. If you have not made this request, please ignore this email.  <a href="${CLIENT_BASE_URL}/activate/${token}">Activate your account here</a> This link is valid for 30 minutes</b>. Thank you`;

const account_created_by_admin = ({
		firstname,
		lastname,
		token
	}) =>
	`Dear ${firstname} ${lastname}. A new ${APP_NAME} account has been created for you. Please use the following link to reset your account in order to add a personalized password. <a href="${CLIENT_BASE_URL}/activate/${token}">Reset your account here</a> This link is valid for 30 minutes</b>. Thank you`;

const confirm_activation = ({
		firstname,
		lastname
	}) =>
	`Dear ${firstname} ${lastname}. Your ${APP_NAME} account is now activated. Thank you`;

const account_updated = ({
		firstname,
		lastname
	}) =>
	`Dear ${firstname} ${lastname}, your ${APP_NAME} profile has been updated successfully on ${new Date(Date.now())}`;

const account_updated_prev = ({
		firstname,
		lastname
	}) =>
	`Dear ${firstname} ${lastname}, your ${APP_NAME} profile has been updated successfully on ${new Date(Date.now())}. Future communications will be sent to the new email address you provided. Thank you`;

const password_reset_by_admin = ({
		firstname,
		lastname,
		password
	}) =>
	`Dear ${firstname} ${lastname}, your ${APP_NAME} password has been reset on ${new Date(Date.now())}. Your temporary password is <b>${password}</b>. Please change your password after you login. Thank you`;

const formatEmail = (type, data) => {
	switch (type) {
		case USER_RESET_LINK:
			return user_reset_link(data);
		case ADMIN_RESET_CODE:
			return admin_reset_code(data);
		case PASSWORD_CHANGED:
			return password_changed(data);
		case CONFIRM_SIGNUP:
			return confirm_signup(data);
		case CONFIRM_ACTIVATION:
			return confirm_activation(data);
		case WELCOME_MESSAGE:
			return welcome_message(data);
		case ACCOUNT_UPDATED:
			return account_updated(data);
		case ACCOUNT_UPDATED_PREV:
			return account_updated_prev(data);
		case CONFIRM_ACCOUNT_CREATED_BY_ADMIN:
			return account_created_by_admin(data);
		case PASSWORD_RESET_BY_ADMIN:
			return password_reset_by_admin(data);
		case ACCOUNT_ACTIVATION_URL_EMAIL:
			return activation_url(data);
		default:
			return data;
	}
};

module.exports = formatEmail;