const {
  Booking,
  Customer,
  User,
  Service,
  sequelize,
  RecurringBooking,
  BookingService,
} = require("../models");

module.exports = {
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
        date,
        staff_id: staffIds[0], // just first one
        service_id: serviceIds[0], // just first one
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
            service_id: svcId,
          });
        }
      }
      await BookingService.bulkCreate(bookingServiceRecords);

      // 3️⃣ If recurring → create recurrence record
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
          [sequelize.fn("MIN", sequelize.col("id")), "id"], // 👈 id bhi aa jayega
          [sequelize.fn("MIN", sequelize.col("name")), "name"],
          "email",
        ],
        group: ["email"],
      });
      const Staff = await User.findAll({
        where: { role: 2 },
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
};
