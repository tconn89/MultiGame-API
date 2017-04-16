PermissionLevel = require('../../models/permission_level.js');

describe('PermissionLevel', function() {
  beforeEach(function(done) {
    permission = new PermissionLevel({
      id: 1,
      name: 'private'
    });
    permission.save(function(error) {
      if (error)
        console.log('     error' + error.message);
      done();
    });
  });
  it('find a permissionlevel by id', function(done) {
    PermissionLevel.findOne({
      id: 1
    }, function(err, permission) {
      permission.name.should.eql('private');
      console.log('     name: ', permission.name);
      done();
    });
  });
});
