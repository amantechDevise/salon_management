const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('customers', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
      receptionist_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    service_id: {
      type: DataTypes.INTEGER,
     allowNull: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    phone: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
     visit_count: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    sequelize,
    tableName: 'customers',
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
