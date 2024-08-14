import React, { useCallback, useEffect, useState } from "react"; // order of imports (standard but not necessary) 1. 3rd party imports like react , react router dom  , then 2. component import and then at last 3. css files

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Users from "./users/pages/Users";
import NewPlaces from "./places/pages/NewPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Authenticate from "./users/pages/Authenticate";
import { AuthContext } from "./shared/context/auth-context";

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(null);
  const [tokenExpirationDate , setTokenExpirationDate] = useState()
  const [userId, setUserId] = useState(null);

  //using useCallBack for  login and logout function so that function doesnt get recreated for every rerender of the component , avoiding infinite loop rerendering
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);

    const tokenExpirationTime =   // to check for expiration of token
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // Date is a built-in API present in which browser javascript
                                              // to get current time and add 1 hour
    setTokenExpirationDate(tokenExpirationTime);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationTime.toISOString()   // to ensure no data gets lost when converted
      })
    );
    setUserId(uid);
  }, []); // since it dont have any dependency it will not rerender

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData"); // removes token from local storage
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()    // to check if expiration date is in future or not
    ) {
      login(storedData.userId, storedData.token , new Date(storedData.expiration));
    }
  }, [login]); //executes when componenet mounts or renders first time

  // we can use 2 useEffect()
  useEffect(() => {
    if(token && tokenExpirationDate){
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout,remainingTime )  // calls logout when time expires
    }
    else{
      clearTimeout(logoutTimer);
    }
  }, [token , logout , tokenExpirationDate]); 

  // using exact path so that only "/" renders not anything else renders
  // the order of routes matter or else unwanted pages will render like newplace before user place or else new place will render user place id is not found

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route exact path="/">
          <Users />
        </Route>
        <Route exact path="/:userId/places">
          <UserPlaces />
        </Route>
        <Route exact path="/places/newplaces">
          <NewPlaces />
        </Route>
        <Route exact path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path="/">
          <Users />
        </Route>
        <Route exact path="/:userId/places">
          <UserPlaces />
        </Route>
        <Route exact path="/auth">
          <Authenticate />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Switch>{routes}</Switch>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
