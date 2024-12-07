import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import Users from './users/pages/Users.js'
import NewPlace from './places/pages/NewPlace.js';
import MainNavigation from './shared/components/Navigation/MainNavigation.js';
import UserPlaces from './places/pages/UserPlaces.js'
import UpdatePlace from './places/pages/UpdatePlace.js';
import Auth from './users/pages/Auth.js';
import { AuthContext } from './shared/context/auth-context.js';

let logoutTimer;

const App = () => {
  //A state for the authcontext
  const [token, setToken] = useState(null);
  const [tokenExpriationData, setTokenExpriationData] = useState();
  const [userId, setUserId] = useState(null);

  const login = useCallback((userId, token, expiration) => {
    setToken(token);
    setUserId(userId);
    const tokenExpriationData = expiration || new Date(new Date().getTime + 1000 * 60 * 60) //create an expiration date for the token that will be an hour from the current time
    setTokenExpriationData(tokenExpriationData);
    //save the user data in the browser
    localStorage.setItem(
      'userData',
      JSON.stringify({ uid: userId, token: token, expiration: tokenExpriationData.toISOString })
    );
  }, [])


  const logout = useCallback(() => {
    setToken(null);
    setTokenExpriationData(null);
    setUserId(null);
    localStorage.removeItem('userData');  //remove the user data that was save in the browser
  }, []);

  useEffect(() => {
    if (token && tokenExpriationData) {
      const remainingTime = tokenExpriationData.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpriationData]);

  //In case the user rerender, check if the he was login, in case he waw than login him back
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));  //Recive the user data from the browser
    //verify if the user login is valid 
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.uid, storedData.token, new Date(storedData.expiration)); //login the user back
    }
  }, [login]);



  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token, login, logout, userId }}>  {/**Define the variable for the context */}
      <Router>
        <MainNavigation />
        <main>
          <Routes>
            {/**The navigate for logged in user */}
            {token ? (
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
