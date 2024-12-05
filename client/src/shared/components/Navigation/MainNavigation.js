import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import MainHeader from "./MainHeader";
import './MainNavigation.css';
import NavLinks from './NavLinks.js';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';

// The `MainNavigation` component handles the main navigation of the app. 
// It manages a side drawer for mobile view that opens and closes when triggered, 
// and displays the navigation links either in the header or in the side drawer based on the state.
const MainNavigation = props => {

    const [drawerIsOpen, setDrawerIsOpen] = useState(false); // Track the side drawer state
    
    const openDrawerHandller = () => {
        setDrawerIsOpen(true);
    }
    
    const clouseDrawerHandller = () => {
        setDrawerIsOpen(false);
    }

    return (
        <React.Fragment>
            {/*In case the drawer is open andthe user press the background than the side drawer will be cloused  */}
            {drawerIsOpen && <Backdrop onClick={clouseDrawerHandller} />}

            {/**The functionality in the side drawer */}
            <SideDrawer show={drawerIsOpen} onClick={clouseDrawerHandller}>
                <nav className='main-navigation__drawer-nav'>
                    <NavLinks />
                </nav>
            </SideDrawer>

            <MainHeader >
                {/*Create a button for the side navigation, in case the button is press the side drawer will open*/}
                <button className="main-navigation__menu-btn" onClick={openDrawerHandller}>
                    <span />
                    <span />
                    <span />
                </button>

                <h1 className="main-navigation__title "> {/*The Title of the app */}
                    <Link to='/'>
                        YourePlaces
                    </Link>
                </h1>

                <nav className="main-navigation__header-nav"> {/*The navigation links */}
                    <NavLinks />
                </nav>
            </MainHeader>
        </React.Fragment>


    );
}

export default MainNavigation;