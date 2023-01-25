// Seriously, Google? No ES6 module support?
// import { waitUntil } from "../common/utils";

(() => {
	const VIDEO_CONTAINER_SELECTORS = [
		// stream
		'.video-player__container'

		// vod
	];
	const CHAT_CONTAINER_SELECTORS = [
		// stream
		'.chat-scrollable-area__message-container',

		//vod
		'[data-test-selector="video-chat-message-list-wrapper"]',
		'.video-chat__message-list-wrapper',
	];

	const RAW_CHAT_SELECTORS = [
		// stream
		'.chat-line__message',

		// vod
		'.vod-message'
	].map(e => `${e}:not([data-danmaku-ready])`);

	const CHAT_USERNAME_SELECTORS = [
		// stream
		'.chat-line__username',

		// vod
		'.vod-message .video-chat__message-author'
	];
	const CHAT_MESSAGE_SELECTORS = [
		// stream
		'.chat-line__message-container .chat-line__username-container ~ span:last-of-type',

		// vod
		'.vod-message .video-chat__message > span ~ span:last-of-type'
	];

	const COLLAPSE_CLASS = 'fsJutT';
	const EXPAND_CLASS = 'eekshR';

	// utils
	const { waitUntil, getElementsBySelectors, getVideoContainer, getChatContainer, getUserSettings, onUserSettingsChange, events } = (() => {
		const waitUntil = (condition, { timeout = 0, interval = 1000 / 60 } = {}) => new Promise((resolve, reject) => {
			let res;
			const tick = () => {
				if (res = condition()) {
					resolve(res);
				} else {
					if (interval || typeof requestAnimationFrame !== 'function') {
						setTimeout(tick, interval);
					} else {
						requestAnimationFrame(tick);
					}
				}
			};

			tick();

			if (timeout) {
				setTimeout(() => {
					reject('timeout');
				}, timeout);
			}
		});

		const getElementsBySelectors = (selectors, $parent) => Promise.race(
			selectors.map(selector => waitUntil(() => {
				const $els = [...($parent || document).querySelectorAll(selector)];
				return $els.length ? $els : null;
			}))
		);

		const getVideoContainer = () => getElementsBySelectors(VIDEO_CONTAINER_SELECTORS).then($els => $els[0]);
		const getChatContainer = () => getElementsBySelectors(CHAT_CONTAINER_SELECTORS).then($els => $els[0]);

		const events = (() => {
			const eventMap = {};

			const listener = ({ signal, data }, sender, sendResponse) => {
				if (eventMap[signal]) {
					eventMap[signal].forEach(({ callback, once }) => {
						try {
							callback(data, sender, sendResponse);
						} catch (e) {
							console.error(e);
						}
						if (once) {
							off(signal, callback);
						}
					});
				}
			};

			chrome?.runtime?.onMessage.addListener(listener);
			window.addEventListener('unload', () => chrome?.runtime?.onMessage.removeListener(listener));

			const on = (signal, callback, once) => {
				if (eventMap[signal]) {
					eventMap[signal].push({ callback, once });
				} else {
					eventMap[signal] = [{ callback, once }];
				}
			}

			const off = (signal, callback) => {
				if (eventMap[signal]) {
					eventMap[signal] = eventMap[signal].filter(({ callback: cb }) => cb !== callback);
				}
			}

			const emit = (signal, data) => {
				chrome?.runtime?.sendMessage({ signal, data });
			}

			return {
				on, emit, off
			};
		})();

		const onUserSettingsChange = callback => {
			events.on('USER_SETTINGS', callback);
		}

		const getUserSettings = () => new Promise(resolve => {
			events.on('USER_SETTINGS', data => resolve(data), true);
			events.emit('GET_USER_SETTINGS');
		});

		return {
			waitUntil,
			getElementsBySelectors,
			getVideoContainer,
			getChatContainer,
			getUserSettings,
			onUserSettingsChange,
			events
		}
	})();


	(async () => {
		let $video, $chat, $danmakuContainer;
		let settings = {}, core, fullPageView;

		const addFullPageView = () => {
			const $group = document.querySelector('.player-controls__right-control-group');
			if (!$group) return;
			if ($group.querySelector('.full-page-view_btn')) return;

			const $button = document.createElement('button');
			$button.classList.add('full-page-view_btn');
			$button.innerText = '☢️';
			$button.setAttribute('title', '[TwitchChatDanmaku] Full page view');

			const $orgParent = $video?.parentElement;

			$button.addEventListener('click', () => {
				fullPageView = !fullPageView;
				if (fullPageView) {
					$video?.classList.add('danmaku_full-page-view');
					document.body.appendChild($video);
				} else {
					$video?.classList.remove('danmaku_full-page-view');
					$orgParent?.appendChild($video);
				}
			});

			$group.insertAdjacentElement('beforeend', $button)
		}

		const isDanmakuWorking = () => (
			($danmakuContainer && document.body.contains($danmakuContainer)) &&
			($video && document.body.contains($video)) &&
			($chat && document.body.contains($chat))
		);

		const getUnprocessedChats = () => waitUntil(() => getElementsBySelectors(RAW_CHAT_SELECTORS, $chat));

		const processChat = async ($chat) => {
			$chat.setAttribute('data-danmaku-ready', true);
			const $username = (await getElementsBySelectors(CHAT_USERNAME_SELECTORS, $chat))[0];
			const $message = (await getElementsBySelectors(CHAT_MESSAGE_SELECTORS, $chat))[0];
			core?.onDanmaku?.($username.cloneNode(true), $message.cloneNode(true));
		}

		const onGetUserSettings = (data, init) => {
			let { mode } = settings;
			settings = data;
			if (!init) {
				core?.onSettingsChange?.(data);

				if (mode !== settings.mode) {
					reset();
				}
			}
		}

		const getCore = async () => {
			try {
				core = await waitUntil(() => window._twitchChatDanmaku?.[settings.mode], { timeout: 1000 });
			} catch (ex) {
				console.error('TwitchChatDanmaku: core not found, abort!', ex);
			}

			return core;
		}

		onGetUserSettings(await getUserSettings(), true);
		onUserSettingsChange(data => onGetUserSettings(data));

		await getCore();
		if (!core) {
			console.error('TwitchChatDanmaku: core not found, abort!');
			return;
		}

		const reset = async () => {
			await getCore();
			addFullPageView();
			[...document.querySelectorAll('#danmaku-container')].forEach($el => $el.remove());
		};

		// init danmaku container
		const initDanmakuContainer = async () => {
			await reset();
			$danmakuContainer = document.createElement('div');
			$danmakuContainer.setAttribute('id', 'danmaku-container');
			$danmakuContainer.setAttribute('data-danmaku-mode', settings.mode);
			$video.appendChild($danmakuContainer);
			core?.init?.($danmakuContainer, settings);

			(async () => {
				let $orgContainer = $danmakuContainer;
				let $chats;

				do {
					$chats?.forEach(processChat);
					$chats = await getUnprocessedChats();
				} while ($orgContainer === $danmakuContainer);
			})();
		}

		// persist worker
		while (true) {
			// for every second, check if the danmaku container is gone
			if (await waitUntil(() => !isDanmakuWorking(), { interval: 1000 })) {
				// if it is gone, wait until the video and chat container are ready
				$chat = await getChatContainer();
				$video = await getVideoContainer();

				if (document.body.contains($chat) && document.body.contains($video)) {
					await initDanmakuContainer();
				}
			}
		}
	})();
})();
