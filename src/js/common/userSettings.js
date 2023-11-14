const DEFAULT_SETTINGS = {
	enabled: true,
	duration: 7,
	fontSize: 28,
	opacity: 1,
	showUsername: false,
	textDecoration: 'stroke',
	font: 'Default',
	bold: true,
	danmakuDensity: 3,
	mode: 'default',
	scrollLocation: 'left',
	scrollWidth: 30,
	filters: false
};

let settings = {
	...DEFAULT_SETTINGS
};

export const uploadSettings = (() => {
	let timer;
	return async () => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(async () => {
			await chrome.storage.sync.set({ USER_SETTINGS: settings });
			return settings;
		}, 2000);
	}
})();

export const updateSettings = (update, reset) => {
	settings = { ...(reset ? DEFAULT_SETTINGS : settings), ...update };
	uploadSettings();
	return settings;
};

export const getUserSettings = async () => {
	let onlineSettings = await chrome.storage.sync.get('USER_SETTINGS');
	settings = { ...DEFAULT_SETTINGS, ...onlineSettings?.USER_SETTINGS };
	return settings;
}