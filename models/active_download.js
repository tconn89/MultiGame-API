(function() {
  var BinaryFile, Schema, mongoose, passportLocalMongoose;
  var async = require('async');
  var fs = require('fs');
  var autoIncrement = require('mongoose-auto-increment');

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  ActiveDownload = new Schema({
    hash: String,
    current_bytes: Number,
    expected_bytes: Number,
    map_name: String,
    user_id: Number,
    created_at: Date,
    updated_at: Date
  });

  ActiveDownload.plugin(autoIncrement.plugin, { model: 'active_downloads', field: 'id' });
  module.exports = mongoose.model('active_downloads', ActiveDownload);
}).call(this);