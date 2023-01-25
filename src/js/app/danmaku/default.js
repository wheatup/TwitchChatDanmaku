if (typeof window._twitchChatDanmaku === 'undefined') {
	window._twitchChatDanmaku = {};
}

(() => {
	let $container;
	let settings = {};
	let stacks = [], maxStack = 20;

	const calculateMaxStack = () => {
		if (!settings) return;
		const { danmakuDensity, fontSize } = settings;
		const percent = ((+danmakuDensity || 0) + 1) / 4;
		const lineHeight = fontSize * 1.2;
		const containerHeight = $container.offsetHeight;
		maxStack = Math.floor(containerHeight / lineHeight * percent);
	}

	window.addEventListener('resize', calculateMaxStack);

	const getProperStack = $chat => {
		let min = maxStack - 1, currentMin = Infinity;
		for (let i = 0; i < maxStack; i++) {
			if (!stacks[i]?.length) {
				stacks[i] = [];
				min = i;
				break;
			} else {
				if (stacks[i].length < currentMin) {
					min = i;
					currentMin = stacks[i].length;
				}
			}
		}
		if ($chat) {
			if(!stacks[min]) {
				stacks[min] = [];
			}
			stacks[min].push($chat);
			$chat.setAttribute('data-stack', min);
			$chat.style.setProperty('--stack', min);
		}
		return min;
	}

	const applyUserSettings = () => {
		if ($container) {
			calculateMaxStack();

			const { enabled, showUsername, textDecoration, bold, font, danmakuDensity, ...rest } = settings;

			Object.entries(rest).forEach(([key, value]) => {
				$container.style.setProperty(`--${key}`, value);
			});

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
			const stack = getProperStack($chat);
			
			$container.appendChild($chat);

			const BIAS = 0.5;

			setTimeout(() => {
				const length = Math.min($message.getBoundingClientRect().width / $container.getBoundingClientRect().width * BIAS, 2);
				$chat.style.setProperty('--length', length);

				setTimeout(() => {
					stacks[stack] = stacks[stack].filter($c => $c !== $chat);
				}, settings.duration * (length + 1) * 1000 * 0.5)
			}, 0);
		}
	};
})();



