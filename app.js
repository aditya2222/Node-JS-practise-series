const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf')
const flash = require('connect-flash')
const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
    'mongodb+srv://admin:tiktik123@cluster0-5t9yf.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const csrfProtection = csrf()

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);


app.use(csrfProtection)
app.use(flash())


app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
		if(!user){	
			return next();
		}
            req.user = user;
            next();
        })
        .catch(err=>{	
		throw new Error(err)
		//next();
	});
});

app.use((req, res, next) => {

    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI, {useNewUrlParser: true})
    .then(result => {
        console.log('Connected')
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
