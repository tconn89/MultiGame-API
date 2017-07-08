Session = require('../models/session');
BinaryFile = require('../models/binary_file');
var nodemailer = require('nodemailer')
var mg = require('nodemailer-mailgun-transport')


userController = function(){};

// Create a method
// mapController.prototype.upload = function(req, res) {
// };

var auth = {
  auth: {
    api_key: 'key-ac5c436f177ccbc638224cb577553aae',
    domain: 'api.terrium.net'
  }
}
var nodemailerMailgun = nodemailer.createTransport(mg(auth));

userController.prototype.sendVerificationMail = function(req, cb) {
  user = req.user;
  var mailOptions = {
    to: user.email,
    from: 'verify@terrium.com',
    subject: 'Terrium Email Verificaton',
    text: 
      `Hello ${user.username}! \n` +
      'Please click this link to verify your email address: \n' +
      'http://' + req.headers.host + '/email/' + user.emailToken
  };
  nodemailerMailgun.sendMail(mailOptions, (err, info) => {
    if(err)
      console.error(err)
    console.log('Response: ' + info)
    cb(err);
  });
}

module.exports = userController;

