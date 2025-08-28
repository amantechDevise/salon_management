const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('users', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ""
        },
 
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ""
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ""
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
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ""
        },
      
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: '1=>Admin,2=>Staff,'
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        sequelize,
        tableName: 'users',
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
