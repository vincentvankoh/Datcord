import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import { render } from 'react-dom';
import Login from './components/Login.jsx';
import Signup from './components/SignUp.jsx';
import Main from './components/Main.jsx';
function App(props) {
  const [renderComponent, setComponent] = useState();
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
        console.log('STATUS', isLoggedIn);
        if (isLoggedIn) {
          setComponent(<Redirect to="/main" />);
          console.log('isLoggedIn is true');
        } else {
          setComponent(<Redirect to="/login" />);
        }
      });
  }, []);
  return (
    // Switch takes you to specific route that matches (if not switch, it renders all)
    <Router>
      <Switch>
        <Route exact path="/">
          {renderComponent}
        </Route>
        <Route exact path="/main" component={Main} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
      </Switch>
    </Router>
  );
}
export default App;