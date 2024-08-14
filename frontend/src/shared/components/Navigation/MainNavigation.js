import {Link} from 'react-router-dom'
import React ,{useState} from 'react'

import MainHeader from './MainHeader'
import './MainNavigation.css'
import NavLinks from './NavLinks'
import SideDrawer from './SideDrawer'
import Backdrop from '../UIElements/BackDrop'

const MainNavigation = () => {      // anything which is inside MainHeader is its children  

    const [drawerIsOpen, SetDrawerIsOpen] = useState(false)
    
    const openDrawerHandler = () => {
        SetDrawerIsOpen(true)
    }

    const closeDrawerHandler = () => {
        SetDrawerIsOpen(false);
    }
    
    // menu btn  for mobile screen (small screen size) 
                                     // we can use React.Fragment or <></> for removing parent tag issue in this and they will not be treated as html elemets and will avoid unnecessary margin and nesting
    return (                             
        <React.Fragment>
        {drawerIsOpen && <Backdrop onClick ={closeDrawerHandler}/>}
        <SideDrawer show = {drawerIsOpen} onClick={closeDrawerHandler} className='nav-navigation__drawer-nav'>
            <NavLinks/>
        </SideDrawer>
        <MainHeader>
            <button className='main-navigation__menu-btn' onClick={openDrawerHandler}>
                <span/>
                <span/>
                <span/>
            </button>
            <h1 className='main-navigation__title'>
                <Link to = '/'>WanderShare</Link>
            </h1>
            <nav className='main-navigation__header-nav'>
                <NavLinks/>
            </nav>
        </MainHeader>
        </React.Fragment>
    );
}
 
export default MainNavigation;