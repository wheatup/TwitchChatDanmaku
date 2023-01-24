// Seriously, Google? No ES6 module support?
// import { waitUntil } from "../common/utils";

(() => {
	const VIDEO_CONTAINER_SELECTORS = ['.persistent-player'];
	const CHAT_CONTAINER_SELECTORS = ['.chat-scrollable-area__message-container'];
	const RAW_CHAT_SELECTORS = ['.chat-line__message'].map(e => `${e}:not([data-danmaku-ready])`);

	// utils
	const { waitUntil, getElementsBySelectors, getVideoContainer, getChatContainer, getUserSettings, onUserSettings, events } = (() => {
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

			chrome.runtime.onMessage.addListener(listener);
			window.addEventListener('unload', () => chrome.runtime.onMessage.removeListener(listener));

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
				chrome.runtime.sendMessage({ signal, data });
			}

			return {
				on, emit, off
			};
		})();

		const onUserSettings = callback => {
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
			onUserSettings,
			events
		}
	})();


	// persist worker
	(async () => {
		let $video, $chat, $danmakuContainer;
		let observing = false, settings = {};

		const isDanmakuWorking = () => (
			($danmakuContainer && document.body.contains($danmakuContainer)) &&
			($video && document.body.contains($video)) &&
			($chat && document.body.contains($chat))
		);

		const getUnprocessedChats = () => waitUntil(() => getElementsBySelectors(RAW_CHAT_SELECTORS, $chat));

		const processChat = async ($chat) => {
			$chat.setAttribute('data-danmaku-ready', true);
			console.log('process', $chat);
		}

		const onGetUserSettings = data => {
			settings = data;
			console.log('SETTINGS', data);
		}

		onGetUserSettings(await getUserSettings());
		onUserSettings(onGetUserSettings);

		// init danmaku container
		const init = async () => {
			console.log('init', { $video, $chat });
			[...document.querySelectorAll('#danmaku-container')].forEach($el => $el.remove());

			$danmakuContainer = document.createElement('div');
			$danmakuContainer.setAttribute('id', 'danmaku-container');
			$video.appendChild($danmakuContainer);

			(async () => {
				let $orgContainer = $danmakuContainer;
				let $chats;

				do {
					$chats?.forEach(processChat);
					$chats = await getUnprocessedChats();
				} while ($orgContainer === $danmakuContainer);
			})();
		}

		while (true) {
			// for every second, check if the danmaku container is gone
			if (await waitUntil(() => !isDanmakuWorking(), { interval: 1000 })) {
				observing = false;
				// if it is gone, wait until the video and chat container are ready
				$chat = await getChatContainer();
				$video = await getVideoContainer();

				if (document.body.contains($chat) && document.body.contains($video)) {
					await init();
				}
			}
		}
	})();
})();
