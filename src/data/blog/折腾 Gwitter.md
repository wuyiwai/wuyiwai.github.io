---
title: 2025年9月
date: 2025-09-13
pubDatetime: 2025-09-13
summary: 折腾 Gwitter 的记录
description: 折腾 Gwitter 的记录
tags:
  - 技术月刊
  - 生活
---
折腾起因是看到个大佬的 weibo 页： https://simonaking.com/Gwitter

他的原理在于：使用github issue作为数据源，用户在github上创建一个公共仓库，只需要在上面发布和编辑issue就可以通过这个项目展示出来。

本来是看这个页面的样式非常简洁，也想方便的接入我的个人博客页。于是开始尝试，遇到了以下的问题：

- 一开始很简单的按照readme文件中的example编写了index.html，但是发现之前没考虑样式不兼容的问题：
	- 我的博客是暗色和橙色搭配的色调，而twitter是白蓝的色调，不搭配
	- 接入 Gwitter 还会遇到嵌入宽度适配的问题（这个倒是好解决）
- 调试了几版都发现不是很好看，而且调试上也不是很方便，在本地写完样式代码，也不是很方便的看到效果，得发布到github page才能看到效果，时间上就有点慢，这个估计要再看看astro的标准调试流程了
- 后面想到其实就是个 github issue api的问题，于是想着自己搭配cursor写一下astro的样式，发现折腾下来反而不好看，这里会涉及到写一个完整的weibo页面要考虑的问题
	- 首先要通过api拉取issue list
		- 如果header不带token，会被限流，所以要带上token
			- 带上token则需要考虑一个问题，前端直接注入token会导致提交代码之后，有心之人可以从页面源代码查到token是什么，这里其实有不必要的安全风险（虽然可以通过github token scope上限制）
				- 所以为了避免上面的问题，前端需要实现通过拉取 一个后端的api，通过api下发issue list，这样相当于是后端服务代理了issue list，可以避免这个问题
	- 拉取到issue list之后要考虑
		- page_size
		- page_total
		- current_page
	- 渲染上要考虑，如果是微博的博文内容，页面上要支持
		- markdown样式
		- issue标签展示
		- issue的发布时间的展示
		- issue的子issue的展示层级逻辑
	- 最后要考虑是否支持评论
- 到了最后发现有个问题无法绕过去：做的这么重，反而背离了用静态博客图简单的初衷，静态博客本质上是先通过在本地渲染好静态文件来减少拉取api带来的时延。所以这意味着我应该要结合github action，在部署时做好页面的初始化，再在静态文件里完成组装。

最后：这是一次有意思的尝试