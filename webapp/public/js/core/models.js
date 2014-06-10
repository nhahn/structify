(function () {
var Node = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    content: {type: 'text'}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Node.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Node.someStaticMethod = function () {
  // Do some other stuff
};
Node.someStaticProperty = 'YYZ';
*/

Node = geddy.model.register('Node', Node);
}());

(function () {
var Search = function () {

  this.defineProperties({
    query: {type: 'string', required: true}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Search.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Search.someStaticMethod = function () {
  // Do some other stuff
};
Search.someStaticProperty = 'YYZ';
*/

Search = geddy.model.register('Search', Search);
}());

(function () {
var Searchsite = function () {

  this.defineProperties({
    searchId: {type: 'int'},
    siteId: {type: 'int'}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Searchsite.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Searchsite.someStaticMethod = function () {
  // Do some other stuff
};
Searchsite.someStaticProperty = 'YYZ';
*/

exports.Searchsite = Searchsite;

}());

(function () {
var Site = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    url: {type: 'string'}
  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Site.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Site.someStaticMethod = function () {
  // Do some other stuff
};
Site.someStaticProperty = 'YYZ';
*/

Site = geddy.model.register('Site', Site);
}());

(function () {
var Sitenode = function () {

  this.defineProperties({

  });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Sitenode.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Sitenode.someStaticMethod = function () {
  // Do some other stuff
};
Sitenode.someStaticProperty = 'YYZ';
*/

exports.Sitenode = Sitenode;

}());
