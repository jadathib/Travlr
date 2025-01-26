const request = require('request'); // Request object for API calls
const apiOptions = { // Configuration for server URL
    server: 'http://localhost:3000'
}

/* Render the travel list view */
const renderTravelList = (req, res, responseBody) => {
    let message = null;  // Initialize message to null
    let pageTitle = process.env.npm_package_description + ' - Travel';

    if (!(responseBody instanceof Array)) { // If the response is not an array
        message = 'API lookup error';
        responseBody = []; // Default to empty array if there's an error
    } else {
        if (!responseBody.length) { // If no trips in the database
            message = 'No trips exist in the database!';
        }
    }

    // Render the travel list page, passing the trips and any messages
    res.render('travel', {
        title: pageTitle,
        trips: responseBody,
        message
    });
};

/* Get traveler list view */
const travelList = (req, res) => {
    const path = '/api/trips'; // Path for the API endpoint
    const requestOptions = {
        url: `${apiOptions.server}${path}`,  // Construct the full URL
        method: 'GET',  // HTTP method for the request
        json: true,     // Automatically parse JSON response
    };

    console.info('>> travelController.travelList calling ' + requestOptions.url); // Log the API call

    // Perform the API request
    request(requestOptions, (err, response, body) => {
        if (err) {
            console.error(err); // Log any error
            return res.status(500).json({ message: 'Error retrieving travel list from API.' }); // Send error response to the client
        }

        if (response.statusCode !== 200) { // Handle non-200 status codes
            return res.status(response.statusCode).json({ message: 'Error fetching data from the server.' });
        }

        renderTravelList(req, res, body);  // Call the render function with the response body
    });
};

module.exports = {
    travelList,
};
