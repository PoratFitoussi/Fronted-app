import { useState, useCallback, useEffect } from "react";

let logoutTimer;

const useAuth = () => {

  //A state for the authcontext
  const [name, setName] = useState('');
  const [token, setToken] = useState(null);
  const [tokenExpriationData, setTokenExpriationData] = useState();
  const [userId, setUserId] = useState(null);

  const login = useCallback((userId, token, name, expiration) => {
    setName(name);
    setToken(token);
    setUserId(userId);
    const tokenExpriationData = expiration || new Date(new Date().getTime() + 1000 * 60 * 60) //create an expiration date for the token that will be an hour from the current time
    setTokenExpriationData(tokenExpriationData);
    //save the user data in the browser
    localStorage.setItem(
      'userData',
      JSON.stringify({ uid: userId, token: token, name: name, expiration: tokenExpriationData.toISOString() })
    );
  }, [])


  const logout = useCallback(() => {
    setName('');
    setToken(null);
    setTokenExpriationData(null);
    setUserId(null);
    localStorage.removeItem('userData');  //remove the user data that was save in the browser
  }, []);



  useEffect(() => {
    // Check if the token exists and there is an expiration date for it
    if (token && tokenExpriationData) {
      const remainingTime = tokenExpriationData.getTime() - new Date().getTime();// Calculate the remaining time before the token expires
      logoutTimer = setTimeout(logout, remainingTime); // Set a timer to automatically log the user out when the token expires
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
      login(storedData.uid, storedData.token, storedData.name, new Date(storedData.expiration)); //login the user back
    }
  }, [login]);

  return { token, login, logout, userId, name };

}

export default useAuth;