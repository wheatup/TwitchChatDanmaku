import { emit, on } from "../common/events.js";
import { setup, $ } from "../common/i18n.js";

const init = async () => {
	await setup();
	emit('GET_USER_SETTINGS');
}

on('USER_SETTINGS', data => {
	console.log('GOT SETTINGS', data);

	const updateOutput = (output, value) => {
		if (output) {
			const source = output.getAttribute('data-source');
			switch (source) {
				case 'opacity':
					output.innerText = value * 100 + '%';
					break;
				case 'duration':
					output.innerText = value + 's';
					break;
				case 'fontSize':
					output.innerText = value + 'px';
					break;
				case 'danmakuDensity':
					output.innerText = $`lblDanmakuDensity_${value}`;
					break;
				default:
					output.innerText = value;
			}
		}
	}

	const onSettingChange = (key, value, change) => {
		const entry = document.querySelector(`.entry[data-entry="${key}"]`);
		if (entry) {
			const input = entry.querySelector(`[name="${key}"]`);
			if (!input) {
				console.warn(`No input for ${key}`);
				return;
			}
			if (input.getAttribute('type') === 'checkbox') {
				input.checked = value;
			} else {
				input.value = value;
			}

			const output = entry.querySelector('output');
			updateOutput(output, value);

			if (key === 'enabled') {
				document.querySelector('.further-settings').classList[value ? 'remove' : 'add']('hidden');
			}

			if (!change) {
				input.addEventListener('input', () => {
					const value = input.getAttribute('type') === 'checkbox' ? input.checked : input.value;
					onSettingChange(key, value, true)
					emit('SET_USER_SETTINGS', { [key]: value });
				});
			}
		} else {
			console.warn(`No entry for ${key}`);
		}
	}

	Object.entries(data).forEach(([key, value]) => {
		onSettingChange(key, value);
	});
});

window.addEventListener('load', init);