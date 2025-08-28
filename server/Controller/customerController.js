const { Service, User, Customer } = require("../models");
const { uploadImage } = require("../uilts/imageUplord");

module.exports = {


    getCustomers: async (req, res) => {
        try {
            const customers = await Customer.findAll({
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
            const { staff_id, service_id, name, email, dob, address, phone, status } = req.body;
            const imageFile = req.files ? req.files.image : null;

            let imagePath = null;
            if (imageFile) {
                imagePath = await uploadImage(imageFile);
            }

            const visitCount = await Customer.count({ where: { email } });

            const newCustomer = await Customer.create({
                staff_id,
                service_id,
                name,
                email,
                dob,
                address,
                image: imagePath,
                phone,
                status: status || 1,
                visit_count: visitCount + 1
            });

            res.status(201).json({
                message: 'Customer visit recorded successfully',
                data: newCustomer
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },


//       addCustomers: async (req, res) => {
//   try {
//     const { staff_id, service_id, name, email, dob, address, phone, status } = req.body;
//     const imageFile = req.files ? req.files.image : null;

//     let imagePath = null;
//     if (imageFile) {
//       imagePath = await uploadImage(imageFile);
//     }

//     // Visit count by email
//     const visitCount = await Customer.count({ where: { email } });

//     // Create customer (without staff_id / service_id single fields)
//     const newCustomer = await Customer.create({
//       name,
//       email,
//       dob,
//       address,
//       image: imagePath,
//       phone,
//       status: status || 1,
//       visit_count: visitCount + 1
//     });

//     // Multiple services set karo
//     if (service_id && service_id.length > 0) {
//       await newCustomer.setServices(service_id);
//     }

//     // Multiple staff set karo
//     if (staff_id && staff_id.length > 0) {
//       await newCustomer.setStaffs(staff_id);
//     }

//     // Final response with relations
//     const customerWithRelations = await Customer.findByPk(newCustomer.id, {
//       include: [
//         { model: Service, as: 'services' },
//         { model: User, as: 'staffs' }
//       ]
//     });

//     res.status(201).json({
//       message: 'Customer visit recorded successfully',
//       data: customerWithRelations
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }


}