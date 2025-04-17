require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('./app_api/models/db');
const passport = require('passport');
require('./app_api/config/passport');
const favicon = require('serve-favicon');
const cors = require('cors');

const indexRouter = require('./app_server/routes/index');
const usersRouter = require('./app_server/routes/users');
const travelRouter = require('./app_server/routes/travel');
const apiRouter = require('./app_api/routes/index');

const app = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Allow CORS - Updated to handle all routes that start with '/api'
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');  // Allow frontend domain
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow all necessary methods
  next();
});

app.use(cors({
  origin: 'http://localhost:4200', // Add the URL of your Angular app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Route setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Centralized error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  const isDev = req.app.get('env') === 'development';

  // Handle specific error types
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      statusCode: 401,
      message: 'Unauthorized: Authentication required',
      detail: isDev ? err.message : undefined
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Validation Error',
      errors: err.errors,
      detail: isDev ? err.message : undefined
    });
  }

  // Default error handler
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: statusCode === 404 ? 'Not Found' : 'Internal Server Error',
    detail: isDev ? err.message : undefined,
    stack: isDev ? err.stack : undefined
  });
});

module.exports = app;
