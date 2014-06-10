var CreateSites = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('title', 'string');
          t.column('url', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('site', def, callback);
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
    this.dropTable('site', callback);
  };
};

exports.CreateSites = CreateSites;
