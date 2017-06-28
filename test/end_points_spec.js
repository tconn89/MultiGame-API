process.env.NODE_ENV = 'test'
connect = require('mongodb').connect;
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var DatabaseCleaner = require('database-cleaner');
var databaseCleaner = new DatabaseCleaner('mongodb');


function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}


describe("top", function () {
    before(function(done) {
      console.log('db connect'); //connect through server.js
      //mongoose.connect('mongodb://localhost/test');

      done();
    });
    beforeEach(function(done) {
      connect('mongodb://localhost/test', function(err, db){
        databaseCleaner.clean(db, function(){
          done();
        });
      });
    });
    importTest("root", './controllers/root_authentication_spec.js');
    importTest("map_save", './controllers/map_controller_spec.js');
    after(function(done) {
      mongoose.connection.close();
      done();
    });
});
