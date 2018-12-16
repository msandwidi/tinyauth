const server = require('../index');
const assert = require('chai').assert;
const request = require('supertest')(server);
const Admin = require('../models/Admin');
const User = require('../models/User');

const fakeAdmin = {
	firstname: 'fname',
	lastname: 'lname',
	username: 'shoudou',
	email: 'afake@email.com',
	password: '123456',
	incorrectPassword: 'bla-bla',
	isVerified: true
};

const fakeAdminUpdated = {
	...fakeAdmin,
	firstname: 'fname2',
	lastname: 'lname2',
	email: 'fake@email.com',
	incorrectPassword: 'bla-bla-bla'
};

const fakeUserAccount = {
	firstname: 'byAdmin-fname',
	lastname: 'byAdmin-lname',
	email: 'fake@email.com'
};

describe('ADMIN ROUTE HANDLERS', () => {
	let authToken;
	let adminBoardContent = [];
	let addedAccount;
	let resetCode;
	let resetToken;

	before(function(done) {
		const newAdmin = new Admin(fakeAdmin);
		Promise.all([ Admin.deleteMany(), User.deleteMany() ]).then(() => {
			newAdmin.save().then(() => done());
		});
	});

	describe('ADMIN LOGIN PROCESS', () => {
		it('should return status 400 false for attempting to login with invalid credentials', (done) => {
			request
				.post('/api/v1/admin/my/signin')
				.send({
					username: 'invalid@email.com',
					password: 'invalid-pass'
				})
				.expect(400)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) return done(err);
					assert.isFalse(res.body.success);
					assert.notExists(res.body.token);
					assert.isString(res.body.message);
					done();
				});
		});

		it('should return 200 and success true after successfull login', (done) => {
			request
				.post('/api/v1/admin/my/signin')
				.send(fakeAdmin)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.token);
					assert.isString(res.body.token);
					authToken = res.body.token;
					done();
				});
		});
	});

	describe('ADMIN FETCH ADMINBOARD', () => {
		it('should return 200 and success true with content array of adminboard', (done) => {
			request
				.get('/api/v1/admin/adminBoard')
				.set('Authorization', 'bearer ' + authToken)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.content);
					assert.isArray(res.body.content);
					adminBoardContent = res.body.content;
					done();
				});
		});
	});

	describe('ADMIN FETCH ACCOUNTS LIST', () => {
		it('should return 200 and success true with list of user accounts', (done) => {
			request
				.get('/api/v1/admin/accounts/accounts-management')
				.set('Authorization', 'bearer ' + authToken)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.accounts);
					assert.isArray(res.body.accounts);
					assert.lengthOf(res.body.accounts, 0);
					done();
				});
		});
	});

	describe('ADMIN CREATE AND MODIFY AN ACCOUNT', () => {
		it('should return 200 and success true with content array of accounts after creating new account', (done) => {
			request
				.post('/api/v1/admin/accounts/create-account')
				.set('Authorization', 'bearer ' + authToken)
				.send(fakeUserAccount)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});

		it('should return 200 and success true with content array of accounts list', (done) => {
			request
				.get('/api/v1/admin/accounts/accounts-management')
				.set('Authorization', 'bearer ' + authToken)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.accounts);
					assert.isArray(res.body.accounts);
					assert.lengthOf(res.body.accounts, 1);
					accountsList = res.body.accounts;
					addedAccount = accountsList[0];
					done();
				});
		});

		it('should return 200 and success true with details of the account selected', (done) => {
			request
				.get('/api/v1/admin/accounts/account-details/' + addedAccount._id)
				.set('Authorization', 'bearer ' + authToken)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.account);
					assert.isObject(res.body.account);
					done();
				});
		});

		it('should return 200 and success true after activating user account', (done) => {
			request
				.post('/api/v1/admin/accounts/account-action')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					accountId: addedAccount._id,
					action: 'activate'
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});

		it('should return 200 and success true after resetting user account password', (done) => {
			request
				.post('/api/v1/admin/accounts/account-action')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					accountId: addedAccount._id,
					action: 'resetPassword'
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});

		it('should return 200 and success true after resetting user account password', (done) => {
			request
				.post('/api/v1/admin/accounts/account-action')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					accountId: addedAccount._id,
					action: 'close'
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});

		it('should return 200 and success true after reopening user account password', (done) => {
			request
				.post('/api/v1/admin/accounts/account-action')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					accountId: addedAccount._id,
					action: 'reopen'
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});

		it('should return 200 and success true after setting user account to user admin', (done) => {
			request
				.post('/api/v1/admin/accounts/account-action')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					accountId: addedAccount._id,
					action: 'setToAdmin'
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});

		it('should return 200 and success true after revoking user admin privileges', (done) => {
			request
				.post('/api/v1/admin/accounts/account-action')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					accountId: addedAccount._id,
					action: 'revokeAdmin'
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});

		it('should return 403 and success false for attempting invalid action on user account', (done) => {
			request
				.post('/api/v1/admin/accounts/account-action')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					accountId: addedAccount._id,
					action: 'invalidAction'
				})
				.expect(403)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isFalse(res.body.success);
					done();
				});
		});
	});

	describe('ADMIN PROFILE AND PASSWORD UPDATE', () => {
		it('should return 400 and success false after attempting to update profile with incorrect confirmation password', (
			done
		) => {
			request
				.post('/api/v1/admin/my/update-profile')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					...fakeAdmin,
					password: fakeAdmin.incorrectPassword
				})
				.expect(400)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) return done(err);
					assert.isFalse(res.body.success);
					done();
				});
		});

		it('should return 200 and success true after updating profile', (done) => {
			request
				.post('/api/v1/admin/my/update-profile')
				.set('Authorization', 'bearer ' + authToken)
				.send(fakeAdminUpdated)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) return done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.user);
					assert.isObject(res.body.user);
					assert.equal(res.body.user.firstname, fakeAdminUpdated.firstname);
					assert.equal(res.body.user.lastname, fakeAdminUpdated.lastname);
					assert.equal(res.body.user.middlename, fakeAdminUpdated.middlename);
					assert.equal(res.body.user.email, fakeAdminUpdated.email);
					done();
				});
		});

		it('should return 403 and success false after attempting to update password with incorrect confirmation password', (
			done
		) => {
			request
				.post('/api/v1/admin/my/change-password')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					newPassword: fakeAdmin.password,
					currentPassword: fakeAdmin.incorrectPassword
				})
				.expect(400)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) return done(err);
					assert.isFalse(res.body.success);
					done();
				});
		});

		it('should return 200 and success true after changing password successfully', (done) => {
			request
				.post('/api/v1/admin/my/change-password')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					newPassword: fakeAdmin.password,
					currentPassword: fakeAdmin.password
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) return done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});
	});

	describe('RE-LOGIN AFTER PASSWORD CHANGE', () => {
		it('should return an authentication token after successfull login', (done) => {
			request
				.post('/api/v1/admin/my/signin')
				.send({
					username: fakeAdminUpdated.username,
					password: fakeAdminUpdated.password
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.token);
					assert.isString(res.body.token);
					authToken = res.body.token;
					done();
				});
		});
	});

	describe('ADMIN LOGOUT REQUEST', () => {
		it('should return 200 ok and success true after successful logout', (done) => {
			request
				.post('/api/v1/admin/my/logout')
				.set('Authorization', 'bearer ' + authToken)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) return done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});

		it('should return 401 and success false for attempting to re-authenticate with expired token', (done) => {
			request
				.get('/api/v1/admin/adminBoard')
				.set('Authorization', 'bearer ' + authToken)
				.expect(401)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) done(err);
					assert.isFalse(res.body.success);
					assert.notExists(res.body.content);
					assert.exists(res.body.message);
					done();
				});
		});
	});

	describe('ADMIN ACCOUNT RECOVERY PROCESS', () => {
		it('should return 200 ok and success true after initiating recovery', (done) => {
			request
				.post('/api/v1/admin/my/recovery')
				.send({
					username: fakeAdminUpdated.username,
					email: fakeAdminUpdated.email
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res) {
					if (err) return done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.token);
					assert.isString(res.body.token);
					resetCode = res.body.resetCode;
					resetToken = res.body.resetToken;
					done();
				});
		});
	});
}); // end of outer describe
