import React from "react";
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GroupChat from "./GroupChat";

function App() {
  return (

    <div className="app">
      <Router>
        <Header />
        <div className="app_body">

          <Sidebar />

          <Switch>
            
            
            <Route path="/groupChat/:groupChatId">
            
              
             
              <GroupChat />
            </Route>
            
            <Route path="/">
              <h1>Home</h1>
            </Route>

          </Switch>

          
        </div>
      </Router>
    </div>
  );
}

export default App;