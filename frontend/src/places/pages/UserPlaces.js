import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../hooks/http-hook";
import PlaceList from "../components/PlaceList";

const UserPlaces = () => {
  const userId = useParams().userId; // takes out the userId property from the url
  const { error, isLoading, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();

  useEffect(() => {
    // cannnot have async function in useEffect
   
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL+`places/user/${userId}`
        );

        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchData();
  }, [sendRequest, userId]);

 const placeDeletedHandler = (deletedPlaceId) => {
  setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId))
 }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace = {placeDeletedHandler} />}
    </React.Fragment>
  );
};

export default UserPlaces;
