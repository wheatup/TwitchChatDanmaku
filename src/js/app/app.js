// Seriously, Google? No ES6 module support?
// import { waitUntil, getElementBySelectors } from "../common/utils";

(() => {
	/* utils */
	const { waitUntil, getElementBySelectors, getVideoContainer, getChatContainer } = (() => {
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

		const getElementBySelectors = selectors => Promise.race(
			selectors.map(selector => waitUntil(() => {
				console.log(selector);
				return document.querySelector(selector);
			}))
		);

		const getVideoContainer = () => getElementBySelectors(['.persistent-player']);
		const getChatContainer = () => getElementBySelectors(['.chat-scrollable-area__message-container']);

		return {
			waitUntil,
			getElementBySelectors,
			getVideoContainer,
			getChatContainer
		}
	})();


	// persist worker
	(async () => {
		let $video, $chat, $danmakuContainer;

		// init danmaku container
		const init = async ($video, $chat) => {
			console.log('init', { $video, $chat });
			$danmakuContainer = document.createElement('div');
			$danmakuContainer.setAttribute('id', 'danmaku-container');
			$video.appendChild($danmakuContainer);
		}

		while (true) {
			// for every second, check if the danmaku container is gone
			if (await waitUntil(() => !$danmakuContainer || document.body.contains($danmakuContainer), { interval: 1000 })) {
				// if it is gone, wait until the video and chat container are ready
				$chat = await getChatContainer();
				$video = await getVideoContainer();

				if (document.body.contains($chat) && document.body.contains($video)) {
					await init($video, $chat);
				}
			}
		}
	})();
})();
