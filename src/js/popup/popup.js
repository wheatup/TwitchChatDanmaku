import { emit, on } from "../common/events.js";
import { setup, $ } from "../common/i18n.js";
let settings;

const init = async () => {
	await setup();
	filterSetup();
	document.querySelector('#resetToDefault').addEventListener('click', e => {
		e.preventDefault();
		emit('RESET_USER_SETTINGS');
	});

	document.querySelector('#filterSettings').addEventListener('click', e => {
		e.preventDefault();
		document.querySelector('form[data-current]').setAttribute('data-current', 'filters');
	});

	document.querySelector('#back').addEventListener('click', e => {
		e.preventDefault();
		document.querySelector('form[data-current]').setAttribute('data-current', 'general');
	});

	emit('GET_USER_SETTINGS');
	emit('GET_FONT_LIST');
}

const filterSetup = list => {
	const isRegex = text => {
		let [_, regex, flags] = /^\/(.+)\/([gmiyuvsd]*)$/[Symbol.match](text) || [];
		if (regex) {
			try {
				regex = new RegExp(regex, flags);
				console.log(regex);
				return true;
			} catch (ex) {
			}
		}
		return false;
	};

	const $filterList = document.querySelector('.filter-list');
	let timer;

	const cleanup = () => {
		const list = [...$filterList.querySelectorAll('input')].reduce((acc, $ipt, index, arr) => {
			const text = $ipt.value.trim();
			if (text) {
				acc.push(text);
			} else if (index < arr.length - 1) {
				$ipt.remove();
			}

			return acc;
		}, []);

		emit('SET_USER_SETTINGS', { filterList: JSON.stringify(list) });
	};

	const onInputChange = $ipt => {
		timer && clearTimeout(timer);
		timer = setTimeout(cleanup, 1000);
		if (isRegex($ipt.value)) {
			$ipt.classList.add('regex');
		} else {
			$ipt.classList.remove('regex');
		}
		if ([...$filterList.querySelectorAll('input')].every($ipt => $ipt.value.trim())) {
			addInput();
		}
	}

	const setupInput = $ipt => {
		$ipt.addEventListener('input', () => onInputChange($ipt));
	}

	const addInput = text => {
		const $ipt = document.createElement('input');
		$ipt.setAttribute('type', 'text');
		if (text) {
			$ipt.value = text;
			if (isRegex(text)) {
				$ipt.classList.add('regex');
			}
		}
		setupInput($ipt);
		$filterList.append($ipt);
	}

	if (list?.length) {
		[...$filterList.querySelectorAll('input')].forEach($ipt => $ipt.remove());
		list.forEach(filter => addInput(filter));
		addInput();
	} else {
		[...$filterList.querySelectorAll('input')].forEach(setupInput);
	}

};

on('USER_SETTINGS', data => {
	settings = data;

	const updateOutput = (output, value) => {
		if (output) {
			const source = output.getAttribute('data-source');
			switch (source) {
				case 'opacity':
					output.innerText = Math.round(value * 100) + '%';
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
				case 'scrollWidth':
					output.innerText = value + '%';
					break;
				default:
					output.innerText = value;
			}
		}
	}

	const onSettingChange = (key, value, change) => {
		if (key === 'filterList') {
			let filterList;
			try {
				filterList = JSON.parse(value);
			} catch (ex) {
				console.error(ex);
			}
			filterList = Array.isArray(filterList) ? filterList : [];
			filterSetup(filterList);
			return;
		}

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