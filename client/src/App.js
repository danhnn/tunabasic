import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AdminPage from './containers/admin/AdminPage';
import FisherManPage from './containers/fisher/FisherManPage';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
        <Router>
          <div>
            <Route exact path="/" component={AdminPage} />
            <Route path="/fisher" component={FisherManPage} />
          </div>
        </Router>
    );
  }
}

export default App;
