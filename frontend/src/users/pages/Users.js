import React,{ useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from '../../hooks/http-hook' 

const Users = () => {

  const {error , isLoading , sendRequest , clearError}  = useHttpClient();
  const [loadedUsers , setLoadedUsers] = useState();


  // dont use async funciton in useEffect as it not expects that
  useEffect(() => {  // to stop infinite loop rendering
    
    const fetchUsers = async () => {
    try{
       // using a iffy async function
      const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + "users") // get request is default
    
      setLoadedUsers(responseData.users);
    }
    catch(err){}  // hook handles the error
    };

    fetchUsers();
  },[sendRequest]);   // since we have used useCallback in sendRequest so it wont have infinite rendering 

  return (
    <React.Fragment>
    <ErrorModal error = {error} onClear = {clearError}/>
    {isLoading && 
    <div className="center">
      <LoadingSpinner/>
    </div>}
    {!isLoading && loadedUsers &&<UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
