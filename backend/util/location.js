const HttpError = require('../models/http-error')

// doing this for an alternative for Google Api Key
// const API_KEY = "wijfoafjiafosifnioanfioaf"

getCoordsForAddress = async (address) => {      // asynchronous function, promise or await need to be used
    // if you dont have api then do this    
    return (
        {
            lat : 40.7484405,
            lng : -73.9882393
        }
    )

    // use it when you have api key from google
    // axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`) //using backticks

    // const data = response.data;

    // if(!data || data.status === 'ZER0_RESULTS'){
    //     const error = new HttpError("Could not find location for the specified address.",422)
    //     throw error
    // }

    // const coordinates = data.results[0].geometry.location;

    // return coordinates;
} 

module.exports = getCoordsForAddress;