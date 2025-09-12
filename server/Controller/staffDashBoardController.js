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
  Rating,
} = require("../models");
const { Op } = require("sequelize");
const { uploadImage } = require("../uilts/imageUplord");
const path = require("path");
const fs = require("fs");
module.exports = {
  dashboard: async (req, res) => {
    try {
      const userid = req.staff.id;
      const loginUser = await User.findOne({
        where: { id: userid, role: 2 },
        attributes: ["name", "email", "image"],
      });
 const totalStaff = await User.count({where: { role: 3 }});
      const totleCustomer = await Customer.count();
      const totleServise = await Service.count();
      res.status(200).json({
        message: "Dashboard data fetched",
        data: { totleCustomer, totleServise, loginUser,totalStaff },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // -------------------start userProfile nd update------------


    getStaff: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
      const offset = (page - 1) * limit;

      const { rows, count } = await User.findAndCountAll({
        where: { role:[3] },
        order: [["createdAt", "DESC"]],
        offset: offset,
        limit: parseInt(limit),
      });

      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        message: "Get all Receptionist",
        data: rows,
        meta: {
          totalRecords: count,
          totalPages: totalPages,
          currentPage: parseInt(page),
          perPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Error fetching Receptionist members:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addStaff: async (req, res) => {
    try {
      const { name, email, phone } = req.body;

      const imageFile = req.files ? req.files.image : null;

      // Check if email already exists
      const existingUser = await User.findOne({ where: { email,role: 3 } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Upload image if provided
      let imagePath = null;
      if (imageFile) {
        imagePath = await uploadImage(imageFile);
      }
      // Create new staff
      const newStaff = await User.create({
        name,
        email,
        phone,
        image: imagePath || "",
        role: 3,
      });
     
      res
        .status(201)
        .json({
          message: "Staff member added successfully",
          data: newStaff ,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
    getStaffById: async (req, res) => {
      try {
        const { id } = req.params;
  
        const staff = await User.findOne({
          where: { id, role: 3 },
          include: [
            {
              model: Customer,
              as: "customers",
              include: [
                {
                  model: Service,
                  as: "service",
                  attributes: ["id", "title", "description", "image", "price"],
                },
              ],
              order: [["createdAt", "DESC"]], // 👈 customers ko latest first
            },
            {
              model: Rating,
              as: "ratingsReceived",
              include: [
                {
                  model: Customer,
                  as: "customer",
                  attributes: ["id", "name", "email"], // 👈 to show who gave feedback
                },
              ],
            },
          ],
          attributes: ["id", "name", "email"],
        });
  
        if (!staff) {
          return res.status(404).json({ message: "Staff not found" });
        }
  
        res.status(200).json({
          message: "Staff details",
          data: staff,
        });
      } catch (error) {
        console.error("Error fetching staff by ID:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
    updateStaffStatus: async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;
  
        const staff = await User.findOne({ where: { id } });
        if (!staff) return res.status(404).json({ message: "Staff not found" });
  
        // Update status
        staff.status = status;
        await staff.save();
  
        res
          .status(200)
          .json({ message: "Staff status updated successfully", data: staff });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
    deleteStaff: async (req, res) => {
      try {
        const { id } = req.params;
        const staff = await User.findOne({ where: { id, role: 3 } });
        if (!staff) return res.status(404).json({ message: "Staff not found" });
  
        // Delete image if exists
        if (staff.image) {
          const imagePath = path.join(__dirname, "..", "public", staff.image);
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
  
        await staff.destroy();
        res.status(200).json({ message: "Staff deleted successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    },

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
    const { service_id, staff_id, name, email, dob, address, phone, status } =
      req.body;

    const imageFile = req.files ? req.files.image : null;
    let imagePath = null;

    if (imageFile) {
      imagePath = await uploadImage(imageFile);
    }

    const userId = req.staff.id; // staff (logged in user)
    const staffIds = staff_id ? staff_id.split(",").map((id) => id.trim()) : [];

    // Create or find customer by email
    const [customer, created] = await Customer.findOrCreate({
      where: { email },
      defaults: {
        name,
        email,
        receptionist_id: userId,
        staff_id: staffIds[0] || 0, // assign first staff for main record
        service_id,
        dob,
        address,
        image: imagePath || "",
        phone,
        status: status || 1,
        visit_count: 0,
      },
    });

    // If customer already exists, you could update visit count (optional)
    // if (!created) {
    //   customer.visit_count += 1;
    //   await customer.save();
    // }

    // Build relationships for CustomerService (customer ↔ staff)
    const customerServices = staffIds.map((sid) => ({
      customer_id: customer.id,
      staff_id: sid,
      // service_id: service_id,  // uncomment if you also want to link service
    }));

    // Save relationships
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
  const staffIds = staff_id.split(",").map((id) => id.trim());

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
        receptionist_id: userId,
         staff_id: staffIds[0]||1, 
        service_id: serviceIds[0]||0, // Assuming first service as primary; update logic if needed
        time,
        status: 1,
      });

      // ✅ Create related service records
   const bookingServiceRecords = [];
      for (const sId of staffIds) {
        for (const svcId of serviceIds) {
          bookingServiceRecords.push({
            booking_id: booking.id,
            customer_id,
            receptionist_id: userId,
            staff_id: sId,
            service_id: svcId ||[],
          });
        }
      }
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

      const service = await Service.findAll();
      const staff = await User.findAll({ where: { role: 3 } });
      const customer = await Customer.findAll({
        attributes: [
          [sequelize.fn("MIN", sequelize.col("id")), "id"],
          [sequelize.fn("MIN", sequelize.col("name")), "name"],
          "email",
        ],
        group: ["email"],
      });

      return res.status(200).json({
        data: { service, customer,staff },
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
                model: ServicePackages,
                as: "package",
              },
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
                model: ServicePackages,
                as: "package",
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
