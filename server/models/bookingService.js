const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('bookingservice', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
     customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
      booking_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
       receptionist_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
  
  
  }, {
    sequelize,
    tableName: 'bookingservice',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
