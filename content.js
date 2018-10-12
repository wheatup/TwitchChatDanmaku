'use restrict';

var $logDiv = null;
var $overlay = null;
var layers = [];
var isVideoPlayer = false;
var isVideoChat = false;

var config = {
   enabled: true,
   duration: 5,
   font_size: 24,
   opacity: 1,
   show_username: false,
   textDecoration: 'stroke'
};

function findLogDiv() {
   return new Promise((resolve, reject) => {
      let timer = setInterval(() => {
         let _$logDiv = $('div[role=log]');
         if (_$logDiv && _$logDiv[0]) {
            $logDiv = $(_$logDiv[0]);
            clearInterval(timer);
            isVideoChat = false;
            resolve($logDiv);
         }else{
            _$logDiv = $('ul[class*=tw-align-items-end]');
            if (_$logDiv && _$logDiv[0]) {
               $logDiv = $(_$logDiv[0]);
               clearInterval(timer);
               isVideoChat = true;
               resolve($logDiv);
            }
         }
      }, 500);
   });
}

function createOverlay() {
   return new Promise((resolve, reject) => {
      if ($('#danmaku_overlay') && $('#danmaku_overlay').length > 0) {
         $overlay = $('#danmaku_overlay');
         resolve();
         return;
      }

      let timer = setInterval(() => {
         var streamPlayer = $('.extension-frame-wrapper');
         var videoPlayer = $('.player');
         if (streamPlayer && streamPlayer.length > 0) {
            $(streamPlayer[0]).append('<div id="danmaku_overlay"></div>')
            $overlay = $('#danmaku_overlay');
            clearInterval(timer);
            isVideoPlayer = false;
            resolve();
         }else if (videoPlayer && videoPlayer.length > 0) {
            $(videoPlayer[0]).append('<div id="danmaku_overlay"></div>')
            $overlay = $('#danmaku_overlay');
            clearInterval(timer);
            isVideoPlayer = true;
            resolve();
         }
      }, 500);
   });
}

function digestChatDom(dom) {
   if (!dom) return null;
   let username = $(dom).find('span[data-a-target=chat-message-username]').html();
   if(!username) return;
   if(isVideoChat){
      dom = $(dom).find('.tw-flex-grow-1')[0];
   }
   let content = '';
   let foundUsername = false;
   if(isVideoChat){
      let ele = '';
      if(config.show_username){
         ele = dom;
      }else{
         ele = $(dom).find('div[data-test-selector=comment-message-selector]')[0];
         ele = ele.children[ele.children.length - 1];
      }
      content += ele.outerHTML;
   }else{
      for(var i = 0; i < dom.children.length; i++){
         let ele = dom.children[i];
         if(!config.show_username){
            if(!foundUsername){
               if($(ele).attr('class') && $(ele).attr('class').indexOf('username') >= 0){
                  foundUsername = true;
               }
               continue;
            }
            if($(ele).attr('aria-hidden')){
               continue;
            }
         }
         content += ele.outerHTML;
      }
   }

   var entry = {
      username: username,
      content: content
   }
   return entry;
}

function addNewDanmaku(entry) {
   if (!config.enabled || !entry) return;
   let layer = 0;
   let maxLayer = Math.floor($overlay.height() / (parseInt(config.font_size) + 4)) - 1;
   for (; layer < maxLayer; layer++) {
      if(!layers[layer]){
         layers[layer] = true;
         break;
      }
   }
   if(layer === maxLayer){
      layer = Math.floor(Math.random() * maxLayer);
   }
   setTimeout(() => {
      layers[layer] = false;
   }, Math.floor(config.duration * 500));

   const danmaku = new Danmaku(entry, layer, config);
   danmaku.attachTo($overlay);
}

function start() {
   $logDiv.unbind('DOMNodeInserted');
   $logDiv.bind('DOMNodeInserted', (event) => {
      var newChatDOM = event.target;
      setTimeout(()=>{
         var chatEntry = digestChatDom(newChatDOM);
         addNewDanmaku(chatEntry);
      }, 0);
   });
   // checkDanmaku();
   console.log('Danmanku ready!');
}

function init() {
   findLogDiv().then(createOverlay).then(start);
   chrome.runtime.sendMessage({
      type: "GET_SETTINGS"
   });
}

$(document).ready(() => {
   init();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   switch (request.type) {
      case 'SETTINGS':
         config = request.data;
         $overlay.css('display', config.enabled ? 'block' : 'none');
         break;
      case 'URL_CHANGE':
         init();
         break;
   }
});
