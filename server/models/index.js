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

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./users")(sequelize,Sequelize)
db.Service = require("./services")(sequelize,Sequelize)
db.Customer = require("./customers")(sequelize,Sequelize)
db.Customer_Services = require("./customer_services")(sequelize,Sequelize)
db.Rating = require("./ratings")(sequelize,Sequelize)

// User <-> Customer
db.User.hasMany(db.Customer, { foreignKey: 'staff_id', as: 'customers' });
db.Customer.belongsTo(db.User, { foreignKey: 'staff_id', as: 'staff' });
// Service <-> Customer
db.Service.hasMany(db.Customer, { foreignKey: 'service_id', as: 'customers' });
db.Customer.belongsTo(db.Service, { foreignKey: 'service_id', as: 'service' });


// Service <-> CustomerServices
db.Service.hasMany(db.Customer_Services, { foreignKey: 'service_id', as: 'customerServices' });
db.Customer_Services.belongsTo(db.Service, { foreignKey: 'service_id', as: 'service' });

// Customer <-> CustomerServices
db.Customer.hasMany(db.Customer_Services, { foreignKey: 'customer_id', as: 'customerServices' });
db.Customer_Services.belongsTo(db.Customer, { foreignKey: 'customer_id', as: 'customer' });

// User (Staff) <-> CustomerServices
db.User.hasMany(db.Customer_Services, { foreignKey: 'staff_id', as: 'customerServices' });
db.Customer_Services.belongsTo(db.User, { foreignKey: 'staff_id', as: 'staff' });

db.User.hasMany(db.Rating, { foreignKey: 'staff_id', as: 'ratingsReceived' });
db.Rating.belongsTo(db.User, { foreignKey: 'staff_id', as: 'staff' });

// Customer <-> Ratings
db.Customer.hasMany(db.Rating, { foreignKey: 'customer_id', as: 'ratingsGiven' });
db.Rating.belongsTo(db.Customer, { foreignKey: 'customer_id', as: 'customer' });
module.exports = db;
