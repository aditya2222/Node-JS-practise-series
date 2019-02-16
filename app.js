const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const errorController = require('./controllers/error');
const User = require('./models/user');
const multer = require('multer')

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
const csrfProtection = csrf();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: 'images' }).single('image'))
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

    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use((req, res, next) => {
    // throw new Error('Sync Dummy')
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            // throw new Error('Dummy')
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err))
            // Does not work for errors inside async code such as inside then block
            // throw new Error(err)
            //next();
        });
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);
app.get('/500', errorController.get505);

// express automatically detects that below is a error handling middleware
app.use((error, req, res, next) => {

    res.status(404).render('500', {
        pageTitle: 'Page Not Found',
        path: '/505',
        isAuthenticated: req.session.isLoggedIn
    });

});

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(result => {
        console.log('Connected');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
