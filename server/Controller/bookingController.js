const {
  Booking,
  Customer,
  User,
  Service,
  sequelize,
  RecurringBooking,
  BookingService,
  ServicePackages,
} = require("../models");
const { Op } = require("sequelize");

module.exports = {
  // getBookingsCalender: async (req, res) => {
  //   try {
  //     const { view, date, month, year } = req.query;
  //     let where = {};

  //     if (month && year) {
  //       // Month filter
  //       const startOfMonth = new Date(year, month - 1, 1);
  //       const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  //       where.date = {
  //         [Op.between]: [startOfMonth, endOfMonth],
  //       };
  //     } else if (date && view) {
  //       const selectedDate = new Date(date);

  //       if (view === "day") {
  //         const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
  //         const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

  //         where.date = { [Op.between]: [startOfDay, endOfDay] };
  //       } else if (view === "week") {
  //         const startOfWeek = new Date(selectedDate);
  //         startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
  //         startOfWeek.setHours(0, 0, 0, 0);

  //         const endOfWeek = new Date(startOfWeek);
  //         endOfWeek.setDate(startOfWeek.getDate() + 6);
  //         endOfWeek.setHours(23, 59, 59, 999);

  //         where.date = { [Op.between]: [startOfWeek, endOfWeek] };
  //       } else if (view === "month") {
  //         const startOfMonth = new Date(
  //           selectedDate.getFullYear(),
  //           selectedDate.getMonth(),
  //           1
  //         );
  //         const endOfMonth = new Date(
  //           selectedDate.getFullYear(),
  //           selectedDate.getMonth() + 1,
  //           0,
  //           23,
  //           59,
  //           59
  //         );

  //         where.date = { [Op.between]: [startOfMonth, endOfMonth] };
  //       }
  //     }
  //     const bookings = await Booking.findAll({
  //       where,
  //       include: [
  //         {
  //           model: Customer,
  //           as: "customer",
  //           attributes: ["id", "name", "email"],
  //         },
  //         { model: User, as: "staff", attributes: ["id", "name", "email"] },
  //         {
  //           model: BookingService,
  //           as: "bookingServices",
  //           include: [
  //             {
  //               model: Service,
  //               as: "service",
  //               attributes: ["id", "title", "price"],
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     res.status(200).json({
  //       message: "Bookings fetched successfully",
  //       data: bookings,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching calendar bookings:", error);
  //     res
  //       .status(500)
  //       .json({ error: "An error occurred while fetching bookings." });
  //   }
  // },

  getBookingsCalender: async (req, res) => {
    try {
      const bookings = await Booking.findAll({
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "name", "email"],
          },
          { model: User, as: "staff", attributes: ["id", "name", "email"] },
          {
            model: BookingService,
            as: "bookingServices",
            include: [
              {
                model: Service,
                as: "service",
                attributes: ["id", "title", "price"],
              },
            ],
          },
        ],
      });

      res.status(200).json({
        message: "Bookings fetched successfully",
        data: bookings,
      });
    } catch (error) {
      console.error("Error fetching calendar bookings:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching bookings." });
    }
  },
  
  getBookings: async (req, res) => {
    try {
      const bookings = await Booking.findAll({
        include: [
          {
            model: Customer,
            as: "customer",
          },
          {
            model: User,
            as: "staff",
            attributes: ["id", "name", "email"],
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
            ],
          },
        ],
      });

      res
        .status(200)
        .json({ message: "Unique email wise Bookings", data: bookings });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({
        error: "An error occurred while fetching bookings.",
      });
    }
  },

  addBooking: async (req, res) => {
    try {
      const {
        customer_id,
        staff_id,
        service_id,
        package_id,
        date,
        time,
        isRecurring,
        frequency,
        endDate,
      } = req.body;

      const staffIds = staff_id.split(",").map((id) => id.trim());
      const serviceIds = service_id.split(",").map((id) => id.trim());

      // Find the customer first
      const customer = await Customer.findByPk(customer_id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      // Increment visit count
      customer.visit_count = (customer.visit_count || 0) + 1;
      await customer.save();

      // 1️⃣ First booking record → just store first staff + first service
      const booking = await Booking.create({
        customer_id,
        package_id:package_id||1,
        date,
        staff_id: staffIds[0]||1, // just first one
        service_id: serviceIds[0]||0, // just first one
        time,
        status: 1,
      });

      // 2️⃣ Insert all combinations in bookingservice
      const bookingServiceRecords = [];
      for (const sId of staffIds) {
        for (const svcId of serviceIds) {
          bookingServiceRecords.push({
            booking_id: booking.id,
            customer_id,
            staff_id: sId,
            service_id: svcId ||[],
          });
        }
      }
      await BookingService.bulkCreate(bookingServiceRecords);

      if (isRecurring) {
        await RecurringBooking.create({
          booking_id: booking.id,
          frequency,
          endDate,
        });
      }

      res.status(201).json({
        message: isRecurring
          ? "Recurring booking added successfully with services"
          : "Booking added successfully with services",
        data: {
          customer,
          booking,
          bookingServices: bookingServiceRecords,
        },
      });
    } catch (error) {
      console.error("Error adding booking:", error);
      res.status(500).json({
        error: "An error occurred while adding booking.",
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const service = await Service.findAll();
      const customer = await Customer.findAll({
        attributes: [
          [sequelize.fn("MIN", sequelize.col("id")), "id"],
          [sequelize.fn("MIN", sequelize.col("name")), "name"],
          "email",
        ],
        group: ["email"],
      });
      const Staff = await User.findAll({
        where: { role: [2,3]},
      });
      return res.status(200).json({
        data: { service, customer, Staff },
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({
        error: "An error occurred while fetching bookings.",
      });
    }
  },

  deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ where: { id } });
      if (!booking)
        return res.status(404).json({ message: "Booking not found" });
      await booking.destroy();
      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
