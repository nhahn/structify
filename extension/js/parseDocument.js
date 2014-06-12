var headers = [];
var port = chrome.runtime.connect({name: "parser"});

//Also we are going to do everything with an FSM to help keep track of
//everything
var fsm = StateMachine.create({
  initial: 'capturing_headers',
  events: [
    { name: 'stop', from: ['capturing_headers', 'verify', 'capturing_class', 'fix_capture'], to: 'stop_save' },
    { name: 'get_more_information', from: 'capturing_headers', to: 'capturing_class' },
    { name: 'send_verification', from: 'capturing_headers', to: 'verify' },
    { name: 'send_verification', from: 'capturing_class', to: 'verify' },
    { name: 'confirm', from: 'verify', to: 'capturing_headers' },
    { name: 'reject', from : 'verify', to: 'fix_capture'}
  ],
  callbacks : {
    onstop: function(event, from, to) {
      document.removeEventListener("click", captureHeaders, true);
      sendResponse({status: "Script Removed"});
      window.location.reload();
    },
    onsend_verification: function(event, from, to) {
      port.postMessage({command: 'verify'});
    }
  }
});

//Override all click events for the page currently selected
function captureHeaders(e) {
  e.stopPropagation();
  e.preventDefault();

  if (fsm.is('capturing_headers')) {
    var clicked = $(e.target);
    clicked.css('background-color', '#CEEDF5');

    if(/H[1-6]/.test(e.target.nodeName)) {
      //OK we are dealing with proper header elements
      //try to identify the rest of them
      $(e.target.nodeName).css('background-color', '#CEEDF5');
      headers = $(e.target.nodeName).toArray();
      fsm.send_verification();
    } else if ( 'DIV' == e.target.nodeName ) {
      //we are dealing with a div -- probably some class will help us
      //define -- ask for another selection
      headers.push(e.target);
      fsm.get_more_information();
    }
  } else if (fsm.is('capturing_class')) {
    var classes = headers[0].className.split(" ");
    var retVal = [];
    $.each(e.target.className.split(" "), function (idx) {
      if (classes.indexOf(this) > 0) {
        retVal.push(this);
      }
    });
    if (retVal.length > 0)
      $("." + retVal.join(" .")).css('background-color', '#CEEDF5');
      headers = $("." + retVal.join(" .")).toArray();
      fsm.send_verification();
    else {
     //Do something else?
    }
  }
}

document.addEventListener("click", captureHeaders, true);

//Specific messages from the port -- aka contact with the background page
port.onMessage.addListener(function(msg) {
  switch (msg.command) {
    case 'verify':
      if (msg.response == 'yes') {
        fsm.confirm();
      } else {
        fms.reject();
      }
  }
});

//General Messages from the extension
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.command) {
      case 'stop':
        fsm.stop();
    }
  });
