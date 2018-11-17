const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./controllers/error')

const app = express();

// Specifying pug as our templating engine
// app.set('view engine', 'pug')
// Specifying handlebars as our templating engine
// app.engine('handlebars', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout'}));
// app.set('view engine', 'handlebars');
// Setting up ejs as the view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorHandler.get404);

app.listen(3000);
