const { v4: uuidv4 } = require("uuid");
const { Rating } = require("../models");

module.exports = {
  // Generate feedback link
  generateFeedbackLink: async (req, res) => {
    try {
      const { staff_id, customer_id } = req.body;
      const userid = req.staff.id;
      const token = uuidv4();

      const rating = await Rating.create({
        staff_id: userid,
        customer_id,
        status: 1, // 1 = pending
        unique_token: token,
      });

      // Frontend/admin link
      const link = `${process.env.ALLOWED_ORIGINS}/admin/${token}`;

      res.status(200).json({ message: "Feedback link generated", link, customer_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Get feedback by token
  getFeedbackByToken: async (req, res) => {
    try {
      const { token } = req.params;

      const rating = await Rating.findOne({ where: { unique_token: token } });

      if (!rating) {
        return res.status(404).json({ message: "Invalid link" });
      }

      // Return staff_id + customer_id + status + any existing rating/feedback
      res.status(200).json({
        staff_id: rating.staff_id,
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

  // Submit feedback
  submitFeedback: async (req, res) => {
    try {
      const { token } = req.params;
      const { rating, feedback } = req.body;

      const ratingData = await Rating.findOne({ where: { unique_token: token } });

      if (!ratingData) {
        return res.status(404).json({ message: "Invalid link" });
      }

      if (ratingData.status === 2) {
        return res.status(400).json({ message: "Feedback already submitted" });
      }

      // Use the customer_id stored in DB
      ratingData.rating = rating;
      ratingData.feedback = feedback;
      ratingData.status = 2; // submitted

      await ratingData.save();

      res.status(200).json({
        message: "Feedback submitted successfully",
        customer_id: ratingData.customer_id,
        staff_id: ratingData.staff_id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },


};
