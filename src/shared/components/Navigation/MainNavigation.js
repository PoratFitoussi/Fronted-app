import {Link} from 'react-router-dom'
import { useState } from 'react';

import MainHeader from "./MainHeader";
import './MainNavigation.css';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';

const MainNavigation = props =>{

    const [drawerIsOpen,setDrawerIsOpen] = useState(false);
    
    const openDrawerHandller = () => {
        setDrawerIsOpen(true);
    }

    const clouseDrawerHandller = () => {
        setDrawerIsOpen(false);
    }

    return(
        <>
            {drawerIsOpen && <Backdrop onClick={clouseDrawerHandller } />}

            <SideDrawer show={drawerIsOpen} onClick={clouseDrawerHandller}>
                <nav className='main-navigation__drawer-nav'>
                    <NavLinks/>
                </nav>
            </SideDrawer>
            <MainHeader >
                <button className="main-navigation_menu-bth" onClick={openDrawerHandller}>
                    <span/>
                    <span/>
                    <span/>
                </button>
                <h1 className="main-navigation__title ">
                    <Link to='/'>
                        YourePlaces
                    </Link>                
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks/>
                </nav>
            </MainHeader>
        </>
    );
}

export default MainNavigation;