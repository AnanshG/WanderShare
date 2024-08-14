import { useRef, useState ,useEffect} from "react";
import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file,setFile] = useState();
  const [previewUrl , setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();// survives re render cycles and also establishes connecton between DOM elements

  const pickedHandler = (event)=>{
    let pickedFile;
    let fileIsValid = isValid;
    if(event.target.files && event.target.files.length === 1){
        pickedFile = event.target.files[0]
        setFile(pickedFile)
        setIsValid(true)
        fileIsValid = true;
    }
    else{
        setIsValid(false)
        fileIsValid = false;
    } 

    props.onInput(props.id , pickedFile , fileIsValid);
  } 

  const pickImageHandler = () => {
    filePickerRef.current.click();  // utilizing image upload element (input tag) when the button gets clicked
  }
    
  useEffect(()=>{
    if(!file){
        return;
    }

    const fileReader = new FileReader();    //FileReader is available in browser side javaScript
    fileReader.onload = ()=>{       // function gets executed when fileReader loads or reads the file
        setPreviewUrl(fileReader.result);
    }
    fileReader.readAsDataURL(file); // reads the file but it doesnt give a promise

  },[file])
  return (
    <div className="form-control">
      <input
        id={props.id}
        type="file"
        ref={filePickerRef}
        accept=".jpg,.png,.jpeg"
        style={{ display: "none" }}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
            {previewUrl && <img src={previewUrl} alt="Preview"/>}
            {!previewUrl && <p>please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
      {!isValid && <p>{props.ErrorText}</p>}
    </div>
  );
};

export default ImageUpload;
