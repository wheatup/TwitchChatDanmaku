import { setup } from "../common/i18n.js";
let ready = false;

const init = async () => {
	setup();
	ready = true;
}

window.addEventListener('load', init);

chrome.runtime.onMessage.addListener(async ({ type, data }) => {
	await waitUntil(() => ready);
	switch (type) {
		case 'GOT_SETTINGS':
			console.log('GOT_SETTINGS', data);
			// settings = request.data;
			// onGotSettings();
			break;
		case 'GOT_FONTS':
			console.log('GOT_FONTS', data);
			// if (data.length > 0) {
			// 	data.forEach((font) =>
			// 		$("#font").append(
			// 			`<option value="${font}"${settings.font === font ? ' selected="selected"' : ""
			// 			}>${font === "Default" ? chrome.i18n.getMessage("default") : font
			// 			}</option>`
			// 		)
			// 	);
			// } else {
			// 	$("#font").closest("li").hide();
			// }
			break;
	}
});