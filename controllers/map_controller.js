Session = require('../models/session');
BinaryFile = require('../models/binary_file');

formidable = require('formidable');
path = require('path');

mapController = function(){};
mapController.prototype.upload = function(req, res) {
  console.log('mapController:upload');
  configuredForm(req,res,false);
};

module.exports = mapController;

addBinary = function(options){
  BinaryFile.findOne({map_name:options.map_name}, function(err,doc){
    if(err){
      throw err;
    }
    if(doc){
      // What if user doesn't own this map?
      if(doc.user_id != options.user.id){
        log =  `${options.user.username} does not own map `;
        log += `${doc.map_name} with permission ${doc.getPermissionLevel()}`;
        return console.log(log);
      }
      console.log('update mode')
      b = doc;
    }
    else{
      console.log('create mode')
      b = new BinaryFile;
      b.setPermissionLevel('private');
      b.path = options.path;
      b.created_at = new Date();
      b.user_id = options.user.id;
    }

    b.updated_at = new Date();
    //b.user_id = req.user.id;
    b.map_name = options.map_name;
    return b.save(function(err) {
      if (err) {
        return console.error('b failed: ' + err);
      }
    });
  });
}
configuredForm = function(req,res, binaryFlag){
  var map_name = req.headers.map_name;
  if(req.query.map_name)
    map_name = req.query.map_name;
  if(!map_name)
    return res.status(400).send('Need a map name').end();

  var form;
  form = new formidable.IncomingForm({noFileSystem: binaryFlag}),
    files = [],
    fields = [];
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '/../public/uploads');
  form
    .on('field', function(field, buffer) {
      console.log('on field');
      fields.push([field, buffer]);
    })
    .on('file', function(field, file) {
      console.log('on file');
      files.push([field,file]);
      file_path = path.join(form.uploadDir, map_name);
      fs.rename(file.path, file_path);
      my_options = { file:file, map_name:map_name, path:file_path, user: req.user };
      addBinary(my_options);
    })
    .on('error', function(err) {
      return console.log('An error has occured: \n' + err);
    })
    .on('end', function(){
      console.log('-> "END" event triggered');
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end('files being uploaded');
    });
    form.parse(req, function(err, fields, files) {
      if(err)
        console.log(err);
    });
}
