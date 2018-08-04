var logDiv = null;
var overlay = null;
var danmakus = {};
var isVideoPlayer = false;
var isVideoChat = false;
var count = 0;

var config = {
   enabled: true,
   duration: 5,
   font_size: 24,
   opacity: 1,
   show_username: false,
   textDecoration: 'stroke'
};

window.__danmaku_config__ = config;

var _lastEntry = null;

function findLogDiv() {
   return new Promise((resolve, reject) => {
      let timer = setInterval(() => {
         var _logDiv = $('div[role=log]');
         if (_logDiv && _logDiv[0]) {
            logDiv = $(_logDiv[0]);
            clearInterval(timer);
            isVideoChat = false;
            resolve(logDiv);
         }
         var _logDiv = $('ul[class*=tw-align-items-end]');
         if (_logDiv && _logDiv[0]) {
            logDiv = $(_logDiv[0]);
            clearInterval(timer);
            isVideoChat = true;
            resolve(logDiv);
         }
      }, 500);
   });
}

function createOverlay() {
   return new Promise((resolve, reject) => {
      if ($('#danmaku_overlay') && $('#danmaku_overlay').length > 0) {
         overlay = $('#danmaku_overlay');
         resolve();
         return;
      }

      let timer = setInterval(() => {
         var streamPlayer = $('.extension-frame-wrapper');
         var videoPlayer = $('.player');
         if (streamPlayer && streamPlayer.length > 0) {
            $(streamPlayer[0]).append('<div id="danmaku_overlay"></div>')
            overlay = $('#danmaku_overlay');
            clearInterval(timer);
            isVideoPlayer = false;
            resolve();
         }else if (videoPlayer && videoPlayer.length > 0) {
            $(videoPlayer[0]).append('<div id="danmaku_overlay"></div>')
            overlay = $('#danmaku_overlay');
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
   //let color = '';
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
   if (_lastEntry === entry) return;
   _lastEntry = entry;
   var danmaku = $(`<span class='danmaku' title='${entry.username}'>${entry.content}</span>`);

   let layer = 0;
   for (; layer < 20; layer++) {
      if (!danmakus[`L${layer}`]) {
         danmakus[`L${layer}`] = [];
         danmakus[`L${layer}`].push(danmaku);
         break;
      } else if (danmakus[`L${layer}`].length <= 0) {
         danmakus[`L${layer}`].push(danmaku);
         break;
      } else {
         continue;
      }
   }
   if (layer >= 20) {
      layer = 0;
   }
   setTimeout(() => {
      let l = danmaku.attr('layer');
      if (danmakus[`L${l}`] && danmakus[`L${l}`].indexOf(danmaku) >= 0) {
         danmakus[`L${l}`].splice(danmakus[`L${l}`].indexOf(danmaku), 1);
      }
   }, Math.floor(config.duration * 500));
   danmaku.attr('layer', layer);
   overlay.append(danmaku);
   danmaku.css('height', (parseInt(config.font_size) + 4) + 'px');
   danmaku.css('opacity', config.opacity);
   danmaku.css('animation-duration', `${config.duration}s`);
   danmaku.css('font-size', config.font_size + 'px');
   var top = layer * (parseInt(config.font_size) + 4);
   danmaku.css('top', top + 'px');
   switch(config.textDecoration){
       case 'none':
           danmaku.css('text-shadow', 'none');
           break;
       case 'shadow':
           danmaku.css('text-shadow', '0px 2px 0 black');
           break;
       case 'stroke':
           danmaku.css('text-shadow', '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000');
           break;
   }

   danmaku.one("webkitAnimationEnd oanimationend msAnimationEnd animationend",
      function(event) {
         danmaku.remove();
      }
   );
}

function start() {
   logDiv.unbind('DOMNodeInserted');
   logDiv.bind('DOMNodeInserted', (event) => {
      var newChatDOM = event.target;
      setTimeout(()=>{
         var chatEntry = digestChatDom(newChatDOM);
         addNewDanmaku(chatEntry);
      }, 0);
   });
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
         break;
      case 'URL_CHANGE':
         init();
         break;
   }
});
