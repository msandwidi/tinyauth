var server = require('../index');
var assert = require("chai").assert;
const request = require('supertest');

describe("HOME ROUTES HANDLERS", () => {

  it('should return 200 OK and success true', (done) => {
    request(server)
      .get('/api/home')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) throw err;
        assert.isObject(res, "did not receive the response object");
        assert.equal(res.status, 200);
        done();
      })
  });

  it('should return 200 OK and success true', (done) => {
    request(server)
      .get('/api/ping')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) throw err;
        assert.isTrue(res.body.success);
        done();
      })
  });
})