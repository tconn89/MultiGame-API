const Session = require('../models/session');
const BinaryFile = require('../models/binary_file');
const ActiveDownload = require('../models/active_download.js');
const crypto = require('crypto');

formidable = require('formidable');
path = require('path');

mapController = function(){};
mapController.activeHash = "";
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
      // if(doc.user_id != options.user.id){
      //   log =  `${options.user.username} does not own map `;
      //   log += `${doc.map_name} with permission ${doc.getPermissionLevel()}`;
      //   return console.log(log);
      // }
      console.log('update mode')
      b = doc;
    }
    else{
      console.log('create mode')
      b = new BinaryFile;
      b.setPermissionLevel('private');
      b.path = options.path;
      b.created_at = new Date();
      if(options.user)
        b.user_id = options.user.id;
      else
        b.user_id = -1;
    }

    b.updated_at = new Date();
    //b.user_id = req.user.id;
    b.map_name = options.map_name;
    if(options.guest){
      b.guest = true;
      b.setPermissionLevel('public');
    }
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
  var guest = req.query.guest;
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
      my_options = { file:file, map_name:map_name, path:file_path, user: req.user, guest: guest };
      addBinary(my_options);
    })
    .on('progress', function(bytesReceived, bytesExpected) {
      if(bytesReceived == 0)
        if(req.url.includes('Terrain'))
          AddActiveDownload(req.user,map_name, bytesReceived, bytesExpected, function(hash){
            console.log("Added download activity" + hash.substring(0, 6));
            return res.send(hash);
          });
      else if(Math.round(10000* bytesReceived / bytesExpected) % 1000 == 0 ){
        console.log(mapController.activeHash);
        UpdateDownload(mapController.activeHash, bytesReceived);
      }


    })
    .on('error', function(err) {
      return console.log('An error has occured: \n' + err);
    })
    .on('end', function(){
      console.log('-> "END" event triggered');
    });
    form.parse(req, function(err, fields, files) {
      if(err)
        console.log(err);
    });

   
}
AddActiveDownload = function(user, name, received, expected, cb){
  m_download = new ActiveDownload();
  crypto.randomBytes(24, function(err, buffer) {
    m_download.hash = mapController.activeHash = buffer.toString('hex');
    m_download.map_name = name;
    m_download.current_bytes = received;
    m_download.expected_bytes = expected;
    m_download.created_at = new Date();
    if(user)
      m_download.user_id = user.id;
    m_download.save(function(err){
      if(err)
        console.error(err);
      cb(mapController.activeHash);
    });
  });
}
UpdateDownload = function(hash, received){
  _data = { current_bytes: received, updated_at: new Date() };
  ActiveDownload.findOneAndUpdate({hash: hash}, _data, function(err, activity){
    if(!activity)
      return console.error("No download found");
    console.log("update download");
  });
}
