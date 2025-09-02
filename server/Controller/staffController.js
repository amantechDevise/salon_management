const { User, Customer, Service, Attendance, Rating } = require("../models");
const { uploadImage } = require("../uilts/imageUplord");
const { Op } = require('sequelize');
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
module.exports = {


  // -------------------------Login Api 

  stafflogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.role !== 2) {
        return res.status(403).json({ message: 'Access denied: not an staff' });
      }
      if (user.status !== 1) {
        return res.status(403).json({ message: 'Access denied: inactive staff' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '24h' });

      return res.status(200).json({ message: ' Staff Login successful', token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // -------------------------Get All Api 
  getStaff: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
      const offset = (page - 1) * limit;

      const { rows, count } = await User.findAndCountAll({
        where: { role: 2 },
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit: parseInt(limit),
      });

      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        message: 'Get all Staff',
        data: rows,
        meta: {
          totalRecords: count,
          totalPages: totalPages,
          currentPage: parseInt(page),
          perPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Error fetching staff members:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // -------------------------Add Staff Api 
  addStaff: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      const imageFile = req.files ? req.files.image : null;

      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Upload image if provided
      let imagePath = null;
      if (imageFile) {
        imagePath = await uploadImage(imageFile);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create new staff
      const newStaff = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        image: imagePath,
        role: 2
      });
      const token = jwt.sign({ id: newStaff.id, email: newStaff.email }, process.env.SECRET_KEY, { expiresIn: '24h' });
      res.status(201).json({ message: 'Staff member added successfully', data: { newStaff, token } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },


  // -------------------------get by id staff Api 
  getStaffById: async (req, res) => {
    try {
      const { id } = req.params;

      const staff = await User.findOne({
        where: { id, role: 2 },
        include: [
          {
            model: Customer,
            as: 'customers',
            include: [
              {
                model: Service,
                as: 'service',
                attributes: ['id', 'title', 'description', 'image', 'price']
              },

            ],
            order: [['createdAt', 'DESC']] // 👈 customers ko latest first
          },
           {
          model: Rating,
          as: "ratingsReceived",
          include: [
            {
              model: Customer,
              as: "customer",
              attributes: ["id", "name", "email"], // 👈 to show who gave feedback
            },
          ],
        },
        ],
        attributes: ['id', 'name', 'email']
      });


      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }

      res.status(200).json({
        message: 'Staff details',
        data: staff
      });

    } catch (error) {
      console.error("Error fetching staff by ID:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // -------------------------getStaffByAttendance

  getStaffByAttendance: async (req, res) => {
    try {
      const { id } = req.params;

      const records = await User.findOne({
        where: { id, role: 2 },
        include: [
          {
            model: Attendance,
            as: 'attendance',
            order: [['date', 'DESC']],
          },
        ],
      });

      if (!records) {
        return res.status(404).json({ message: 'Staff not found' });
      }

      res.status(200).json({
        message: 'Attendance records fetched successfully',
        data: records
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },


  range: async (req, res) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;

      const records = await User.findOne({
        where: { id, role: 2 },
        attributes: ["id", "name", "email"],
        include: [
          {
            model: Attendance,
            as: "attendance",
            where:
              startDate && endDate
                ? { date: { [Op.between]: [startDate, endDate] } }
                : {},
            required: false,
          },
        ],
        order: [[{ model: Attendance, as: "attendance" }, "date", "DESC"]],
      });


      if (!records) {
        return res.status(404).json({ message: "Staff not found" });
      }

      res.status(200).json({
        message: "Attendance records fetched successfully",
        data: {
          ...records.toJSON(),
          attendance: records.attendance || [], // force empty array if none
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },


  updateStaff: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, message } = req.body;
      const imageFile = req.files ? req.files.image : null;

      const staff = await User.findOne({ where: { id, role: 2 } });
      if (!staff) return res.status(404).json({ message: 'Staff not found' });

      // If new image uploaded, replace old image
      if (imageFile) {
        if (staff.image) {
          const oldImagePath = path.join(__dirname, '..', 'public', staff.image);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
        staff.image = await uploadImage(imageFile);
      }

      // Update other fields
      staff.name = name || staff.name;
      staff.email = email || staff.email;
      staff.phone = phone || staff.phone;
      staff.message = message || staff.message;

      await staff.save();

      res.status(200).json({ message: 'Staff updated successfully', data: staff });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },


  updateStaffStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const staff = await User.findOne({ where: { id } });
      if (!staff) return res.status(404).json({ message: 'Staff not found' });

      // Update status
      staff.status = status;
      await staff.save();

      res.status(200).json({ message: 'Staff status updated successfully', data: staff });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  deleteStaff: async (req, res) => {
    try {
      const { id } = req.params;
      const staff = await User.findOne({ where: { id, role: 2 } });
      if (!staff) return res.status(404).json({ message: 'Staff not found' });

      // Delete image if exists
      if (staff.image) {
        const imagePath = path.join(__dirname, '..', 'public', staff.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }

      await staff.destroy();
      res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

}