export const waitUntil = (condition, timeout = 0) => new Promise((resolve, reject) => {
	let res;
	const tick = () => {
		if (res = condition()) {
			resolve(res);
		} else {
			requestAnimationFrame(tick);
		}
	};

	tick();

	if (timeout) {
		setTimeout(() => {
			reject('timeout');
		}, timeout);
	}
});
