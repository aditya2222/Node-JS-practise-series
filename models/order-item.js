// Sequelize is the package import
const Sequelize = require('sequelize')
// Sequelize is the database instance which we created in order to connect to the database
const sequelize  = require('../util/database')


const OrderItem = sequelize.define('orderItem',{
	id:{
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	quantity: Sequelize.INTEGER

})

module.exports = OrderItem
