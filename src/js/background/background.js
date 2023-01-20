import { emit, on } from "../common/events.js";
import { getUserSettings, updateSettings } from "../common/userSettings.js";
import { waitUntil } from "../common/utils.js";

let ready = false;
let settings;

const init = async () => {
	settings = await getUserSettings();
	ready = true;
};

on('GET_USER_SETTINGS', async () => {
	await waitUntil(() => ready);
	emit('USER_SETTINGS', settings);
});

on('SET_USER_SETTINGS', async data => {
	await waitUntil(() => ready);
	settings = updateSettings(data);
	// emit('USER_SETTINGS', settings);
});

init();