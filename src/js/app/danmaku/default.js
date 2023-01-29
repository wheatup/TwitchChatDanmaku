if (typeof window._twitchChatDanmaku === 'undefined') {
	window._twitchChatDanmaku = {};
}

(() => {
	let $container;
	let settings = {};
	let stacks = [], maxStack = 20;

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

	const calculateMaxStack = () => {
		if (!settings) return;
		const { danmakuDensity, fontSize } = settings;
		const percent = ((+danmakuDensity || 0) + 1) / 4;
		const lineHeight = fontSize * 1.25;
		const containerHeight = $container?.offsetHeight || 480;
		const containerWidth = $container?.offsetWidth || 854;
		maxStack = Math.max(Math.floor(containerHeight / lineHeight * percent), 1);
		$container?.style.setProperty('--width', `${containerWidth}px`);
	}

	window.addEventListener('resize', calculateMaxStack);
	setInterval(calculateMaxStack, 500);

	const getProperStack = $chat => {
		let min = maxStack, currentMin = Infinity;
		for (let i = 0; i < maxStack; i++) {
			if (!stacks[i]) {
				stacks[i] = 0;
				min = i;
				break;
			} else if (stacks[i] < currentMin) {
				min = i;
				currentMin = stacks[i];
			}
		}
		min = Math.min(min, maxStack);
		if ($chat) {
			if (!stacks[min]) {
				stacks[min] = 1;
			} else {
				stacks[min]++;
			}
			$chat.setAttribute('data-stack', min);
			$chat.style.setProperty('--stack', min);
		}
		return min;
	}

	const applyUserSettings = () => {
		if ($container) {
			calculateMaxStack();

			const { enabled, showUsername, textDecoration, bold, font, danmakuDensity, mode, ...rest } = settings;

			Object.entries(rest).forEach(([key, value]) => {
				$container.style.setProperty(`--${key}`, value);
			});

			if (!enabled || mode !== 'default') {
				$container.innerHTML = '';
				stacks = [];
			}

			if (!enabled) {
				$container.style.setProperty('display', 'none');
			} else {
				$container.style.removeProperty('display');
			}

			if (showUsername) {
				$container.classList.remove('hide-username');
			} else {
				$container.classList.add('hide-username');
			}

			if (bold) {
				$container.classList.add('bold');
			} else {
				$container.classList.remove('bold');
			}

			if (font === 'Default') {
				$container.style.removeProperty('--font-family');
			} else {
				$container.style.setProperty('--font-family', font);
			}

			$container.setAttribute('data-text-decoration', textDecoration);
		}
	}

	window._twitchChatDanmaku['default'] = {
		init($el, userSettings) {
			$container = $el;
			settings = userSettings;
			applyUserSettings();
		},

		onSettingsChange(userSettings) {
			settings = userSettings;
			applyUserSettings();
		},

		onDanmaku($username, $message) {
			if (!settings?.enabled) return;
			if ($message?.querySelector('.chat-line__message--deleted-notice') || $username?.querySelector('.chat-line__message--deleted-notice')) return;
			const $chat = document.createElement('div');
			$chat.classList.add('danmaku-chat');

			const $usernameContainer = document.createElement('span');
			$usernameContainer.classList.add('danmaku-username');
			$usernameContainer.appendChild($username);
			$chat.appendChild($usernameContainer);

			const $messageContainer = document.createElement('span');
			$messageContainer.classList.add('danmaku-message');
			$messageContainer.appendChild($message);
			$chat.appendChild($messageContainer);

			$chat.addEventListener('animationend', () => $chat.remove());

			const stack = getProperStack($chat) || 0;

			$container.appendChild($chat);

			setTimeout(() => {
				let length = $message.getBoundingClientRect().width / $container.getBoundingClientRect().width || 0;
				$chat.style.setProperty('--length', length);

				waitUntil(() =>
					!$container || !$container.contains($chat) || (
						$container.getBoundingClientRect().left + $container.getBoundingClientRect().width >=
						$chat.getBoundingClientRect().left + $chat.getBoundingClientRect().width + 200
					)
				).then(() => {
					stacks[stack] = Math.max(stacks[stack] - 1, 0) || 0;
				})
			}, 0);
		}
	};
})();



