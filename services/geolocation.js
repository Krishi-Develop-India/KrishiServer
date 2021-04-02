const axios = require('axios');

const apiKey = process.env.GEO_LOCATION_KEY;

const getLocalityData = async (lat, long) => {
    try{
        const route = `http://api.positionstack.com/v1/reverse?access_key=${apiKey}&query=${lat},${long}&limit=1&output=json`;
        const { data:location }  = await axios.get(route);
        return location.data[0];
    } catch(error) {
        console.log("Error getting the locality", error);
    }
}

module.exports = {
    getLocalityData
};