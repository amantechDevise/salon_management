const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('payments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },

    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Link to invoices table"
    },

    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Link to booking table"
    },

    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Link to customers table"
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },

    method: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "e.g. cash, card, UPI, bank_transfer"
    },

    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "Reference from gateway or bank"
    },

    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1=>Pending, 2=>Completed, 3=>Failed, 4=>Refunded"
    },

    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "When payment was completed"
    }

  }, {
    sequelize,
    tableName: 'payments',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
    ]
  });
};
