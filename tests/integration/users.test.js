const request = require('supertest');
const {
  User
} = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/users', () => {
  beforeEach(() => {
    server = require('../../index');
  })
  afterEach(() => {
    server.close();
  });

  // describe('GET /me', () => {
  //   it('should return a user', async () => {
  //     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2U4MTY5OWYxYTZlMzA3ZTViZTQwYTEiLCJpYXQiOjE1NTg3MTQwMDl9.2usQwrZyk37l6wgnobQPI1ZDJuSqyU4rwaWrO3MX9aE';

  //     const res = await request(server)
  //       .post('/api/users/me')
  //       .send({
  //         'x-auth-token': token
  //       })

  //     expect(res.body).toHaveProperty('_id');

  //   });
  // });
});