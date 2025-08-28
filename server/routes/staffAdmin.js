var express = require('express');
const staffDashBoardController = require('../Controller/staffDashBoardController');
const stafauthenticateToken = require('../middleware/staffToken');
const ratingController = require('../Controller/ratingController');

var staffrouter = express.Router();

staffrouter.get('/dashboard',stafauthenticateToken,staffDashBoardController.dashboard)
staffrouter.get('/get-profile',stafauthenticateToken,staffDashBoardController.getProfile)
staffrouter.put('/update-profile',stafauthenticateToken,staffDashBoardController.updateProfile)
staffrouter.get('/customer',stafauthenticateToken,staffDashBoardController.getCustomers)
staffrouter.post('/customer/add',stafauthenticateToken,staffDashBoardController.addCustomers)
staffrouter.get('/services',stafauthenticateToken,staffDashBoardController.getServices)

 // ----------------------ratingController---------------
 staffrouter.post("/generate",stafauthenticateToken, ratingController.generateFeedbackLink);
staffrouter.get("/:token",stafauthenticateToken, ratingController.getFeedbackByToken);
staffrouter.post("/:token",stafauthenticateToken, ratingController.submitFeedback);

// ----------------------bookingsController---------------

staffrouter.get('/bookings',stafauthenticateToken,staffDashBoardController.getBookings)
staffrouter.get('/getAll',stafauthenticateToken,staffDashBoardController.getAll)
staffrouter.post('/bookings/add',stafauthenticateToken,staffDashBoardController.addBooking)
module.exports = staffrouter;