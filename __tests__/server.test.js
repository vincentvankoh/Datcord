const request = require('supertest');
const fs = require('file-system');
const path = require('path');

const server = 'http://localhost:3000';
const cookieParser = require('cookie-parser');
const db = require('../server/models/models.js');

let sessionID = '';
/*
This is testing end to end connection from the client to the server and back to the Database
*/
describe('Server Route Integration', () => {
  // Testing get request to the root url for our static files
  describe('/', () => {
    describe('GET - SUCCESS ', () => {
      it('responds with status 200', () => request(server)
        .get('/')
        .expect(200));
      it('responds with a content type of text/html', () => request(server)
        .get('/')
        .expect('Content-Type', /text\/html/));
      it('serves our index.html file', () => {
        fs.readFile(path.resolve(__dirname, '../client/index.html'), (err, data) => {
          if (err) console.log({ error: err });
          return request(server)
            .get('/');
          expect((res) => res.text.should.equal(data));
        });
      });
    });
  });
  /*
  Testing signup request fron the client, proper server routing,
  and database during a succesful signup
  */
  describe('/api/signup', () => {
    describe('POST - SUCCESS (username that does not exist in the "users" table of the test database)', () => {
      // declare a dummy user that is signing up in order to test all the functionality
      const newUser = { username: 'newUser', password: 'password' };
      // Delete the contents of the test database before running each test case
      beforeEach((done) => {
        db.query('TRUNCATE users CASCADE')
          .then(() => {
            done();
          });
      });
      it('responds with status 200', () => request(server)
        .post('/api/signup')
        .send(newUser)
        .expect(200));
      it('responds with isLoggedIn === true', () => request(server)
        .post('/api/signup')
        .send(newUser)
        .then((data) => {
          expect(data.body.isLoggedIn).toEqual(true);
        }));
      it('responds with username === newUser', () => request(server)
        .post('/api/signup')
        .send(newUser)
        .then((data) => {
          expect(data.body.username).toEqual(newUser.username);
        }));
      it('responds with instructions for the browser to store an ssid cookie', () => request(server)
        .post('/api/signup')
        .send(newUser)
        .then((data) => {
          expect(data.header['set-cookie'][0].includes('ssid=')).toEqual(true);
        }));
    });
    /*
  Testing signup request fron the client, proper server routing,
  and database during an unsuccesful signup
  */
    describe('POST - FAILURE: (username that does exist in the "users" table of the test database)', () => {
      // declare a dummy user that is signing up in order to test all the functionality
      const newUser = { username: 'newUser', password: 'password' };
      it('responds with status of 500 ', () => request(server)
        .post('/api/signup')
        .send(newUser)
        .expect(500));
      it('responds with isLoggedIn === false', () => request(server)
        .post('/api/signup')
        .send(newUser)
        .then((data) => {
          expect(data.body.isLoggedIn).toEqual(false);
        }));
      it('responds with with an empty string "" as the username', () => request(server)
        .post('/api/signup')
        .send(newUser)
        .then((data) => {
          expect(data.body.username).toEqual('');
        }));
      it('responds with with an error message of "ERROR: Unable to create user"', () => request(server)
        .post('/api/signup')
        .send(newUser)
        .then((data) => {
          expect(data.body.errorMsg).toEqual('ERROR: Unable to create user');
        }));
      it('responds without instructions for the browser to store an ssid cookie', () => request(server)
        .post('/api/signup')
        .send(newUser)
        .then((data) => {
          expect(data.header['set-cookie']).toEqual(undefined);
        }));
    });
  });
  /*
  Testing signup request fron the client, proper server routing,
  and database during a succesful login
  */
  describe('/api/login', () => {
    describe('POST - SUCCESS (login attempt with valid stored credentials in DB)', () => {
      // declare a dummy user that is signing up in order to test all the functionality
      const newUser = { username: 'newUser', password: 'password' };
      it('responds with status 200', () => request(server)
        .post('/api/login')
        .send(newUser)
        .expect(200));
      it('responds with isLoggedIn === true', () => request(server)
        .post('/api/login')
        .send(newUser)
        .then((data) => {
          expect(data.body.isLoggedIn).toEqual(true);
        }));
      it('responds with username === newUser', () => request(server)
        .post('/api/login')
        .send(newUser)
        .then((data) => {
          expect(data.body.username).toEqual(newUser.username);
        }));
      it('responds with instructions for the browser to store an ssid cookie', () => request(server)
        .post('/api/login')
        .send(newUser)
        .then((data) => {
          sessionID = data.header['set-cookie'][0];
          expect(sessionID.includes('ssid=')).toEqual(true);
        }));
    });
    describe('POST - FAILURE (login attempt with unknown username)', () => {
      // declare a dummy user that is signing up in order to test all the functionality
      const newUser = { username: 'oldUser', password: 'password' };
      it('responds with status of 500 ', () => request(server)
        .post('/api/login')
        .send(newUser)
        .expect(500));
      it('responds with isLoggedIn === false', () => request(server)
        .post('/api/login')
        .send(newUser)
        .then((data) => {
          expect(data.body.isLoggedIn).toEqual(false);
        }));
      it('responds with with an empty string "" as the username', () => request(server)
        .post('/api/login')
        .send(newUser)
        .then((data) => {
          expect(data.body.username).toEqual('');
        }));
      it('responds with with an error message of "ERROR: User doesn\'t exist in the database"', () => request(server)
        .post('/api/login')
        .send(newUser)
        .then((data) => {
          expect(data.body.errorMsg).toEqual('ERROR: User doesn\'t exist in the database');
        }));
      it('responds without instructions for the browser to store an ssid cookie', () => request(server)
        .post('/api/login')
        .send(newUser)
        .then((data) => {
          expect(data.header['set-cookie']).toEqual(undefined);
        }));
    });
    describe('POST - FAILURE (login attempt with password that does not match value stored in DB)', () => {
      // declare a dummy user that is signing up in order to test all the functionality
      const newUser = { username: 'newUser', password: 'wrongPassword' };
      it('responds with status of 500 ', () => request(server)
        .post('/api/login')
        .send(newUser)
        .expect(500));
      it('responds with isLoggedIn === false', () => request(server)
        .post('/api/login')
        .send(newUser)
        .then((data) => {
          expect(data.body.isLoggedIn).toEqual(false);
        }));
      it('responds with with an empty string "" as the username', () => request(server)
        .post('/api/login')
        .send(newUser)
        .then((data) => {
          expect(data.body.username).toEqual('');
        }));
      it('responds with with an error message of "ERROR: password is incorrect"', () => request(server)
        .post('/api/login')
        .send(newUser)
        .then((data) => {
          expect(data.body.errorMsg).toEqual('ERROR: password is incorrect');
        }));
      it('responds without instructions for the browser to store an ssid cookie', () => request(server)
        .post('/api/login')
        .send(newUser)
        .then((data) => {
          expect(data.header['set-cookie']).toEqual(undefined);
        }));
    });
  });
  /*
   Testing session and cookie verification
   */
  describe('/api/isloggedin', () => {
    describe('GET - SUCCESS (Client request does not have an SSID cookie)', () => {
      it('responds with status of 200 ', () => request(server)
        .get('/api/isloggedin')
        .expect(200));
      it('responds with isLoggedIn === false', () => request(server)
        .get('/api/isloggedin')
        .then((data) => {
          expect(data.body.isLoggedIn).toEqual(false);
        }));
      it('responds with with an empty string "" as the username', () => request(server)
        .get('/api/isloggedin')
        .then((data) => {
          expect(data.body.username).toEqual('');
        }));
    });
    describe('GET - SUCCESS (Client request has a valid SSID cookie)', () => {
      it('responds with status of 200', () => request(server)
        .get('/api/isloggedin')
        .set('cookie', sessionID)
        .expect(200));
      it('responds with isLoggedIn === true', () => request(server)
        .get('/api/isloggedin')
        .set('cookie', sessionID)
        .then((data) => {
          expect(data.body.isLoggedIn).toEqual(true);
        }));
      it('responds with with an empty string "newUser" as the username', () => request(server)
        .get('/api/isloggedin')
        .set('cookie', sessionID)
        .then((data) => {
          expect(data.body.username).toEqual('newUser');
        }));
    });
    describe('GET - FAILURE (Client request has a invalid SSID cookie)', () => {
      beforeAll((done) => {
        db.query('TRUNCATE users CASCADE')
          .then(() => {
            done();
          });
      });
      it('responds with status of 500', () => request(server)
        .get('/api/isloggedin')
        .set('cookie', sessionID)
        .expect(500));
      it('responds with isLoggedIn === false', () => request(server)
        .get('/api/isloggedin')
        .set('cookie', sessionID)
        .then((data) => {
          expect(data.body.isLoggedIn).toEqual(false);
        }));
      it('responds with with an error message of "ERROR: Session ID not found in session database"', () => request(server)
        .get('/api/isloggedin')
        .set('cookie', sessionID)
        .then((data) => {
          expect(data.body.errorMsg).toEqual('ERROR: Session ID not found in session database');
        }));
    });
  });
  /*
 Testing logout functionality
 */
  describe('/api/logout', () => {
    const newUser = { username: 'newUser', password: 'password' };
    beforeAll((done) => {
      request(server).post('/api/signup').send(newUser).then((data) => {
        sessionID = data.header['set-cookie'][0];
        done();
      });
    });
    afterEach((done) => {
      request(server)
        .post('/api/login')
        .send(newUser).then((data) => {
          sessionID = data.header['set-cookie'][0];
          done();
        });
    });
    // testing post request to logout
    describe('Post - SUCCESS (with valid ssid cookie)', () => {
      it('responds with status 200', () => request(server)
        .post('/api/logout')
        .set('cookie', sessionID)
        .expect(200));
      it('responds with boolean of false for isLoggedIn ', () => request(server)
        .post('/api/logout')
        .set('cookie', sessionID)
        .then((data) => {
          expect(data.body.isLoggedIn).toEqual(false);
        }));
      // Should have clearCookie(ssid) in data.headers
    });
  });
});

// POST - /api/logout: request contains ssid cookie, response returns isLoggedIn of false and status of 200
// POST - /api/updateusername: request contains username, password, newUsername, response returns username and status of 200
// POST - /api/updatepassword: request contains username, password, newPassword, response returns username and status of 200
