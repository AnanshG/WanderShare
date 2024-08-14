import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import "./Authenticate.css";

const Authenticate = () => {
  const Auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }

    setIsLoginMode((prevMode) => !prevMode); // use to toggle between true and false , depending on the state
  };

  const submitHandler = async (event) => {
    event.preventDefault(); // to prevent default submition and automating reloading of page necessary to use

    console.log(formState.inputs);
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "users/login",
          "POST",
          JSON.stringify({
            // takes regular javascript data and converts it JSON format
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-type": "application/json", // it is necessary to specify content type in header or else body-parser in backend will not be able to understand
          }
        );

        Auth.login(responseData.userId , responseData.token);
      } catch (err) {
        // hook handles the error
      }
    } else {
      try {
        const formData = new FormData(); // formData supports binary data and is available in browser
        formData.append("email", formState.inputs.email.value); // appending form data with text data and binary data
        formData.append("name", formState.inputs.name.value); // appending form with text data data and binary data
        formData.append("password", formState.inputs.password.value); // appending form data with text data and binary data
        formData.append("image", formState.inputs.image.value); // appending form data and binary data

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "users/signup",
          "POST",
          formData // fetch automatically adds suitable headers for the formData
        );

        
        Auth.login(responseData.userId , responseData.token);
      } catch (err) {} // hook handles the error
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login</h2>
        <hr />
        <form onSubmit={submitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              label="Name"
              element="input"
              type="text"
              errorText="Name should have some characters"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              onInput={inputHandler}
              center
              id="image"
              errorText="Please upload an image"
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            errorText="Email is not valid , enter a valid email"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            errorText="Password should be more than 6 characters long"
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Authenticate;
