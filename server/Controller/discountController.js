const { Discount } = require("../models");

// Generate 3 letters + 3 digits code
function generatePromoCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = Array.from({ length: 3 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join("");

  const randomNumbers = Math.floor(100 + Math.random() * 900); // 3-digit number
  return `${randomLetters}${randomNumbers}`; // e.g., ABC123
}

module.exports = {
  // Get all discounts
  getDiscount: async (req, res) => {
    try {
      const discounts = await Discount.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.json({ message: "Discounts fetched", data: discounts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Add new discount
  addDiscount: async (req, res) => {
    try {
      let { code, title, type, value, start_date, end_date, status } = req.body;

      if (!code || code.trim() === "") {
        code = generatePromoCode();
      }

      const discount = await Discount.create({
        code: code.toUpperCase(),
        title,
        type,
        value,
        start_date,
        end_date,
        status: status || 1,
      });

      res.status(201).json({ message: "Discount created", data: discount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update discount
  updateDiscount: async (req, res) => {
    try {
      const { id } = req.params;
      let { code, title, type, value, start_date, end_date, status } = req.body;

      const discount = await Discount.findByPk(id);
      if (!discount) {
        return res.status(404).json({ message: "Discount not found" });
      }

      if (!code || code.trim() === "") {
        code = generatePromoCode();
      }

      discount.code = code.toUpperCase();
      discount.title = title || discount.title;
      discount.type = type || discount.type;
      discount.value = value || discount.value;
      discount.start_date = start_date || discount.start_date;
      discount.end_date = end_date || discount.end_date;
      discount.status = status || discount.status;

      await discount.save();

      res.json({ message: "Discount updated successfully", data: discount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // ✅ Delete discount
  deleteDiscount: async (req, res) => {
    try {
      const { id } = req.params;

      const discount = await Discount.findByPk(id);
      if (!discount) {
        return res.status(404).json({ message: "Discount not found" });
      }

      await discount.destroy();
      res.json({ message: "Discount deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
