const { Booking, Customer, User, Service, sequelize } = require('../models');

module.exports = {
    getBookings: async (req, res) => {
        try {
            const bookings = await Booking.findAll({
                include: [
                    {
                        model: Customer,
                        as: 'customer',
                        attributes: [
                            'email',
                            [sequelize.fn('MIN', sequelize.col('customer.id')), 'id'],
                            [sequelize.fn('MIN', sequelize.col('customer.name')), 'name'],
                            [sequelize.fn('MIN', sequelize.col('customer.phone')), 'phone'],
                        ]
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
                attributes: [
                    [sequelize.fn('MIN', sequelize.col('Booking.id')), 'id'],
                    [sequelize.fn('MIN', sequelize.col('Booking.date')), 'date'],   // 👈 your date field
                    [sequelize.fn('MIN', sequelize.col('Booking.time')), 'time']    // 👈 your time field
                ],
                group: ['customer.email'],
                order: [[sequelize.fn('MIN', sequelize.col('Booking.date')), 'DESC']]
            });

            res.status(200).json({ message: 'Unique email wise Bookings', data: bookings });

        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({
                error: 'An error occurred while fetching bookings.',
            });
        }
    },


    addBooking: async (req, res) => {
        try {
            const { customer_id, staff_id, service_id, date, time } = req.body;

            const staffIds = staff_id.split(',').map(id => id.trim());
            const serviceIds = service_id.split(',').map(id => id.trim());

            const bookingRecords = [];

            for (const sId of staffIds) {
                for (const svcId of serviceIds) {
                    bookingRecords.push({
                        customer_id,  // should be numeric ID
                        staff_id: sId,
                        service_id: svcId,
                        date,
                        time,
                        status: 1 //panding
                    });
                }
            }

            const createdBookings = await Booking.bulkCreate(bookingRecords, { returning: true });


            res.status(201).json({
                message: 'Booking(s) added successfully',
                data: createdBookings
            });

        } catch (error) {
            console.error('Error adding bookings:', error);
            res.status(500).json({
                error: 'An error occurred while adding bookings.',
            });
        }
    },



    getAll: async (req, res) => {
        try {
            const service = await Service.findAll()
            const customer = await Customer.findAll({
                attributes: [
                    [sequelize.fn('MIN', sequelize.col('id')), 'id'],   // 👈 id bhi aa jayega
                    [sequelize.fn('MIN', sequelize.col('name')), 'name'],
                    'email'
                ],
                group: ['email']
            });
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
