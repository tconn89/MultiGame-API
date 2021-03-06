// Generated by CoffeeScript 1.10.0
(function() {
  var Account, BinaryFile, express, formidable, fs, passport, path, router;


  express = require('express');

  passport = require('passport');

  async = require('async');
  crypto = require('crypto');
  nodemailer = require('nodemailer');

  util = require('util');

  formidable = require('formidable');

  Account = require('../models/account');

  BinaryFile = require('../models/binary_file');

  ActiveDownload = require('../models/active_download');

  Session = require('../models/session');

  mongoose = require('mongoose');

  MapController = require('../controllers/map_controller');
  mapController = new MapController();
  UserController = require('../controllers/user_controller');
  userController = new userController();

  PermissionController = require('../controllers/permissions_controller');
  permissionController = new PermissionController();


  var Schema   = mongoose.Schema;
  var ObjectIdSchema = Schema.ObjectId;
  var ObjectId = mongoose.Types.ObjectId;

  fs = require('fs');

  path = require('path');

  var mime = require('mime');

  router = express.Router();

  // Verify the user is signed in
  router.get('/', function(req, res) {
    res.type('text/plain').send(`${req.user.username} just started a new session`);
  });

  // Render a registration page
  router.get('/register', function(req, res) {
    return res.render('register', {});
  });

  router.post('/guest/save', function(req, res){
    req.query.guest = true;
    mapController.upload(req, res);    
  });
  // Change the permission level to Public, Protected, or Private
  router.post('/map_permission_level', function(req, res){
    permissionController.update(req, res, "", function(myRes){
      if(myRes.status == 200){
        permissionController.update(req, res, "Terrain", function(terrainRes){
          if(terrainRes.status != 200)
            return res.status(terrainRes.status).send(terrainRes.message);
          res.status(myRes.status).send(myRes.message);
        });
      } else {
        res.status(myRes.status).send(myRes.message);
      }
    });

  });
  // Temporary endpoint until we have roles
  router.get('/users', function(req,res){
    Account.find({}, function(err, users){
      if(err)
        console.error(err);
      result = '';
      users.forEach(function(user){
        result += user.username + '\n'
      })
      res.send(result);
    });
  });
  router.get('/progress', function(req, res){
    _date = new Date();
    _time = _date.setSeconds(_date.getSeconds()-7);
    ActiveDownload.findOne({user_id: req.headers.id, created_at: {$gte: _time}}, function(err, activity){
      if(err)
        console.error(err);
      if(!activity)
        res.send({percentile: 1, current_bytes: 1, expected_bytes: 1});
      else{
        received = activity.current_bytes;
        expected = activity.expected_bytes;
        percent = Math.round(100* received / expected)/ 100;
        res.send({ percentile: percent,
                   bytesReceived: received,
                   bytesExpected: expected });
      }
    })
  });
  router.post('/admin/remove', function(req, res){
    BinaryFile.customRemove(req.body.map_name, function(m_message, m_status){
      res.status(m_status).send({message: m_message});
    })
  });

  router.post('/map/remove', function(req, res){
    _map_name = req.body.map_name
    _user = req.user
    BinaryFile.findOne({map_name: _map_name}, function(err, map){
      if(map.user_id == _user.id){
        BinaryFile.customRemove(req.body.map_name, function(m_message, m_status){
          res.status(m_status).send({message: m_message});
        })
      }
      else
        res.status(401).send({message: `${_user.username} cannot destroy ${_map_name}; They do not own that map.`})
    })
  })
  // Send user registration credentials to server
  router.post('/register', function(req, res, next) {
    username = req.body.username;
    password = req.body.password;
    email = req.body.email;
    console.log(`user: ${username}`);
    if(!username || !password || !email){
      req.session.destroy();
      //res.clearCookie('connect.sid');
      return res.status(400).send('missing field data').end();
    }
    token = crypto.randomBytes(20).toString('hex');
    console.log(`token ${token}`);
    async.waterfall([function(done){
      // email duplicate check
      Account.findOne({email: email}, function(err, user){
        if(err)
          console.error(err);
        if(user)
          return res.status(400).send("User already exists with the email");
        done('done')
      })
    }], function(){
      Account.register(new Account({
        username: username,
        email: email,
        emailToken: token,
        emailPending: true,
        created_at: new Date
      }), req.body.password, function(err, account) {
        if (err) {
          return res.status(400).send(err.message);
        }
        return passport.authenticate('local')(req, res, function() {
          req.session.cookie.maxAge = 3600000;
          // do not duplicate in db sessions
          // need to be async
          session = new Session();
          session.created_at = new Date;
          session.saveSesh(req.session.id, req.user, res, function(){
            userController.sendVerificationMail(req, req.user, function(err){
              if(err){
                Account.find({ username:req.user.username }).remove().exec();
                res.status(400).send(`${req.user.email} is not a valid email address`);
              }
              else
                res.status(200).send(`Email sent to ${req.user.email}, please verify before proceeding`);
            });
          });
        });
      });
    });
  });

  // Resend Verification Email
  router.post('/email/resend', function(req, res){
    Account.findOne({email: req.body.email}, function(err, user){
      if(err || user == null)
        res.status(400).send(`Couldn't find email for user: ${req.body.username}`)
      else{
        if(user.emailPending){
          userController.sendVerificationMail(req, user, function(err){
            if(err)
              res.status(400).send(`${user.email} is not a valid email address`);
            else
              res.status(200).send(`Email sent to registered email address of ${user.username}`);
          });
        } else 
          res.status(400).send(`${user.username}'s email address has already been verified`);
      }
    })
  });

  // Tell the server you are the authorized user to reset password
  router.get('/email/:token', function(req, res){
    Account.findOne({emailToken: req.params.token}, function(err, user){
      user.emailPending = false;
      user.emailToken = -1;
      user.save(function(err){
        if(err)
          console.error(err);
      })
      return res.status(200).send(`email verified, ${user.username} may login now`);
    });
  });


  // why does this work?
  router.get('/login', function(req, res) {
    return res.render('login', {
      user: req.user,
      error: req.flash('error')
    });
  });

  // Authenticate the user and return a unique session id
  // User must have verified email address to login
  router.post('/login', passport.authenticate('local', {
    failureFlash: true
  }), function(req, res, next) {
    if(req.user.emailPending)
      return res.status(400).send('User has not verified their email address');
    Session.findOne({user_id: req.user.id}, function(err, session){
      if(err)
        console.error(err);
      if(!session){
        console.error('this should never happen')
      }
      return session.saveSesh(req.session.id, req.user, res);
    });
  });

  // Expire the user session
  router.get('/logout', function(req, res, next) {
    Session.findOne({user_id: req.user.id }, (err, session) => {
      if(err)
        console.error(err);
      session.expire(() => {
        user = req.user.username;
        req.session.destroy();
        res.status(200).send({message: `${user} logged out`})
      });
    });
  });

  // sends file to client
  clientBinary = function(req,res){
    var filename;
    var params;
    var map_name = req.headers.map_name;
    if(req.query.map_name){
      map_name = req.query.map_name;
    }
    params = {'map_name': map_name };
    filename = 'binary';
    console.log(`map_name: ${map_name}`);
    BinaryFile.findOne(params, function(err, data){
      if(err)
        return res.render(err);
      else
        if(!data)
          return res.status(400).send(`No maps by name: ${map_name}`);
        mimetype = mime.lookup(data.path);
        console.log(mimetype);
        filename = data.path.split('/').pop();
        res.setHeader('Content-Description','File Transfer');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', mimetype);
        res.status('200').end(fs.readFileSync(data.path));
    });
  };
  // Download a serialized binary file
  router.get('/binary',
    clientBinary
  );
  router.get('/guest/load',
    clientBinary
  );

  // Just an idea, not working
  router.get('/redis', function(req, res){
    server.open(function(err){
      if(err == null){
        // do some stuff
        return res.render('connected')
      }
    })
  });

  // Test for returning size of maps in kilobytes
  router.get('/sizes', function(req, res){
    BinaryFile.find({}, function(err, binary_refs){
      if(err){
        throw err;
      }
      sizes = [];
      binary_refs.forEach(function(binary_ref){
        file = fs.statSync(binary_ref.path);
        size = file.size/1000.0;
        console.log(`Map ${binary_ref.map_name} has size: ${size} kilobytes`);
        sizes.push(file.size);
      });
      res.status(200).send('All Done');
    })
  });
  router.get('/upload', function(req, res) {
    return res.render('upload');
  });


  router.get('/guest/maps', function(req, res){
    BinaryFile.find({guest: true}, function(err, docs){
      if(err){
        throw err;
      }
      names = [];
      i = 0;
      docs.forEach(function(ref){
        if(ref.map_name){
          if(!ref.map_name.endsWith('Terrain'))
            names.push(ref.map_name);
        }
      });
      maps = {
        'maps': names
      }
      maps_json = JSON.stringify(maps);
      res.status(200).send(maps_json).end();
    });
  });
  //  Request a list of all maps by protection level
  router.get('/maps_index', function(req, res){
    permissionLevel = req.query.permission;
    if(!permissionLevel)
      permissionLevel = 'protected';
    permissionID = BinaryFile.getPermissionID(permissionLevel);
    params = {permission_level_id: permissionID}
    if(permissionID == 1)
      params.user_id = req.user.id
    BinaryFile.find(params, function(err, docs){
      if(err){
        throw err;
      }
      names = [];
      i = 0;
      docs.forEach(function(ref){
        if(ref.map_name){
          if(!ref.map_name.endsWith('Terrain'))
            names.push(ref.map_name);
        }
      });
      maps = {
        'maps': names
      }
      maps_json = JSON.stringify(maps);
      res.status(200).send(maps_json).end();
    });
  });

  // Upload a binary file with a specified mapname
  router.post('/upload', function(req, res){
    mapController.upload(req, res);
  });

  // forgot password initilize recovery email
  var nodemailer = require('nodemailer')
  var mg = require('nodemailer-mailgun-transport')
  var auth = {
    auth: {
      api_key: process.env.MAILGUN_KEY,
      domain: process.env.SITE
    }
  }

  var nodemailerMailgun = nodemailer.createTransport(mg(auth));
  router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        Account.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            return res.status(400).send({message: 'No account with that email address exists'});
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpiration = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@terrium.net',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        nodemailerMailgun.sendMail(mailOptions, (err, info) => {
          if(err)
            console.error(err)
          console.log('Response: ' + info)
          done(err, 'done');
        });
        //smtpTransport.sendMail(mailOptions, function(err) {
        //  req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
         // done(err, 'done');
        //});
      }
    ], function(err) {
      if (err) return next(err);
      res.send({message: 'Your password reset email has been sent'});
    });
  });

  // login user and display new password form
  router.get('/reset/:token', function(req, res) {
    Account.findOne({ resetPasswordToken: req.params.token, resetPasswordExpiration: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        return res.status(401).send({message: 'Password reset token is invalid or has expired'});
      }
      Session.findOne({user_id: user.id}, (err, session) => {
        if(err)
          console.error(err);
        session.saveSesh(req.params.token, user, res, function(){
          res.render('reset');
        });
      });
    });
  });

  // Post a new password
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        Account.findOne({ resetPasswordToken: req.params.token, resetPasswordExpiration: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            return res.status(401).send({message: 'Password reset token is invalid or has expired.'});
          }

          user.resetPasswordToken = undefined;
          user.resetPasswordExpiration = undefined;
          user.setPassword(req.body.password, () => {
            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        });
      },
      function(user, done) {
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@terrium.net',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        nodemailerMailgun.sendMail(mailOptions, (err, info) => {
          if(err)
            console.error(err)
          console.log('Response: ' + info)
          done(err, 'done');
        });
      }
    ], function(err) {
      if(err)
        console.error(err);
      res.send({message: 'password update email successfully sent'});
    });
  });

  module.exports = router;

}).call(this);
