const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const User = sequelize.define('sser', {
    id: {
        type: Sequelize.STRING,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
})

module.exports = User