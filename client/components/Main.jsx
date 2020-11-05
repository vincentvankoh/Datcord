import React, { useEffect, useState } from 'react';

function Main () {
  // [state name, state action]
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [ws, setWebSocket] = useState("");

  // set websocket location
  const url = 'ws://localhost:4040';
  // connect to a new Websocket
  const connection = new WebSocket(url);

  const nestedDisplay = [];

  useEffect( () => {
    connection.onopen = (e) => {
        console.log('WebSocket is open now.');
      }
    connection.onclose = (e) => {
    console.log('WebSocket is closed now.');
    // You can pass the special value of empty array [] as a way of saying “only run on mount, and clean up on unmount”
    setWebSocket(new WebSocket(url));
    }
    connection.onerror = (e) => {
        console.log('WebSocket has had an error: ', e)
    }
    connection.onmessage = (e) => {
    // when message is received from server append to dom
        nestedDisplay.push(
            <div key={e.data}>
                <p key={e.data}>{e.data}</p>
                <hr />
            </div>
        )
        // console.log("nested display updated", nestedDisplay)
        setMessages(messages.concat(nestedDisplay));
    }
  });

    // console.log(messages);
    // console.log(message);
  
    return (
        <div>
             <div className='chatroom'>
                { messages }
            </div>
        <hr />
            <form>
                <input 
                    type='text'
                    className='message'
                    placeholder='message'
                    onChange={ (e) => setMessage(e.target.value)}
                    />
                <button
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