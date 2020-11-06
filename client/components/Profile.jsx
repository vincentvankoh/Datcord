import React, { useState } from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';

import Logout from './Logout.jsx';
import App from '../App.jsx';

function Profile(props) {

  const [chatComponent, setRenderComponent] = useState(<></>);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [success, setSuccess] = useState(<></>);
  // make post request to /api/updateusername /api/updatepassword
    // update user
      // send username, password, newUsername
      // response: success, newUsername 
    // update password
      // send username, password, newPassword
      // response: success

  // need to pass down res.locals.username from App.jsx 
    // does this need to be passed through Main.jsx to get here? want to display on main page

    
    // click handler to send post request with updated information
      // must account for post requests that have only updated username or updated password

    // click handler to send post request to delete information


    function changeUsername() {
      console.log("change username button clicked")
      if (currentPassword === "") {
        setSuccess(<div>Please enter your password to complete changes.</div>)
      }
      if (newUsername !== "" && newPassword === "" && currentPassword !== "") {
        fetch('/api/updateusername', {
          method: 'POST',
          headers: {
              'Content-Type' : 'application/json',
          },
          body: JSON.stringify( 
          {
              username: props.username,
              newUsername: newUsername,
              password: currentPassword,
          }
          ),
      })
      .then((resp) => resp.json())
      //if all ok from server response, redirect to main page of app
      .then(data => {
          const { success, newUsername } = data;
          // if isLogged in is true, redirect to main page
          console.log("fetch data", data);
          console.log(success);
          if (success) {
            setSuccess(<div>Username successfully changed to {newUsername}!</div>)
          } else {
            setSuccess(<div>Uh-oh, something went wrong...</div>)
          }
      })
      .catch(err => console.log(err));
      }
    }

    function changePassword() {
      console.log("change password button clicked");
      if (currentPassword === "") {
        setSuccess(<div>Please enter your password to complete changes.</div>)
      }
      if (newPassword !== "" && newUsername === "" && currentPassword !== "") {
        fetch('/api/updatepassword', {
          method: 'POST',
          headers: {
              'Content-Type' : 'application/json',
          },
          body: JSON.stringify( 
          {
              username: props.username,
              password: currentPassword,
              newPassword: newPassword,
          }
          ),
      })
      .then((resp) => resp.json())
      //if all ok from server response, redirect to main page of app
      .then(data => {
          const { success } = data;
          // if isLogged in is true, redirect to main page
          console.log("fetch data", data);
          console.log(success);
          if (success) {
            setSuccess(<div>Password successfully changed!</div>)
          } else {
            setSuccess(<div>Uh-oh, something went wrong...</div>)
          }
      })
      .catch(err => console.log(err));
      }
    }

 
    // display textbox with username, allow editing

    // display blank password box, allow new password input
      // ideally, we'd make them put in their old password before allowing this to update

    // display button to save profile updates

    // display logout button

    // display button to delete user

    function toChat() {
      setRenderComponent(<Redirect to="/" />)
    }

    function logoutClick() {
      console.log("logout clicked")
      fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
        }).then((resp) => resp.json())
        .then((data) => {
          const { isLoggedIn } = data;
          // if isLogged in is true, redirect to main page
          if (isLoggedIn) {
          } else {
            setNewComponent(<Redirect to="/" />);
          }
        }).catch((err) => console.log(err));
    }

    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/">
              <App />
            </Route>
            <Route exact path="/logout">
              <Logout />
          </Route> 
          <Route exact path="/profile">
            {chatComponent}
            <div>
              <h2>{props.username}'s Profile</h2>
              {success}
              <form style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Change Username: </label><input placeholder="new  username" onChange={((e) => {
                  setNewUsername(e.target.value);
                })}></input>

                <label>Current Password: </label><input type="password" placeholder="password" onChange={((e) => {
                  setCurrentPassword(e.target.value);
                })} required></input>

                <label>Change Password: </label><input type="password"
                 placeholder="new password" onChange={((e) => {
                  setNewPassword(e.target.value)
                })}></input>

                <button type="button" className="submit" onClick={changeUsername}>Change Username</button>  <button type="button" className="submit" onClick={changePassword}>Change Password</button>
              </form>
              <div className="buttons">
              <button type="button" onClick={toChat}>Back to Chat</button>
              <button type="button" onClick={logoutClick}>Logout</button>
              </div>
            </div>
          </Route>
          </Switch>
        </Router>
      </div>
    )

}


export default Profile;