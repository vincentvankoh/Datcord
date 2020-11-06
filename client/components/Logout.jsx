// import React, { Profiler, useEffect, useState } from 'react';
// import {
//   BrowserRouter as Router, Route, Switch, Redirect,
// } from 'react-router-dom';
// import App from "../App.jsx";

// function Logout() {

//   const [renderComponent, setComponent] = useState(<></>);

//   // make post request to /api/logout
//     // response: isloggedin = false

//     useEffect(() => {
//       // fetch starts
//       fetch('/api/logout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//         }).then((resp) => resp.json())
//         .then((data) => {
//           const { isLoggedIn } = data;
//           // if isLogged in is true, redirect to main page
//           if (isLoggedIn) {
//           } else {
//             setComponent(<Redirect to="/" />);
//           }
//         }).catch((err) => console.log(err));
//     }, [])


//   // need to pass down res.locals.username from App.jsx 
//     // does this need to be passed through Main.jsx to get here?

//     // click handler function to send res.clearcookies request

//     // display logout button

//     return (
//       <div>     
//       <Router>
//         <Switch>
//           {renderComponent}
//           <Route exact path="/" component={App} />
//         </Switch>
//       </Router>
//       </div>
//     )
    
// }


// export default Logout;