const cron = require("node-cron");
const { Op, fn, col, where } = require("sequelize");
const { Discount, ServicePackages } = require("../models"); 

// Discount expiry cron
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

// ServicePackages expiry cron
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
