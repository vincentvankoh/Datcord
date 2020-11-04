import React, {useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import Main from './components/Main.jsx';

<<<<<<< HEAD
class App extends React.Component {
  // when the component first mounts,
  // send a fetch request to the back end
  // see if the current user has a cookie session
  // if they do, redirect to main page
  // if they don't, redirect to login 
  componentDidMount() {
    const { push } = useHistory();
    // as soon as the page loads,
    // send fetch request to see if
    fetch('/api/isLoggedIn', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((isSignedIn) => {
      // current user isLoggedIn
      // if they are, display Main.jsx
      if (isSignedIn) push('/main');
      // if not, direct them to the login page
      push('/login');
    })
  }

  render() {
    return (
      <div >
        <Route exact path='/'>
          <Main />
        </Route>
        <Route exact path='/login' >
          <Login />
        </Route>
        <Route path='/signup'>
          <SignUp />
        </Route>
      </div>
    )
  }
=======
function App (props) {

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
        {isLoggedIn ? <Main/> : <Redirect to="/login" />}
      </Route>
      <Route exact path="/login" component={Login}></Route>
      <Route exact path="/signup" component={SignUp}>
      </Route>
    </Switch>
  </Router>
)

>>>>>>> 8045d639bc2492b7228794bd5e408e8bd78289d1
}

export default App;
