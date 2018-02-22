Session = require('../models/session');
BinaryFile = require('../models/binary_file');

formidable = require('formidable');
path = require('path');

permissionController = function(){};

// params
// req, res
// opts: optional suffix on map name
// cb:   function callback after update finishes
permissionController.prototype.update = function(req, res, opts, cb){
  permission = req.query.permission;
  map_name = req.query.map_name;
  if(opts)
    map_name += opts
  user = req.user;
  BinaryFile.findOne({map_name: map_name}, function(err,doc){
    if(err)
      console.error(err);
    if(!doc){
      console.error(`no map found by name: ${map_name}`);
      return cb({status: 400, message: `No map found named ${map_name}`});
    } else if(doc.user_id != user.id) {
      log = `${user.username} not the owner of ${map_name}`;
      console.error(log);
      return cb({status: 401, message: log});
    } else {
      doc.setPermissionLevel(permission, function(err){
        if(err)
          console.error(err);
      });
      return cb({status: 200, message: `Set permission level to ${permission}`});
    }
  });
};

module.exports = permissionController;
