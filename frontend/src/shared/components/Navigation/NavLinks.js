import { useContext } from "react";

import { NavLink } from "react-router-dom";
                                            // NavLink is a special type of link which changes colour on the link which user  is on
import './NavLinks.css'
import { AuthContext } from "../../context/auth-context";

const NavLinks = () => {            // adding exact  in all users as we dont have all links operational in react router so that it doesnt treat every link same
   const Auth = useContext(AuthContext) 
   
   return ( 
        <ul className="nav-links">
            <li>
               <NavLink to = '/' exact>ALL USERS</NavLink> 
            </li>
            {Auth.isLoggedIn &&  <li>
               <NavLink to = {`/${Auth.userId}/places`}>MY PLACES</NavLink> 
            </li>}
            { Auth.isLoggedIn && <li>
               <NavLink to = '/places/newplaces'>ADD PLACE</NavLink> 
            </li>}
            {!Auth.isLoggedIn && <li>
               <NavLink to = '/auth'>AUTHENTICATE</NavLink> 
            </li>}
            {Auth.isLoggedIn && (
               <li>
                  <button onClick={Auth.logout}>
                     LOGOUT
                  </button>
               </li>
            )}
        </ul>
     );
}
 
export default NavLinks;