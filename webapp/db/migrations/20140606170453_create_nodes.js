var CreateNodes = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('title', 'string');
          t.column('content', 'text');
          t.column('nodeId', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('node', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('node', callback);
  };
};

exports.CreateNodes = CreateNodes;
