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
		// browser.fontSettings (and its getFontList method) is a Chrome-only
		// API and is not implemented in Firefox. Fall back to just "Default"
		// so the popup's font picker still works, it just won't offer the
		// user's installed system fonts.
		try {
			const data = await browser.fontSettings?.getFontList();
			fonts = ["Default", ...(data || []).map(font => font.displayName)];
		} catch (ex) {
			console.warn('[TwitchChatDanmaku] fontSettings API unavailable, using default font list only', ex);
			fonts = ["Default"];
		}
	}
	emit('FONT_LIST', fonts);
});

init();