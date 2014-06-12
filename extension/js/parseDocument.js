//Override all click events for the page currently selected

var headers = [];

function captureHeaders(e) {
  e.stopPropagation();
  e.preventDefault();

  var clicked = $(e.target);
  clicked.css('background-color', '#CEEDF5');

  if(/H[1-6]/.test(e.target.nodeName)) {
    //OK we are dealing with proper header elements
    //try to identify the rest of them
    $(e.target.nodeName).css('background-color', '#CEEDF5');
    headers = $(e.target.nodeName).toArray();
    //TODO ask for verify?
  } else if ( 'DIV' == e.target.nodeName ) {
    //we are dealing with a div -- probably some class will help us
    //define -- ask for another selection
    if (headers.length > 0) {
      var classes = headers[0].className.split(" ");
      var retVal = [];
      $.each(e.target.className.split(" "), function (idx) {
        if (classes.indexOf(this) > 0) {
          retVal.push(this);
        }
      });
      if (retVal.length > 0)
        headers = $("." + retVal.join(" .")).toArray();
      else {
       //Do something else?
      }
    } else {
      headers.push(e.target);
    }
  }


}

function sendMessage(type) {
   chrome.runtime.sendMessage({target: e.target}, function(response) {

   });
}

document.addEventListener("click", captureHeaders, true);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.command) {
      case 'stop':
        document.removeEventListener("click", captureHeaders, true);
        sendResponse({status: "Script Removed"});
    }
  });
