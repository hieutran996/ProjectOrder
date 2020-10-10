import React from 'react';
import { RecoilRoot } from 'recoil';
import LoginFaceBook from './Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ReactRouter from './Router/ReactRouter';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Switch>
          <Route path="/login" render={() => <LoginFaceBook />} />
          <ReactRouter />
        </Switch>
      </Router>
    </RecoilRoot>
  );
}

export default App;
