const { User, Customer, Service } = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { uploadImage } = require("../uilts/imageUplord");
module.exports = {

dashboard: async (req, res) => {
        try {
            const userid = req.user.id;
            const loginUser = await User.findOne({
                where: { id: userid, role: 1 },
                attributes: ['name', 'email', 'image']
            });
            const totleUser = await User.count({
                where: { role: 2 }
            });
            const totleCustomer = await Customer.count();
            const totleServise = await Service.count();
            res.status(200).json({ message: 'Dashboard data fetched', data: { totleUser, totleCustomer, totleServise, loginUser } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }

    },


    Adminlogin: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.role !== 1) {
                return res.status(403).json({ message: 'Access denied: not an admin' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '24h' });

            return res.status(200).json({ message: ' Admin Login successful', token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    getProfile: async (req, res) => {
        try {
            const userid = req.user.id
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
            console.log(req.body);

            const userId = req.user.id;
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

            console.log(user);

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
    }
}