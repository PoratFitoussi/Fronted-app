import { createContext } from "react";

// Creating a context for managing authentication state in the application.
export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    token: null,
    name: '',
    login: () => { },
    logout: () => { }
});