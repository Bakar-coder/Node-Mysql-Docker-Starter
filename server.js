// import app modules
require('express-async-errors');
require('joi-objectid');
const express = require('express'),
  config = require('config'),
  cors = require('cors'),
  db = require('./utils/database'),
  fileUpload = require('express-fileupload'),
  morgan = require('morgan'),
  path = require('path'),
  port = process.env.PORT || 5000,
  app = express();

// import models
const { User } = require('./models/User');
const { Product } = require('./models/Product');

// set environment variables
if (!config.get('jwtPrivateKey')) {
  console.log('No private provided...');
  process.exit(1);
}

// app routes
const index = require('./routes/index'),
  users = require('./routes/users'),
  addProduct = require('./routes/admin/add-product');

// set app middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client')));
app.use('uploads', express.static(path.join(__dirname, 'uploads')));
app.use(fileUpload());
app.use(morgan('combined'));
app.use(cors());
app.use('/', index);
app.use('/api/users', users);
app.use('/api/admin', addProduct);

// create schema relationship
Product.belongsTo(User, { constraints: true, onDelete: 'cascade' });
User.hasMany(Product);

// initialize database()
db.sync()
  .then(() => console.log('connected to mysql database...'))
  .catch(err => console.error('Database Connection Error! -', err));

// initialize node server
app.listen(port, () => console.log(`server running on port: ${port}...`));
