if (typeof window._twitchChatDanmaku === 'undefined') {
	window._twitchChatDanmaku = {};
}

(() => {
	let $container;
	let settings = {};
	const applyUserSettings = () => {
		if ($container) {
			const { enabled, ...rest } = settings;

			Object.entries(rest).forEach(([key, value]) => {
				$container.style.setProperty(`--${key}`, value);
			});

			if (!enabled) {
				$container.style.setProperty('display', 'none');
			} else {
				$container.style.removeProperty('display');
			}
		}
	}

	window._twitchChatDanmaku['template'] = {
		/**
		 * This is called when the first time danmaku is ready
		 * @param {*} $el Danmaku container, with ID "danmaku-container"
		 * @param {*} userSettings user settings
		 */
		init($el, userSettings) {
			console.log('init', { $el, userSettings })
			$container = $el;
			settings = userSettings;
			applyUserSettings();
		},

		/**
		 * This is called when user tweeked settings from popup
		 * @param {*} userSettings user settings
		 */
		onSettingsChange(userSettings) {
			console.log('onSettingsChange', { userSettings });
			settings = userSettings;
			applyUserSettings();
		},

		/**
		 * This is called when a danmaku is detected
		 * @param {*} $username The username node of the danmaku
		 * @param {*} $message The message node of the danmaku
		 */
		onDanmaku($username, $message) {
			console.log('onDanmaku', { $username, $message });
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

			$container.appendChild($chat);
		}
	};
})();



