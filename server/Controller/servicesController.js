const { Service } = require("../models");
const fs = require("fs");
const path = require("path");
const { uploadImage } = require("../uilts/imageUplord");

module.exports = {

  // Get all services
  getServices: async (req, res) => {
    try {
      const services = await Service.findAll({
          order: [['createdAt', 'DESC']]
      });
      res.status(200).json({ message: 'All services fetched', data: services });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get single service by ID
  getServiceById: async (req, res) => {
    try {
      const { id } = req.params;
      const service = await Service.findOne({ where: { id } });
      if (!service) return res.status(404).json({ message: 'Service not found' });
      res.status(200).json({ message: 'Service details', data: service });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Add new service
  addService: async (req, res) => {
    try {
      const { title, price, status,description } = req.body;
      const imageFile = req.files ? req.files.image : null;

      let imagePath = "";
      if (imageFile) imagePath = await uploadImage(imageFile);

      const newService = await Service.create({
        title,
        description,
        price: price || 0.00,
        status: status || 1,
        image: imagePath
      });

      res.status(201).json({ message: 'Service added successfully', data: newService });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update service by ID
  updateService: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, price, status } = req.body;
      const imageFile = req.files ? req.files.image : null;

      const service = await Service.findOne({ where: { id } });
      if (!service) return res.status(404).json({ message: 'Service not found' });

      // Replace old image if new image uploaded
      if (imageFile) {
        if (service.image) {
          const oldImagePath = path.join(__dirname, '..', 'public', service.image);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
        service.image = await uploadImage(imageFile);
      }

      service.title = title || service.title;
      service.price = price !== undefined ? price : service.price;
      service.status = status !== undefined ? status : service.status;

      await service.save();

      res.status(200).json({ message: 'Service updated successfully', data: service });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update only service status
updateServiceStatus: async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected 0 or 1

    const service = await Service.findOne({ where: { id } });
    if (!service) return res.status(404).json({ message: 'Service not found' });

    // Update status
    service.status = status;
    await service.save();

    res.status(200).json({ message: 'Service status updated successfully', data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

  // Delete service by ID
  deleteService: async (req, res) => {
    try {
      const { id } = req.params;
      const service = await Service.findOne({ where: { id } });
      if (!service) return res.status(404).json({ message: 'Service not found' });

      // Delete image if exists
      if (service.image) {
        const imagePath = path.join(__dirname, '..', 'public', service.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }

      await service.destroy();
      res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

};
