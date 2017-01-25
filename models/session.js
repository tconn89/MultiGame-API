(function() {
  var Session, Schema, mongoose, passportLocalMongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  passportLocalMongoose = require('passport-local-mongoose');

  Session = new Schema({
    path: String,
    secret: String,
    user_id: Number,
    created_at: Date
  });
  Session.methods.saveSesh = function(clientSecret, user, res){
    session = this;
    // client to 
    session.secret = clientSecret;
    //session.path = req.session.cookie.path;
    session.user_id = user.id;
    session.save(function(err){
      if(err)
        console.error(err);
      return res.send({'session': clientSecret})
    });
  }

  
  // Session.plugin(passportLocalMongoose);

  module.exports = mongoose.model('Session', Session);


}).call(this);
