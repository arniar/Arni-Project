var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
var mongoose = require('mongoose');


var indexRouter = require('./routes/index');
var signinRouter = require('./routes/signin');
var signinOtpRouter = require('./routes/signinOtp');
var alreadyRouter = require('./routes/already');
var loginRouter = require('./routes/login');
var forgetPasswordRouter = require('./routes/forgetPassword');
var forgetPasswordOtpRouter = require('./routes/forgetPasswordOtp');
var resetPasswordRouter = require('./routes/resetPassword');
var termsRouter = require('./routes/terms');
var privacyRouter = require('./routes/privacy');
var resetSuccessRouter = require('./routes/resetSuccess');


var app = express();

const mongoURI = 'mongodb://localhost:27017/Arni'; // or use MongoDB Atlas URI

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error: ', err));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Use environment variable
  resave: false,           // Prevents unnecessary session resaving
  saveUninitialized: false, // Don't save uninitialized sessions
  cookie: {
      secure: false,        // Set true if using HTTPS
      httpOnly: true,       // Prevent client-side access to cookies
      maxAge: 1000 * 60 * 15 // 15 minutes session expiry
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  // Save user info to session or database
  return done(null, profile);
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'email', 'picture.type(large)'], // Requesting email and profile picture
  scope: ['email'] // Ensure this is included to request email
}, (accessToken, refreshToken, profile, done) => {
  // Process user profile here
  console.log(profile);
  return done(null, profile);
}));



app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/signin', signinRouter);
app.use('/signinOtp', signinOtpRouter);
app.use('/already', alreadyRouter);
app.use('/login', loginRouter);
app.use('/forgetPassword', forgetPasswordRouter);
app.use('/forgetPasswordOtp', forgetPasswordOtpRouter);
app.use('/resetPassword', resetPasswordRouter);
app.use('/terms', termsRouter);
app.use('/privacy', privacyRouter);
app.use('/resetSuccess', resetSuccessRouter);


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

module.exports = app;
