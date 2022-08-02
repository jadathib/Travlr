const mongoose = require('mongoose'); 
const model = mongoose.model('trips'); 

//GET: /trips- lists all the trips
const tripsList = async (req, res) => {
  model 
      .find({}) //empty filter for all, which returens all trips 
      .exec((err, trips) => {//what happens when javascript runs function
        if (!trips) {//if nothing gets returned
          return res//error message 
              .status(404)
              .json({ "message": "trip not found"});
        } else if (err) {//else if we did get error from mongoose
          return res
              .status(404)
              .json(err);//then take errorblock turn into javascript
        } else {//else success
          return res 
              .status(200)
              .json(trips);
        }
    });
};

const tripsFindCode = async (req, res) => {//call trips and place a parameter of the trip code
  model 
      .find({ 'code': req.params.tripCode })//pass a filter criteria of the code
      .exec((err, trip) => {//all error codes are same from the top
          if (!trip) {
              return res 
              .status(404)
              .json({ "message": "trip not found"});
          } else if (err) { 
              return res 
              .status(404)
              .json(err); 
          } else {
              return res 
              .status(200)
              .json(trip);
          }
    });
};

module.exports = {
  tripsList,
  tripsFindCode
};

