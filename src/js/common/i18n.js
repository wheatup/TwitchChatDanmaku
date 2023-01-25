export const $ = (text, ...rest) => {
	if (Array.isArray(text) && text.raw) {
		text = text.reduce((acc, cur) => acc + cur + (rest.shift() || ''), '');
	}

	text = /__MSG_(\S+?)__/[Symbol.match](text)?.[1] || text;
	return chrome.i18n.getMessage(text);
}

export const setup = () => {
	let tempHtml = document.body.innerHTML;
	tempHtml = tempHtml
		.replace(/__MSG_\S+?__/g, $)
		.replace('__VERSION__', chrome.runtime.getManifest().version);
	document.body.innerHTML = tempHtml;
}