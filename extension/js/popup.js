// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var readabilityToken = "f4e78786f91cc233df5c7ace656a6e63f6411217";


document.addEventListener('DOMContentLoaded', function () {

  //Grab the readability version of the current tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var currentTab = tabs[0];
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

    //Show the searches we have been performing
    chrome.storage.local.get("queries", function (data) {
      var queries = data.queries;
      getTemplate("searches.hbs",{queries: queries, currentTab: currentTab.id},function(html) {
        $('body').html(html);
      });
    });

    //Execute the content scripts to hightlight the pre-defined places on the page
    //from readability
    chrome.tabs.executeScript(currentTab.id, {
      file: "/js/jquery-2.1.1.min.js"
    }, function() {
      //This is executed after jquery is completely loaded
      chrome.tab.executeScript(currentTab.id, {
        file: "/js/parseDocument.js"
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

