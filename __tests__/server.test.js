const request = require('supertest');
const fs = require('file-system');
const path = require('path');
const server = 'http://localhost:3000';
const cookieParser = require('cookie-parser');

describe('Server Route Integration', () => {

  // Testing get request to homepage
  describe('/', () => {
    describe('GET - SUCCESS', () => {
      it('responds with status 200', () => {
        return request(server)
          .get('/')
          .expect(200);
      });
      it('responds with a content type of text/html', () => {
        return request(server)
          .get('/')
          .expect('Content-Type', /text\/html/)
      });
      it('serves our index.html file', () => {
        fs.readFile(path.resolve(__dirname, '../client/index.html'), (err, data) => {
          if (err) console.log({ error: err })
          return request(server)
            .get('/')
          expect(res => res.text.should.equal(data))
        });
      });
    });
  });

  describe('/api/signup', () => {
    describe('POST', () => {
      // SUCCESS:
      // 200 status
      const newUser2 = { username: 'newUser2', password: 'password2' }
      describe('GET - SUCCESS', () => {
        it('responds with status 200', () => {
          return request(server)
            .post('/api/signup')
            .send(newUser2)
            .expect(200);
        });
      });
    });
  });

});

    //describe('/api/isloggedin', () => {
    //  describe('GET - Client request does not have an SSID cookie', () => {
    //    return request(server)
    //      .get('/api/isloggedin')
    //  });
    //  describe('GET - Client request has a valid SSID cookie', () => {
    //    // Define cookie here
    //    return request(server)
    //      .get('/api/isloggedin')
    //      .set('cookie', cookie)
    //  });
    //  describe('GET - Client request has an invalid SSID cookie', () => {
    //    // Define cookie here
    //    return request(server)
    //      .get('/api/isloggedin')
    //      .set('cookie', cookie)
    //  });
    //});


            // SUCCESS:
        // 200 status
        // Body contains { isLoggedIn of true, username of provided username 

        // FAILURE:
        // 500 status
        // Body contains { isLoggedIn of false, username '', errmsg = ''}

        // FAILURE TEST CASES:
        // ------------------
        // userController.hashPassword: 'ERROR: Failed to encrypt user password'
        // userController.createUser: 'ERROR: Unable to create user'
        // sessionController.createSession: 'ERROR: Failed to store new session in database'