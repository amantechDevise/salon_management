const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('notifications', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        invoice_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ""
        },
        is_read: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
     
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: "1=active, 2=archived/deleted"
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: "1=>reminder,2=>payment"
        },

    }, {
        sequelize,
        tableName: 'notifications',
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
