var language = window.navigator.userLanguage || window.navigator.language;

function setLocale(){
   let m, tempHtml = document.body.innerHTML;
   while(m = /__MSG_(.+?)__/.exec(tempHtml)){
      tempHtml = tempHtml.replace(m[0], chrome.i18n.getMessage(m[1]));
   }
   tempHtml = tempHtml.replace('__VERSION__', chrome.runtime.getManifest().version);
   document.body.innerHTML = tempHtml;
}

$(document).ready(() => {
   setLocale();
   var enabled = localStorage.getItem('enabled');
   var duration = localStorage.getItem('duration');
   var font_size = localStorage.getItem('font_size');
   var opacity = localStorage.getItem('opacity');
   var show_username = localStorage.getItem('show_username');
   var textDecoration = localStorage.getItem('textDecoration');
   $('#enabled').change(()=>{
      var flag = $("#enabled").prop('checked');
      if(flag){
         $('#further_settings').slideDown(200);
      }else{
         $('#further_settings').slideUp(200);
      }
   });


   $('#enabled').bootstrapToggle({
      on: chrome.i18n.getMessage('enable'),
      off: chrome.i18n.getMessage('disable'),
      size: 'small'
   });

   $('#show_username').bootstrapToggle({
      on: chrome.i18n.getMessage('show'),
      off: chrome.i18n.getMessage('hide'),
      size: 'small'
   });

   if(enabled === undefined || enabled === null){
      $('#enabled').bootstrapToggle('on');
      $('#further_settings').slideDown(200);
      $('#show_username').bootstrapToggle('off');
      $("#duration").val(5);
      $("#font_size").val(24);
      $("#opacity").val(1);
      $("#textDecoration").val('stroke');
      enabled = true;
      duration = 5;
      font_size = 24;
      opacity = 1;
      show_username = false;
      textDecoration = 'stroke';
      localStorage.setItem('enabled', enabled);
      localStorage.setItem('duration', duration);
      localStorage.setItem('font_size', font_size);
      localStorage.setItem('opacity', opacity);
      localStorage.setItem('show_username', show_username);
      localStorage.setItem('textDecoration', textDecoration)
   }else{
      enabled = enabled === 'true' || enabled === true;
      show_username = show_username === 'true' || show_username === true;
      if (enabled) {
         $('#enabled').bootstrapToggle('on');
         $('#further_settings').slideDown(200);
      } else {
         $('#enabled').bootstrapToggle('off');
         $('#further_settings').slideUp(200);
      }
      if (show_username) {
         $('#show_username').bootstrapToggle('on');
      } else {
         $('#show_username').bootstrapToggle('off');
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
      if(textDecoration){
          $('#textDecoration').val(textDecoration);
      }
   }

   var settings = {
      enabled,
      duration,
      font_size,
      opacity,
      show_username,
      textDecoration,
   };

   document.getElementById('enabled').onchange = onEnabledChange;
   document.getElementById('show_username').onchange = onShowUsernameChange;
   document.getElementById('textDecoration').onchange = onTextDecorationChange;

   document.getElementById('duration').onchange = onDurationChange;
   document.getElementById('duration-display').value = document.getElementById('duration').value + chrome.i18n.getMessage('s');
   document.getElementById('font_size').onchange = onFontSizeChange;
   document.getElementById('font_size-display').value = document.getElementById('font_size').value + chrome.i18n.getMessage('px');
   document.getElementById('opacity').onchange = onOpacityChange;
   document.getElementById('opacity-display').value = document.getElementById('opacity').value;


   $('#apply').click(onClickApply);
   $('#rtl').click(onClickResetToDefault);

});

function onClickApply() {
   enabled = $("#enabled").prop('checked');
   show_username = $("#show_username").prop('checked');
   duration = $("#duration").val();
   font_size = $("#font_size").val();
   opacity = $("#opacity").val();
   textDecoration = $('#textDecoration').val();

   var settings = {
      enabled,
      duration,
      font_size,
      opacity,
      show_username,
      textDecoration,
   };

   localStorage.setItem('enabled', enabled);
   localStorage.setItem('duration', duration);
   localStorage.setItem('font_size', font_size);
   localStorage.setItem('opacity', opacity);
   localStorage.setItem('show_username', show_username);
   localStorage.setItem('textDecoration', textDecoration);
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

function onClickResetToDefault() {
   $('#enabled').bootstrapToggle('on');
   $('#show_username').bootstrapToggle('off');
   $("#duration").val(5);
   $("#font_size").val(24);
   $("#opacity").val(1);
   $('#textDecoration').val('stroke');
   document.getElementById('duration-display').value = document.getElementById('duration').value + chrome.i18n.getMessage('s');
   document.getElementById('font_size-display').value = document.getElementById('font_size').value + chrome.i18n.getMessage('px');
   document.getElementById('opacity-display').value = document.getElementById('opacity').value;
   onClickApply();
}

function onDurationChange() {
   $('#duration-display').val(this.value + chrome.i18n.getMessage('s'));
   onClickApply();
}

function onFontSizeChange() {
   $('#font_size-display').val(this.value + chrome.i18n.getMessage('px'));
   onClickApply();
}

function onOpacityChange() {
   $('#opacity-display').val(this.value);
   onClickApply();
}

function onEnabledChange(){
    onClickApply();
}

function onShowUsernameChange(){
    onClickApply();
}

function onTextDecorationChange(){
    onClickApply();
}
