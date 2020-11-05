import React, { useEffect, useState, useContext } from 'react';
import { Link, useHistory, BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Main from './Main.jsx';
import Signup from './SignUp.jsx';

function Login(props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("Login unsuccessful");
  const [loginStatus, setLoginStatus] = useState("");

  function handleClick() {
    // fetch starts
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          username: username,
          password: password,
        }
      ),
    }).then((resp) => resp.json())
      .then((data) => {
        const { isLoggedIn } = data;
        // if isLogged in is true, redirect to main page
        if (isLoggedIn) {
          setLoginStatus(true)
          console.log(loginStatus)
        } else {
          setLoginStatus(false)
          console.log(loginStatus)
        }
      }).catch((err) => console.log(err));
  }

  useEffect(() => {

  })

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path='/login' >
            {loginStatus ? <Redirect to="/" /> :
              <div>
                <h3>Login</h3>
                <form style={{ display: 'flex', flexDirection: 'column' }}>
                  <input
                    type="text"
                    placeholder="username"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleClick}
                  >
                    Log In
              </button>
                </form>
                <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
              </div>
            }
          </Route>
          <Route exact path='/'>
            <Main username={username} />
          </Route>
          <Route exact path='/signup' component={Signup} />
        </Switch>
      </Router>
    </div>
  ); // end of return 
} // end of login function

export default Login;
