
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req,res,next)=>{

User.findById('5c28d7d6d1236114e2980b45')
	.then(user=>{	
		req.user = user
		next()
	})
	.catch(error=>{
		console.log(error)	
	})

})


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://admin:tiktik123@cluster0-5t9yf.mongodb.net/shop?retryWrites=true',{useNewUrlParser:true})
.then((response)=>{
	User.findOne()
	.then(user=>{
		if(!user){
		
		const user = new User({
			name: 'admin',
			email: 'admin@gmail.com',
			cart: {
				items: []	
			}
			})
			user.save()
		}
	
	})
	console.log('Connected')
	app.listen(3000)
})
.catch((error)=>{
	console.log(error)

})
