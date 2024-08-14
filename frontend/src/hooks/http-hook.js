
import { useState, useCallback , useRef , useEffect } from "react"

export const useHttpClient = () => {
    const [isLoading , setIsLoading] = useState(false)
    const [error , setError] = useState();

    // used to store an active request if the user suddenly chaneges request if changed (used when to cancel a http request)
    const activeHttpRequests = useRef([]);       // by using useRef the piece of data will not change when the function re initializes


    // using useCallback so that sendRequest does get recreated after every re rendering of component
    const sendRequest =  useCallback( async (url , method = "GET" , body = null , headers = {}) => {
        setIsLoading(true);
        
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);  // useRef wraps data in array with current property
        
        try{
            
            const response = await fetch(url , {     // fetch function needs 1 parameter the url string (where to send http request to) and one parameter is there which is optional , it gives info about the request like type of request , body of request , header
                method,
                body,
                headers,
                signal : httpAbortCtrl.signal   // used to cancel http request if needed
            })
            
            const responseData = await response.json();
            
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            )

            if(!response.ok){   //error code 2xx is treated ok , 4xx 5xx are not treated ok
              throw new Error(responseData.message);
            }
            
            setIsLoading(false)
            return responseData;
        }
        catch(err){
            setError(err.message)
            setIsLoading(false)
            throw err;
        }

        
        }, [])

        const clearError = () => {
            setError(null)
        }



        // using this to ensure we dont have any ongoing request when the components changes and we no longer have the current component in which we have request
        
        useEffect( () => {     // useEffect is not only used to run logic when component renders but also used to run clean up logic when component unmounts

            return () => {      // returned function is used as a cleanup function when a component unmounts
                activeHttpRequests.current.forEach( abortCtrl => abortCtrl.abort() );    // to abort any request when component gets unmounted
            }         
        }  ,[] )

    return {sendRequest , isLoading , error ,clearError};
}