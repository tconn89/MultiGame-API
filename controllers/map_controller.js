Session = require('../models/session')
formidable = require('formidable');

mapController = function(){};
mapController.prototype.upload = function(req, res) {
  local_authentication(req, res, function(err, probly_user){
    if(err)
      throw err;
  // user authorization
  // if(!req.user){
  //   console.error('you must be a user');
  //   return res.status('401').send('you must be a user');
  // }

    console.log('mapController:upload');
    configuredForm(req,res,false);
  });
  //configuredForm(req,res,true);
};

module.exports = mapController;

local_authentication = function(req, res, callback){
  if(!req.session)
    return res.send('session undefined, you are not authorized')

  var my_cookie;
  console.log(`auth: ${req.headers.authorization}`);
  console.log(`my_cookie: ${req.headers.my_cookie}`);
  if(req.headers.authorization)
    my_cookie = req.headers.authorization.split(',');
  else if(req.headers.my_cookie)
    my_cookie = req.headers.my_cookie.split(',');
  else if(req.body.my_cookie)
    my_cookie = req.body.my_cookie.split(',');
  else
    return res.status(401).send('no cookie data, you are not authorized')

  Session.findOne({secret: my_cookie[0]}, function(err,db_sesh){
    console.log('wtf');
    if(err)
      throw err;
    console.log(db_sesh);
    console.log('made it');
    if(db_sesh)
      Account.findOne({id: db_sesh.user_id}, function(err, user){
        if(user)
           callback(err, user);
        else{
          console.log('anonymous sesh');
          res.status(401).send('anonymous session, you are not authorized')
        }
      });
    else
      res.status(401).send('no session on record, you are not authorized')
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
      addBinary(file, map_name, file_path);
    })
    .on('error', function(err) {
      return console.log('An error has occured: \n' + err);
    })
    .on('end', function(){
      console.log('-> upload done');
    });
  form.parse(req, function(err, fields, files) {
    if(err)
      console.log(err);
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: files}));
  });
}
