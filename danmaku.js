const Danmaku = function (entry, layer, config) {
	this.username = entry.username;
	this.content = entry.content;
	this.layer = layer;
	this.html = $(`<span title='${this.username}'>${this.content}</span>`);
	this.html.attr('layer', layer);
	this.html.css('height', (parseInt(config.font_size) + 4) + 'px');
	this.html.css('opacity', config.opacity);
	this.html.css('font-weight', config.bold ? 'bold' : 'default');
	this.html.css('transition-duration', `${config.duration}s`);
	this.html.css('font-size', config.font_size + 'px');
	this.html.css('top', (layer * (parseInt(config.font_size) + 4)) + 'px');
	if (config.font && config.font !== 'Default') {
		this.html.css('font-family', config.font);
	}
	switch (config.textDecoration) {
		case 'none':
			break;
		case 'shadow':
			this.html.addClass('shadow');
			break;
		case 'stroke':
			this.html.addClass('stroke');
			break;
	}
	setTimeout(() => { if (this.html) this.html.remove() }, config.duration * 1000 + 2000);
}

Danmaku.prototype.attachTo = function (container) {
	let width = container.clientWidth;
	this.html.addClass('danmaku');
	this.html.css('transform', `translateX(${width}px)`);
	this.html.css('visibility', `visible`);
	container.insertAdjacentElement('beforeend', this.html[0]);
	
	setTimeout(() => {
		if (this.html) {
			let myWidth = Math.floor(this.html.width() + 100);
			this.html.css('transform', `translateX(-${myWidth}px)`);
		}
	}, 0);
	this.html.one("webkitTransitionEnd otransitionend msTransitionEnd transitionend",
		() => { this.html.remove(); }
	);
}
