const {
  User,
  Customer,
  Service,
  sequelize,
  Booking,
  Attendance,
  CustomerService,
  BookingService,
} = require("../models");
const { Op } = require("sequelize");
const { uploadImage } = require("../uilts/imageUplord");
module.exports = {
  dashboard: async (req, res) => {
    try {
      const userid = req.staff.id;
      const loginUser = await User.findOne({
        where: { id: userid, role: 2 },
        attributes: ["name", "email", "image"],
      });

      const totleCustomer = await Customer.count();
      const totleServise = await Service.count();
      res.status(200).json({
        message: "Dashboard data fetched",
        data: { totleCustomer, totleServise, loginUser },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // -------------------start userProfile nd update------------

  getProfile: async (req, res) => {
    try {
      const userid = req.staff.id;
      const user = await User.findByPk(userid, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res
        .status(200)
        .json({ message: "get User Profile successfully", data: user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.staff.id;
      const { name, email, phone } = req.body;
      const imageFile = req.files ? req.files.image : null;

      let imagePath = null;
      if (imageFile) {
        imagePath = await uploadImage(imageFile);
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.email = email || user.email;
      if (imagePath) {
        user.image = imagePath;
      }

      await user.save();

      return res
        .status(200)
        .json({ message: "Profile updated successfully", data: user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  // -------------------end userProfile nd update------------

  // -------------------start customer ------------
  // getCustomers: async (req, res) => {
  //     try {

  //         const customers = await Customer.findAll({
  //             include: [
  //                 {
  //                     model: Service,
  //                     as: 'service',
  //                     attributes: ['id', 'title', 'description', 'image', 'price']
  //                 }
  //             ],

  //             order: [['createdAt', 'DESC']]
  //         });
  //         res.status(201).json({ message: 'Get all Customers', data: customers });
  //     } catch (error) {
  //         console.error("Error fetching customers:", error);
  //         res.status(500).json({ error: "An error occurred while fetching customers." });
  //     }
  // },
  getCustomers: async (req, res) => {
    try {
      const [latestCustomers] = await sequelize.query(`
                SELECT MAX(visit_count) as visit_count, email
                FROM customers
                GROUP BY email
            `);

      const whereClause = {
        [Op.or]: latestCustomers.map((c) => ({
          email: c.email,
          visit_count: c.visit_count,
        })),
      };

      const customers = await Customer.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: "staff",
            attributes: ["id", "name", "email"],
          },
          {
            model: Service,
            as: "service",
            attributes: ["id", "title", "description", "image", "price"],
          },
        ],
        order: [["visit_count", "DESC"]],
      });

      res.status(200).json({
        message: "Get all latest Customers (per email)",
        data: customers,
      });
    } catch (error) {
      console.error("Error fetching customers:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching customers." });
    }
  },

  // addCustomers: async (req, res) => {
  //     try {
  //         const {
  //             service_id,
  //             name,
  //             email,
  //             dob,
  //             address,
  //             phone,
  //             status
  //         } = req.body;

  //         // Check if service_id is provided
  //         if (!service_id) {
  //             return res.status(400).json({ message: "service_id is required" });
  //         }

  //         const imageFile = req.files ? req.files.image : null;
  //         let imagePath = null;

  //         if (imageFile) {
  //             imagePath = await uploadImage(imageFile);
  //         }

  //         // Split service_id string into array, trim spaces
  //         const serviceIds = service_id.split(',').map(id => id.trim()).filter(id => id !== '');

  //         if (serviceIds.length === 0) {
  //             return res.status(400).json({ message: "At least one valid service_id is required" });
  //         }

  //         // Use the logged in staff id from token/session (not from req.body)
  //         const userId = req.staff.id;

  //         // Count current visits by this email (for visit_count tracking)
  //         let visitCount = await Customer.count({ where: { email } });

  //         const customerRecords = [];

  //         for (const svcId of serviceIds) {
  //             visitCount++; // increment for each new record
  //             customerRecords.push({
  //                 staff_id: userId,
  //                 service_id: svcId,
  //                 name,
  //                 email,
  //                 dob,
  //                 address,
  //                 image: imagePath || "",
  //                 phone,
  //                 status: status || 1,
  //                 visit_count: visitCount
  //             });
  //         }

  //         // Bulk insert all customer visit records
  //         const createdCustomers = await Customer.bulkCreate(customerRecords);

  //         res.status(201).json({
  //             message: 'Customer visits recorded successfully',
  //             data: createdCustomers
  //         });

  //     } catch (error) {
  //         console.error(error);
  //         res.status(500).json({ message: 'Internal server error' });
  //     }
  // },

  addCustomers: async (req, res) => {
    try {
      const { service_id, name, email, dob, address, phone, status } = req.body;

      const imageFile = req.files ? req.files.image : null;
      let imagePath = null;

      if (imageFile) {
        imagePath = await uploadImage(imageFile);
      }

      const userId = req.staff.id; // single staff id
      const serviceIds = service_id.split(",").map((id) => id.trim());

      // Find or create the main customer record
      const [customer, created] = await Customer.findOrCreate({
        where: { email },
        defaults: {
          name,
          email,
          staff_id: userId,
          service_id,
          dob,
          address,
          image: imagePath || "",
          phone,
          status: status || 1,
          visit_count: 1,
        },
      });

      // If customer already exists, update visit count
      if (!created) {
        customer.visit_count += 1;
        await customer.save();
      }

      // Create customer-service-staff relationships
      const customerServices = [];

      for (const svcId of serviceIds) {
        customerServices.push({
          customer_id: customer.id,
          staff_id: userId,
          service_id: svcId,
        });
      }

      // Assuming you have a CustomerService model for the relationships
      const createdRelationships = await CustomerService.bulkCreate(
        customerServices
      );

      res.status(201).json({
        message: "Customer services recorded successfully",
        data: {
          customer,
          services: createdRelationships,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // -------------------end customer ------------

  // -------------------start Services ------------

  getServices: async (req, res) => {
    try {
      const services = await Service.findAll({
        order: [["createdAt", "DESC"]],
        where: { status: 1 },
      });
      res.status(200).json({ message: "All services fetched", data: services });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  allBooking: async (req, res) => {
    try {
      const userId = req.staff.id;

      const bookings = await Booking.findAll({
        include: [
          {
            model: Customer,
            as: "customer",
          },
          {
            model: Service,
            as: "service",
            attributes: ["id", "title", "price"],
          },
        ],
        where: { staff_id: userId },
      });

      res.status(200).json({
        message: "Bookings for this staff member",
        data: bookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({
        error: "An error occurred while fetching bookings.",
      });
    }
  },

  bookingAdd: async (req, res) => {
    try {
      const {
        customer_id,
        staff_id,
        service_id,
        date,
        time,
        isRecurring,
        frequency,
        endDate,
      } = req.body;

      // ✅ Parse staff_id and service_id
      const staffIds = staff_id.split(",").map((id) => id.trim());
      const serviceIds = service_id.split(",").map((id) => id.trim());

      // ✅ Get logged-in staff/user ID
      const userId = req.staff.id; // Depending on your auth middleware

      // ✅ Create main booking
      const booking = await Booking.create({
        customer_id,
        date,
        staff_id: userId,
        service_id: serviceIds[0], // Assuming first service as primary; update logic if needed
        time,
        status: 1,
      });

      // ✅ Create related service records
      const bookingServiceRecords = serviceIds.map((svcId) => ({
        booking_id: booking.id,
        customer_id,
        staff_id: userId,
        service_id: svcId,
      }));

      await BookingService.bulkCreate(bookingServiceRecords);

      // ✅ If recurring booking, save recurrence
      if (isRecurring && frequency && endDate) {
        await RecurringBooking.create({
          booking_id: booking.id,
          frequency,
          endDate,
        });
      }

      // ✅ Success response
      res.status(201).json({
        message: isRecurring
          ? "Recurring booking added successfully with services."
          : "Booking added successfully with services.",
        data: {
          booking,
          bookingServices: bookingServiceRecords,
        },
      });
    } catch (error) {
      console.error("Error adding booking:", error);
      res.status(500).json({
        error: "An error occurred while adding booking.",
        details: error.message,
      });
    }
  },

  allGet: async (req, res) => {
    try {
      console.log(req.body);

      const service = await Service.findAll();
      const customer = await Customer.findAll({
        attributes: [
          [sequelize.fn("MIN", sequelize.col("id")), "id"],
          [sequelize.fn("MIN", sequelize.col("name")), "name"],
          "email",
        ],
        group: ["email"],
      });

      return res.status(200).json({
        data: { service, customer },
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({
        error: "An error occurred while fetching bookings.",
      });
    }
  },

  // --------------------------------------Create a new attendance record
  createAttendance: async (req, res) => {
    try {
      const userId = req.staff.id;

      // Today’s date in YYYY-MM-DD
      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      }); // e.g., "2025-09-01"

      // Find today's attendance record
      let record = await Attendance.findOne({
        where: { staff_id: userId, date: today },
      });

      // Current time in IST with AM/PM
      const currentTime = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata", // ✅ ensure correct timezone
      }).format(new Date());

      if (!record) {
        // First Check-In
        record = await Attendance.create({
          staff_id: userId,
          date: today,
          checkIn: currentTime,
          checkOut: null,
        });

        return res.status(201).json({
          message: "Checked In successfully",
          data: record,
        });
      }

      if (!record.checkOut) {
        // First Check-Out
        record.checkOut = currentTime;
        await record.save();

        return res.status(200).json({
          message: "Checked Out successfully",
          data: record,
        });
      }

      // Already checked out → allow re-check-in
      record.checkIn = currentTime;
      record.checkOut = null;
      await record.save();

      return res.status(200).json({
        message: "Re-Checked In successfully",
        data: record,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get all attendance records
  getAllAttendance: async (req, res) => {
    try {
      const userId = req.staff.id;
      const records = await Attendance.findAll({
        include: [
          {
            model: User,
            as: "staffId",
          },
        ],
        where: { staff_id: userId },
        order: [["date", "DESC"]],
      });

      res
        .status(200)
        .json({ message: "Attendance records fetched", data: records });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get attendance by staff ID
  getAttendanceByStaff: async (req, res) => {
    try {
      const { staff_id } = req.params;
      const records = await Attendance.findAll({
        where: { staff_id },
        order: [["date", "DESC"]],
      });
      res
        .status(200)
        .json({ message: `Attendance for staff ${staff_id}`, data: records });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update an attendance record by ID
  updateAttendance: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.staff.id;
      const { staff_id, date, checkIn, checkOut } = req.body;

      const record = await Attendance.findByPk(id);
      if (!record) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      await record.update({ staff_id: userId, date, checkIn, checkOut });
      res
        .status(200)
        .json({ message: "Attendance updated successfully", data: record });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Delete an attendance record by ID
  deleteAttendance: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await Attendance.findByPk(id);
      if (!record) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      await record.destroy();
      res.status(200).json({ message: "Attendance deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Optional: Get attendance for a date range
  getAttendanceByDate: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const records = await Attendance.findAll({
        include: [
          {
            model: User,
            as: "staffId",
            attributes: ["id", "name", "email"],
          },
        ],
        where: {
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [["date", "DESC"]],
      });
      res
        .status(200)
        .json({ message: "Attendance records fetched", data: records });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
