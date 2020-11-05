import React, { useEffect, useState, useRef, useContext } from 'react';

function Main (props) {
  // [state name, state action]
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [ws, setWebSocket] = useState("");

  // this gives Main.jsx access to the username property from App.jsx
    // see React hooks useContext 
//   const username = useContext(UserContext);

  // set websocket location
  const url = 'ws://localhost:4040';
  // connect to a new Websocket
  const connection = new WebSocket(url);

  const nestedDisplay = [];

  useEffect( () => {
    document.getElementById('sendChat').addEventListener('keypress', function(event) {
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
          console.log('username', e.data[0], 'message', e.data[1], 'e', e, 'data', e.data)
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

    // console.log(messages);
    // console.log(message);
  
    return (
        <div>
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
    )
}

export default Main;