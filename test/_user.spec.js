const server = require('../index');
const assert = require('chai').assert;
const request = require('supertest')(server);
const User = require('../models/User');

const signupUser = {
	firstname: 'fname',
	lastname: 'lname',
	email: 'another@email.com',
	password: '123456',
	new_password: '1234567',
	incorrectPassword: 'bla-bla'
};

const loginUser = {
	firstname: 'fname',
	lastname: 'lname',
	email: 'new@email.com',
	password: '123456',
	new_password: '1234567',
	incorrectPassword: 'bla-bla',
	isVerified: true
};

const loginUserUpdated = {
	...loginUser,
	firstname: 'fname_new',
	middlename: 'mname_new',
	lastname: 'lname_new',
	email: 'anew@email.com'
};

describe('USER ROUTE HANDLERS', () => {
	let authToken = undefined;
	let activationCode = undefined;
	let resetToken = undefined;
	let newPasswordToken = undefined;

	before(function (done) {
		User.deleteMany().then(() => {
			const newUser = new User(loginUser);
			newUser.save().then(() => {
				console.log('User collection cleared before test');
				done();
			})
		});
	});

	describe('SIGN UP PROCESS', () => {
		it('should return 200 OK and success true signing up', (done) => {
			request
				.post('/api/v1/users/signup')
				.send(signupUser)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});

	});

	describe('LOGIN PROCESS', () => {
		it('should return status 403 success false', (done) => {
			request
				.post('/api/v1/users/signin')
				.send({
					email: 'invalid@email.com',
					password: 'invalid-pass'
				})
				.expect(400)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					assert.isFalse(res.body.success);
					assert.notExists(res.body.token);
					assert.isString(res.body.message);
					done();
				});
		});

		it('should return 200 and success true', (done) => {
			request
				.post('/api/v1/users/signin')
				.send(loginUser)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.token);
					assert.isString(res.body.token);
					authToken = res.body.token;
					done();
				});
		});
	});

	describe('DASHBOARD REQUEST', () => {
		it('should return 401 ok and success false', (done) => {
			request
				.get('/api/v1/users/dashboard')
				.set('Authorization', 'bearer ' + '')
				.expect(401)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					assert.isFalse(res.body.success);
					done();
				});
		});

		it('should return 200 ok and success true', (done) => {
			request
				.get('/api/v1/users/dashboard')
				.set('Authorization', 'bearer ' + authToken)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.content);
					assert.isArray(res.body.content);
					done();
				});
		});
	});

	describe('USER PROFILE REQUEST', () => {
		it('should return 200 and success true after retrieving self profile', (done) => {
			request
				.get('/api/v1/users/my-profile')
				.set('Authorization', 'bearer ' + authToken)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.profile);
					assert.isObject(res.body.profile);
					done();
				});
		});
	});

	describe('USER PROFILE AND PASSWORD UPDATE', () => {
		it('should return 400 and success false after attempting to update profile with incorrect confirmation password', (
			done
		) => {
			request
				.post('/api/v1/users/update-profile')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					...loginUserUpdated,
					password: loginUser.incorrectPassword
				})
				.expect(400)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					assert.isFalse(res.body.success);
					done();
				});
		});

		it('should return 200 and success true after updating profile', (done) => {
			request
				.post('/api/v1/users/update-profile')
				.set('Authorization', 'bearer ' + authToken)
				.send(loginUserUpdated)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.user);
					assert.isObject(res.body.user);
					assert.equal(res.body.user.firstname, loginUserUpdated.firstname);
					assert.equal(res.body.user.lastname, loginUserUpdated.lastname);
					assert.equal(res.body.user.email, loginUserUpdated.email);
					done();
				});
		});

		it('should return 403 and success false after attempting to update password with incorrect confirmation password', (
			done
		) => {
			request
				.post('/api/v1/users/change-password')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					password: loginUser.password,
					currentPassword: loginUser.incorrectPassword
				})
				.expect(400)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					assert.isFalse(res.body.success);
					done();
				});
		});

		it('should return 200 and success true after changing password successfully', (done) => {
			request
				.post('/api/v1/users/change-password')
				.set('Authorization', 'bearer ' + authToken)
				.send({
					password: loginUser.password,
					currentPassword: loginUser.password
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});
	});

	describe('RE-LOGIN AFTER PASSWORD CHANGE', () => {
		it('should return an authentication token', (done) => {
			request
				.post('/api/v1/users/signin')
				.send({
					email: loginUserUpdated.email,
					password: loginUserUpdated.password
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) done(err);
					assert.isTrue(res.body.success);
					assert.exists(res.body.token);
					assert.isString(res.body.token);
					authToken = res.body.token;
					done();
				});
		});
	});

	describe('LOGOUT REQUEST', () => {
		it('should return 200 ok and success true', (done) => {
			request
				.post('/api/v1/users/logout')
				.set('Authorization', 'bearer ' + authToken)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});
	});

	describe('TEST ACCOUNT RECOVERY PROCESS', () => {
		it('should return 200 ok and success true after requesting request token to be sent via email', (done) => {
			request
				.post('/api/v1/users/recovery')
				.send({
					email: loginUserUpdated.email
				})
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function (err, res) {
					if (err) return done(err);
					assert.isTrue(res.body.success);
					done();
				});
		});
	});
});