var headers = [];
var port = chrome.runtime.connect({name: "parser"});
var class_selector = '';
var parent_selector = '';
var node_selector = '';
var prev_level = [$('body')];
var more_information = null;

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
    { name: 'reject', from : 'verify', to: 'fix_capture' },
    { name: 'get_more_information', from: 'verify', to: 'capturing_parent' }
  ],
  callbacks : {
    onstop: function(event, from, to) {
      document.removeEventListener("click", captureHeaders, true);
      window.location.reload();
    },
    onsend_verification: function(event, from, to) {
      port.postMessage({command: 'verify'});
    },
    onconfirm: function(event, from, to) {
      $.each(headers, function(idx) {
      })
      port.postMessage
    },
    onreject: function(event, from, to) {

    },
    onget_more_information: function(event, from, to) {
      port.postMessage({command: 'info'});
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
      selector = e.target.nodeName.toLowerCase();
      $.each(prev_level, function(idx) {
        var nodes = $(this).find(e.target.nodeName);
        nodes.css('background-color', '#CEEDF5');
        headers.push({this: nodes.toArray()});
      });
      fsm.send_verification();
    } else if ( 'DIV' == e.target.nodeName ) {
      //we are dealing with a div -- probably some class will help us
      //define -- ask for another selection
      more_information = e.target;
      selector = e.target.nodeName.toLowerCase();
      fsm.get_more_information();
    }
  } else if (fsm.is('capturing_class')) {
    var classes = more_information.className.split(" ");
    var retVal = [];
    $.each(e.target.className.split(" "), function (idx) {
      if (classes.indexOf(this) > 0) {
        retVal.push(this);
      }
    });
    if (retVal.length > 0) {
      $.each(prev_level, function(idx) {
        var nodes = $(this).find("." + retVal.join(" ."))
        nodes.css('background-color', '#CEEDF5');
        headers.push({this: nodes.toArray()});
      });
      fsm.send_verification();
    } else {
     //Do something else?
    }
  } else if (fsm.is('capturing_parent')) {
    //TODO figure this out for smaller cases ...
    var preNode = headers[0];
    var parent = $(e.target).parents().has(preNode).first();
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
        fsm.reject();
      }
  }
});

//General Messages from the extension
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.command) {
      case 'stop':
        sendResponse({status: 'stopped'});
        fsm.stop();
        break;
    }
  });
