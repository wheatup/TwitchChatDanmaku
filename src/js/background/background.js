import { emit, on, sendToRelativeTabs } from "../common/events.js";
import { getUserSettings, updateSettings } from "../common/userSettings.js";
import { waitUntil } from "../common/utils.js";

let ready = false;
let settings, fonts;

const init = async () => {
	settings = await getUserSettings();
	ready = true;
};

on('GET_USER_SETTINGS', async (data, sender) => {
	await waitUntil(() => ready);
	emit('USER_SETTINGS', settings);
});

on('SET_USER_SETTINGS', async (data, sender) => {
	await waitUntil(() => ready);
	settings = updateSettings(data);
	sendToRelativeTabs('USER_SETTINGS', settings);
});

on('RESET_USER_SETTINGS', async (data, sender) => {
	await waitUntil(() => ready);
	settings = updateSettings(data, true);
	emit('USER_SETTINGS', settings);
});

on('GET_FONT_LIST', async (data, sender) => {
	if (!fonts) {
		const data = await chrome.fontSettings.getFontList();
		fonts = ["Default", ...data.map(font => font.displayName)];
	}
	emit('FONT_LIST', fonts);
});

init();