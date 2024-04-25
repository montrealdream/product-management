const express = require('express');

// require router
const routerClient = require('./routes/client/index.route');
const routerAdmin = require('./routes/admin/index.route');

// require dotenv (NPM)
require('dotenv').config();

// require method-override (NPM)
const methodOverride = require('method-override');

// require body-parser (NPM)
const bodyParser = require('body-parser');

// require express-flash (NPM)
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// require system config 
const systemConfig = require('./config/system');
const database = require('./config/database');

// require path
const path = require('path');

// express
const app = express()
const port = process.env.PORT;

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// app.locals 
app.locals.path_admin = systemConfig.path_admin;

// template engines
// app.set('views', './views');
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// static files
// app.use(express.static('public'));
app.use(express.static(`${__dirname}/public`));

// database mongoDB-mongoose
database.connect();

// usage express flash
app.use(cookieParser('pnup'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// router tinymce
app.use(
  '/tinymce', 
  express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);

// router
routerClient(app);
routerAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})