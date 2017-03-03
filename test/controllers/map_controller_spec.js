server = require('../../bin/server');
chai = require('chai');
chaiHttp = require('chai-http');
should = chai.should();
chai.use(chaiHttp);
const {readFileSync} = require("fs");

Session = require('../../models/session');
Account = require('../../models/account');

describe('root_authentication', function(){
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
      .post('/upload')
      .set('my_cookie', 'token')
      .set('map_name', 'swatchbuckler')
      .attach('file', readFileSync('./test/images/basic.png'), 'basic.png')
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        done();
      });
  });
});
