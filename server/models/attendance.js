const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('attendance', {
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
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        checkIn: {
            type: DataTypes.TIME,
            allowNull: true
        },
        checkOut: {
            type: DataTypes.TIME,
            allowNull: true
        },

    }, {
        sequelize,
        tableName: 'attendance',
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
