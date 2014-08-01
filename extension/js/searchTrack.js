/*
 * This file keeps track of the Google searches a person performs in the background. It saves them
 * in the local storage in the "queries" variable
 */

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url != undefined || changeInfo.url != null) {
    var matches = changeInfo.url.match(/www\.google\.com\/.*q=(.*?)($|&)/);
    //We have found a new search
    if (matches != null) {
      var query = decodeURIComponent(matches[1].replace(/\+/g," "));
      //Store queries in the local storage
      chrome.storage.local.get("queries", function (q) {
        q.queries = q.queries || [];
        q.queries.unshift({"query": query, "tabId": tabId, "date": Date.now()});
        //now look at the rest of the items in the array
        for(var i = 1; i < q.queries.length; i++) {
          //we've already performed this query, try and keep as much from the previous
          //instance as possible
          if (q.queries[i].query == query) {
            var elem = q.queries[i];
            q.queries.splice(i, 1);
            q.queries[0] = elem;
            q.queries[0].tabId = tabId;
            q.queries[0].date = Date.now();
          }
          //We have performed a search on this tab before -- we need to unassociate
          //the previous search
          if (q.queries[i].tabId == tabId) {
            q.queries[i].tabId = -1;
          }
        }
        // If the array is getting bigger than 25 elements, remove the last one
        if (q.queries.length > 25) {
          q.queries.pop();
        }
        chrome.storage.local.set({"queries": q.queries});
      });
    }
  }

});
