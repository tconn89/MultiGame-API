Account = require(process.cwd() + '/models/account');
mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4');
async = require('async')

// users to add as admin
adminUsers = ['irrevocable', 'cocoon'];
Account.find({username: { $in: adminUsers }}, function(err, users){
  async.forEach(users, function(user, callback){
    user.roles = ['admin'];
    user.save(function(err){
      if(err) callback(err);
      console.log(`${user.username} processed`);
      callback();
    });
}, function(err){
  if(err)
    return console.error(err);
  else
    console.log("Set admin roles successfully");
  mongoose.connection.close();
  return process.exit(1);
  });
});
