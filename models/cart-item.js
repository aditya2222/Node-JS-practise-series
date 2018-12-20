
// Sequelize is the package import
const Sequelize = require('sequelize')
// Sequelize is the database instance which we created in order to connect to the database
const sequelize  = require('../util/database')


const CartItem = sequelize.define('cartItem',{
	id:{
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	quantity: Sequelize.INTEGER

})

module.exports = CartItem
