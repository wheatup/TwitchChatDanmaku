if (typeof window._twitchChatDanmaku === 'undefined') {
	window._twitchChatDanmaku = {};
}

(() => {
	let $container, $scrollContainer;
	let settings = {};
	const applyUserSettings = () => {
		if ($container) {
			const { enabled, showUsername, scrollLocation, bold, font, mode, ...rest } = settings;

			$scrollContainer?.scrollTo({ left: 0, top: $scrollContainer.scrollHeight, behavior: 'smooth' });

			Object.entries(rest).forEach(([key, value]) => {
				$container.style.setProperty(`--${key}`, value);
			});

			if(!enabled || mode !== 'scroll') {
				$container.innerHTML = '';
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

			if (scrollLocation) {
				$container.setAttribute('data-scroll-location', scrollLocation);
			}
		}
	}

	window._twitchChatDanmaku['scroll'] = {
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
			if (!$scrollContainer || !$container.contains($scrollContainer)) {
				$scrollContainer = document.createElement('div');
				$scrollContainer.classList.add('danmaku-scroll-container');
				$container.appendChild($scrollContainer);
			}
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

			$scrollContainer.appendChild($chat);

			$chat.addEventListener('animationend', () => $chat?.remove());

			$scrollContainer.scrollTo({ left: 0, top: $scrollContainer.scrollHeight, behavior: 'smooth' });
		}
	};
})();



