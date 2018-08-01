$(document).ready(() => {
   var enabled = localStorage.getItem('enabled');
   var duration = localStorage.getItem('duration');
   var font_size = localStorage.getItem('font_size');
   var opacity = localStorage.getItem('opacity');

   $('#enabled').bootstrapToggle({
      on: 'Enabled',
      off: 'Disabled',
      size: 'small'
   });

   if (enabled === 'false' || !enabled) {
      $('#enabled').bootstrapToggle('off');
   } else {
      $('#enabled').bootstrapToggle('on');
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

   var settings = {
      enabled: enabled,
      duration: duration,
      font_size: font_size,
      opacity: opacity
   };

   document.getElementById('duration').onchange = onDurationChange;
   document.getElementById('duration-display').value = document.getElementById('duration').value + 's';
   document.getElementById('font_size').onchange = onFontSizeChange;
   document.getElementById('font_size-display').value = document.getElementById('font_size').value + 'px';
   document.getElementById('opacity').onchange = onOpacityChange;
   document.getElementById('opacity-display').value = document.getElementById('opacity').value;

   $('#apply').click(onClickApply);
   $('#rtl').click(onClickResetToDefault);

});

function onClickApply() {
   enabled = $("#enabled").prop('checked');
   duration = $("#duration").val();
   font_size = $("#font_size").val();
   opacity = $("#opacity").val();

   var settings = {
      enabled: enabled,
      duration: duration,
      font_size: font_size,
      opacity: opacity
   };

   localStorage.setItem('enabled', enabled);
   localStorage.setItem('duration', duration);
   localStorage.setItem('font_size', font_size);
   localStorage.setItem('opacity', opacity);

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
   $("#duration").val(5);
   $("#font_size").val(16);
   $("#opacity").val(1);
   document.getElementById('duration-display').value = document.getElementById('duration').value + 's';
   document.getElementById('font_size-display').value = document.getElementById('font_size').value + 'px';
   document.getElementById('opacity-display').value = document.getElementById('opacity').value;
   onClickApply();
}

function onDurationChange() {
   $('#duration-display').val(this.value + 's');
}

function onFontSizeChange() {
   $('#font_size-display').val(this.value + 'px');
}

function onOpacityChange() {
   $('#opacity-display').val(this.value);
}
