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
      mongoose.connect('mongodb://localhost/test');
      done();
    });
    beforeEach(function(done) {
      connect('mongodb://localhost/test', function(err, db){
        databaseCleaner.clean(db, function(){
          done();
        });
      });
    });
    importTest("session", './models/session_spec.js');
    importTest("account", './models/account_spec.js');
    importTest("permissionLevel", './models/permission_level_spec.js');
    after(function(done) {
      mongoose.connection.close();
      done();
    });
});
