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
            type: DataTypes.DATE,
            allowNull: false
        },
        checkIn: {
            type: DataTypes.TIME,
            allowNull: false
        },
         checkOut: {
            type: DataTypes.TIME,
            allowNull: false
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
