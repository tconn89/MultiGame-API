Session = require('../models/session');
BinaryFile = require('../models/binary_file');

formidable = require('formidable');
path = require('path');

permissionController = function(){};

permissionController.prototype.update = function(req, res){
  permission = req.query.permission;
  map_name = req.query.map_name;
  user = req.user;
  BinaryFile.findOne({map_name: map_name}, function(err,doc){
    if(err)
      console.error(err);
    if(!doc){
      console.error(`no map found by name: ${map_name}`);
    } else if(doc.user_id != user.id) {
      log = `${user.username} not the owner of ${map_name}`;
      console.error(log);
      res.status(401).send(log);
    } else {
      doc.setPermissionLevel(permission, function(err){
        if(err)
          console.error(err);
      });
      res.status(200).send(`Set permission level to ${permission}`).end();
    }
  });
};

module.exports = permissionController;
