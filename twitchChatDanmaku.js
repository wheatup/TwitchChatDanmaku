let $logDiv = null;
let $overlay = null;
let layers = [];
let isVideoChat = false;
let fontList = null;

let settings = {};

const waitUntil = condition => new Promise(resolve => {
	let res;
	const tick = () => {
		if (res = condition()) {
			resolve(res);
		}
		requestAnimationFrame(tick);
	};
	tick();
});

function sendMessage(type, data) {
	chrome.runtime.sendMessage({ type, data });
}

async function findLogDiv() {
	$logDiv = await waitUntil(() =>
		document.querySelector('.chat-scrollable-area__message-container') ||
		document.querySelector('.video-chat__message-list-wrapper ul')
	);

	return $logDiv;
}

async function createOverlay() {
	if (document.querySelector('#danmaku_overlay')) {
		return;
	}

	const streamPlayer = await waitUntil(() =>
		document.querySelector('.passthrough-events') ||
		document.querySelector('.video-player__container') ||
		document.querySelector('.highwind-video-player__overlay') ||
		document.querySelector('[class*=video-player]') ||
		document.querySelector('.persistent-player')
	);

	$overlay = document.createElement('div');
	$overlay.id = 'danmaku_overlay';
	streamPlayer.appendChild($overlay);
	return $overlay;
}

function digestChatDom(dom) {
	let username = '';
	let content = '';

	if (dom.classList.contains('chat-line__message')) {
		const $author = dom.querySelector('.chat-line__username-container');
		if (!$author) return;

		if (!settings.show_username) {
			username = $author.outerHTML;
			content = [...$author.parentElement.childNodes].pop().outerHTML;
		} else {
			username = '';
			content = $author.parentElement.outerHTML;
		}

	} else if (dom.tagName === 'LI') {
		const $author = dom.querySelector('.video-chat__message-author');
		if (!$author) return;

		if (!settings.show_username) {
			username = $author.outerHTML;
			content = dom.querySelector('.video-chat__message > span:last-of-type')?.outerHTML;
		} else {
			username = '';
			content = $author.parentElement.outerHTML;
		}
	} else {
		return;
	}

	return {
		username,
		content
	};
}

let timers = [];

function addNewDanmaku(entry) {
	if (!settings.enabled || !entry) return;
	const density = [0.25, 0.5, 0.75, 1][settings.danmaku_density] || 1;
	let layer = 0;
	let maxLayer = Math.floor(($overlay.clientHeight * density) / (parseInt(settings.fontSize) + 4)) - 1;
	for (; layer < maxLayer; layer++) {
		if (!layers[layer]) {
			layers[layer] = true;
			break;
		}
	}
	if (layer === maxLayer) {
		layer = Math.floor(Math.random() * maxLayer);
	}

	const danmaku = new Danmaku(entry, layer, settings);

	setTimeout(() => {
		let width = danmaku.html.width() || 160;
		width = Math.max(width, 160);
		width = Math.min(width, 1000);
		if (timers[layer]) {
			clearTimeout(timers[layer]);
		}
		timers[layer] = setTimeout(() => {
			layers[layer] = false;
		}, Math.floor(settings.duration * width * 2));
	}, 50);
	danmaku.attachTo($overlay);
}

let replaced = false;
function replaceToggleVisibility() {
	if (replaced) return;
	let toggle = document.querySelector('.right-column__toggle-visibility');
	if (!toggle) return;
	replaced = true;

	let injected = false;
	toggle.addEventListener('click', (e) => {
		const rightColumn = document.querySelector('.right-column');
		const header = document.querySelector('.channel-header .tw-full-height.tw-pd-l-05');
		const theatre = document.querySelector('.persistent-player--theatre');
		const whispers = document.querySelector('.whispers--right-column-expanded');

		if (!injected && rightColumn.classList.contains('right-column--collapsed')) {
			injected = true;
			return;
		}
		injected = true;
		if (rightColumn) {
			if (rightColumn.classList.contains('right-column--collapsed')) {
				rightColumn.setAttribute('data-a-target', 'right-column-chat-bar');
				rightColumn.classList.remove('right-column--collapsed');
				if (rightColumn.classList.contains('right-column--theatre')) {
					rightColumn.classList.add('tw-full-height');
					if (theatre) {
						theatre.style.width = 'calc(100% - 34rem)';
					}
				}

				rightColumn.children[0].classList.add('tw-block');
				rightColumn.children[0].classList.remove('tw-hide');

				rightColumn
					.querySelector('[data-a-target=right-column__toggle-collapse-btn] .tw-icon__svg')
					.querySelector('path')
					.setAttribute('d', 'M4 16V4H2v12h2zM13 15l-1.5-1.5L14 11H6V9h8l-2.5-2.5L13 5l5 5-5 5z');

				if (header) {
					header.classList.remove('tw-sm-pd-r-4');
					header.classList.add('tw-sm-pd-r-1');
				}

				if (whispers) {
					whispers.classList.add('whispers--right-column-expanded-beside');
				}
			} else {
				rightColumn.setAttribute('data-a-target', 'right-column-chat-bar-collapsed');
				rightColumn.classList.add('right-column--collapsed');
				if (rightColumn.classList.contains('right-column--theatre')) {
					rightColumn.classList.remove('tw-full-height');
					if (theatre) {
						theatre.style.width = '100vw';
					}
				}

				rightColumn.children[0].classList.remove('tw-block');
				rightColumn.children[0].classList.add('tw-hide');

				rightColumn
					.querySelector('[data-a-target=right-column__toggle-collapse-btn] .tw-icon__svg')
					.querySelector('path')
					.setAttribute('d', 'M16 16V4h2v12h-2zM6 9l2.501-2.5-1.5-1.5-5 5 5 5 1.5-1.5-2.5-2.5h8V9H6z');
				if (header) {
					header.classList.remove('tw-sm-pd-r-1');
					header.classList.add('tw-sm-pd-r-4');
				}

				if (whispers) {
					whispers.classList.remove('whispers--right-column-expanded-beside');
				}
			}
		}
		e.stopPropagation();
	});
}

let gotSettings = false;
let gotFonts = false;
const insertEvent = ({ target }) => {
	setTimeout(() => addNewDanmaku(digestChatDom(target)), 0);
};

async function start() {
	$logDiv.removeEventListener('DOMNodeInserted', insertEvent);
	$logDiv.addEventListener('DOMNodeInserted', insertEvent);

	console.log(
		'%c[Twitch Chat Danmaku] If you like this extension, please consider to support the dev by sending a donation via https://www.paypal.me/wheatup. Thanks! Pepega',
		'color: #fff; font-weight: bold; background-color: #295; border-radius: 3px; padding: 2px 5px;'
	);

	while (!gotSettings || !gotFonts || !replaced) {
		if (!gotSettings) {
			sendMessage('GET_SETTINGS');
		}

		if (!gotFonts) {
			sendMessage('GET_FONTS');
		}

		if (!replaced) {
			replaceToggleVisibility();
		}

		await sleep(1000);
	}
}

async function init() {
	await findLogDiv();
	await createOverlay();
	start();
}

$(document).ready(init);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	switch (request.type) {
		case 'GOT_SETTINGS':
			Object.assign(settings, request.data);
			$overlay.style.display = settings.enabled ? 'block' : 'none';
			gotSettings = true;
			break;
		case 'UPDATE_SETTINGS':
			Object.assign(settings, request.data);
			$overlay.style.display = settings.enabled ? 'block' : 'none';
			break;
		case 'URL_CHANGE':
			init();
			break;
		case 'GOT_FONTS':
			fontList = request.data;
			gotFonts = true;
			break;
	}
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
