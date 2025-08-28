const { Booking, Customer, User, Service } = require('../models');

module.exports = {
    getBookings: async (req, res) => {
        try {
            const bookings = await Booking.findAll({
                include: [
                    {
                        model: Customer,
                        as: 'customer',
                        attributes: ['id', 'name', 'email', 'phone']
                    },
                    {
                        model: User,
                        as: 'staff',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: Service,
                        as: 'service',
                        attributes: ['id', 'title', 'price']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            
            res.status(200).json({ message: 'Get all Bookings', data: bookings });

        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({
                error: 'An error occurred while fetching bookings.',
            });
        }
    },

    addBooking: async (req, res) => {
        try {
            const { customer_id, staff_id, service_id, date, time } = req.body

            const booking = await Booking.create({
                customer_id,
                staff_id,
                service_id,
                date,
                time
            });
            res.status(201).json({ message: 'Booking added successfully', data: booking });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({
                error: 'An error occurred while fetching bookings.',
            });
        }
    },

    getAll: async (req, res) => {
        try {
            const service = await Service.findAll()
            const customer = await Customer.findAll()
            const Staff = await User.findAll({
                where: { role: 2 }
            })
            return res.status(200).json({
                data: { service, customer, Staff }

            });

        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({
                error: 'An error occurred while fetching bookings.',
            });
        }
    },
};
