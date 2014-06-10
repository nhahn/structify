var Nodes = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Node.all(function(err, nodes) {
      if (err) {
        throw err;
      }
      self.respondWith(nodes, {type:'Node'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , node = geddy.model.Node.create(params);

    if (!node.isValid()) {
      this.respondWith(node);
    }
    else {
      node.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(node, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Node.first(params.id, function(err, node) {
      if (err) {
        throw err;
      }
      if (!node) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(node);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Node.first(params.id, function(err, node) {
      if (err) {
        throw err;
      }
      if (!node) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(node);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Node.first(params.id, function(err, node) {
      if (err) {
        throw err;
      }
      node.updateProperties(params);

      if (!node.isValid()) {
        self.respondWith(node);
      }
      else {
        node.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(node, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Node.first(params.id, function(err, node) {
      if (err) {
        throw err;
      }
      if (!node) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Node.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(node);
        });
      }
    });
  };

};

exports.Nodes = Nodes;
