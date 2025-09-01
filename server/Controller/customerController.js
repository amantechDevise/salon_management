const { Service, User, Customer, sequelize, CustomerService } = require("../models");
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
      staff_id,
      service_id,
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

    // Find or create the main customer record
    const [customer, created] = await Customer.findOrCreate({
      where: { email },
      defaults: {
        name,
        email,
        staff_id,
        service_id,
        dob,
        address,
        image: imagePath || "",
        phone,
        status: status || 1,
        visit_count: 1
      }
    });

    // If customer already exists, update visit count
    if (!created) {
      customer.visit_count += 1;
      await customer.save();
    }

    // Create customer-service-staff relationships
    const customerServices = [];
    
    for (const sId of staffIds) {
      for (const svcId of serviceIds) {
        customerServices.push({
          customer_id: customer.id,
          staff_id: sId,
          service_id: svcId
        });
      }
    }

    // Assuming you have a CustomerService model for the relationships
    const createdRelationships = await CustomerService.bulkCreate(customerServices);

    res.status(201).json({
      message: 'Customer services recorded successfully',
      data: {
        customer,
        services: createdRelationships
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
},


getCustomerDetails: async (req, res) => {
  try {
    const customerId = req.params.id;

    const specificCustomer = await Customer.findOne({
      where: { id: customerId },
      include: [
        
        {
          model: CustomerService,
          as: 'customerServices',
          include: [
            {
              model: User,
              as: 'staff',
              attributes: ['id', 'name'],
            },
            {
              model: Service,
              as: 'service',
              attributes: ['id', 'title'],
            },
          ],
        },
      ],
    });

    if (!specificCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    console.log(specificCustomer,"specificCustomerspecificCustomer");
    
    const allVisits = await Customer.findAll({
      where: { email: specificCustomer.email },
      include: [
        
        {
          model: CustomerService,
          as: 'customerServices',
          include: [
            {
              model: User,
              as: 'staff',
              attributes: ['id', 'name'],
            },
            {
              model: Service,
              as: 'service',
              attributes: ['id', 'title'],
            },
          ],
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