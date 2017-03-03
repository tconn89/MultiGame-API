var Session = require('../../models/session');
should = require('should');

describe('Session', function(){
  beforeEach(function(done){
    session = new Session({
      secret: "v9CnUgnfapm_zLJG3Eja3Wf6li2bfPCd",
      user_id: 1
    });
    session.save(function(error){
      if(error)
        console.log('error' + error.message)
      done();
    });
  });
  it('finds a session by user_id', function(done) {
    Session.findOne({
      user_id: 1
    }, function(err, session) {
      session.secret.should.eql('v9CnUgnfapm_zLJG3Eja3Wf6li2bfPCd');
      console.log('   session: ', session.secret);
      done();
    });
  });
  afterEach(function(done) {
    Session.remove({}, function() {
      done();
    });
  });
});
