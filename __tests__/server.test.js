const request = require('supertest');
const fs = require('file-system');
const path = require('path');
const server = 'http://localhost:3000';
const cookieParser = require('cookie-parser');
const db = require('../server/models/models.js');

describe('Server Route Integration', () => {

  // Testing get request to homepage
  describe('/', () => {
    describe('GET - SUCCESS ', () => {
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
  //Testing signup functionality 
  describe('/api/signup', () => {
    beforeAll((done) => {
      // Delete the contents of the test database before running any tests
      db.query('TRUNCATE users CASCADE')
        .then(() => {
          done();
        })
    });

    describe('POST - SUCCESS (username that does not exist in the "users" table of the test database)', () => {
      const newUser = { username: 'newUser', password: 'password' }
      // Delete the contents of the test database before running each test case
      beforeEach((done) => {
        db.query('TRUNCATE users CASCADE')
          .then(() => {
            done();
          })
      });
      it('responds with status 200', () => {
        return request(server)
          .post('/api/signup')
          .send(newUser)
          .expect(200);
      });
      it('responds with isLoggedIn === true', () => {
        return request(server)
          .post('/api/signup')
          .send(newUser)
          .then(data => {
            expect(data.body.isLoggedIn).toEqual(true);
          });
      });
      it('responds with username === newUser', () => {
        return request(server)
          .post('/api/signup')
          .send(newUser).then((data) => {
            expect(data.body.username).toEqual(newUser.username);
          });
      });
      it('responds with instructions for the browser to store an ssid cookie', () => {
        return request(server)
          .post('/api/signup')
          .send(newUser).then((data) => {
            expect(data.header["set-cookie"][0].includes("ssid=")).toEqual(true);
          });
      });
    });

    describe('POST - FAILURE: (username that does exist in the "users" table of the test database)', () => {
      const newUser = { username: 'newUser', password: 'password' }
      it('responds with status of 500 ', () => {
        return request(server)
          .post('/api/signup')
          .send(newUser)
          .expect(500);
      });
      it('responds with isLoggedIn === false', () => {
        return request(server)
          .post('/api/signup')
          .send(newUser).then((data) => {
            expect(data.body.isLoggedIn).toEqual(false);
          });
      });
      it('responds with with an empty string "" as the username', () => {
        return request(server)
          .post('/api/signup')
          .send(newUser).then((data) => {
            expect(data.body.username).toEqual("");
          });
      });
      it('responds with with an error message of "ERROR: Unable to create user"', () => {
        return request(server)
          .post('/api/signup')
          .send(newUser).then((data) => {
            expect(data.body.errorMsg).toEqual("ERROR: Unable to create user");
          });
      });
      it('responds without instructions for the browser to store an ssid cookie', () => {
        return request(server)
          .post('/api/signup')
          .send(newUser).then((data) => {
            expect(data.header["set-cookie"]).toEqual(undefined);
          });
      });
    });
  });

  describe('/api/login', () => {
    describe('POST - SUCCESS (login attemp with valid stored credentials in DB)', () => {
      const newUser = { username: 'newUser', password: 'password' };
      it('responds with status 200', () => {
        return request(server)
          .post('/api/login')
          .send(newUser)
          .expect(200);
      });
      it('responds with isLoggedIn === true', () => {
        return request(server)
          .post('/api/login')
          .send(newUser)
          .then(data => {
            expect(data.body.isLoggedIn).toEqual(true);
          });
      });
      it('responds with username === newUser', () => {
        return request(server)
          .post('/api/login')
          .send(newUser).then((data) => {
            expect(data.body.username).toEqual(newUser.username);
          });
      });
      it('responds with instructions for the browser to store an ssid cookie', () => {
        return request(server)
          .post('/api/login')
          .send(newUser).then((data) => {
            expect(data.header["set-cookie"][0].includes("ssid=")).toEqual(true);
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