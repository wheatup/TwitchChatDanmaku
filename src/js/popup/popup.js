import { emit, on } from "../common/events.js";
import { setup, $ } from "../common/i18n.js";
let settings;

const init = async () => {
	await setup();
	document.querySelector('#resetToDefault').addEventListener('click', e => {
		e.preventDefault();
		emit('RESET_USER_SETTINGS');
	});
	emit('GET_USER_SETTINGS');
	emit('GET_FONT_LIST');
}

on('USER_SETTINGS', data => {
	settings = data;

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
			} else if (key === 'mode') {
				[...document.querySelectorAll(`[data-mode~=${value}]`)].forEach(e => {
					e.classList.remove('hidden');
				});
				[...document.querySelectorAll(`[data-mode]:not([data-mode~=${value}])`)].forEach(e => {
					e.classList.add('hidden');
				});
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

on('FONT_LIST', fonts => {
	const select = document.querySelector('[name="font"]');
	fonts.forEach(font => {
		const option = document.createElement('option');
		option.innerText = font;
		option.value = font;
		if (settings?.font === font) {
			option.selected = true;
		}
		select.appendChild(option);
	});
})

window.addEventListener('load', init);