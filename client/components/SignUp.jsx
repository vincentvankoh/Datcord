import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Main from './Main.jsx';

function Signup () {
  const [username, setUserName] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [loginStatus, setLoginStatus] = useState(""); 

  useEffect( () => {

  })

  function submitSignup() {
      console.log("username", username);
      console.log("password", password);
    fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify( 
        {
            username: username,
            password: password,
        }
        ),
    })
    .then((resp) => resp.json())
    //if all ok from server response, redirect to main page of app
    .then(data => {
        const { isLoggedIn } = data;
        // if isLogged in is true, redirect to main page
        console.log("fetch data", data);
        console.log(isLoggedIn);
        if (isLoggedIn) {
          setLoginStatus(true)
        } else {
          setLoginStatus(false)
        }
    })
    .catch(err => console.log(err));
    }

  return (
    <div>
    <Router>
    <Switch>
      <Route exact path='/signup' >
        { loginStatus ? <Redirect to="/" component={Main} /> : 
        <div>
        <h3>Sign Up</h3>
        <form style={{display: 'flex', flexDirection: 'column'}}>
            <input 
                type="text"
                placeholder="username"
                onChange={(e) =>  {
                    setUserName(e.target.value)
                    console.log(username);
                }
                }
                required
                />
            <input 
                type="password"
                placeholder="password"
                onChange={(e) => {
                    setPassword(e.target.value)
                    console.log(password)
                }
                }
                required
                />
            <button type="button" onClick={submitSignup} onSubmit={submitSignup}>Sign Up</button>
            <h2>{errorMessage}</h2>
        </form>
        </div>
        
        }
      </Route>
      <Route exact path='/' component={Main}>
      </Route>
    </Switch>
    </Router>

    </div>
    ) // end of return
} // end of function

export default Signup;
