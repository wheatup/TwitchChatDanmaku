# Twitch Chat Danmaku (Twitch聊天弹幕)

<hr/>

### [English Documentation](#summary)
### [中文说明](#中文说明-1)

<hr/>

## <span id="summary">Summary</span>

> * This is a chrome extension that brings danmaku (barrage comments) feature to twitch.tv, with fully customizable settings.
> * You can watch twitch chat directly on the stream without having to glance at the chat window, even possible in full screen mode.
> * This extension supports all kinds of emoticons; you won't miss any detail of any chat!
> * Have fun!

## Install

### Online Version (Recommended)
> Download from: [Google App Store](https://chrome.google.com/webstore/detail/twitch-chat-danmaku/koiphfkghjgmncbkcpfnegnbcbomlchg)

### Standalone Version
> Download from: [GitHub](https://github.com/wheatup/TwitchChatDanmaku/raw/master/build/TwitchChatDanmaku.crx)

### Standalone Installation
> 1. Download [TwitchChatDanmaku.crx](https://github.com/wheatup/TwitchChatDanmaku/raw/master/build/TwitchChatDanmaku.crx) file.
> 2. Open up chrome, in the address bar, type ```chrome://extensions/```, and enter.
> 3. Turn on Developer Mode at the top right corner.
> 4. Click and drag the downloaded file into the viewport.

## Preview

![preview](https://lh3.googleusercontent.com/eQeZIQNlqrZe_dtKCtNZdv_ZDZoh-vKJ3hPFDI1FmOHyIdQpQDfmZPof8H_1yNvn1803lBj6=w640-h400-e365)

## <span id="ChangeLog">Change Logs</span>

### 1.1.5
> * Fixed a bug that the danmaku stays shorter than expected.
> * Fixed a bug that some of the danmaku is not affected by global style settings.
> * Adjust the danmaku easing function.

### 1.1.4
> * Tweek some settings.

### 1.1.3
> * Drastically increased the performance.
> * Fixed a bug that may cause some danmaku stay on the screen forever.

### 1.0.10
> * New avaliable language: 日本語.
> * Slightly improves performance.
> * Disable danmaku will now hide danmaku immediately.
> * Now maximum count of danmaku rows will be depend on the height of the video area.

### 1.0.9
> * Fixed some locale translation errors.
> * Temporarily removed Srpski support due to an encoding error.

### 1.0.8
> * Add text style option.
> * Remove apply button, now all settings will apply instantly.
> * More supported languages: Srpski, Deutsch.

### 1.0.7
> * Use page action instead of browser action.
> * Add more locale texts.

### 1.0.6
> * Add locale feature, now supports English, 中文(简体), 中文(繁體).

### 1.0.5
> * Fixed a bug that single emoticon chat might not show up properly.

### 1.0.4
> * Fixed a bug that occasionally some part of the chat is missing.

### 1.0.3
> * Fixed a bug that the config won't load up properly when first installed.

### 1.0.2
> * Add fullscreen compatibility.

### 1.0.1
> * Now you can reset the settings by clicking Reset to Default button.

### 1.0.0
> * First commit.

<hr/>

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

## 预览

![preview](https://lh3.googleusercontent.com/eQeZIQNlqrZe_dtKCtNZdv_ZDZoh-vKJ3hPFDI1FmOHyIdQpQDfmZPof8H_1yNvn1803lBj6=w640-h400-e365)

## <span id="ChangeLogCN">更新日志</span>

### 1.1.5
> * 修复了弹幕的显示时间短于预期的BUG。
> * 修复了某些文字不受全局弹幕样式影响的BUG。
> * 调整了弹幕的缓动动画方法。

### 1.1.4
> * 修改某些设置。

### 1.1.3
> * 大幅提高性能。
> * 修复了一个可能导致弹幕不会消失的bug。

### 1.0.10
> * 新增语言: 日本語.
> * 稍微提高了性能。
> * 点击禁用弹幕可以立即隐藏所有弹幕。
> * 现在弹幕的最大行数取决于屏幕大小了。

### 1.0.9
> * 修复一些翻译错误。
> * 由于某些兼容性问题，暂时移除了塞尔维亚语的支持。

### 1.0.8
> * 增加文字样式选项。
> * 移除了应用按钮，现在所有改动都会立即生效。
> * 更多支持语言：塞尔维亚语，德语。

### 1.0.7
> * 使用页面驱动替换浏览器驱动。
> * 增加更多多语言文本。

### 1.0.6
> * 增加多语言支持，现在支持英语, 中文(简体), 中文(繁體).

### 1.0.5
> * 修复某些弹幕显示不正常的bug。

### 1.0.4
> * 修复某些弹幕的某些内容缺失的问题。

### 1.0.3
> * 修复配置文件加载出错的问题。

### 1.0.2
> * 增加全屏支持。

### 1.0.1
> * 增加重设设置的功能。

### 1.0.0
> * 初次提交。
