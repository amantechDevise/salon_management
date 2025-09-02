var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const cors = require("cors")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/admin');
const fileUpload = require('express-fileupload');
const staffRouter = require('./routes/staffAdmin');
var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Allowed origins for CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["https://web.salon.com", "https://web.salon.com"];
// const allowedOrigins = process.env.ALLOWED_ORIGINS
//   ? process.env.ALLOWED_ORIGINS.split(",") 
//   : ["http://localhost:3200", "http://localhost:3200"];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST","PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies if needed
  })
);
// Set correct path for React build
const frontendBuildPath = path.join(__dirname, '../frontend/dist');

// Serve React build static files
app.use(express.static(frontendBuildPath));
app.use('/admin', indexRouter);
app.use('/admin', usersRouter);
app.use('/staffAdmin', staffRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'), function(err) {
    if (err) {
      console.error('Error sending React index.html:', err);
      res.status(err.status).end();
    }
  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 8020;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
