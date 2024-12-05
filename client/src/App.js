import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import Users from './users/pages/Users.js'
import NewPlace from './places/pages/NewPlace.js';
import MainNavigation from './shared/components/Navigation/MainNavigation.js';
import UserPlaces from './places/pages/UserPlaces.js'
import UpdatePlace from './places/pages/UpdatePlace.js';
import Auth from './users/pages/Auth.js';
import { AuthContext } from './shared/context/auth-context.js';

const App = () => {
  //A state for the authcontext
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((userID) => {
    setIsLoggedIn(true);
    setUserId(userID);
  }, [])


  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userId }}>  {/**Define the variable for the context */}
      <Router>
        <MainNavigation />
        <main>
          <Routes>
            {/**The navigate for logged in user */}
            {isLoggedIn ? (
              <React.Fragment>
                <Route path="/" element={<Users />} />
                <Route path="/:uid/places" element={<UserPlaces />} />
                <Route path="/places/new" element={<NewPlace />} />
                <Route path="/places/:pid" element={<UpdatePlace />} />
                <Route path="/" element={<Auth />} />  {/**now the user redirect to a the home page once is logged in */}
                <Route path="*" element={<Navigate to="/" />} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Route path="/" element={<Users />} />
                <Route path="/:uid/places" element={<UserPlaces />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<Navigate to="/" />} />
              </React.Fragment>
            )}
          </Routes>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;