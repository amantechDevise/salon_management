var express = require('express');
const staffController = require('../Controller/staffController');
const servicesController = require('../Controller/servicesController');
const dashboardController = require('../Controller/dashboardController');
const customerController = require('../Controller/customerController');
const authenticateToken = require('../middleware/verifyToken');
const bookingController = require('../Controller/bookingController');

var router = express.Router();

/* GET users listing. */



// ----------------------DashBoard-------------
router.get('/dashboard',authenticateToken,dashboardController.dashboard)
router.get("/get-profile", authenticateToken, dashboardController.getProfile);
router.put("/update-profile",authenticateToken ,dashboardController.updateProfile);

// ----------------------staffController-------------


router.get('/staff',authenticateToken,staffController.getStaff)
router.post('/staff/add',authenticateToken,staffController.addStaff)
router.get('/staff/:id',authenticateToken,staffController.getStaffById)
router.put('/staff/:id',authenticateToken,staffController.updateStaff)
router.delete('/staff/:id',authenticateToken,staffController.deleteStaff)
router.patch('/staff/:id/status',authenticateToken, staffController.updateStaffStatus);
router.get("/staff/:id/attendance",authenticateToken, staffController.getStaffByAttendance);
router.get("/staff/:id/range",authenticateToken, staffController.range);

// ----------------------servicesController---------------
router.get('/services',authenticateToken,servicesController.getServices)
router.post('/services/add',authenticateToken,servicesController.addService)
router.get('/services/:id',authenticateToken,servicesController.getServiceById)
router.put('/services/:id',authenticateToken,servicesController.updateService)
router.put('/services/:id',authenticateToken,servicesController.updateService)
router.patch('/services/:id/status',authenticateToken, servicesController.updateServiceStatus);
router.delete('/services/:id',authenticateToken,servicesController.deleteService)



// ----------------------customerController---------------
router.get('/customer',authenticateToken,customerController.getCustomers)
router.post('/customer/add',authenticateToken,customerController.addCustomers)
router.get('/customerDetails/:id',authenticateToken,customerController.getCustomerDetails)




// ----------------------bookingsController---------------

router.get('/bookings',authenticateToken,bookingController.getBookings)
router.get('/getAll',authenticateToken,bookingController.getAll)
router.post('/bookings/add',authenticateToken,bookingController.addBooking)



module.exports = router;
