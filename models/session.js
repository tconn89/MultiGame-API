(function() {
  var Session, Schema, mongoose, passportLocalMongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  passportLocalMongoose = require('passport-local-mongoose');

  Session = new Schema({
    path: String,
    secret: String,
    user_id: Number,
    created_at: Date,
    updated_at: Date
  });
  Session.methods.saveSesh = function(clientSecret, user, res, cb = null){
    session = this;
    // client to
    session.secret = clientSecret;
    //session.path = req.session.cookie.path;
    session.user_id = user.id;
    session.updated_at = new Date;
    session.save(function(err){
      if(err)
        console.error(err);
      if(cb)
        return cb();
      return res.send({'session': clientSecret, user: user.username});
    });
  }
  Session.methods.expire = function(callback){
    this.secret = 0;
    this.save(function(err){
      if(err)
        console.error(err);
      return callback();
    });
  }


  // Session.plugin(passportLocalMongoose);

  module.exports = mongoose.model('Session', Session);


}).call(this);
