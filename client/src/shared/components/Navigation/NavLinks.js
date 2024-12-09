import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './NavLinks.css'
import { AuthContext } from '../../context/auth-context';

// The `NavLinks` component renders navigation links based on the user's authentication status, 
// using context (`AuthContext`) to determine if the user is logged in or not. It displays different 
// links depending on whether the user is authenticated or not, such as "MY PLACES", "ADD PLACE", and "LOGOUT".
const NavLinks = () => {

    const auth = useContext(AuthContext);   //An object we use to determent if the the link need to appear or not, depend if the user login or not  
    return (<ul className='nav-links'>
        <li>
            <NavLink to='/'>ALL USERS</NavLink>
        </li>
        {auth.isLoggedIn && (   //Make sure that the link is vissable only if the user in login
            <li>
                <NavLink to= {`/${auth.userId}/places`}>MY PLACES</NavLink>
            </li>
        )}
        {auth.isLoggedIn && (   //Make sure that the link is vissable only if the user in login
            <li>
                <NavLink  to='/places/new'>ADD PLACE</NavLink>
            </li>
        )}
        {!auth.isLoggedIn && (  //Make sure that the link is vissable only if the user in logout
            <li>
                <NavLink className='leftes-button' to='/auth'>SIGN UP</NavLink>
            </li>
        )}
        {auth.isLoggedIn && (   //Make sure that the link is vissable only if the user in logout
            <li>
                <NavLink className='leftes-button' onClick={auth.logout} to='/auth'>LOGOUT</NavLink>
            </li>
        )}
    </ul>
    );
}

export default NavLinks