var CreateSitenodes = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('siteId','string');
          t.column('nodeId','string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('sitenodes', def, callback);
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
    this.dropTable('sitenodes', callback);
  };
};

exports.CreateSitenodes = CreateSitenodes;
