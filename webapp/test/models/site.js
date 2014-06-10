var assert = require('assert')
  , tests
  , Site = geddy.model.Site;

tests = {

  'after': function (next) {
    // cleanup DB
    Site.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var site = Site.create({});
    site.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
