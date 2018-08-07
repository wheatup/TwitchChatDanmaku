const Danmaku = function(entry, layer, config){
   this.username = entry.username;
   this.content = entry.content;
   this.layer = layer;
   this.html = $(`<span title='${this.username}'>${this.content}</span>`);
   this.html.attr('layer', layer);
   this.html.css('height', (parseInt(config.font_size) + 4) + 'px');
   this.html.css('opacity', config.opacity);
   this.html.css('animation-duration', `${config.duration}s`);
   this.html.css('font-size', config.font_size + 'px');
   this.html.css('top', (layer * (parseInt(config.font_size) + 4)) + 'px');
   switch(config.textDecoration){
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

Danmaku.prototype.attachTo = function(container){
   this.html.addClass('danmaku');
   container.append(this.html);
   this.html.one("webkitAnimationEnd oanimationend msAnimationEnd animationend",
      ()=>{this.html.remove();}
   );
}
