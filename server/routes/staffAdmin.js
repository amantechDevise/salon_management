var express = require("express");
const staffDashBoardController = require("../Controller/staffDashBoardController");
const stafauthenticateToken = require("../middleware/staffToken");
const ratingController = require("../Controller/ratingController");
const staffController = require("../Controller/staffController");

var staffrouter = express.Router();

staffrouter.get("/staff", stafauthenticateToken, staffDashBoardController.getStaff);
staffrouter.post("/staff/add", stafauthenticateToken, staffDashBoardController.addStaff);
staffrouter.get("/staff/:id",stafauthenticateToken, staffDashBoardController.getStaffById);
staffrouter.delete("/staff/:id", stafauthenticateToken, staffDashBoardController.deleteStaff);
staffrouter.patch(
  "/staff/:id/status",
stafauthenticateToken, staffDashBoardController.updateStaffStatus
);
staffrouter.get(
  "/dashboard",
  stafauthenticateToken,
  staffDashBoardController.dashboard
);
staffrouter.put(
  "/profile/change-password",
  stafauthenticateToken,
  staffController.updatePassword
);
staffrouter.get(
  "/get-profile",
  stafauthenticateToken,
  staffDashBoardController.getProfile
);
staffrouter.put(
  "/update-profile",
  stafauthenticateToken,
  staffDashBoardController.updateProfile
);
staffrouter.get(
  "/customer",
  stafauthenticateToken,
  staffDashBoardController.getCustomers
);
staffrouter.post(
  "/customer/add",
  stafauthenticateToken,
  staffDashBoardController.addCustomers
);
staffrouter.get(
  "/services",
  stafauthenticateToken,
  staffDashBoardController.getServices
);
staffrouter.get(
  "/packages",
  stafauthenticateToken,
  staffDashBoardController.getPackages
);
staffrouter.get(
  "/booking",
  stafauthenticateToken,
  staffDashBoardController.allBooking
);
staffrouter.get(
  "/getAll",
  stafauthenticateToken,
  staffDashBoardController.allGet
);
staffrouter.post(
  "/booking/add",
  stafauthenticateToken,
  staffDashBoardController.bookingAdd
);

staffrouter.get(
  "/attendance",
  stafauthenticateToken,
  staffDashBoardController.getAllAttendance
);
staffrouter.post(
  "/attendance/add",
  stafauthenticateToken,
  staffDashBoardController.createAttendance
);
staffrouter.get(
  "/range",
  stafauthenticateToken,
  staffDashBoardController.getAttendanceByDate
);

// ----------------------ratingController---------------
staffrouter.post(
  "/generate",
  stafauthenticateToken,
  ratingController.generateFeedbackLink
);
staffrouter.get(
  "/feedback/:staffName/:token",
  ratingController.getFeedbackByToken
);
staffrouter.post(
  "/feedback/:staffName/:token",
  ratingController.submitFeedback
);


staffrouter.get(
  "/generate_Invoice/:booking_id",
  stafauthenticateToken,
  staffDashBoardController.generateInvoice
);
module.exports = staffrouter;
