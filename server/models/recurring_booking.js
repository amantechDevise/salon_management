const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('recurring_booking', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },

        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        frequency: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: '	1=>weekly2=>monthly	'
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },


    }, {
        sequelize,
        tableName: 'recurring_booking',
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
