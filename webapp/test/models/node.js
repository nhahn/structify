var assert = require('assert')
  , tests
  , Node = geddy.model.Node;

tests = {

  'after': function (next) {
    // cleanup DB
    Node.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var node = Node.create({});
    node.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
