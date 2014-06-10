document.addEventListener('DOMContentLoaded', function () {
  var renderQueue = {};

  window.renderTemplate = function(template, context, callback) {
    var req = new XMLHttpRequest();
    var uri = "/templates/"+template;
    req.open("GET",uri,true);
    req.onload = function () {
      var template = this.responseText;
      var iframe = document.getElementById('sandbox');
      var message = {
        command: 'render',
        context: context,
        template: template,
        id: Date.now()
      };
      renderQueue[message.id] = callback;
      iframe.contentWindow.postMessage(message, '*');
    }
    req.send();
  };

  window.addEventListener('message', function(event) {
    if (event.data.html) {
      renderQueue[event.data.id](event.data.html);
      delete renderQueue[event.data.id];
    }
  });
});

