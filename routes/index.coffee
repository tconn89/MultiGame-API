express = require('express')
passport = require('passport')
formidable = require('formidable')
Account = require('../models/account')
BinaryFile = require('../models/binary_file')
fs = require('fs')
path = require('path')
router = express.Router()
router.get '/', (req, res) ->
  res.render 'index', user: req.user
router.get '/register', (req, res) ->
  res.render 'register', {}
router.post '/register', (req, res, next) ->
  Account.register new Account(username: req.body.username), req.body.password, (err, account) ->
    if err
      return res.render('register', error: err.message)
    passport.authenticate('local') req, res, ->
      req.session.save (err) ->
        if err
          return next(err)
        res.redirect '/'
router.get '/login', (req, res) ->
  res.render 'login',
    user: req.user
    error: req.flash('error')
router.post '/login', passport.authenticate('local',
  failureRedirect: '/login'
  failureFlash: true), (req, res, next) ->
  req.session.save (err) ->
    if err
      return next(err)
    res.redirect '/'
router.get '/logout', (req, res, next) ->
  req.logout()
  req.session.save (err) ->
    if err
      return next(err)
    res.redirect '/'
router.get '/binary', (req, res) ->
  BinaryFile.first
router.get '/upload', (req, res) ->
  res.render 'upload'
router.get '/ping', (req, res) ->
  console.log __dirname
  BinaryFile.remove (err) ->
    if err
      throw err
    b = new BinaryFile
  console.log 'Starting'

  http = require('http')
  file = fs.createWriteStream("./write.jpg")
  request = http.get("localhost:3000/binary", (response) ->
    response.pipe(file))
  fs.exists './sample.jpg', (fileok) ->
    console.log(fileok)
    if fileok
      fs.readFile './sample.jpg', (error, data) ->
        b = new BinaryFile
        b.binary = data
        b.save
    else
      console.log 'file not found'
    return
  console.log 'Carry on executing'

  res.status(200).send 'finished' 

router.post '/upload', (req, res) ->
  # create an incoming form object
  form = new (formidable.IncomingForm)
  # specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true
  # store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/../public/uploads')
  # every time a file has been uploaded successfully,
  # rename it to it's orignal name
  form.on 'file', (field, file) ->
    console.log('create file')
    fs.rename file.path, path.join(form.uploadDir, file.name)
  # log any errors that occur
  form.on 'error', (err) ->
    console.log 'An error has occured: \n' + err
  # once all the files have been uploaded, send a response to the client

  console.log('working')
  form.on 'end', ->
    console.log('success')
    res.end 'success'
    # parse the incoming request containing the form data
    b = new BinaryFile

    console.log('binary: ' + b)
    
    a = new Buffer(form.parse)
    b.binary = a
    console.log(a.toString('hex'))
    #b.binary = new Buffer(form)
    console.log ('buffer created')
    console.log (b.binary)

    b.save((err) ->
      if(err)
        console.error('b failed: ' + err))

  form.parse(req)

module.exports = router
