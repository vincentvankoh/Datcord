import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import Main from './components/Main.jsx';

function App(props) {

  const [isLoggedIn, setLogin] = useState(false);

  useEffect(() => {
    // as soon as the page loads, send fetch request to see if the isSignedIn is true
    fetch('/api/isloggedin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
      .then((json) => {
        const { isLoggedIn } = json;
        if (isLoggedIn) {
          console.log("isLoggedIn is true")

        } else {
          console.log("isLoggedIn is false")
        }
      });
  }, []
  );

  return (
    // Switch takes you to specific route that matches (if not switch, it renders all)
    <Router>
      <Switch>
        <Route exact path='/' >
          {isLoggedIn ? <Main /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/signup" component={SignUp}>
        </Route>
      </Switch>
    </Router>
  )

}

export default App;
