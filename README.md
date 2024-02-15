# Twitch Chat Danmaku (Twitch聊天弹幕)

<hr/>

### [English Documentation](#summary)
### [中文说明](#中文说明-1)

<hr/>

## <span id="summary">Summary</span>

> * This is a Chrome extension that brings a danmaku (barrage) comments feature, to twitch.tv, with fully customizable settings.
> * Make the chat more exciting and vibrant! Bring the spirit of NicoNico to Twitch!
> * You can view the Twitch chat directly on the stream without having to glance at the chat window, even possible in full screen mode.
> * This extension supports most emoji/emoticons, so you won't miss anything going on in the chat!
> * Two modes - danmaku for a barrage of comments on screen, or scroll to overlay the traditional chat on screen.
> * Have fun!

## Installation

### Online Version (Recommended)
> Download from: [Chrome Web Store](https://chrome.google.com/webstore/detail/twitch-chat-danmaku/koiphfkghjgmncbkcpfnegnbcbomlchg)

### Standalone Version
> Download from: [GitHub](https://github.com/wheatup/TwitchChatDanmaku/raw/master/build/TwitchChatDanmaku.crx)

### Standalone Installation
> 1. Download [TwitchChatDanmaku.crx](https://github.com/wheatup/TwitchChatDanmaku/raw/master/build/TwitchChatDanmaku.crx) file.
> 2. Open up Google Chrome, and enter ```chrome://extensions/``` in the address bar.
> 3. Turn on Developer Mode via the switch at the top right corner of the window.
> 4. Click and drag the downloaded file into the viewport.

### ~~For Firefox Users~~ (Obsolete, need updates)

* Thanks to [Chih-Hsuan Fan](https://github.com/pc035860), this extension now ~~partially~~ supports FireFox!
* *The custom font feature is disabled for FireFox due to support discrepancies, sorry for the inconvenience.*

> 1. Go to [Twitch Chat Danmaku for FireFox](https://addons.mozilla.org/en-US/firefox/addon/twitch-chat-danmaku/) and install the linked extension!


## Example (Danmaku mode)

![preview](https://lh3.googleusercontent.com/eQeZIQNlqrZe_dtKCtNZdv_ZDZoh-vKJ3hPFDI1FmOHyIdQpQDfmZPof8H_1yNvn1803lBj6=w640-h400-e365)

## Example (Scroll mode)
![preview](https://lh3.googleusercontent.com/pw/ABLVV84yGxhbCuEgqPDr56e87p5BXZPz7IIejEsrufBSVsgvQBsRQClXoxU-XHP9RN-BSFIZq38h4k6AVoGprrZettaqPFs_1RbeNNM55N6GKOLS91o74PMoRuy4cXB96de7XuK9L29UXHlF80wzRyGNdTCTEl_IfVBt7WglGXWwuj9FSwTXtCi0e8sDn-2UPt4eQYvGePy1TxlLhPNlSKR-CfYH3ruqD38ojcH9zUiz4SzkxmxyjKUhGDgQ5AQxFFY79x2qdJvIzid6TPGb6vktFV1VFEUPBPQk5p6_571XJbwZE6dvMNcISB45Uvbcn8AmRAwsHVUfKRWEIgDUAzZLyKGqNc6VmahQ3Zec6D7641Qmz_H0w5KCXPNe0fICTsDnkQbyZJMJMZQU_z50YfiS92w-7VGX1IX33RGAS-6kG37PI1EDSUgMoe8Gi4-_GBiRt84xyYUelMLYCmRB6tADgRDY3HXVhxdKJ_wz7_ISwhUDIaBD00mHAKXEUrZcX22_m4af6h-Hpmk3c2TV8aQJM-PdHHm6WSnNNKgHEu1kxSNDHmNiEf-YcgL69ts1XqBeAlzgZeLkRUSQ5lY2nH42CVxGJfE5znkEJJltpDoU9sZIuGWERwFdfWE9ZfIJlp6pNSIjdPmtzFkyhK9L_K5wazPZPpQpnmdYqxWIk2iaTVWQ-aGg0XyEHxY6yc76wK0lAxphQhEnh49Lj0kQN0u1CiQRRvuTo9CRnUX9JXWxPT9jQAFSlgEp5kMoMsJhkRsohKbEB42vfHiQUnj5xq2ASAPEvZj1Ff7ZEHiDF-K9xtuQu51ejemWWWM6JekvH-Pp7D_ZII99yPYbifLUcVrydKveMiH2hFjbZ8lraitnLfm1lbt5AjIitk7MGxkY0DfIEu28_YxNjQ1uKOKUdYNAHCbELqQEw7NomhFTXolkXnRxMbMdutUaFIzGoy2CaPGFuCW6fVyTly1IQ0l2dHOMIrAztWrJNsw0MHE=w1623-h911-s-no-gm)

## Settings 
> 1. Danmaku - Enables/disables this extension's features.
> 2. Username - Enable this to show the username of the poster with each comment in Danmkau mode.
> 3. Mode - Danmaku mode adds a barrage of comments scrolling horizontally across the screen, while Scroll mode adds the regular chat as a transparent overlay on top of the video.
> 4. Duration - How long comments stay on the screen in Danmaku mode.
> 5. Opacity - How transparent the comments overlayed by this extension are
> 6. Font - The font of the comments.
> 7. Font size - Adjusts the size of the comments.
> 8. Filters - Add regex here to filter what type of messages you want this extension to display, rather than all of them.
> * Danmaku mode only settings
> 1. Text style - effect options to make the chat easier to read
> 2. Density - How much of the screen the barrage can take up.
> * Scroll mode only settings
> 1. Position - The location on screen where. the chat is overlayed.
> 2. Width - Width of the chat overlay rectangle

## Development

1. Run ```npm install``` to install dependencies.
2. Run ```npm run sass``` to watch and compile sass files.

# <span id="中文说明-1">中文说明</span>

## 简介

> * 这是为Twitch.tv写的聊天弹幕插件，包含完整的自定义功能。
> * 你可以无时无刻的观看到聊天内容，全屏也没问题。
> * 本插件支持Twitch表情图标，以及任何第三方表情图标。

## 安装

### 在线版（建议）
> 点击 [Google App Store](https://chrome.google.com/webstore/detail/twitch-chat-danmaku/koiphfkghjgmncbkcpfnegnbcbomlchg)进行安装

### 离线版（供墙内用户使用）
> 点击 [TwitchChatDanmaku.crx](https://github.com/wheatup/TwitchChatDanmaku/raw/master/build/TwitchChatDanmaku.crx)下载crx文件。

### 离线安装方法
> 1. 首先下载 [TwitchChatDanmaku.crx](https://github.com/wheatup/TwitchChatDanmaku/raw/master/build/TwitchChatDanmaku.crx) 文件。
> 2. 打开chrome，在地址栏输入 ```chrome://extensions/``` 并回车。
> 3. 在页面右上角，启用开发者模式。
> 4. 将下载的crx文件拖曳至浏览器窗口中完成安装。

### ~~火狐浏览器安装方法~~ (已过期，需更新)

* 感谢 [Chih-Hsuan Fan](https://github.com/pc035860) 的贡献，本扩展现已~~部分~~支持火狐浏览器！
* *因浏览器支持原因，火狐版本暂不支持自定义字体，望理解。*

> 1. 移步至[Twitch聊天弹幕火狐版](https://addons.mozilla.org/en-US/firefox/addon/twitch-chat-danmaku/)并安装。

## 预览

![preview](https://lh3.googleusercontent.com/eQeZIQNlqrZe_dtKCtNZdv_ZDZoh-vKJ3hPFDI1FmOHyIdQpQDfmZPof8H_1yNvn1803lBj6=w640-h400-e365)
