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
      allowNull: false,
      defaultValue: 0
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
     customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
      booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
