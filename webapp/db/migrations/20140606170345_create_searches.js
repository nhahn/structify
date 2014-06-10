var CreateSearches = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('query', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('search', def, callback);
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
    this.dropTable('search', callback);
  };
};

exports.CreateSearches = CreateSearches;
