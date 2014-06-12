// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var readabilityToken = "f4e78786f91cc233df5c7ace656a6e63f6411217";
var save_notification = "structify-save-page";

document.addEventListener('DOMContentLoaded', function () {

  //Grab the readability version of the current tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var currentTab = tabs[0];
    //Show the searches we have been performing
    chrome.storage.local.get(['queries','tab','query'], function (data) {
      var queries = data.queries;
      var prevTab = data.tab;

      //First, check if we are currently saving data for this tab
      if ( prevTab != null && prevTab.id == currentTab.id)
      {
        getTemplate("savePage.hbs",{}, function(html) {
          $('body').html(html);
        });
        return;
      } else if (prevTab != null) {
        //Reset the previous tab and stop the page saving
        chrome.notifications.clear(sessionStorage.getItem("notification").notification,
                                   function() {});
        chrome.tabs.sendMessage(prevTab, {command: 'stop'}, function(){});
        chrome.storage.local.set({"tab": null});
        chrome.stroage.local.set({"query": null});
      }

      getTemplate("searches.hbs",{queries: queries, currentTab: currentTab.id},
        function(html) {
          $('body').html(html);
          $('#queries li').click(function(e) {
            var prevElem = $(this).parent().find('.selected')
            prevElem.removeClass('selected');
            prevElem.text(prevElem.find('div').text());
            $(this).html('<span class="glyphicon glyphicon-ok"></span><div>'+$(this).text()+'</div>');
            $(this).addClass('selected');
          });
          $('#nextStep').click(function(e) {
            chrome.storage.local.set({"tab": currentTab});
            chrome.storage.local.set({"query": queries[$('#queries')
                                               .find('.selected').index('li')]});
            var notification = {
              type: "basic",
              title: "Saving Page",
              message: "Select the content section headers",
              iconUrl: "/img/structify_medium.png",
              priority: 2,
              buttons: [{"title": "Stop"}]
            };
            getTemplate("savePage.hbs",{}, function(html) {
              $('body').html(html);
            });
            //Execute the content scripts to hightlight the pre-defined places on the page
            chrome.tabs.executeScript(currentTab.id, {
              file: "/js/jquery-2.1.1.min.js"
            }, function() {
              //This is executed after jquery is completely loaded
              chrome.tabs.executeScript(currentTab.id, {
                file: "/js/parseDocument.js"
              });
            });
            chrome.storage.local.set({"notification": save_notification});
            chrome.notifications.create(save_notification, notification,
              function (notification) {
              });
          });
        });
    });
  });
});

function createSearch(tabId, query, callback) {
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

function getTemplate(template, context, callback) {
  chrome.runtime.getBackgroundPage( function(page) {
    page.renderTemplate(template,context,callback);
  });
}

function insertReadability(currentTab) {
  var req = new XMLHttpRequest();
  var uri = "https://www.readability.com/api/content/v1/parser?url=";
  uri += encodeURIComponent(currentTab.url);
  uri += "&token="+readabilityToken;
  req.open("GET",uri,true);
  req.onload = function () {
    var retVal = JSON.parse(this.responseText);
    chrome.runtime.getBackgroundPage( function (backgroundPage){
      $(backgroundPage.document).find('#readability').html(retVal.content);
    });
  };
  req.send();
}

