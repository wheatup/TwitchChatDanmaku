import { emit, on, sendToRelativeTabs } from "../common/events.js";
import { getUserSettings, updateSettings } from "../common/userSettings.js";
import { waitUntil } from "../common/utils.js";

let ready = false;
let settings;

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

init();