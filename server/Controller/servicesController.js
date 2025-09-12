const { Service, ServicePackages, PackageServices } = require("../models");
const fs = require("fs");
const path = require("path");
const { uploadImage } = require("../uilts/imageUplord");

module.exports = {
  // Get all services
  getServices: async (req, res) => {
    try {
      const services = await Service.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json({ message: "All services fetched", data: services });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get single service by ID
  getServiceById: async (req, res) => {
    try {
      const { id } = req.params;
      const service = await Service.findOne({ where: { id } });
      if (!service)
        return res.status(404).json({ message: "Service not found" });
      res.status(200).json({ message: "Service details", data: service });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Add new service
  addService: async (req, res) => {
    try {
      const { title, price, status, description, duration,gst } = req.body;
      const imageFile = req.files ? req.files.image : null;

      let imagePath = "";
      if (imageFile) imagePath = await uploadImage(imageFile);

      const newService = await Service.create({
        title,
        gst:gst || 0.0,
        duration,
        description,
        price: price || 0.0,
        status: status || 1,
        image: imagePath,
      });

      res
        .status(201)
        .json({ message: "Service added successfully", data: newService });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update service by ID
  updateService: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, price, status, duration,gst } = req.body;
      const imageFile = req.files ? req.files.image : null;

      const service = await Service.findOne({ where: { id } });
      if (!service)
        return res.status(404).json({ message: "Service not found" });

      // Replace old image if new image uploaded
      if (imageFile) {
        if (service.image) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            "public",
            service.image
          );
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
        service.image = await uploadImage(imageFile);
      }

      service.title = title || service.title;
      service.gst = gst || service.gst;
      service.duration = duration || service.duration;
      service.price = price !== undefined ? price : service.price;
      service.status = status !== undefined ? status : service.status;

      await service.save();

      res
        .status(200)
        .json({ message: "Service updated successfully", data: service });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update only service status
  updateServiceStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // expected 0 or 1

      const service = await Service.findOne({ where: { id } });
      if (!service)
        return res.status(404).json({ message: "Service not found" });

      // Update status
      service.status = status;
      await service.save();

      res.status(200).json({
        message: "Service status updated successfully",
        data: service,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Delete service by ID
  deleteService: async (req, res) => {
    try {
      const { id } = req.params;
      const service = await Service.findOne({ where: { id } });
      if (!service)
        return res.status(404).json({ message: "Service not found" });

      // Delete image if exists
      if (service.image) {
        const imagePath = path.join(__dirname, "..", "public", service.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }

      await service.destroy();
      res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // ---------------------------- ServicePackages
  addPackage: async (req, res) => {
    try {
      const { title, description, price, service_id,end_date,start_date } = req.body;

      const pkg = await ServicePackages.create({ title, description, price,start_date,end_date });

      if (service_id && service_id.length > 0) {
        const mapData = service_id.map((sid) => ({
          package_id: pkg.id,
          service_id: sid,
        }));
        await PackageServices.bulkCreate(mapData);
      }

      res.json({ message: "Package created", data: pkg });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getPackages: async (req, res) => {
    try {
      const services = await ServicePackages.findAll({
        include: [
          {
            model: PackageServices,
            as: "packageServices",
            include: [{ model: Service, as: "service" }],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      res
        .status(200)
        .json({ message: "All ServicePackages fetched", data: services });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  deletePackages: async (req, res) => {
    try {
      const { id } = req.params;

      const discount = await ServicePackages.findByPk(id);
      if (!discount) {
        return res.status(404).json({ message: "ServicePackages not found" });
      }

      await discount.destroy();
      res.json({ message: "Service Packages deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
