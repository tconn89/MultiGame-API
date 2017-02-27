Session = require('../models/session')

local_authentication = function(req, res, next){
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
    if(err)
      throw err;
    if(db_sesh)
      Account.findOne({id: db_sesh.user_id}, function(err, user){
        if(err)
          throw err;
        if(user){
          req.user = user
          next();
        }
        else
          res.status(401).send('anonymous session, you are not authorized')
      });
    else
      res.status(401).send('no session on record, you are not authorized')
  });
}

module.exports = local_authentication;
