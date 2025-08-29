const { Service, User, Customer, sequelize } = require("../models");
const { uploadImage } = require("../uilts/imageUplord");
const { Op } = require('sequelize');
module.exports = {


  getCustomers: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;         // current page (default: 1)
      const limit = parseInt(req.query.limit) || 10;      // records per page (default: 10)
      const offset = (page - 1) * limit;

      const searchTerm = req.query.search || '';          // Search term (for name, email, etc.)
      const whereClause = {};

      // Step 1: Get latest visit_count for each email
      const [latestCustomers] = await sequelize.query(`
      SELECT MAX(visit_count) AS visit_count, email
      FROM Customers
      GROUP BY email
    `);

      // Dynamically build the whereClause for the search term
      if (searchTerm) {
        whereClause[Op.or] = [
          { email: { [Op.like]: `%${searchTerm}%` } },  // Searching by email
          { '$staff.name$': { [Op.like]: `%${searchTerm}%` } }  // Searching by staff name (you can adjust as needed)
        ];
      }

      // Add condition to match latest visit_count per email
      whereClause[Op.or] = whereClause[Op.or] || [];
      whereClause[Op.or] = whereClause[Op.or].concat(
        latestCustomers.map(c => ({
          email: c.email,
          visit_count: c.visit_count,
        }))
      );

      const { count, rows: customers } = await Customer.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'staff',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Service,
            as: 'service',
            attributes: ['id', 'title', 'description', 'image', 'price'],
          },
        ],
        order: [['visit_count', 'DESC']],  // Sorting by visit_count in descending order
        offset: page && limit ? offset : 0,  // If pagination is off, no offset
        limit: page && limit ? limit : undefined,  // If pagination is off, no limit
      });

      // Step 3: Return paginated or non-paginated response based on query params
      if (page && limit) {
        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
          message: 'Get all latest Customers (per email)',
          data: customers,
          meta: {
            totalRecords: count,
            totalPages,
            currentPage: page,
            perPage: limit,
          },
        });
      } else {
        // If pagination is not required, return all results
        return res.status(200).json({
          message: 'Get all matching Customers',
          data: customers,
        });
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({
        error: 'An error occurred while fetching customers.',
      });
    }
  },



    addCustomers: async (req, res) => {
      try {
        const {
          staff_id,      // e.g., "1,2"
          service_id,    // e.g., "5,6"
          name,
          email,
          dob,
          address,
          phone,
          status
        } = req.body;

        const imageFile = req.files ? req.files.image : null;
        let imagePath = null;

        if (imageFile) {
          imagePath = await uploadImage(imageFile);
        }

        const staffIds = staff_id.split(',').map(id => id.trim());
        const serviceIds = service_id.split(',').map(id => id.trim());

        let visitCount = await Customer.count({ where: { email } }); // current count

        const customerRecords = [];

        for (const sId of staffIds) {
          for (const svcId of serviceIds) {
            visitCount++; // increment per new record
            customerRecords.push({
              staff_id: sId,
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
        }

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


getCustomerDetails: async (req, res) => {
  try {
    const customerId = req.params.id;

    // Step 1: Get specific customer by ID
    const specificCustomer = await Customer.findOne({
      where: { id: customerId },
      include: [
        {
          model: User,
          as: 'staff',
          attributes: ['id', 'name', 'email', 'phone'],
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'title', 'description', 'image', 'price'],
        },
      ],
    });

    if (!specificCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Step 2: Fetch all entries with the same email as specificCustomer's email
    const allVisits = await Customer.findAll({
      where: { email: specificCustomer.email },
      include: [
        {
          model: User,
          as: 'staff',
          attributes: ['id', 'name', 'email', 'phone'],
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'title', 'description', 'image', 'price'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      message: "Customer visits fetched successfully",
      data: {
        specificCustomer,
        allVisits,
      },
    });

  } catch (error) {
    console.error("Error in getCustomerDetails:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}







}