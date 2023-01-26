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
		const containerHeight = $container.offsetHeight || 480;
		const containerWidth = $container.offsetWidth || 854;
		maxStack = Math.max(Math.floor(containerHeight / lineHeight * percent), 1);
		$container.style.setProperty('--width', `${containerWidth}px`);
	}

	window.addEventListener('resize', calculateMaxStack);
	setInterval(calculateMaxStack, 500);

	const getProperStack = $chat => {
		let min = maxStack - 1, currentMin = Infinity;
		for (let i = 0; i < maxStack; i++) {
			if (!stacks[i]?.length) {
				if (!stacks[i]) {
					stacks[i] = [];
				}
				min = i;
				break;
			} else {
				if (stacks[i].length < currentMin) {
					min = i;
					currentMin = stacks[i].length;
				}
			}
		}
		min = Math.min(min, maxStack - 1);
		if ($chat) {
			if (!stacks[min]) {
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
				stacks = [];
				$container.innerHTML = '';
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

			const BIAS = 0.5;

			setTimeout(() => {
				let length = Math.min($message.getBoundingClientRect().width / $container.getBoundingClientRect().width * BIAS, 2) || 0;
				$chat.style.setProperty('--length', length);

				setTimeout(() => {
					stacks[stack] = stacks[stack]?.filter($c => $c !== $chat) || [];
				}, settings.duration * Math.max(length * 1.5, 0.55) * 1000)
			}, 0);
		}
	};
})();



