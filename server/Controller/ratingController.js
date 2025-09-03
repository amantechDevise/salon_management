const { v4: uuidv4 } = require("uuid");
const { Rating, User } = require("../models"); // Assuming you have a Staff model

module.exports = {
  // Generate feedback link with staff name
  generateFeedbackLink: async (req, res) => {
    try {
      const { customer_id } = req.body;
      const staff_id = req.staff.id;

      // Get staff details to include name in URL
      const staff = await User.findOne({ where: { id: staff_id } });
      if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
      }

      const token = uuidv4();

      // Create URL-friendly staff name
      const staffNameForUrl = staff.name
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, ""); // Remove special characters

      const rating = await Rating.create({
        staff_id: staff_id,
        customer_id,
        status: 1, // 1 = pending
        unique_token: token,
      });

      // Frontend link with staff name and token
      const link = `${process.env.ALLOWED_ORIGINS}/staff-Admin/feedback/${staffNameForUrl}/${token}`;

      res.status(200).json({
        message: "Feedback link generated",
        link,
        customer_id,
        staff_name: staff.name,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Get feedback by token - include staff details
  getFeedbackByToken: async (req, res) => {
    try {
      const { token } = req.params;
      const rating = await Rating.findOne({
        where: { unique_token: token },
        include: [
          {
            model: User,
            as: "staff", // 👈 lowercase
            attributes: ["id", "name", "email"],
          },
        ],
      });

      if (!rating) {
        return res.status(404).json({ message: "Invalid link" });
      }

      res.status(200).json({
        staff_id: rating.staff_id,
        staff_name: rating.staff.name, // 👈 lowercase
        customer_id: rating.customer_id,
        rating: rating.rating,
        feedback: rating.feedback,
        status: rating.status,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Submit feedback with star rating
  submitFeedback: async (req, res) => {
    try {
      const { token } = req.params;
      const { rating, feedback } = req.body;

      // Validate rating (should be between 1-5)
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Please provide a valid rating between 1 and 5 stars",
        });
      }

      const ratingData = await Rating.findOne({
        where: { unique_token: token },
        include: [
          {
            model: User,
            as: "staff", // 👈 lowercase
            attributes: ["name"],
          },
        ],
      });

      if (!ratingData) {
        return res.status(404).json({ message: "Invalid link" });
      }

      if (ratingData.status === 2) {
        return res.status(400).json({ message: "Feedback already submitted" });
      }

      ratingData.rating = rating;
      ratingData.feedback = feedback;
      ratingData.status = 2;
      ratingData.submitted_at = new Date();

      await ratingData.save();

      res.status(200).json({
        message: "Feedback submitted successfully",
        customer_id: ratingData.customer_id,
        staff_id: ratingData.staff_id,
        staff_name: ratingData.staff.name, // 👈 lowercase
        rating: ratingData.rating,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
