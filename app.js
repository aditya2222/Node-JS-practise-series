const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/User')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById(1)
		.then((user) => {
			req.user = user;
			next()
		})
		.catch((error) => {
			console.log(error)
		})
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Establishing relations before sync
Product.belongsTo(User, {
	constraints: true,
	// cascade means delete associated product also if user is deleted
	onDelete: 'CASCADE'
})

// Associations
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, {through: CartItem})
Product.belongsToMany(Cart, {through: CartItem})


sequelize.sync()
	.then((result) => {
		// Once tables are created
		return User.findById(1)
	})
	.then((user) => {
		if (!user) {
			return User.create({
				name: 'Aditya',
				email: 'adityasingh2222@gmail.com'
			})
		}
		return user;
	})
	.then((user) => {
		// console.log(user)
		user.createCart()
	})
	.then((response)=>{
		app.listen(3000)
	})
	.catch((error) => {
		console.log(error)
	})



