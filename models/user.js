const database = require('../db/database');
const types = require('sequelize').DataTypes;

module.exports.User = database.define('user', {
        id: {
            type: types.UUID, primaryKey: true, allowNull: false
        },
        username: {
            type: types.TEXT, unique: true, allowNull: false
        },
        access_token: {
            type: types.TEXT, allowNull: false
        },
        refresh_token: {
            type: types.TEXT, allowNull: false
        },
        expires_at: {
            type: types.DATE, allowNull: false
        }
    }
);