
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect
const User = require('./models/User')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById('5c238fd585635b247e06eb76')
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


mongoConnect(()=>{
app.listen(3000)

})

