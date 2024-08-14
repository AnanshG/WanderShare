import { useCallback, useReducer } from "react";


const formReducer = (state, action) => {
    // used for checking the form validity for inputs
    switch (action.type) {
      case "INPUT_CHANGE":
        let formIsValid = true;
        for (const inputId in state.inputs) {
          if(!state.inputs[inputId]){
            continue;
          }
          if (inputId === action.inputId) {
            formIsValid = formIsValid && action.isValid;
          } 
          else {
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }
        }
  
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputId] : { value: action.value, isValid: action.isValid } // dynamic assignment
          },
          isValid: formIsValid,
        };
      case 'SET_DATA':
        return {
          inputs : action.inputs,
          isValid : action.formIsValid
        };
      default:
        return state;
    }
  };
  

export const useForm = (initialInput , initialValidity) => {

    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInput,
        isValid: initialValidity
    });

    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
          type: "INPUT_CHANGE",
          value: value,
          isValid: isValid,
          inputId: id,
        });
      }, []);     // dispatch function doesnt not change so there is no need to put dispatch as a dependency
    
      // useCallback is a React hook that returns a memoized version of a callback function. The memoized function only changes if one of the dependencies specified in the hook's dependency array has changed. This optimization helps prevent unnecessary re-renders of child components that rely on reference equality of functions passed as props.
      // to prevent the  useEffect to run again when titlehandlerInput runs as it is a dependancy in useEffect of Input component
      
      const setFormData = useCallback((inputData , formValidity) => {
        dispatch({
          type : "SET_DATA",
          inputs : inputData,
          formIsValid : formValidity
        });
      } , [])

      return [formState , inputHandler , setFormData];
}