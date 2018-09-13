'use strict';
module.exports = (sequelize, DataTypes) => {
    const history = sequelize.define('history', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pick: {
            allowNull: false,
            type: DataTypes.STRING
        },
        result: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
    }, {
        tableName: 'history',
        timestamps: false,
    });
    return history;
};
