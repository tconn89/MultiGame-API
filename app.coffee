# dependencies
express = require('express')
path = require('path')
favicon = require('serve-favicon')
logger = require('morgan')
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
mongoose = require('mongoose')
passport = require('passport')
LocalStrategy = require('passport-local').Strategy
flash = require('connect-flash')
routes = require('./routes/index')
users = require('./routes/users')
app = express()
# view engine setup
app.set 'views', path.join(__dirname, 'views')
app.set 'view engine', 'jade'
# uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use logger('dev')
app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: false)
app.use cookieParser()
app.use require('express-session')(
  secret: 'keyboard cat'
  resave: false
  saveUninitialized: false)
app.use passport.initialize()
app.use flash()
app.use passport.session()
app.use express.static(path.join(__dirname, 'public'))
app.use '/', routes
# passport config
Account = require('./models/account')
BinaryFile = require('./models/binary_file')
passport.use new LocalStrategy(Account.authenticate())
passport.serializeUser Account.serializeUser()
passport.deserializeUser Account.deserializeUser()
# mongoose
mongoose.Promise = global.Promise
mongoose.connect 'mongodb://localhost/passport_local_mongoose_express4'
# catch 404 and forward to error handler
app.use (req, res, next) ->
  err = new Error('Not Found')
  err.status = 404
  next err
# error handlers
# development error handler
# will print stacktrace
if app.get('env') == 'development'
  app.use (err, req, res, next) ->
    res.status err.status or 500
    res.render 'error',
      message: err.message
      error: err
# production error handler
# no stacktraces leaked to user
app.use (err, req, res, next) ->
  res.status err.status or 500
  res.render 'error',
    message: err.message
    error: {}
module.exports = app
