server = require('../bin/server');
chai = require('chai');
chai = require('chai');
chaiHttp = require('chai-http');
should = chai.should();
chai.use(chaiHttp);

Session = require('../models/session');
Account = require('../models/account');

describe('Map#Save', function(){
  // how to hit endpoints
  beforeEach(function(done){
    Account.remove({}, function() {
      Session.remove({}, function() {
        session = new Session({
          secret: "token",
          user_id: 1
        });
        session.save(function(error){
          if(error)
            console.log('error' + error.message)
          account = new Account({
            id      : 1,
            username: '12345',
            password: 'testy'
          });
          account.save(function(error) {
            if (error)
              console.log('     error' + error.message);
            done();
          });
        });
      })
    });
  });
  it('it should SAVE one map', (done) => {

    chai.request(server)
      .get('/')
      .set('my_cookie', 'token')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.eql('12345 just started a new session');
        done();
      });
  });
});
