const cron = require("node-cron");
const { Op, fn, col, where } = require("sequelize");
const { Discount, ServicePackages, Booking, Notification } = require("../models");

// ===============================
// ✅ Discount expiry cron
// ===============================
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("⏰ Running discount expiry cron job...");

    const today = new Date().toISOString().split("T")[0];

    const updated = await Discount.update(
      { status: 0 },
      {
        where: {
          status: 1,
          [Op.and]: where(fn("DATE", col("end_date")), today),
        },
      }
    );

    console.log(`✅ Discounts expired today updated: ${updated[0]}`);
  } catch (error) {
    console.error("❌ Error in Discount cron job:", error);
  }
}, {
  timezone: "Asia/Kolkata",
});

// ===============================
// ✅ ServicePackages expiry cron
// ===============================
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("⏰ Running service package expiry cron job...");

    const today = new Date().toISOString().split("T")[0];

    const updated = await ServicePackages.update(
      { status: 0 },
      {
        where: {
          status: 1,
          [Op.and]: where(fn("DATE", col("end_date")), today),
        },
      }
    );

    console.log(`✅ ServicePackages expired today updated: ${updated[0]}`);
  } catch (error) {
    console.error("❌ Error in ServicePackages cron job:", error);
  }
}, {
  timezone: "Asia/Kolkata",
});

// ===============================
// ✅ Upcoming Booking Reminder cron
// ===============================

// cron.schedule("0 9 * * *", async () => {
//   try {
//     console.log("🔔 Running upcoming booking reminder job...");

//   const today = new Date().toISOString().split("T")[0];
// const tomorrow = new Date();
// tomorrow.setDate(new Date().getDate() + 1);
// const tomorrowStr = tomorrow.toISOString().split("T")[0];

// const upcomingBookings = await Booking.findAll({
//   where: {
//     status: 1,
//     [Op.and]: [
//       where(fn("DATE", col("date")), {
//         [Op.between]: [today, tomorrowStr],  
//       }),
//     ],
//   },
// });


     
//     for (const booking of upcomingBookings) {
//       await Notification.create({
//         customer_id: booking.customer_id,
//         user_id: booking.staff_id,
//         booking_id: booking.id,
//         title: "Upcoming Booking Reminder",
//         message: `Reminder: You have a booking on ${booking.date.toDateString()} at ${booking.time}`,
//         type: 1,   // 1 = reminder
//         is_read: 0,
//         status: 1,
//       });
//     }

//     console.log(`✅ Reminders created for ${upcomingBookings.length} bookings`);
//   } catch (error) {
//     console.error("❌ Error in Booking reminder cron job:", error);
//   }
// }, {
//   timezone: "Asia/Kolkata",
// });
