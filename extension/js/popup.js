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
      switch (checkState(prevTab, currentTab)){
        case 'showSearches':
          showSearches(queries, currentTab);
          break;
        case 'showSave':
          showSave(currentTab);
          break;
      }
    });
  });
});

function checkState(prevTab, currentTab) {
  if ( prevTab != null && prevTab.id == currentTab.id) {
    return 'showSave';
  } else if (prevTab != null) {
    clearState(prevTab);
  }
  return 'showSearches';
}

function showSave(currentTab) {
  getTemplate("savePage.hbs",{}, function(html) {
    $('body').html(html);
    $('#back').click(function() {
      chrome.storage.local.get(['queries','tab'], function (data) {
        clearState(data.tab);
        showSearches(data.queries,currentTab);
      });
    });
    $('#stop').click(function() {
      chrome.storage.local.get(['tab'], function (data) {
        clearState(data.tab);
        window.close();
      });
    });

  });
}

function showSearches(queries, currentTab){
  getTemplate("searches.hbs",{queries: queries, currentTab: currentTab.id},
    function(html) {
      $('body').html(html);
      var container = $('#queries');
      var elem = container.find('.selected');
      //If something is selected, scroll to it
      if (elem.length) {
        elem[0].scrollIntoView(true);
      }

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
        runContent(currentTab);
      });
    });
}

function clearState(prevTab){
  //Reset the previous tab and stop the page saving
  chrome.storage.local.get("notification", function(data){
    chrome.notifications.clear(data.notification, function(){});
  });
  chrome.tabs.sendMessage(prevTab.id, {command: 'stop'}, function(){});
  chrome.storage.local.set({"tab": null});
  chrome.storage.local.set({"query": null});
}

function runContent(tab){
  var notification = {
  type: "basic",
  title: "Saving Page",
  message: "Select the content section headers",
  iconUrl: "/img/structify_medium.png",
  priority: 2,
  buttons: [{"title": "Stop"}]
  };
  //Execute the content scripts to hightlight the pre-defined places on the page
  chrome.tabs.executeScript(tab.id, {
    file: "/js/jquery-2.1.1.min.js"
  }, function() {
    chrome.tabs.executeScript(tab.id, {
      file: "/js/state-machine.min.js"
    }, function() {
      chrome.tabs.executeScript(tab.id, {
        file: "/js/parseDocument.js"
      }, function(){
        //Signal we are ready by showing the notification and changing the page
        showSave(tab);
        chrome.storage.local.set({"notification": save_notification});
        chrome.notifications.create(save_notification, notification,
          function (notification) { });
      });
    });
  });
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

