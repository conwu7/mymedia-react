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
  const [userPreferences, setUserPreferences] = useState({notSet: true});
  const [isUserCheckDone, setUserCheckDone] = useState(false);
  // Get username, list and media sort preferences
  const updateUser = useCallback(
       () => {
        return checkForUser(setUser, setUserCheckDone, setUserPreferences)
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
  if (!isUserCheckDone || (user && userPreferences.notSet)) return null;
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
                listPref={userPreferences.listSortPreference}
                mediaPref={userPreferences.mediaSortPreference}
                defaultMediaPage={userPreferences.defaultMediaPage}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default MyMediaListsApp;
