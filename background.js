chrome.runtime.onInstalled.addListener(function() {
   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
         conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
               hostContains: 'twitch'
            },
         })],
         actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
   });
});

function init() {
   var enabled = localStorage.getItem('enabled');
   if (enabled !== undefined && enabled !== null) {
      var duration = localStorage.getItem('duration');
      var font_size = localStorage.getItem('font_size');
      var opacity = localStorage.getItem('opacity');
      var show_username = localStorage.getItem('show_username');

      if (enabled) {
         $("#enabled").prop('checked', true);
      } else {
         $("#enabled").prop('checked', false);
      }
      if (show_username) {
         $("#show_username").prop('checked', true);
      } else {
         $("#show_username").prop('checked', false);
      }
      if (duration) {
         $("#duration").val(duration);
      }
      if (font_size) {
         $("#font_size").val(font_size);
      }
      if (opacity) {
         $("#opacity").val(opacity);
      }

      enabled = enabled === 'true' || enabled === true;
      show_username = show_username === 'true' || show_username === true;



      var settings = {
         enabled: enabled,
         duration: duration,
         font_size: font_size,
         opacity: opacity,
         show_username: show_username
      };

      chrome.tabs.query({
         active: true,
         currentWindow: true
      }, function(tabs) {
         chrome.tabs.sendMessage(tabs[0].id, {
            type: 'SETTINGS',
            data: settings
         });
      });
   }
}


chrome.tabs.onUpdated.addListener(
   function(tabId, changeInfo, tab) {
      if (changeInfo.url) {
         chrome.tabs.sendMessage(tabId, {
            type: 'URL_CHANGE',
            data: {
               url: changeInfo.url
            }
         });
         init();
      }
   }
);

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      switch (request.type) {
         case 'GET_SETTINGS':
            init();
            break;
      }
   }
);
