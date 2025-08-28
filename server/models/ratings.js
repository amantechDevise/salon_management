const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ratings', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        staff_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        unique_token: {
            type: DataTypes.STRING(70),
            allowNull: false,
            defaultValue: ""
        },
        feedback: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: '1=>padding,2=>submitted,'
        },

    }, {
        sequelize,
        tableName: 'ratings',
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
