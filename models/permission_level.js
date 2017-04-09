(function() {
  var PermissionLevel, Schema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  PermissionLevel = new Schema({
    id: Number,
    name: String
  });


  module.exports = mongoose.model('permissionlevels', PermissionLevel);

}).call(this);
