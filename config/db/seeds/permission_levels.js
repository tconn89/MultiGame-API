PermissionLevel = require(process.cwd() + '/models/permission_level');
mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4');

levels_to_seed = ['private', 'protected', 'public'];
levels_to_seed.forEach(function(level, index){
  permissionLevel = new PermissionLevel;
  permissionLevel.id = index + 1;
  permissionLevel.name = level;
  permissionLevel.save(function(err){
    if(err)
      console.log(err);
    console.log(`saved ${level}`)
    if(index == 2)
      mongoose.connection.close();
  });
});
