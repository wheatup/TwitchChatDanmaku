export const waitUntil = (condition, { timeout = 0, interval = 1000 / 60 } = {}) => new Promise((resolve, reject) => {
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