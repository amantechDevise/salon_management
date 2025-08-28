const fs = require('fs');
const path = require('path');

const uploadImage = async (imageFile, oldImagePath = null) => {
  return new Promise((resolve, reject) => {
    if (!imageFile) {
      return reject(new Error("No file provided"));
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return reject(new Error("Only image files (jpg, jpeg, png, webp) are allowed"));
    }

    const uploadDir = path.join(__dirname, '..', 'public', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Delete old image if path provided
    if (oldImagePath) {
      // Remove leading slash if exists
      const oldImageFilePath = path.join(uploadDir, path.basename(oldImagePath));
      if (fs.existsSync(oldImageFilePath)) {
        fs.unlinkSync(oldImageFilePath);
      }
    }

    const fileName = `img_${Date.now()}_${imageFile.name}`;
    const filePath = path.join(uploadDir, fileName);

    imageFile.mv(filePath, (err) => {
      if (err) return reject(err);
      resolve(`/images/${fileName}`); 
    });
  });
};

module.exports = { uploadImage };
