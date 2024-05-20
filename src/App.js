import React from 'react';
import { BrowserRouter as Router, Route, Redirect,Switch} from 'react-router-dom'

import './App.css';
import Users from './users/pages/Users.js'
import NewPlace from './places/pages/NewPlace.js';
import MainNavigation from './shared/components/Navigation/MainNavigation.js';
import UserPlaces from './places/pages/UserPlaces.js'
import UpdatePlace from './places/pages/UpdatePlace.js';

const App = () => {
  return (
    <Router>
      <MainNavigation/>
      <main>
        <Switch> 
        <Route path="/" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places">
          <UserPlaces/>
        </Route>
        <Route path="/places/new">
          <NewPlace />
        </Route>
        <Route path="/places/:pid">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
      </main>
           
    </Router>
    );
}

export default App;


