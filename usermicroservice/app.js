var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cron = require('node-cron');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Charger les variables d'environnement
require('dotenv').config();
require('dotenv').config();
console.log('JWT_SECRET chargé :', process.env.JWT_SECRET);
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Database Connection
if (process.env.NODE_ENV !== 'test') {
  const mongoConfig = require('./config/database.json');
  mongoose.connect(mongoConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

  mongoose.connection.once('open', () => {
    console.log(" MongoDB connection established successfully");
  });
}

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;