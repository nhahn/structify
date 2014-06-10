var CreateSearchsites = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('searchId', 'string');
          t.column('siteId', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('searchsite', def, callback);
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
    this.dropTable('searchsite', callback);
  };
};

exports.CreateSearchsites = CreateSearchsites;
