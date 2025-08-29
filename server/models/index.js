'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add models explicitly if needed
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./users")(sequelize, Sequelize);
db.Service = require("./services")(sequelize, Sequelize);
db.Customer = require("./customers")(sequelize, Sequelize);
db.Attendance = require("./attendance")(sequelize, Sequelize);
db.Booking = require("./bookings")(sequelize, Sequelize);
db.Rating = require("./ratings")(sequelize, Sequelize);

//
// ✅ RELATIONSHIPS
//

// USER ↔ CUSTOMER (Staff assigned to customer)
db.User.hasMany(db.Customer, { foreignKey: 'staff_id', as: 'customers' });
db.Customer.belongsTo(db.User, { foreignKey: 'staff_id', as: 'staff' });

db.User.hasMany(db.Attendance, { foreignKey: 'staff_id', as: 'attendance' });
db.Attendance.belongsTo(db.User, { foreignKey: 'staff_id', as: 'staffId' });

// SERVICE ↔ CUSTOMER
db.Service.hasMany(db.Customer, { foreignKey: 'service_id', as: 'customers' });
db.Customer.belongsTo(db.Service, { foreignKey: 'service_id', as: 'service' });

// ✅ BOOKING ↔ CUSTOMER
db.Customer.hasMany(db.Booking, { foreignKey: 'customer_id', as: 'bookings' });
db.Booking.belongsTo(db.Customer, { foreignKey: 'customer_id', as: 'customer' });

// ✅ BOOKING ↔ USER (Staff)
db.User.hasMany(db.Booking, { foreignKey: 'staff_id', as: 'staffBookings' });
db.Booking.belongsTo(db.User, { foreignKey: 'staff_id', as: 'staff' });

// ✅ BOOKING ↔ SERVICE
db.Service.hasMany(db.Booking, { foreignKey: 'service_id', as: 'bookings' });
db.Booking.belongsTo(db.Service, { foreignKey: 'service_id', as: 'service' });

// USER ↔ RATING (Ratings received by staff)
db.User.hasMany(db.Rating, { foreignKey: 'staff_id', as: 'ratingsReceived' });
db.Rating.belongsTo(db.User, { foreignKey: 'staff_id', as: 'staff' });

// CUSTOMER ↔ RATING (Ratings given by customer)
db.Customer.hasMany(db.Rating, { foreignKey: 'customer_id', as: 'ratingsGiven' });
db.Rating.belongsTo(db.Customer, { foreignKey: 'customer_id', as: 'customer' });

module.exports = db;
