let reset = false;
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

const updateSettings = (update, overwrite) => {
	settings = overwrite ? update : { ...settings, ...update };
	chrome.storage.sync.set({ _9gag_settings: settings });
	sendMessage('SETTINGS_UPDATED', settings);
};

export const getUserSettings = async () => {
	let settings = { ...DEFAULT_SETTINGS };
	await chrome.storage.sync.get(['_tcd_settings'], ({ _tcd_settings }) => {
		if (!_tcd_settings || reset) {
			updateSettings(DEFAULT_SETTINGS, true);
		} else if (Object.entries(DEFAULT_SETTINGS).some(([key, value]) => typeof _tcd_settings[key] !== typeof value)) {
			const updateKeys = Object.keys(DEFAULT_SETTINGS).filter(key => typeof _tcd_settings[key] !== typeof DEFAULT_SETTINGS[key]);
			const updateObject = Object.fromEntries(updateKeys.map(key => [key, DEFAULT_SETTINGS[key]]));
			updateSettings({ ..._tcd_settings, ...updateObject });
		} else {
			settings = _tcd_settings;
		}
	});
	return settings;
}