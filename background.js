function init(){
   var enabled = localStorage.getItem('enabled');
   if(enabled !== undefined){
      var duration = localStorage.getItem('duration');
      var font_size = localStorage.getItem('font_size');
      var opacity = localStorage.getItem('opacity');

      if(enabled){
         $("#enabled").prop('checked', true);
      }else{
         $("#enabled").removeAttr('checked');
      }
      if(duration){
         $("#duration").val(duration);
      }
      if(font_size){
         $("#font_size").val(font_size);
      }
      if(opacity){
         $("#opacity").val(opacity);
      }

      var settings = {
         enabled: enabled,
         duration: duration,
         font_size: font_size,
         opacity: opacity
      };

      chrome.tabs.query({
         active: true,
         currentWindow: true
      }, function(tabs) {
         chrome.tabs.sendMessage(tabs[0].id, {type: 'SETTINGS', data: settings});
      });
   }
}


chrome.tabs.onUpdated.addListener(
   function(tabId, changeInfo, tab) {
      if (changeInfo.url) {
         chrome.tabs.sendMessage(tabId, {
            type: 'URL_CHANGE',
            data: {url: changeInfo.url}
         }, function(){
            init();
         });
      }
   }
);
