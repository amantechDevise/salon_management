const { User, Customer, Service } = require("../models");

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
    getCustomers: async (req, res) => {
        try {

            const customers = await Customer.findAll({
                include: [
                    {
                        model: Service,
                        as: 'service',
                        attributes: ['id', 'title', 'description', 'image', 'price']
                    }
                ],

                order: [['createdAt', 'DESC']]
            });
            res.status(201).json({ message: 'Get all Customers', data: customers });
        } catch (error) {
            console.error("Error fetching customers:", error);
            res.status(500).json({ error: "An error occurred while fetching customers." });
        }
    },
    addCustomers: async (req, res) => {
        try {
            const {  service_id, name, email, dob, address, phone, status } = req.body;
            const imageFile = req.files ? req.files.image : null;
            const userid = req.staff.id;
            let imagePath = null;
            if (imageFile) {
                imagePath = await uploadImage(imageFile);
            }

            let existingCustomer = await Customer.findOne({ where: { email } });

            if (existingCustomer) {
                existingCustomer.visit_count = (existingCustomer.visit_count || 0) + 1;
                await existingCustomer.save();

                return res.status(200).json({
                    message: 'Existing customer visit updated',
                    data: existingCustomer
                });
            }

            const newCustomer = await Customer.create({
                staff_id: userid,
                service_id,
                name,
                email,
                dob,
                address,
                image: imagePath || "",
                phone,
                status: status || 1,
                visit_count: 1
            });

            res.status(201).json({ message: 'Customer added successfully', data: newCustomer });

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
          where:{status:1}
      });
      res.status(200).json({ message: 'All services fetched', data: services });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
}