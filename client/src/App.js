import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation.js';
import { AuthContext } from './shared/context/auth-context.js';
import useAuth from './shared/hooks/auth-hooks.js';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner.js';
import './App.css';

//To make the web download only the request that used
const Users = React.lazy(() => import('./users/pages/Users.js'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace.js'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces.js'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace.js'));
const Auth = React.lazy(() => import('./users/pages/Auth.js'));

const App = () => {

  const { token, login, logout, userId, name } = useAuth();

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token, login, logout, userId, name }}>  {/**Define the variable for the context */}
      <Router>
        <MainNavigation />
        <main>
          {/**To use the lavy methid */}
          <Suspense fallback=
            {
              <div className='center'>
                <LoadingSpinner />
              </div>
            }>
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
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
