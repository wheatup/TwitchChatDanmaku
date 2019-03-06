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
			let _$logDiv = $('div[role=log]');
			if (_$logDiv && _$logDiv[0]) {
				$logDiv = $(_$logDiv[0]);
				clearInterval(timer);
				isVideoChat = false;
				resolve($logDiv);
			} else {
				_$logDiv = $('ul[class*=tw-align-items-end]');
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
		if ($('#danmaku_overlay') && $('#danmaku_overlay').length > 0) {
			$overlay = $('#danmaku_overlay');
			resolve();
			return;
		}

		let timer = setInterval(() => {
			var streamPlayer = $('.extension-container');
			var videoPlayer = $('.player');
			if (streamPlayer && streamPlayer.length > 0) {
				$(streamPlayer[0]).append('<div id="danmaku_overlay"></div>');
				$overlay = $('#danmaku_overlay');
				clearInterval(timer);
				isVideoPlayer = false;
				resolve();
			} else if (videoPlayer && videoPlayer.length > 0) {
				$(videoPlayer[0]).append('<div id="danmaku_overlay"></div>');
				$overlay = $('#danmaku_overlay');
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
		.find('span[data-a-target=chat-message-username]')
		.html();
	if (!username) return;
	if (isVideoChat) {
		dom = $(dom).find('.tw-flex-grow-1')[0];
	}
	let content = '';
	let foundUsername = false;
	if (isVideoChat) {
		let ele = '';
		if (settings.show_username) {
			ele = dom;
		} else {
			ele = $(dom).find('div[data-test-selector=comment-message-selector]')[0];
			ele = ele.children[ele.children.length - 1];
		}
		content += ele.outerHTML;
	} else {
		for (var i = 0; i < dom.children.length; i++) {
			let ele = dom.children[i];
			if (!settings.show_username) {
				if (!foundUsername) {
					if (
						$(ele).attr('class') &&
						$(ele)
							.attr('class')
							.indexOf('username') >= 0
					) {
						foundUsername = true;
					}
					continue;
				}
				if ($(ele).attr('aria-hidden')) {
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
	setTimeout(() => {
		layers[layer] = false;
	}, Math.floor(settings.duration * 500));

	const danmaku = new Danmaku(entry, layer, settings);
	danmaku.attachTo($overlay);
}

function start() {
	$logDiv.unbind('DOMNodeInserted');
	$logDiv.bind('DOMNodeInserted', event => {
		var newChatDOM = event.target;
		setTimeout(() => {
			var chatEntry = digestChatDom(newChatDOM);
			addNewDanmaku(chatEntry);
		}, 0);
	});
	replaceToggleVisibility();
	console.log('Danmanku ready!');
}

function init() {
	findLogDiv()
		.then(createOverlay)
		.then(start);
	sendMessage('GET_SETTINGS');
	sendMessage('GET_FONTS');
	if (checkTimer) {
		clearInterval(checkTimer);
	}
	checkTimer = setInterval(check, 1000);
}

let injected = false;
let replaced = false;
function replaceToggleVisibility() {
	if(replaced) return;
	replaced = true;
	let toggle = $('.right-column__toggle-visibility');
	toggle.click(e => {
		if (!$('.right-column .tw-flex-grow-0').is(':visible') || $('.right-column .tw-flex-grow-0').width() <= 5) {
			if (!injected) {
			} else {
				toggleVisibility();
				e.stopPropagation();
			}
		} else {
			toggleVisibility();
			e.stopPropagation();
		}
	});
}

let checkTimer = null;
function check() {
	let container = $('nav.top-nav~.tw-flex');
	if (container.hasClass('_tcd_full')) {
		if ($('.whispers') && $('.whispers').hasClass('whispers--right-column-expanded')) {
			$('.whispers').removeClass('whispers--right-column-expanded');
		}
	} else {
		if ($('.whispers') && !$('.whispers').hasClass('whispers--right-column-expanded')) {
			$('.whispers').addClass('whispers--right-column-expanded');
		}
	}
}

function toggleVisibility() {
	injected = true;
	let container = $('nav.top-nav~.tw-flex');
	if (container.hasClass('_tcd_full')) {
		container.removeClass('_tcd_full');
		if ($('.whispers') && !$('.whispers').hasClass('whispers--right-column-expanded')) {
			$('.whispers').addClass('whispers--right-column-expanded');
		}
	} else {
		container.addClass('_tcd_full');
		if ($('.whispers') && $('.whispers').hasClass('whispers--right-column-expanded')) {
			$('.whispers').removeClass('whispers--right-column-expanded');
		}
	}
	let svg = $('.right-column__toggle-visibility .tw-svg');
	let rightarr =
		'<svg class="tw-svg__asset tw-svg__asset--glypharrright tw-svg__asset--inherit" width="20px" height="20px" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><path d="M7.463 5.054a.714.714 0 0 0-.463.66v8.572c0 .289.183.55.463.66.28.11.603.05.817-.155l4.5-4.286A.696.696 0 0 0 13 10a.7.7 0 0 0-.22-.505L8.28 5.21a.777.777 0 0 0-.817-.155"></path></svg>';
	let leftarr =
		'<svg class="tw-svg__asset tw-svg__asset--glypharrleft tw-svg__asset--inherit" width="20px" height="20px" version="1.1" viewBox="0 0 20 20" x="0px" y="0px"><path d="M12.537 14.946a.714.714 0 0 0 .463-.66V5.714a.715.715 0 0 0-.463-.66.777.777 0 0 0-.817.155l-4.5 4.286A.696.696 0 0 0 7 10a.7.7 0 0 0 .22.505l4.5 4.286a.777.777 0 0 0 .817.155"></path></svg>';
	if (container.hasClass('_tcd_full')) {
		svg.html(leftarr);
	} else {
		svg.html(rightarr);
	}
}

$(document).ready(() => {
	init();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch (request.type) {
		case 'GOT_SETTINGS':
			settings = request.data;
			$overlay.css('display', settings.enabled ? 'block' : 'none');
			break;
		case 'UPDATE_SETTINGS':
			settings = request.data;
			$overlay.css('display', settings.enabled ? 'block' : 'none');
			break;
		case 'URL_CHANGE':
			init();
			break;
		case 'GOT_FONTS':
			fontList = request.data;
			break;
	}
});
