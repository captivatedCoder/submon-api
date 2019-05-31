const request = require('supertest');

describe('auth middleware', () => {
  beforeEach(() => {
    server = require('../../index');
  })
  afterEach(() => {
    server.close();
  });


  it('should return 401 if no token is provided', () => {

  });
});