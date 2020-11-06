import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';
import { render } from 'react-dom';
import Login from './components/Login.jsx';
import Signup from './components/SignUp.jsx';
import Main from './components/Main.jsx';

// create context API 
// const UserContext = React.createContext(username);
// It returns object with 2 values:
  // {Provider, Consumer}
  // Use Provider to 

function App(props) {

  const [renderComponent, setComponent] = useState();
  const [username, setUsername] = useState('');

  useEffect(() => {
    // as soon as the page loads, send fetch request to see if the isLoggedIn is true
    fetch('/api/isloggedin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
      .then((json) => {
        console.log("json", json)
        const { username, isLoggedIn } = json;
        console.log('STATUS', isLoggedIn);
        if (isLoggedIn) {
          if (username){
            setUsername(username);
          }
          setComponent(<Redirect to="/main" />);
          console.log('isLoggedIn is true', username);
        } else {
          setComponent(<Redirect to="/login" />);
        }
      });
  }, []);

  return (
    // Switch takes you to specific route that matches (if not switch, it renders all matches ("/" will load everything with a "/" in it))

    // UserContext wrapper will provide children components access to values passed in


      <Router>
        <Switch>
          <Route exact path="/">
            {renderComponent}
          </Route>
          <Route exact path="/main" >
            <Main username={username}/>
          </Route>
          <Route exact path="/login" >
            <Login />
          </Route>
          <Route exact path="/signup" >
            <Signup />
          </Route>
        </Switch>
      </Router>

  );
}

export default App;