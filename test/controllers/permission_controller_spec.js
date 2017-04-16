server = require('../../bin/server');
chai = require('chai');
should = chai.should();
chai.use(require('chai-http'));
fs = require('fs')
const {readFileSync} = require('fs');

Session = require('../../models/session');
Account = require('../../models/account');
BinaryFile = require('../../models/binary_file');

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
            username: 'test_user',
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
        setTimeout(function(){
          BinaryFile.findOne({map_name: 'swatchbuckler'}, function(err, map){
            if(err)
              console.log(err);
            fs.statSync(map.path).isFile().should.be.true;
            done();
          });
        }, 500);
      });
  });
  after(function(done) {
    fs.unlinkSync('public/uploads/swatchbuckler')
    done();
  });
});
