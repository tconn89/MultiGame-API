var fs = require('fs');

path = 'Users/tyconnors/Workspace';
var data = fs.readFileSync(path + '/booty.jpg');
data = new Buffer(data.toString(), 'binary')
console.log(data);
console.log(data.toString('binary'));
