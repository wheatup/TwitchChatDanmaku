const DEFAULT_SETTINGS = {
	enabled: true,
	duration: 7,
	fontSize: 28,
	opacity: 1,
	showUsername: false,
	textDecoration: 'stroke',
	font: 'Default',
	bold: true,
	danmakuDensity: 3
};

let settings = {
	...DEFAULT_SETTINGS
};

export const updateSettings = async (update, reset) => {
	const USER_SETTINGS = { ...(reset ? DEFAULT_SETTINGS : settings), ...update };
	await chrome.storage.sync.set({ USER_SETTINGS });
	return USER_SETTINGS;
};

export const getUserSettings = async () => {
	let onlineSettings = await chrome.storage.sync.get('USER_SETTINGS');
	settings = { ...DEFAULT_SETTINGS, ...onlineSettings?.USER_SETTINGS };
	return settings;
}