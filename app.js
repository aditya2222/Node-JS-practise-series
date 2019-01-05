const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://admin:tiktik123@cluster0-5t9yf.mongodb.net/shop'

const app = express();

const store = new MongoDBStore({

	uri: MONGODB_URI,
	collection: 'sessions'

})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({

	secret: 'My Secret',
	resave: false,
	saveUninitialized: false,
	store: store

}))
 
//app.use((req, res, next) => {
//  User.findById('5c28d7d6d1236114e2980b45')
//    .then(user => {
//      req.user = user;
//      next();
//    })
//    .catch(err => console.log(err));
//});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use(errorController.get404);

mongoose
  .connect(
    MONGODB_URI, {useNewUrlParser:true}
  )
  .then(result => {
	  console.log('Connected')
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Admin',
          email: 'admin@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
