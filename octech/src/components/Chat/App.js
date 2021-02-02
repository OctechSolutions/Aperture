import React, { useState } from "react";
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GroupChat from "./GroupChat";

function App() {
  const [user, setUser] = useState(null);


  return (

    <div className="app">
      <Router>
        <Header />
        <div className="app_body">

          <Sidebar />

          <Switch>
            {/* {Wildcard} (any path besides main will have this) */}
            
            <Route path="/groupChat/:groupChatId">
              {/* <h1>Chat Window</h1> */}
              
              {/* <Chat /> */}
              <GroupChat />
            </Route>
            
            <Route path="/">
              <h1>Home</h1>
            </Route>

          </Switch>

          {/* React-Router Logic -> Chat screen */}
        </div>
      </Router>
    </div>
  );
}

export default App;