import { emit, on } from "../common/events.js";
import { setup } from "../common/i18n.js";
import { waitUntil } from "../common/utils.js";

let ready = false;

const init = async () => {
	await setup();
	ready = true;
	emit('GET_USER_SETTINGS');
}

on('USER_SETTINGS', async data => {
	await waitUntil(() => ready);
	console.log('GOT SETTINGS', data);
});

window.addEventListener('load', init);