const { User, Customer, Service, sequelize } = require("../models");
const { Op } = require('sequelize');
module.exports = {

    dashboard: async (req, res) => {
        try {
            const userid = req.staff.id;
            const loginUser = await User.findOne({
                where: { id: userid, role: 2 },
                attributes: ['name', 'email', 'image']
            });

            const totleCustomer = await Customer.count();
            const totleServise = await Service.count();
            res.status(200).json({ message: 'Dashboard data fetched', data: { totleCustomer, totleServise, loginUser } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }

    },


    // -------------------start userProfile nd update------------

    getProfile: async (req, res) => {
        try {
            const userid = req.staff.id
            const user = await User.findByPk(userid, {
                attributes: { exclude: ["password"] },
            });


            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ message: 'get User Profile successfully', data: user });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    updateProfile: async (req, res) => {
        try {

            const userId = req.staff.id;
            const { name, email, phone } = req.body;
            const imageFile = req.files ? req.files.image : null;

            let imagePath = null;
            if (imageFile) {
                imagePath = await uploadImage(imageFile);
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }


            user.name = name || user.name;
            user.phone = phone || user.phone;
            user.email = email || user.email;
            if (imagePath) {
                user.image = imagePath;
            }

            await user.save();

            return res.status(200).json({ message: 'Profile updated successfully', data: user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    // -------------------end userProfile nd update------------



    // -------------------start customer ------------
    // getCustomers: async (req, res) => {
    //     try {

    //         const customers = await Customer.findAll({
    //             include: [
    //                 {
    //                     model: Service,
    //                     as: 'service',
    //                     attributes: ['id', 'title', 'description', 'image', 'price']
    //                 }
    //             ],

    //             order: [['createdAt', 'DESC']]
    //         });
    //         res.status(201).json({ message: 'Get all Customers', data: customers });
    //     } catch (error) {
    //         console.error("Error fetching customers:", error);
    //         res.status(500).json({ error: "An error occurred while fetching customers." });
    //     }
    // },
    getCustomers: async (req, res) => {
        try {
            const [latestCustomers] = await sequelize.query(`
                SELECT MAX(visit_count) as visit_count, email
                FROM Customers
                GROUP BY email
            `);

            const whereClause = {
                [Op.or]: latestCustomers.map(c => ({
                    email: c.email,
                    visit_count: c.visit_count
                }))
            };

            const customers = await Customer.findAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: 'staff',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: Service,
                        as: 'service',
                        attributes: ['id', 'title', 'description', 'image', 'price']
                    }
                ],
                order: [['visit_count', 'DESC']]
            });

            res.status(200).json({ message: 'Get all latest Customers (per email)', data: customers });
        } catch (error) {
            console.error("Error fetching customers:", error);
            res.status(500).json({ error: "An error occurred while fetching customers." });
        }
    },
    addCustomers: async (req, res) => {
        try {
            const {
                service_id,
                name,
                email,
                dob,
                address,
                phone,
                status
            } = req.body;

            // Check if service_id is provided
            if (!service_id) {
                return res.status(400).json({ message: "service_id is required" });
            }

            const imageFile = req.files ? req.files.image : null;
            let imagePath = null;

            if (imageFile) {
                imagePath = await uploadImage(imageFile);
            }

            // Split service_id string into array, trim spaces
            const serviceIds = service_id.split(',').map(id => id.trim()).filter(id => id !== '');

            if (serviceIds.length === 0) {
                return res.status(400).json({ message: "At least one valid service_id is required" });
            }

            // Use the logged in staff id from token/session (not from req.body)
            const userId = req.staff.id;

            // Count current visits by this email (for visit_count tracking)
            let visitCount = await Customer.count({ where: { email } });

            const customerRecords = [];

            for (const svcId of serviceIds) {
                visitCount++; // increment for each new record
                customerRecords.push({
                    staff_id: userId,
                    service_id: svcId,
                    name,
                    email,
                    dob,
                    address,
                    image: imagePath || "",
                    phone,
                    status: status || 1,
                    visit_count: visitCount
                });
            }

            // Bulk insert all customer visit records
            const createdCustomers = await Customer.bulkCreate(customerRecords);

            res.status(201).json({
                message: 'Customer visits recorded successfully',
                data: createdCustomers
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // -------------------end customer ------------



    // -------------------start Services ------------

    getServices: async (req, res) => {
        try {
            const services = await Service.findAll({
                order: [['createdAt', 'DESC']],
                where: { status: 1 }
            });
            res.status(200).json({ message: 'All services fetched', data: services });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
}