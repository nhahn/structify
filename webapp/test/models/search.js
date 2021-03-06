var assert = require('assert')
  , tests
  , Search = geddy.model.Search;

tests = {

  'after': function (next) {
    // cleanup DB
    Search.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var search = Search.create({});
    search.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
