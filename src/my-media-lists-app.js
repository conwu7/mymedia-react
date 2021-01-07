import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import './stylesheets/reset.css';
import './stylesheets/App.css';
import './stylesheets/components/validation.scss';

import SignUpForm from './pages/sign-up';
import LoginForm from './pages/login';
import Dashboard from './pages/dashboard';

import { NavBar, NavBarNoUser } from './components/navbar';

import { checkForUser } from './helpers/common';

function MyMediaListsApp() {
  const [user, setUser] = useState('');
  const [listPref, setListPref] = useState('');
  const [mediaPref, setMediaPref] = useState('');
  const [isUserCheckDone, setUserCheckDone] = useState(false);
  // Get username, list and media sort preferences
  const updateUser = useCallback(

       () => {
        return checkForUser(setUser, setUserCheckDone, setListPref, setMediaPref)
            .catch(err => console.log(err));
      },
      []
  );
  // Initial call to get username, list and media sort preference
  useEffect(() => {
    updateUser()
        .catch(err => console.log(err));
  }, [updateUser])
  // While confirming user cookie is still active
  if (!isUserCheckDone || (user && (!listPref && !mediaPref))) return null;
  return (
    <div className="App" id="App">
      <Router>
        {user ? <NavBar /> : <NavBarNoUser />}
        <Switch>
          <Route path="/login">
            <LoginForm user={user}/>
          </Route>
          <Route path="/signup">
            <SignUpForm user={user}/>
          </Route>
          <Route path="/">
            <Dashboard
                user={user}
                updateUser={updateUser}
                listPref={listPref}
                mediaPref={mediaPref}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default MyMediaListsApp;
