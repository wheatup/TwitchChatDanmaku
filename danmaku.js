const Danmaku = function (entry, layer, config) {
   this.username = entry.username;
   this.content = entry.content;
   this.layer = layer;
   this.html = $(`<span title='${this.username}'>${this.content}</span>`);
   this.html.attr('layer', layer);
   this.html.css('height', (parseInt(config.font_size) + 4) + 'px');
   this.html.css('opacity', config.opacity);
   this.html.css('transition-duration', `${config.duration}s`);
   this.html.css('font-size', config.font_size + 'px');
   this.html.css('top', (layer * (parseInt(config.font_size) + 4)) + 'px');
   setTimeout(() => { if (this.html) this.html.remove() }, config.duration * 1000 + 2000);
   switch (config.textDecoration) {
      case 'none':
         this.html.css('text-shadow', 'none');
         break;
      case 'shadow':
         this.html.css('text-shadow', '0px 2px 0 black');
         break;
      case 'stroke':
         this.html.css('text-shadow', '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000');
         break;
   }
}

Danmaku.prototype.attachTo = function (container) {
   let width = container.width();
   this.html.addClass('danmaku');
   this.html.css('transform', `translateX(${width}px)`);
   this.html.css('visibility', `visible`);
   container.append(this.html);
   setTimeout(() => {
      if (this.html) {
         let myWidth = this.html.width() + width;
         this.html.css('transform', `translateX(-${myWidth}px)`);
      }
   }, 0);
   this.html.one("webkitTransitionEnd otransitionend msTransitionEnd transitionend",
      () => { this.html.remove(); }
   );
}
