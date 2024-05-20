import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import './NavLinks.css'

const NavLinks = () => {

    return(
        <ul className='nav-links'>
            <li>
                <NavLink to='/'>ALL USERS</NavLink>
            </li>
            <li>
                <NavLink to='/u1/places'>MY PLACES</NavLink>
            </li>
            <li>
                <NavLink to='/places/new'>ADD PLACES</NavLink>
            </li>
            <li>
                <NavLink to='/auth'>AUTHENTICATE</NavLink>
            </li>
        </ul>
    );
}

export default NavLinks