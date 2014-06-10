var Searches = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Search.all(function(err, searches) {
      if (err) {
        throw err;
      }
      self.respondWith(searches, {type:'Search'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this;
    //Only create a new search if the query is new
    geddy.model.Search.first({query: params["query"]}, function (err,search) {
      if (err) {
        throw err;
      }
      if (search == null) {
        search = geddy.model.Search.create(params);
        if (!search.isValid()) {
          this.respondWith(search);
        }
        else {
          search.save(function(err, data) {
            if (err) {
              throw err;
            }
            self.respondWith(search, {status: err});
          });
        }
      } else {
        self.respondWith(search, {status: err});
      }
    });


  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Search.first(params.id, function(err, search) {
      if (err) {
        throw err;
      }
      if (!search) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(search);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Search.first(params.id, function(err, search) {
      if (err) {
        throw err;
      }
      if (!search) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(search);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Search.first(params.id, function(err, search) {
      if (err) {
        throw err;
      }
      search.updateProperties(params);

      if (!search.isValid()) {
        self.respondWith(search);
      }
      else {
        search.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(search, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Search.first(params.id, function(err, search) {
      if (err) {
        throw err;
      }
      if (!search) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Search.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(search);
        });
      }
    });
  };

};

exports.Searches = Searches;
