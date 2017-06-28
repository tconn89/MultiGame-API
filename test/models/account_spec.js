Account = require('../../models/account.js');

describe('Account', function() {
  beforeEach(function(done) {
    var account;
    account = new Account({
      username: '12345',
      password: 'testy'
    });
    account.save(function(error) {
      if (error)
        console.log('     error' + error.message);
      done();
    });
  });
  it('find a user by username', function(done) {
    Account.findOne({
      username: '12345'
    }, function(err, account) {
      account.username.should.eql('12345');
      account.id.should.above(0);
      console.log('     username: ', account.username);
      done();
    });
  });
});
