const { Booking, Discount, Invoice, Service, Customer, BookingService, User, ServicePackages } = require("../models");

module.exports = {
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
      } else if (booking.package?.price) {
        totalAmount = Number(booking.package.price);
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


  // Get all invoices
  getAllInvoices: async (req, res) => {
    try {
      const invoices = await Invoice.findAll({
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "name", "email"],
          },
          {
            model: Booking,
            as: "booking",
            include: [
              {
                model: Service,
                as: "service",
                attributes: ["id", "title", "price"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        data: invoices,
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Get invoice by ID
  getInvoiceById: async (req, res) => {
    try {
      const { id } = req.params;

      const invoice = await Invoice.findOne({
        where: { id },
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "name", "email", "phone", "address"],
          },
          {
            model: Booking,
            as: "booking",
            include: [
              {
                model: Service,
                as: "service",
                attributes: ["id", "title", "price", "duration"],
              },
            ],
          },
          {
            model: Discount,
            as: "discount",
            attributes: ["id", "code", "title", "type", "value"],
          },
        ],
      });

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      res.status(200).json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      console.error("Error fetching invoice:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Update invoice status (e.g., mark as paid)
  updateInvoiceStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const invoice = await Invoice.findOne({ where: { id } });

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      await invoice.update({ status });

      res.status(200).json({
        success: true,
        message: "Invoice status updated successfully",
        data: invoice,
      });
    } catch (error) {
      console.error("Error updating invoice status:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Get invoices by customer ID
  getInvoicesByCustomer: async (req, res) => {
    try {
      const { customer_id } = req.params;

      const invoices = await Invoice.findAll({
        where: { customer_id },
        include: [
          {
            model: Booking,
            as: "booking",
            include: [
              {
                model: Service,
                as: "service",
                attributes: ["id", "title", "price"],
              },
            ],
          },
          {
            model: Discount,
            as: "discount",
            attributes: ["id", "code", "title", "type", "value"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        data: invoices,
      });
    } catch (error) {
      console.error("Error fetching customer invoices:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Delete invoice by ID
  deleteInvoice: async (req, res) => {
    try {
      const { id } = req.params;

      const invoice = await Invoice.findOne({ where: { id } });

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      await invoice.destroy();

      res.status(200).json({
        success: true,
        message: "Invoice deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Get invoices by status
  getInvoicesByStatus: async (req, res) => {
    try {
      const { status } = req.params;

      const invoices = await Invoice.findAll({
        where: { status },
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "name", "email"],
          },
          {
            model: Booking,
            as: "booking",
            include: [
              {
                model: Service,
                as: "service",
                attributes: ["id", "title", "price"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        data: invoices,
      });
    } catch (error) {
      console.error("Error fetching invoices by status:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  // Update invoice details
  updateInvoice: async (req, res) => {
    try {
      const { id } = req.params;
      const { discount_id, notes } = req.body;

      const invoice = await Invoice.findOne({ where: { id } });

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      // If discount is being updated, recalculate the final amount
      if (discount_id && discount_id !== invoice.discount_id) {
        let discount = null;
        let finalAmount = invoice.total_amount;

        if (discount_id && discount_id !== 0) {
          discount = await Discount.findOne({
            where: { id: discount_id },
          });

          if (discount) {
            if (discount.type === 1) {
              // Percentage discount
              const discountValue =
                (invoice.total_amount * discount.value) / 100;
              finalAmount = invoice.total_amount - discountValue;
            } else if (discount.type === 2) {
              // Fixed discount
              finalAmount = invoice.total_amount - discount.value;
            }
          }
        }

        await invoice.update({
          discount_id,
          final_amount: finalAmount,
          notes: notes || invoice.notes,
        });
      } else {
        await invoice.update({
          notes: notes || invoice.notes,
        });
      }

      const updatedInvoice = await Invoice.findOne({
        where: { id },
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "name", "email", "phone", "address"],
          },
          {
            model: Booking,
            as: "booking",
            include: [
              {
                model: Service,
                as: "service",
                attributes: ["id", "title", "price", "duration"],
              },
            ],
          },
          {
            model: Discount,
            as: "discount",
            attributes: ["id", "code", "title", "type", "value"],
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: "Invoice updated successfully",
        data: updatedInvoice,
      });
    } catch (error) {
      console.error("Error updating invoice:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};
