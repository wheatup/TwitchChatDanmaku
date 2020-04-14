let fonts = [];
let settings = { 
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

function sendMessage(type, data, tabId = null) {
	chrome.runtime.sendMessage({ type, data });
	if (tabId) {
		chrome.tabs.sendMessage(tabId, { type, data });
	} else {
		chrome.tabs.query(
			{
				active: true
			},
			tabs => {
				tabs.forEach(tab => {
					chrome.tabs.sendMessage(tab.id, { type, data });
				});
			}
		);
	}
}

chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					new chrome.declarativeContent.PageStateMatcher({
						pageUrl: {
							hostContains: 'twitch'
						}
					})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);
	});
});

function saveSettings() {
	localStorage.setItem('enabled', settings.enabled);
	localStorage.setItem('duration', settings.duration);
	localStorage.setItem('font_size', settings.font_size);
	localStorage.setItem('opacity', settings.opacity);
	localStorage.setItem('show_username', settings.show_username);
	localStorage.setItem('textDecoration', settings.textDecoration);
	localStorage.setItem('bold', settings.bold);
	localStorage.setItem('font', settings.font || 'Default');
	localStorage.setItem('danmaku_density', settings.danmaku_density || 3);
}

function loadSettings() {
	let enabled = localStorage.getItem('enabled');
	// Has saved settings
	if (enabled !== null && enabled !== '' && typeof enabled !== 'undefined') {
		settings.enabled = enabled === 'true' || enabled === true;
		settings.duration = localStorage.getItem('duration');
		settings.font_size = localStorage.getItem('font_size');
		settings.opacity = localStorage.getItem('opacity');
		settings.textDecoration = localStorage.getItem('textDecoration');
		settings.font = localStorage.getItem('font');
		settings.bold = localStorage.getItem('bold') === 'true' || localStorage.getItem('bold') === true;
		settings.show_username = localStorage.getItem('show_username');
		settings.show_username = (settings.show_username === 'true' || settings.show_username === true);
		settings.danmaku_density = localStorage.getItem('danmaku_density');
	} else {
		saveSettings();
	}
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.url) {
		sendMessage('URL_CHANGE', changeInfo.url, tabId);
		loadSettings();
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch (request.type) {
		case 'GET_SETTINGS':
			loadSettings();
			sendMessage('GOT_SETTINGS', settings);
			break;
		case 'UPDATE_SETTINGS':
			settings = request.data;
			saveSettings();
			break;
		case 'GET_FONTS':
			chrome.fontSettings.getFontList(data => {
				fonts = ['Default'];
				for (let font of data) {
					fonts.push(font.displayName);
				}
				sendMessage('GOT_FONTS', fonts);
			});
			break;
	}
});
