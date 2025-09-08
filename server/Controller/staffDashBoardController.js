const {
  User,
  Customer,
  Service,
  sequelize,
  Booking,
  Attendance,
  CustomerService,
  BookingService,
  ServicePackages,
  PackageServices,
  Discount,
  Invoice,
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


  addCustomers: async (req, res) => {
    try {
      const { service_id, name, email, dob, address, phone, status } = req.body;

      const imageFile = req.files ? req.files.image : null;
      let imagePath = null;

      if (imageFile) {
        imagePath = await uploadImage(imageFile);
      }

      const userId = req.staff.id; // single staff id
      // const serviceIds = service_id.split(",").map((id) => id.trim());

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
          visit_count: 0,
        },
      });

      // If customer already exists, update visit count
      // if (!created) {
      //   customer.visit_count += 1;
      //   await customer.save();
      // }

      // Create customer-service-staff relationships
      const customerServices = [];

      // for (const svcId of serviceIds) {
        customerServices.push({
          customer_id: customer.id,
          staff_id: userId,
          // service_id: svcId,
        });
      // }

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

  getPackages: async (req, res) => {
    try {
      const services = await ServicePackages.findAll({
        include: [
          {
            model: PackageServices,
            as: "packageServices",
            include: [{ model: Service, as: "service" }],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      res
        .status(200)
        .json({ message: "All ServicePackages fetched", data: services });
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
            model: ServicePackages,
            as: "package",
            attributes: ["id", "title", "price"],
          },
          {
            model: BookingService,
            as: "bookingServices",
            include: [
              {
                model: Service,
                as: "service",
                attributes: ["id", "title", "price"],
              },
            ]
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
          package_id,
        service_id,
        date,
        time,
        isRecurring,
        frequency,
        endDate,
      } = req.body;

      // ✅ Parse staff_id and service_id
      const serviceIds = service_id.split(",").map((id) => id.trim());

      // ✅ Get logged-in staff/user ID
      const userId = req.staff.id; // Depending on your auth middleware

      // Find the customer first
      const customer = await Customer.findByPk(customer_id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      // Increment visit count
      customer.visit_count = (customer.visit_count || 0) + 1;
      await customer.save();
      // ✅ Create main booking
      const booking = await Booking.create({
        customer_id,
        date,
        package_id:package_id||1,
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
          customer,
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








    generateInvoice: async (req, res) => {
      try {
        const { booking_id } = req.params;
  
        const booking = await Booking.findOne({
          where: { id: booking_id },
          include: [
  
            {
              model: Customer,
              as: "customer",
              attributes: ["id", "name", "email", "phone", "address"],
           
            },
            {
              model: BookingService,
              as: "bookingServices",
              include: [
                {
                  model: Service,
                  as: "service",
                  attributes: ["id", "title", "price", "duration"],
                },
              ],
            },
          ],
        });
  
        if (!booking) {
          return res.status(404).json({
            success: false,
            message: "Booking not found",
          });
        }
  
        // ✅ Calculate totals from all services (force number)
        let totalAmount = 0;
        let totalDuration = 0;
  
        if (booking.bookingServices && booking.bookingServices.length > 0) {
          booking.bookingServices.forEach(bs => {
            const price = Number(bs.service?.price) || 0;
            const duration = Number(bs.service?.duration) || 0;
  
            totalAmount += price;
            totalDuration += duration;
          });
        }
  
        // 🔹 Check for discount if applicable
        let discount = null;
        let finalAmount = totalAmount;
  
        if (booking.discount_id && booking.discount_id !== 0) {
          discount = await Discount.findOne({
            where: { id: booking.discount_id },
          });
  
          if (discount) {
            if (discount.type === 1) {
              // Percentage discount
              const discountValue = (totalAmount * discount.value) / 100;
              finalAmount = totalAmount - discountValue;
            } else if (discount.type === 2) {
              // Fixed discount
              finalAmount = totalAmount - discount.value;
            }
          }
        }
  
        // 🔹 Create or update invoice
        const [invoice, created] = await Invoice.findOrCreate({
          where: { booking_id: booking_id },
          defaults: {
            customer_id: booking.customer_id,
            discount_id: booking.discount_id || 0,
            total_amount: totalAmount,
            final_amount: finalAmount,
            total_duration: totalDuration,
            status: 1, // Pending
          },
        });
  
        if (!created) {
          // Update existing invoice if needed
          await invoice.update({
            total_amount: totalAmount,
            final_amount: finalAmount,
            discount_id: booking.discount_id || 0,
            total_duration: totalDuration,
          });
        }
        // 🔹 Get the complete invoice with all relations
        const completeInvoice = await Invoice.findOne({
          where: { id: invoice.id },
          include: [
            {
              model: Customer,
              as: "customer",
              attributes: ["id", "name", "email", "phone", "address"],
                 include: [
                {
                  model: User,
                  as: "staff",
                  attributes: ["id", "name", "email", "phone",],
                },
              ]
            },
            {
              model: Booking,
              as: "booking",
              include: [
                {
                  model: BookingService,
                  as: "bookingServices",
                  include: [
                    {
                      model: Service,
                      as: "service",
                      attributes: ["id", "title", "price", "duration"],
                    },
                  ],
                },
              ],
            },
            {
              model: Discount,
              as: "discount",
            },
          ],
        });
  
        res.status(200).json({
          success: true,
          message: "Invoice generated successfully",
          data: {
            ...completeInvoice.toJSON(),
            totalAmount,
            finalAmount,
            totalDuration,
          },
        });
      } catch (error) {
        console.error("Error generating invoice:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
      }
    },
  
};
