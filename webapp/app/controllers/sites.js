var Sites = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Site.all(function(err, sites) {
      if (err) {
        throw err;
      }
      self.respondWith(sites, {type:'Site'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , site = geddy.model.Site.create(params);

    if (!site.isValid()) {
      this.respondWith(site);
    }
    else {
      site.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(site, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Site.first(params.id, function(err, site) {
      if (err) {
        throw err;
      }
      if (!site) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(site);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Site.first(params.id, function(err, site) {
      if (err) {
        throw err;
      }
      if (!site) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(site);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Site.first(params.id, function(err, site) {
      if (err) {
        throw err;
      }
      site.updateProperties(params);

      if (!site.isValid()) {
        self.respondWith(site);
      }
      else {
        site.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(site, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Site.first(params.id, function(err, site) {
      if (err) {
        throw err;
      }
      if (!site) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Site.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(site);
        });
      }
    });
  };

};

exports.Sites = Sites;
