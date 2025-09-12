const { Discount, Customer } = require("../models");

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
        include:[{
          model:Customer, as:'customer', attributes:['id','name','email']
        }],
        order: [["createdAt", "DESC"]],
      });
      res.json({ message: "Discounts fetched", data: discounts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

applyDiscount: async (req, res) => {
  try {
    const { customer_id, code } = req.body;

    if (!customer_id || !code) {
      return res.status(400).json({ message: "customer_id and code are required" });
    }

    const discount = await Discount.findOne({
      where: { code: code.toUpperCase(), status: 1 },
    });

    if (!discount) {
      return res.status(404).json({ message: "Discount code not found" });
    }

    const now = new Date();
    if (now < discount.start_date || now > discount.end_date) {
      return res.status(400).json({ message: "Discount expired" });
    }

    // ✅ Single-customer discount check
    if (discount.customer_id) {
      if (discount.customer_id != customer_id) {
        return res.status(403).json({ message: "This discount is only for a special customer" });
      }
    }

    // ✅ Track usage
    let usedBy = discount.used_by;
    if (!Array.isArray(usedBy)) {
      try {
        usedBy = usedBy ? JSON.parse(usedBy) : [];
      } catch (err) {
        usedBy = [];
      }
    }

    if (usedBy.includes(customer_id)) {
      return res.status(400).json({ message: "You already used this discount" });
    }

    usedBy.push(customer_id);
    discount.used_by = usedBy;
    await discount.save();

    res.json({
      message: "Discount applied successfully",
      data: {
        code: discount.code,
        type: discount.type,
        value: discount.value,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
},



  // Add new discount
  addDiscount: async (req, res) => {
    try {
      let { code, title, type, value, start_date, end_date, status,customer_id } = req.body;

      if (!code || code.trim() === "") {
        code = generatePromoCode();
      }

      const discount = await Discount.create({
         customer_id: customer_id || null,
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
