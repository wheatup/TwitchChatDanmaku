var logDiv = null;
var overlay = null;
var danmakus = {};
var isVideo = false;
var count = 0;

var config = {
   enabled: true,
   duration: 5,
   font_size: 16,
   opacity: 1
};

window.__danmaku_config__ = config;

var _lastEntry = null;

function findLogDiv() {
   return new Promise((resolve, reject) => {
      let timer = setInterval(() => {
         if(!isVideo){
            var _logDiv = $('div[role=log]');
            if (_logDiv && _logDiv[0]) {
               logDiv = $(_logDiv[0]);
               clearInterval(timer);
               resolve(logDiv);
            }
         }else{
            var _logDiv = $('ul[class*=tw-align-items-end]');
            if (_logDiv && _logDiv[0]) {
               logDiv = $(_logDiv[0]);
               clearInterval(timer);
               resolve(logDiv);
            }
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
         var player = isVideo ? $('.player') : $('.extension-frame-wrapper');
         if (player && player.length > 0) {
            $(player[0]).append('<div id="danmaku_overlay"></div>')
            overlay = $('#danmaku_overlay');
            clearInterval(timer);
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
   if(isVideo && dom.tagName === 'LI'){
      dom = $(dom).find('div[data-test-selector=comment-message-selector]')[0].children[$(dom).find('div[data-test-selector=comment-message-selector]')[0].children.length - 1];
   }else{
      dom = $(dom).find('span[data-a-target=chat-message-text]')[0];
   }
   let content = dom.outerHTML;

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
   isVideo = window.location.href.indexOf('/videos/') >= 0;
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
         config.enabled = request.data.enabled;
         config.duration = request.data.duration;
         config.font_size = request.data.font_size;
         config.opacity = request.data.opacity;
         break;
      case 'URL_CHANGE':
         init();
         break;
   }
});
