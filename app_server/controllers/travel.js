const request = require('request'); //creation of request object
const apiOptions = { //javascription option w server url
    server: 'http://localhost:3000'
}

/* render travel list view*/ 
const renderTravelList = (req, res, responseBody) => {
    let message = null; // process the body that came back from the api call
    let pageTitle = process.env.npm_package_description + ' - Travel'; 

    if(!(responseBody instanceof Array)) {//if the result that came back is not an error
        message = 'API lookup error'; 
        responseBody = []; //then empty array
    } else {
        if (!responseBody.length) {//we could get an array that is empty, like nothing in the database so 
            message = 'No trips exist in database!'; // set the message
        }
    }

    res.render('travel', {//call the response object
        title: pageTitle, 
        trips: responseBody, //instead of coming from the file system, passing the response body from the api
        message
    });
};

/* GET traveler list view */
const travelList = (req, res) => { //returns a list of trips
    const path = '/api/trips'; //path points to api location
    const requestOptions = { //request options
        url: `${apiOptions.server}${path}`, //the url
        method: 'GET', //the method
        json: {}, //the body
    };

    console.info('>> travelController.travelList calling' + requestOptions.url); //emit on the console the controller is making a call over to the api that there is a request being made

    request(
        requestOptions, 
        (err, { statusCode }, body) => {
            if (err) {
                console.error(err);
            }
            renderTravelList(req, res, body); // renders the travel list
        }
    );
};

module.exports = {
    travelList, 
};