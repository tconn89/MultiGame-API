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

  // BinaryFile.plugin(passportLocalMongoose);

  module.exports = mongoose.model('Session', Session);

}).call(this);
