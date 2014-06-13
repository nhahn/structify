chrome.runtime.onConnect.addListener( function(port) {
  console.assert(port.name == "parser");
  port.onMessage.addListener(function(msg) {
    switch(msg.command) {
      case 'verify':
        clearNotification();
        var notification = {
          type: "basic",
          title: "Verify Choices",
          message: "I tried to guess the rest of the headers based on your input. Do these look right?",
          iconUrl: "/img/structify_medium.png",
          priority: 2,
          buttons: [{"title": "Yes"}, {"title": "No"}]
        };
        chrome.notifications.create("structify-verify-page", notification,
          function (){});
        break;
      case 'info':
        clearNotification();
        var notification = {
          type: "basic",
          title: "More Information",
          message: "In order to make a good guess, could you select another header?",
          iconUrl: "/img/structify_medium.png",
          priority: 2,
          buttons: [{"title": "Stop"}]
        };
        chrome.notifications.create("structify-more-info", notification,
          function (){});
        break;
    }
  });
  chrome.notifications.onButtonClicked.addListener(
  function(notificationId, buttonIndex) {
    chrome.notifications.clear(notificationId,function() {});
    switch(notificationId)
    {
      case 'structify-save-page':
        stopScript();
        break;
      case 'structify-more-info':
        stopScript();
        break;
      case 'structify-verify-page':
        switch(buttonIndex) {
          case 0:
            port.postMessage({command: 'verify', response: 'yes'});
            break;
            //TODO guess the smaller headings
          case 1: //No
            port.postMessage({command: 'verify', response: 'no'});
            break;
            //TODO redo the larger headings
        }
        break;
    }
  });
});

function stopScript() {
  chrome.storage.local.get("tab", function (data) {
    chrome.tabs.sendMessage(data.tab.id, {command: 'stop'}, function(){});
  });
  chrome.storage.local.set({"tab": null});
  chrome.storage.local.set({"query": null});
}

function clearNotification() {
  chrome.storage.local.get("notification", function(data){
    chrome.notifications.clear(data.notification, function(){});
  });
}

function Page(url, title, query) {
  this.url = url;
  this.title = title;
  this.query = query;
  this.headers = [];
}

Page.prototype.addHeader = function(header) {
  this.headers.push(header);
}

Page.prototype.send = function() {
  var req = new XMLHttpRequest();
  req.open("POST", "http://localhost:4000/searches.json", true);
  //req.onload = this.showPhotos_.bind(this);
  req.setRequestHeader("Content-type", "application/json");
  req.onload = function () {
    var json = JSON.parse(this.responseText);
    chrome.storage.local.get("queries", function (q) {
      q.queries = q.queries || [];
      q.queries[tabId]["queryId"] = json.id;
      chrome.storage.local.set({"queries": q.queries});
    });
    callback(json);
  };
  req.send(JSON.stringify({query: query}));
}

function Header(title, parent, content) {
  this.title = title;
  this.parent = parent;
  this.content = content;
  this.children = [];
  parent.addHeader(this);
}

Header.prototype.addHeader = function(header) {
  this.children.push(header);
}
