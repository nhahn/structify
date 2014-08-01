var readabilityToken = "f4e78786f91cc233df5c7ace656a6e63f6411217";
var save_notification = "structify-save-page";

/*
 * This is our initial method for when we click the popup -- it determines what we do and
 * loads some of the initial variables
 */
document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var currentTab = tabs[0];
    //Get the state variables for our process
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

/*
 * Checks the state of saving a tab. This determines if we have a tab we were saving and stoped,
 * if we are still saving a tab, or if we are just starting off
 *
 * @prevTab The tab we were/are saving. Can be null is we aren't saving something
 * @currentTab The tab we are on when we clicked the popup
 *
 */
function checkState(prevTab, currentTab) {
  if ( prevTab != null && prevTab.id == currentTab.id) {
    return 'showSave';
  } else if (prevTab != null) {
    clearState(prevTab);
  }
  return 'showSearches';
}

/*
 * Show the "savePage" screen on the popup (this is basically a follow the instructions page)
 * This gets shown when a person selects a query to save with or if they are currently saving this tab
 *
 * @currentTab The tab that we are showing the "showSave" for. We pass this in for state tracking purposes
 */
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

/*
 * Show what searches we have performed in the popup for the user to select
 *
 * @queries The queries that a person has been making on Google
 * @currentTab The tab that the person is selecting the popup on
 */
function showSearches(queries, currentTab){
  //Load our handlebar template into the popup
  getTemplate("searches.hbs",{queries: queries, currentTab: currentTab.id},
    function(html) {
      $('body').html(html);
      //If we have a search associated with this page, automatically scroll to it
      var container = $('#queries');
      var elem = container.find('.selected');
      //If something is selected, scroll to it
      if (elem.length) {
        elem[0].scrollIntoView(true);
      }

      //Add listener for the items to they are selected when clicked and we setup all of the information
      //for the next step
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

/*
 * Stop saving the current tab. If we started saving parts of a page, clear that page
 *
 * @preTab The tab who we were previously saving that we want to clear
 */
function clearState(prevTab){
  //Reset the previous tab and stop the page saving
  chrome.storage.local.get("notification", function(data){
    chrome.notifications.clear(data.notification, function(){});
  });
  chrome.tabs.sendMessage(prevTab.id, {command: 'stop'}, function(){});
  chrome.storage.local.set({"tab": null});
  chrome.storage.local.set({"query": null});
}

/*
 * Runs the content scripts on the particular page. This is the page that we are trying to save
 * using the extension.
 *
 * @tab The tab we want to run the content scripts on. This should be the activeTab
 *      (this is how we are getting permissions to do this)
 */
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
    file: "/js/jquery-2.1.1.min.js" //Need jquery for awesome dom manipulation
  }, function() {
    chrome.tabs.executeScript(tab.id, {
      file: "/js/state-machine.min.js" //We use a state-machine on the page to track where we are in the process
    }, function() {
      chrome.tabs.executeScript(tab.id, {
        file: "/js/parseDocument.js" //This is our custom script that runs on the page -- communicates with domParser.js
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

/*
 * Renders a particular handlebars template using the background handlebars engine.
 *
 * @template The name of the template e.g "searches.hbs"
 * @context The variables to be rendered in the template e.g. {var: [some arr]}
 * @callback The callback with the rendered HTML e.g. function (html) { blah }
 *
 */
function getTemplate(template, context, callback) {
  chrome.runtime.getBackgroundPage( function(page) {
    page.renderTemplate(template,context,callback);
  });
}

/*
 * Grabs the URL from the tab and renders the readability version in the background
 * #readability container
 *
 * @currentTab The tab to render readability
 * @callback Once the page is rendered, passes the html container with the readability
 *           document e.g. function(elem) { blah }
 */
function insertReadability(currentTab, callback) {
  var req = new XMLHttpRequest();
  var uri = "https://www.readability.com/api/content/v1/parser?url=";
  uri += encodeURIComponent(currentTab.url);
  uri += "&token="+readabilityToken;
  req.open("GET",uri,true);
  req.onload = function () {
    var retVal = JSON.parse(this.responseText);
    chrome.runtime.getBackgroundPage( function (backgroundPage){
      var container = $(backgroundPage.document).find('#readability').html(retVal.content);
      callback(container);
    });
  };
  req.send();
}

