var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
//var common = require("./common");


function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}


describe("top", function () {
    before(function(done) {
      console.log('db connect');
      //db = mongoose.connect('mongodb://localhost/test');
      done();
    });
    beforeEach(function () {
    });
    //importTest("session", './session_spec.js');
  //  importTest("account", './account_spec.js');
    importTest("map_save", './map_controller_spec.js');
    after(function(done) {
      mongoose.connection.close();
      done();
    });
});
