chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.command) {
      case 'verify':
        chrome.notifications.clear(ssessionStorage.getItem("notification").notification,
                                   function(){});
    }

  });
