const {
  User,
  Customer,
  Service,
  Booking,
  BookingService,
} = require("../models");
const { fn, col, literal } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadImage } = require("../uilts/imageUplord");
module.exports = {
  dashboard: async (req, res) => {
    try {
      const userid = req.user.id;
      const loginUser = await User.findOne({
        where: { id: userid, role: 1 },
        attributes: ["name", "email", "image"],
      });

      // Total counts
      const totleUser = await User.count({ where: { role: 2 } });
      const totleCustomer = await Customer.count();
      const totleServise = await Service.count();

      // ====== Business Overview ======
      // 1. Total Revenue by Staff
      const totalRevenue = await Booking.findAll({
        attributes: [
          [fn("SUM", col("bookingServices->service.price")), "totalRevenue"],
        ],
        include: [
          {
            model: BookingService,
            as: "bookingServices",
            attributes: [],
            include: [
              {
                model: Service,
                as: "service",
                attributes: [],
              },
            ],
          },
        ],
        raw: true,
      });
// 2. Daily Revenue Performance with Staff (FIXED)
const dailyRevenue = await Booking.findAll({
  attributes: [
    [fn("DATE", col("date")), "day"],
    [fn("SUM", col("bookingServices->service.price")), "revenue"],
    [col("staff.id"), "staffId"], // Add staff ID
    [col("staff.name"), "staffName"], // Add staff name
  ],
  include: [
    {
      model: BookingService,
      as: "bookingServices",
      attributes: [],
      include: [
        {
          model: Service,
          as: "service",
          attributes: [],
        },
      ],
    },
    {
      model: User,
      as: "staff",
      attributes: [], // Keep attributes empty here since we're selecting them above
    },
  ],
  group: [fn("DATE", col("date")), "staff.id", "staff.name"], // Add staff.name to group
  order: [[fn("DATE", col("date")), "DESC"]],
  raw: true,
});

// 3. Weekly Revenue Performance with Staff (FIXED)
const weeklyRevenue = await Booking.findAll({
  attributes: [
    [fn("YEARWEEK", col("date")), "week"],
    [fn("SUM", col("bookingServices->service.price")), "revenue"],
    [col("staff.id"), "staffId"], // Add staff ID
    [col("staff.name"), "staffName"], // Add staff name
  ],
  include: [
    {
      model: BookingService,
      as: "bookingServices",
      attributes: [],
      include: [
        {
          model: Service,
          as: "service",
          attributes: [],
        },
      ],
    },
    {
      model: User,
      as: "staff",
      attributes: [], // Keep attributes empty here
    },
  ],
  group: [fn("YEARWEEK", col("date")), "staff.id", "staff.name"], // Add staff.name to group
  raw: true,
});

// 4. Monthly Revenue Performance with Staff (FIXED)
const monthlyRevenue = await Booking.findAll({
  attributes: [
    [fn("DATE_FORMAT", col("date"), "%Y-%m"), "month"],
    [fn("SUM", col("bookingServices->service.price")), "revenue"],
    [col("staff.id"), "staffId"], // Add staff ID
    [col("staff.name"), "staffName"], // Add staff name
  ],
  include: [
    {
      model: BookingService,
      as: "bookingServices",
      attributes: [],
      include: [
        {
          model: Service,
          as: "service",
          attributes: [],
        },
      ],
    },
    {
      model: User,
      as: "staff",
      attributes: [], // Keep attributes empty here
    },
  ],
  group: [fn("DATE_FORMAT", col("date"), "%Y-%m"), "staff.id", "staff.name"], // Add staff.name to group
  raw: true,
});

// 5. Breakdown by Services with Staff (FIXED)
const revenueByService = await Booking.findAll({
  attributes: [
    [col("bookingServices.service.id"), "serviceId"],
    [col("bookingServices.service.title"), "serviceTitle"],
    [fn("SUM", col("bookingServices->service.price")), "totalRevenue"],
    [fn("COUNT", col("bookingServices.id")), "totalBookings"],
    [col("staff.id"), "staffId"],
    [fn("GROUP_CONCAT", col("staff.name")), "staffNames"], // Use GROUP_CONCAT only
  ],
  include: [
    {
      model: BookingService,
      as: "bookingServices",
      attributes: [],
      include: [
        {
          model: Service,
          as: "service",
          attributes: [],
        },
      ],
    },
    {
      model: User,
      as: "staff",
      attributes: [],
    },
  ],
  group: [
    "bookingServices.service.id",
    "bookingServices.service.title",
    "staff.id", // Group by staff.id only
  ],
  raw: true,
});
      // ====== Existing Stats ======
      const dailyStats = await Booking.findAll({
        attributes: [
          "staff_id",
          [fn("DATE", col("date")), "day"],
          [fn("COUNT", col("customer_id")), "total_clients"],
          [
            fn(
              "SUM",
              literal(
                `(SELECT COUNT(*) FROM bookingservice  WHERE bookingservice .booking_id = booking.id)`
              )
            ),
            "total_services",
          ],
        ],
        include: [{ model: User, as: "staff", attributes: ["id", "name"] }],
        group: ["staff_id", "day"],
        order: [[literal("day"), "DESC"]],
      });

      const weeklyStats = await Booking.findAll({
        attributes: [
          "staff_id",
          [fn("YEARWEEK", col("date")), "week"],
          [fn("COUNT", col("customer_id")), "total_clients"],
          [
            fn(
              "SUM",
              literal(
                `(SELECT COUNT(*) FROM bookingservice  WHERE bookingservice.booking_id = booking.id)`
              )
            ),
            "total_services",
          ],
        ],
        include: [{ model: User, as: "staff", attributes: ["id", "name"] }],
        group: ["staff_id", "week"],
      });

      const monthlyStats = await Booking.findAll({
        attributes: [
          "staff_id",
          [fn("DATE_FORMAT", col("date"), "%Y-%m"), "month"],
          [fn("COUNT", col("customer_id")), "total_clients"],
          [
            fn(
              "SUM",
              literal(
                `(SELECT COUNT(*) FROM bookingservice  WHERE bookingservice.booking_id = booking.id)`
              )
            ),
            "total_services",
          ],
        ],
        include: [{ model: User, as: "staff", attributes: ["id", "name"] }],
        group: ["staff_id", "month"],
      });

      const recentBookings = await Booking.findAll({
        limit: 10,
        order: [["date", "DESC"]],
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "name", "email", "image"],
          },
          {
            model: Service,
            as: "service",
            attributes: ["id", "title", "price"],
          },
          { model: User, as: "staff", attributes: ["id", "name", "email"] },
        ],
      });

      res.status(200).json({
        message: "Dashboard data fetched",
        data: {
          totleUser,
          totleCustomer,
          totleServise,
          loginUser,
          dailyStats,
          weeklyStats,
          monthlyStats,
          recentBookings,
          businessOverview: {
            totalRevenue: totalRevenue[0]?.totalRevenue || 0,
            dailyRevenue,
            weeklyRevenue,
            monthlyRevenue,
            revenueByService,
          },
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  Adminlogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role !== 1) {
        return res.status(403).json({ message: "Access denied: not an admin" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );

      return res
        .status(200)
        .json({ message: " Admin Login successful", token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  getProfile: async (req, res) => {
    try {
      const userid = req.user.id;
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
      console.log(req.body);

      const userId = req.user.id;
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

      console.log(user);

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
};
