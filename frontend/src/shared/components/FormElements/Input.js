import { useReducer , useEffect} from "react";

import { validate } from "../../util/validators";
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state, // copies the properties of the state
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
     case "TOUCH":
      return {
        ...state,
        isTouched : true
      }
    default:
      return state;
  }
};
const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialIsValid || "",
    isTouched : false
  }); // used for complex state , takes two arguments one is function and other is initial state
  // dispatch function is used to dispatch actions to the reducer function to update state according to type of action

  const {id , onInput} = props;
  const {isValid , value} = inputState; 

  useEffect(() => {
    onInput(id ,value , isValid)
  }, [id , value , isValid , onInput])

  const touchHandler = () => {
    dispatch({type : 'TOUCH'})
  }

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}     // onBlur is attribute which get activate when the user leaves the input bar , means touching it , we are doing it so user gets a chance before warning message
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler} 
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
