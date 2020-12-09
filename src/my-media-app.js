import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {useState, useEffect} from "react";

import './stylesheets/reset.css';
import './stylesheets/App.css';

import SignUpForm from './pages/sign-up';
import LoginForm from './pages/login';
import Dashboard from './pages/dashboard';
import Account from './pages/account';

import AppHeader from './components/app-header';
import NavBar from './components/navbar';
import NavBarNoUser from './components/navbar-no-user';

function MyMediaApp() {
  const [user, setUser] = useState('');
  useEffect(() => {
    fetch('api/getuserdetails')
    .then(response => response.json())
    .then(apiResponse => apiResponse.success ? setUser(apiResponse.result.username) : "" )
    .catch(err => console.log(err))
  }, []);
  return (
    <div className="App">
      <Router>
        <AppHeader />
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
          <Route path="/">
            <Dashboard user={user}/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default MyMediaApp;
