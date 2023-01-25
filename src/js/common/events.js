const eventMap = {};

chrome.runtime.onMessage.addListener(
	({ signal, data }, sender, sendResponse) => {
		if (eventMap[signal]) {
			eventMap[signal].forEach(({ callback, once }) => {
				try {
					callback(data, sender, sendResponse);
				} catch (e) {
					console.error(e);
				}
				if (once) {
					off(signal, callback);
				}
			});
		}
	}
);

export const on = (signal, callback, once) => {
	if (eventMap[signal]) {
		eventMap[signal].push({ callback, once });
	} else {
		eventMap[signal] = [{ callback, once }];
	}
}

export const off = (signal, callback) => {
	if (eventMap[signal]) {
		eventMap[signal] = eventMap[signal].filter(({ callback: cb }) => cb !== callback);
	}
}

export const emit = (signal, data) => {
	try {
		chrome.runtime.sendMessage({ signal, data });
	} catch (ex) {
		console.warn(ex);
	}
	sendToRelativeTabs(signal, data);
}

const getRelativeTabs = async () => {
	return await chrome.tabs.query({ url: '*://*.twitch.tv/*' });
}

export const sendToTab = (tabId, signal, data) => {
	try {
		chrome.tabs.sendMessage(tabId, { signal, data });
	} catch (ex) {
		console.warn(ex);
	}
}

export const sendToRelativeTabs = (signal, data) => {
	getRelativeTabs().then(tabs => {
		if (tabs) {
			tabs.forEach(tab => {
				sendToTab(tab.id, signal, data);
			});
		}
	});
}


export default {
	on, emit, off, sendToTab, sendToRelativeTabs
}