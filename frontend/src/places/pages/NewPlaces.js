import React, { useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import ImageUpload from '../../shared/components/FormElements/ImageUpload'
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {useForm} from '../../hooks/form-hook'
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import {useHttpClient} from '../../hooks/http-hook'
import { AuthContext } from "../../shared/context/auth-context";



import "./NewPlaces.css";

const NewPlaces = () => {
  const {error , isLoading , sendRequest , clearError} = useHttpClient();
  const auth = useContext(AuthContext)

  // using array destructuring
  const [formState , inputHandler] = useForm({
    title : {
      value : "",
      isValid : false
    },
    description : {
      value : "",
      isValid : false
    },
    address : {
      value : "",
      isValid : false
    },
    image : {
      value : null,
      isValid : false
    }
  } , false);
  
  const history = useHistory()

  const placeSubmitHandler = async event => {
    event.preventDefault();

    try{

      const formData = new FormData(); // formData supports binary data and is available in browser
        formData.append("title", formState.inputs.title.value); // appending form data with text data and binary data
        formData.append("description", formState.inputs.description.value); // appending form with text data data and binary data
        formData.append("address", formState.inputs.address.value); // appending form data with text data and binary data
        formData.append("image",  formState.inputs.image.value); // appending form data with binary data

      await sendRequest(process.env.REACT_APP_BACKEND_URL+"places","POST",formData,{
        Authorization : "Bearer " + auth.token
      })    // fetch adds the appropriate header for formData , fetch is underlying function in sendRequest

    history.push('/');    // pushes user to home
    }
    catch(err){}  // hook manages the error
  }

  return (
    <React.Fragment>
      <ErrorModal error = {error} onClear = {clearError}/>
      <form className="place-form" onSubmit={placeSubmitHandler}>
      {isLoading && <LoadingSpinner asOverlay />}
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        type="text"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address"
        onInput={inputHandler}
      />
      <ImageUpload
            id="image"
            errorText="Please upload an image"
            onInput={inputHandler}
          />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
    </React.Fragment>
  );
};

export default NewPlaces;
