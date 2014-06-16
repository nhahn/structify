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
    { name: 'confirm', from: 'verify', to: 'guess_headers' },
    { name: 'reject', from: 'verify', to: 'fixing_capture' },
    { name: 'done_fixing', from: 'fix_capture', to: 'guess_headers' },
    { name: 'confirm', from: 'verify', to: 'capturing_parent' }
  ],
  callbacks : {
    onstop: function(event, from, to) {
      document.removeEventListener("click", captureHeaders, true);
      window.location.reload();
    },
    onsend_verification: function(event, from, to) {
      port.postMessage({command: 'verify'});
    },
    onreject: function(event, from, to) {
      port.postMessage({command: 'redo'});
    },
    onget_more_information: function(event, from, to) {
      port.postMessage({command: 'info'});
    },
    onconfirm: function(event, from, to) {
      //Take the previous headers, and set them to the prev_level
      prev_level = headers;
      storeData();
      headers = [];
      return StateMachine.ASYNC;
    },
    onguess_headers: function(event, from, to) {
      post.postMessage({command: 'subheaders'});
    }
  }
});

//Override all click events for the page currently selected
function captureHeaders(e) {
  e.stopPropagation();
  e.preventDefault();

  switch (true) {
    case fsm.is('capturing_headers'):
      var clicked = $(e.target);
      clicked.css('background-color', '#CEEDF5');

      if(/H[1-6]/.test(e.target.nodeName)) {
        //OK we are dealing with proper header elements
        //try to identify the rest of them
        selector = e.target.nodeName.toLowerCase();
        $.each(prev_level, function(idx) {
          var nodes = $(this).find(e.target.nodeName);
          nodes.css('background-color', '#CEEDF5');
          headers.push({children: nodes.toArray(), parent: this});
        });
        fsm.send_verification();
      } else if ( 'DIV' == e.target.nodeName ) {
        //we are dealing with a div -- probably some class will help us
        //define -- ask for another selection
        more_information = e.target;
        selector = e.target.nodeName.toLowerCase();
        fsm.get_more_information();
      }
      break;
    case fsm.is('capturing_class'):
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
      }
      break;
    case fsm.is('fixing_capture'):
      var elem = null;
      for (var i = 0; i < headers.length; i++){
        if(headers[i] === e.target){
          elem = e.target;
          $(e.target).css('background-color','');
          headers.splice(i,1);
          break;
        }
      }
      //We didn't remove anything -- we must be adding
      //If we removed -- should we bother with trying to find the common ancestor?
      if (elem == null) {
        $(e.target).css('background-color','#CEEDF5');
        headers.push(e.target);
        //TODO figure out this logic -- not really sure what it could be?
      }
      break;
    case fsm.is('capturing_parent'):
      var preNode = headers[0];
      var parent = $(e.target).parents().has(preNode).first();
      break;
  }
}

function storeData() {
  //send the data we've colleced to the background script
  var ret = [];
  $.each(headers, function(idx) {
    var parent = { name: $(this.parent)[0].nodeName.toLowerCase(),
                   content: $(this.parent).text(),
                   classes: $(this.parent)[0].className.split(' ')
                 };
    var children = [];
    $.each(this.children, function(idx) {
      children.push({name: this.nodeName.toLowerCase(), classes: this.className.split(' '), content: $(this).text()});
    });
    parent.children = children;
    ret.push(parent);
  });
  port.postMessage({command: 'store', data: ret});
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

function commonParents(nodes) {
  if (!(nodes instanceof Array) || nodes.length < 1){
    return [];
  }
  var arr = nodes.slice();
  if (nodes.length == 1){
    return $(nodes[0]).parents();
  } else {
    var elem = nodes[0];
    arr.splice(0,1);
    return commonParents(arr).has(elem);
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
      break;
    case 'fixing':
      if (msg.reponse == 'done') {
        fsm.confirm();
      }
      break;
    case 'doneStoring':
      fsm.transition();
      break;
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
