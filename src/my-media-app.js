import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {useState, useEffect, useCallback} from "react";

import './stylesheets/reset.css';
import './stylesheets/App.css';
import './stylesheets/components/validation.scss';

import SignUpForm from './pages/sign-up';
import LoginForm from './pages/login';
import Dashboard from './pages/dashboard';
import Account from './pages/account';

import {NavBar, NavBarNoUser} from './components/navbar';

import {checkForUser} from './helpers/common';

function MyMediaApp() {
  const [user, setUser] = useState('');
  const [listPref, setListPref] = useState('');
  const [mediaPref, setMediaPref] = useState('');
  const [isUserCheckDone, setUserCheckDone] = useState(false);
  const updateUser = useCallback(
       () => {
        return checkForUser(setUser, setUserCheckDone, setListPref, setMediaPref)
            .catch(err => console.log(err));
      },
      []
  );
  useEffect(() => {
    updateUser()
        .catch(err => console.log(err));
  }, [updateUser])
  if (!isUserCheckDone) return null;
  return (
    <div className="App" id="App">
      <Router>
        {user ? <NavBar /> : <NavBarNoUser />}
        <Switch>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/login">
            <LoginForm user={user}/>
          </Route>
          <Route path="/signup">
            <SignUpForm user={user}/>
          </Route>
          <Route path="/dashboard">
            <Dashboard
                user={user}
                updateUser={updateUser}
                listPref={listPref}
                mediaPref={mediaPref}
                setListPref={setListPref}
                setMediaPref={setMediaPref}
            />
          </Route>
          <Route path="/">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default MyMediaApp;
