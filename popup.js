var language = window.navigator.userLanguage || window.navigator.language;
let settings = null;
let fonts = null;

function setLocale() {
	let m,
		tempHtml = document.body.innerHTML;
	while ((m = /__MSG_(.+?)__/.exec(tempHtml))) {
		tempHtml = tempHtml.replace(m[0], chrome.i18n.getMessage(m[1]));
	}
	tempHtml = tempHtml.replace('__VERSION__', chrome.runtime.getManifest().version);
	document.body.innerHTML = tempHtml;
}

function sendMessage(type, data, tabId = null) {
	chrome.runtime.sendMessage({ type, data });
	if (tabId) {
		chrome.tabs.sendMessage(tabId, { type, data });
	} else {
		chrome.tabs.query(
			{
				active: true,
				currentWindow: true
			},
			tabs => {
				tabs.forEach(tab => {
					chrome.tabs.sendMessage(tab.id, { type, data });
				});
			}
		);
	}
}

function onGotSettings() {
	$('#duration').val(settings.duration);
	$('#font').val(settings.font);
	$('#font_size').val(settings.font_size);
	$('#opacity').val(settings.opacity);
	$('#enabled').bootstrapToggle(settings.enabled ? 'on' : 'off');
	$('#show_username').bootstrapToggle(settings.show_username ? 'on' : 'off');
	$('#textDecoration').val(settings.textDecoration);
	$('#danmaku_density').val(settings.danmaku_density);
	$('#bold').bootstrapToggle(settings.bold ? 'on' : 'off');
	apply();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.type) {
		case 'GOT_SETTINGS':
			settings = request.data;
			onGotSettings();
			break;
		case 'GOT_FONTS':
      if (request.data.length > 0) {
        request.data.forEach((font) =>
          $("#font").append(
            `<option value="${font}"${
              settings.font === font ? ' selected="selected"' : ""
            }>${
              font === "Default" ? chrome.i18n.getMessage("default") : font
            }</option>`
          )
        );
      } else {
        $("#font").closest("li").hide();
      }
			break;
	}
});

$(document).ready(() => {
	setLocale();
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

	document.getElementById('enabled').onchange = onEnabledChange;
	document.getElementById('show_username').onchange = onShowUsernameChange;
	document.getElementById('textDecoration').onchange = onTextDecorationChange;
	document.getElementById('danmaku_density').oninput = onDanmakuDensityChange;
	document.getElementById('font').onchange = onFontChange;
	document.getElementById('bold').onchange = onBoldChange;

	document.getElementById('duration').oninput = onDurationChange;
	document.getElementById('duration-display').value = document.getElementById('duration').value + chrome.i18n.getMessage('s');
	document.getElementById('font_size').oninput = onFontSizeChange;
	document.getElementById('font_size-display').value = document.getElementById('font_size').value + chrome.i18n.getMessage('px');
	document.getElementById('opacity').oninput = onOpacityChange;
	document.getElementById('opacity-display').value = document.getElementById('opacity').value;
	document.getElementById('danmaku_density-display').value = chrome.i18n.getMessage('lblDanmakuDensity_' + document.getElementById('danmaku_density').value);

	$('#rtl').click(onClickResetToDefault);

	sendMessage('GET_FONTS');
	sendMessage('GET_SETTINGS');
});

function apply() {
	if (settings.enabled) {
		$('#further_settings').slideDown(200);
	} else {
		$('#further_settings').slideUp(200);
	}
	$('#duration-display').val(settings.duration + chrome.i18n.getMessage('s'));
	$('#font_size-display').val(settings.font_size + chrome.i18n.getMessage('px'));
	$('#opacity-display').val(settings.opacity);
	$('#danmaku_density-display').val(chrome.i18n.getMessage('lblDanmakuDensity_' + settings.danmaku_density));
}

function onClickResetToDefault() {
	settings = { 
		enabled: true, 
		duration: 7, 
		font_size: 28, 
		opacity: 1, 
		show_username: false, 
		textDecoration: 'stroke', 
		font: 'Default', 
		bold: true, 
		danmaku_density: 3 
	};

	$('#duration').val(settings.duration);
	$('#font').val(settings.font);
	$('#font_size').val(settings.font_size);
	$('#opacity').val(settings.opacity);
	$('#bold').bootstrapToggle(settings.bold ? 'on' : 'off');
	$('#enabled').bootstrapToggle(settings.enabled ? 'on' : 'off');
	$('#show_username').bootstrapToggle(settings.show_username ? 'on' : 'off');
	$('#textDecoration').val(settings.textDecoration);
	$('#danmaku_density').val(settings.danmaku_density);
	apply();
	sendMessage('UPDATE_SETTINGS', settings);
}

function onDurationChange() {
	settings.duration = this.value;
	apply();
	sendMessage('UPDATE_SETTINGS', settings);
}

function onFontSizeChange() {
	settings.font_size = this.value;
	apply();
	sendMessage('UPDATE_SETTINGS', settings);
}

function onFontChange() {
	settings.font = this.value;
	apply();
	sendMessage('UPDATE_SETTINGS', settings);
}

function onBoldChange(){
	settings.bold = $('#bold').prop('checked');
	apply();
	sendMessage('UPDATE_SETTINGS', settings);
}

function onOpacityChange() {
	settings.opacity = this.value;
	apply();
	sendMessage('UPDATE_SETTINGS', settings);
}

function onEnabledChange() {
	settings.enabled = $('#enabled').prop('checked');
	apply();
	sendMessage('UPDATE_SETTINGS', settings);
}

function onShowUsernameChange() {
	settings.show_username = $('#show_username').prop('checked');
	apply();
	sendMessage('UPDATE_SETTINGS', settings);
}

function onTextDecorationChange() {
	settings.textDecoration = $('#textDecoration').val();
	apply();
	sendMessage('UPDATE_SETTINGS', settings);
}


function onDanmakuDensityChange() {
	settings.danmaku_density = $('#danmaku_density').val();
	apply();
	sendMessage('UPDATE_SETTINGS', settings);
}
