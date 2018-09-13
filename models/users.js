'use strict';
module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        salt: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {});
    return users;
};
