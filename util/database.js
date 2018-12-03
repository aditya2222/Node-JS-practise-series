const Sequelize = require('sequelize')

const sequelize = new Sequelize('node-complete','admin','password',{
	host: 'localhost',
	dialect: 'mysql'
})

module.exports = sequelize