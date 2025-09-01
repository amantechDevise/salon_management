const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('service_packages', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        package_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        service_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

    }, {
        sequelize,
        tableName: 'service_packages',
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
