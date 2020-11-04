const request = require('supertest');
const server = 'http://localhost:3000';

describe('Server Route Integration', () => {
  describe('/', () => {
    describe('GET', () => {
      it('responds with status 200 and serves our index.html file', () => {
        return request(server)
          .get('/')
          .expect('Content-Type', /text\/html/)
          .expect(200);
      });
    });
  });



});

