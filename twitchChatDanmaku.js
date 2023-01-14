let $logDiv = null;
let $overlay = null;
let layers = [];
let isVideoChat = false;
let fontList = null;

let settings = {};

function sendMessage(type, data) {
	chrome.runtime.sendMessage({ type, data });
}

function findLogDiv() {
	return new Promise((resolve, reject) => {
		let timer = setInterval(() => {
			let _$logDiv = $('div[role=log]');
			let _$videoChatUl = $(".video-chat ul");
			let _$messageContainer = $(".chat-scrollable-area__message-container");
			if (_$logDiv && _$logDiv[0]) {
				$logDiv = $(_$logDiv[0]);
				clearInterval(timer);
				isVideoChat = false;
				resolve($logDiv);
			} else if (_$videoChatUl && _$videoChatUl[0]) {
				$logDiv = $(_$videoChatUl[0]);
				clearInterval(timer);
				isVideoChat = true;
				resolve($logDiv);
			} else {
				if (_$messageContainer && _$messageContainer[0]) {
					$logDiv = $(_$messageContainer[0]);
					clearInterval(timer);
					isVideoChat = true;
					resolve($logDiv);
				}
			}
		}, 500);
	});
}

function createOverlay() {
	return new Promise((resolve) => {
		if ($('#danmaku_overlay') && $('#danmaku_overlay').length > 0) {
			$overlay = $('#danmaku_overlay');
			resolve();
			return;
		}

		let timer = setInterval(() => {
			var streamPlayer =
				document.querySelector('.passthrough-events') ||
				document.querySelector('.video-player__container') ||
				document.querySelector('.highwind-video-player__overlay') ||
				document.querySelector('[class*=video-player]');

			if (streamPlayer) {
				streamPlayer.insertAdjacentHTML('beforeend', '<div id="danmaku_overlay"></div>');
				$overlay = $('#danmaku_overlay');
				clearInterval(timer);
				resolve();
			}
		}, 500);
	});
}

function digestChatDom(dom) {
	if (!dom) return null;
	let username = $(dom).find('span[data-a-target=chat-message-username]').html();
	if (!username) return;
	// if (isVideoChat) {
	// 	dom = $(dom).find('.tw-flex-grow-1')[0];
	// }
	let content = '';
	let foundUsername = false;
	if (isVideoChat) {
		let ele = '';
		if (settings.show_username) {
			ele = $(dom).find('.video-chat__message-menu')[0].previousSibling;
		} else {
			ele = $(dom).find('.text-fragment')[0];
			// ele = ele.children[ele.children.length - 1];
		}
		if (ele && ele.outerHTML)
			content += ele.outerHTML;
	} else {
		let d = dom.querySelector('[class*=username-container]') || dom.querySelector('.text-fragment');
		if (d) {
			dom = d.parentElement;
		}
		for (var i = 0; i < dom.children.length; i++) {
			let ele = dom.children[i];
			if (!settings.show_username) {
				if (!foundUsername) {
					if ($(ele).attr('class') && $(ele).attr('class').indexOf('username') >= 0) {
						foundUsername = true;
					}
					continue;
				}
				if ($(ele).attr('aria-hidden')) {
					continue;
				}
			}
			if (ele && ele.outerHTML)
				content += ele.outerHTML;
		}
	}

	var entry = {
		username: username,
		content: content
	};
	return entry;
}

let timers = [];

function addNewDanmaku(entry) {
	if (!settings.enabled || !entry) return;
	const density = [0.25, 0.5, 0.75, 1][settings.danmaku_density] || 1;
	let layer = 0;
	let maxLayer = Math.floor(($overlay.height() * density) / (parseInt(settings.font_size) + 4)) - 1;
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
async function start() {
	$logDiv.unbind('DOMNodeInserted');
	$logDiv.bind('DOMNodeInserted', (event) => {
		var newChatDOM = event.target;

		if (!newChatDOM.className) return;

		setTimeout(() => {
			var chatEntry = digestChatDom(newChatDOM);
			addNewDanmaku(chatEntry);
		}, 0);
	});

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
			$overlay.css('display', settings.enabled ? 'block' : 'none');
			gotSettings = true;
			break;
		case 'UPDATE_SETTINGS':
			Object.assign(settings, request.data);
			$overlay.css('display', settings.enabled ? 'block' : 'none');
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
