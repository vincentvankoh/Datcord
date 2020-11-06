import React, { useEffect, useState, useRef, useContext } from 'react';
import {
    BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom';

import Profile from "./Profile.jsx";
import Login from "./Login.jsx";
import App from "../App.jsx";

function Main (props) {
  // [state name, state action]
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [ws, setWebSocket] = useState("");
  const [renderedComponent, setNewComponent] = useState();

  // this gives Main.jsx access to the username property from App.jsx
    // see React hooks useContext 
//   const username = useContext(UserContext);

  // set websocket location
  const url = 'ws://localhost:4040';
  // connect to a new Websocket
  const connection = new WebSocket(url);

  const nestedDisplay = [];

  useEffect( () => {
    window.addEventListener('keypress', function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    });
  });

  useEffect( () => {
    connection.onopen = (e) => {
        console.log('WebSocket is open now.');
    }
    connection.onclose = (e) => {
    console.log('WebSocket is closed now.');
    setWebSocket(new WebSocket(url));
    }
    connection.onerror = (e) => {
        console.log('WebSocket has had an error: ', e)
    }
    connection.onmessage = (e) => {
    // when message is received from server append to dom
          let messageArray = e.data.split(/,(.+)/)
        nestedDisplay.unshift(
            <div key={Date.now()}>
                <p><span>{messageArray[0]}: </span>
                {messageArray[1]}</p>
                <hr />
            </div>
        )
        // console.log("nested display updated", nestedDisplay)
        setMessages(messages.concat(nestedDisplay));
    }
  }, []);

  function profileClick() {
      console.log("profile clicked")
    setNewComponent(<Redirect to="/profile"> </Redirect>);
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
                  <Route exact path="/profile">
                    <Profile username={props.username} />
                  </Route>
                  <Route exact path="/">
                    <App />
                 </Route> 
                 <Route exact path="/main">
                 {renderedComponent}
                 <div>
                    <div className="buttons">
                        <span className="profile"><button type="button" onClick={profileClick}>Profile</button></span>
                        <span className="logout"><button type="button" onClick={logoutClick}>Logout</button></span>
                    </div>
                    <div className='chatroom' >
                        { messages }
                    </div>
                 <hr />
                 <form onSubmit={e => { e.preventDefault();
                        connection.send(message);
                        const textbox = document.querySelector('.message');
                        textbox.value = '';
                        setMessages(nestedDisplay); }}>
                    <input 
                        type='text'
                        className='message'
                        placeholder='message'
                        onChange={ (e) => setMessage(
                            [props.username, e.target.value]
                            )}
                        />
                    <button
                        id='sendChat'
                        type='button'
                        onClick={ (e) => {
                            e.preventDefault();
                            connection.send(message);
                            const textbox = document.querySelector('.message');
                            textbox.value = '';
                            setMessages(nestedDisplay);
                        }}
                        >
                        Send
                    </button>
                </form> 
                </div>

                 </Route>
                </Switch>
            </Router>
           
                
        </div>
    )
}

export default Main;