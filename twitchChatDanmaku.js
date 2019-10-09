let $logDiv = null;
let $overlay = null;
let layers = [];
let isVideoPlayer = false;
let isVideoChat = false;
let fontList = null;

let settings = {};

function sendMessage(type, data) {
	chrome.runtime.sendMessage({ type, data });
}

function findLogDiv() {
	return new Promise((resolve, reject) => {
		let timer = setInterval(() => {
			let _$logDiv = $("div[role=log]");
			if (_$logDiv && _$logDiv[0]) {
				$logDiv = $(_$logDiv[0]);
				clearInterval(timer);
				isVideoChat = false;
				resolve($logDiv);
			} else {
				_$logDiv = $("ul[class*=tw-align-items-end]");
				if (_$logDiv && _$logDiv[0]) {
					$logDiv = $(_$logDiv[0]);
					clearInterval(timer);
					isVideoChat = true;
					resolve($logDiv);
				}
			}
		}, 500);
	});
}

function createOverlay() {
	return new Promise(resolve => {
		if ($("#danmaku_overlay") && $("#danmaku_overlay").length > 0) {
			$overlay = $("#danmaku_overlay");
			resolve();
			return;
		}

		let timer = setInterval(() => {
			var streamPlayer = $(".passthrough-events");
			var videoPlayer = $(".highwind-video-player__overlay");
			if (streamPlayer && streamPlayer.length > 0) {
				$(streamPlayer[0]).append('<div id="danmaku_overlay"></div>');
				$overlay = $("#danmaku_overlay");
				clearInterval(timer);
				isVideoPlayer = false;
				resolve();
			} else if (videoPlayer && videoPlayer.length > 0) {
				$(videoPlayer[0]).append('<div id="danmaku_overlay"></div>');
				$overlay = $("#danmaku_overlay");
				clearInterval(timer);
				isVideoPlayer = true;
				resolve();
			}
		}, 500);
	});
}

function digestChatDom(dom) {
	if (!dom) return null;
	let username = $(dom)
		.find("span[data-a-target=chat-message-username]")
		.html();
	if (!username) return;
	if (isVideoChat) {
		dom = $(dom).find(".tw-flex-grow-1")[0];
	}
	let content = "";
	let foundUsername = false;
	if (isVideoChat) {
		let ele = "";
		if (settings.show_username) {
			ele = dom;
		} else {
			ele = $(dom).find("div[data-test-selector=comment-message-selector]")[0];
			ele = ele.children[ele.children.length - 1];
		}
		content += ele.outerHTML;
	} else {
		for (var i = 0; i < dom.children.length; i++) {
			let ele = dom.children[i];
			if (!settings.show_username) {
				if (!foundUsername) {
					if (
						$(ele).attr("class") &&
						$(ele)
							.attr("class")
							.indexOf("username") >= 0
					) {
						foundUsername = true;
					}
					continue;
				}
				if ($(ele).attr("aria-hidden")) {
					continue;
				}
			}
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
	let layer = 0;
	let maxLayer = Math.floor($overlay.height() / (parseInt(settings.font_size) + 4)) - 1;
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

function start() {
	$logDiv.unbind("DOMNodeInserted");
	$logDiv.bind("DOMNodeInserted", event => {
		var newChatDOM = event.target;
		setTimeout(() => {
			var chatEntry = digestChatDom(newChatDOM);
			addNewDanmaku(chatEntry);
		}, 0);
	});
	replaceToggleVisibility();
	console.log(
		"%c[Twitch Chat Danmaku] If you like this extension, please consider to support the dev by sending a donation via https://www.paypal.me/wheatup. Thanks! Pepega",
		"color: #fff; font-weight: bold; background-color: #295; border-radius: 3px; padding: 2px 5px;"
	);
}

async function init() {
	await findLogDiv();
	await createOverlay();
	start();
	sendMessage("GET_SETTINGS");
	sendMessage("GET_FONTS");
	if (checkTimer) {
		clearInterval(checkTimer);
	}
	checkTimer = setInterval(check, 1000);
}

let replaced = false;
function replaceToggleVisibility() {
	if (replaced) return;
	replaced = true;

	let toggle = $(".right-column__toggle-visibility");
	toggle.click(e => {
		const rightColumn = document.querySelector('.right-column');
		const header = document.querySelector('.channel-header .tw-full-height.tw-pd-l-05');
		console.log(rightColumn);
		if (rightColumn) {
			if (rightColumn.classList.contains('right-column--collapsed')) {
				rightColumn.setAttribute('data-a-target', 'right-column-chat-bar');
				rightColumn.setAttribute('class', 'right-column right-column--beside tw-block tw-flex-shrink-0 tw-full-height tw-relative');
				rightColumn.children[0].setAttribute('class', 'tw-block tw-flex-grow-0 tw-flex-shrink-0 tw-full-height tw-relative');
				rightColumn.querySelector('[data-a-target=right-column__toggle-collapse-btn] .tw-icon__svg').querySelector('path').setAttribute('d', 'M4 16V4H2v12h2zM13 15l-1.5-1.5L14 11H6V9h8l-2.5-2.5L13 5l5 5-5 5z');
				if (header) {
					header.classList.remove('tw-sm-pd-r-4');
					header.classList.add('tw-sm-pd-r-1');
				}
			} else {
				rightColumn.setAttribute('data-a-target', 'right-column-chat-bar-collapsed');
				rightColumn.setAttribute('class', 'right-column right-column--beside right-column--collapsed tw-block tw-flex-shrink-0 tw-relative');
				rightColumn.children[0].setAttribute('class', 'tw-flex-grow-0 tw-flex-shrink-0 tw-full-height tw-hide tw-relative');
				rightColumn.querySelector('[data-a-target=right-column__toggle-collapse-btn] .tw-icon__svg').querySelector('path').setAttribute('d', 'M16 16V4h2v12h-2zM6 9l2.501-2.5-1.5-1.5-5 5 5 5 1.5-1.5-2.5-2.5h8V9H6z');
				if (header) {
					header.classList.remove('tw-sm-pd-r-1');
					header.classList.add('tw-sm-pd-r-4');
				}
			}
		}
		e.stopPropagation();
	});
}

let checkTimer = null;
function check() {
	let container = $("nav.top-nav~.tw-flex");
	if (container.hasClass("_tcd_full")) {
		if ($(".whispers") && $(".whispers").hasClass("whispers--right-column-expanded")) {
			$(".whispers").removeClass("whispers--right-column-expanded");
		}
	} else {
		if ($(".whispers") && !$(".whispers").hasClass("whispers--right-column-expanded")) {
			$(".whispers").addClass("whispers--right-column-expanded");
		}
	}
}

$(document).ready(() => {
	init();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	switch (request.type) {
		case "GOT_SETTINGS":
			settings = request.data;
			$overlay.css("display", settings.enabled ? "block" : "none");
			break;
		case "UPDATE_SETTINGS":
			settings = request.data;
			$overlay.css("display", settings.enabled ? "block" : "none");
			break;
		case "URL_CHANGE":
			init();
			break;
		case "GOT_FONTS":
			fontList = request.data;
			break;
	}
});
