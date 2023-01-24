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
	chrome.runtime.sendMessage({ signal, data });
	sendToRelativeTabs(signal, data);
}

const getRelativeTabs = async () => {
	return await chrome.tabs.query({ url: '*://*.twitch.tv/*' });
}

export const sendToTab = (tabId, signal, data) => {
	chrome.tabs.sendMessage(tabId, { signal, data });
}

export const sendToRelativeTabs = (signal, data) => {
	getRelativeTabs().then(tabs => {
		if (tabs) {
			tabs.forEach(tab => {
				chrome.tabs.sendMessage(tab.id, { signal, data });
			});
		}
	});
}


export default {
	on, emit, off, sendToTab, sendToRelativeTabs
}