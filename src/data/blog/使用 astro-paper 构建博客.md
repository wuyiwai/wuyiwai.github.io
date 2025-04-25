---
title: 使用 astro-paper 构建博客
date: 2025-04-25
pubDatetime: 2025-04-25
description: 新发现了一个比较好看的博客主题，记录迁移过程
summary: 新发现了一个比较好看的博客主题，记录迁移过程
tags: ["博客"]
---
## 前置
本来打算不折腾博客了，专注以内容的生产，但是看到 [astro-paper](https://github.com/satnaing/astro-paper) 的时候还是为之惊艳，demo页面是：https://astro-paper.pages.dev/，效果图如下：

#### 主页

![](https://raw.githubusercontent.com/wuyiwai/Source/master/astro-paper-compressed.png)

#### 标签页
![](https://raw.githubusercontent.com/wuyiwai/Source/master/astro-paper-tag-compressed.png)

#### 归档页
![](https://raw.githubusercontent.com/wuyiwai/Source/master/astro-paper-archive-compressed.png)


有几个比较重要的要素是我比较喜欢的：
- 页面简洁
- 标题和内容摘要预览都用不同的颜色进行区分，对比度非常高
- 归档页按时间轴整理的样式特别好看
- astro的缓存带来的性能提升

## 本地部署
接下来开始准备部署。

部署的思路本质上还是希望用 `github.io` 进行展示，我只需要专注以生产 `markdown` 资料，而不需要关注部署相关的事情，所以还是沿用之前的思路，用 `github action` 去实现自动部署在 `github page`上。

首先，官方文档在这 - [astro-paper](https://github.com/satnaing/astro-paper)

### 本地部署调试
```
## 确保本地有 pnpm

## 在本地找个空文件夹，创建好模板文件
## 这里特别注意，由于我是在本仓库创建并切换了 astro 分支，所以该目录非空，继而创建了 temp 目录，在temp目录中创建模板后再把模板文件复制到分支目录，不然 .git 会冲突，这里后续要优化下改成 subgit 进行同步
pnpm create astro@latest --template satnaing/astro-paper 

## 安装依赖
pnpm install

## 本地运行调试，一般运行后可以在 localhost:4321 进行访问，astro 会监听资源变更进行实时渲染
pnpm run dev

## 构建页面
pnpm run build
```

## 配置相关
具体可以参考：
- [How to configure AstroPaper theme](https://astro-paper.pages.dev/posts/how-to-configure-astropaper-theme/) - 进行主要的配置项，包括网站标题、页面展示等
- [Adding new posts in AstroPaper theme](https://astro-paper.pages.dev/posts/adding-new-posts-in-astropaper-theme/) - 配置文章属性
- [Predefined color schemes](https://astro-paper.pages.dev/posts/predefined-color-schemes/) - 选择预设配色

## github action部署
配置好个人网站的配置和经过本地部署调试之后，便可以开始写 `github action` 进行部署了

具体 `action` 可以参考官方案例 [astro-paper ci](https://github.com/satnaing/astro-paper/blob/main/.github/workflows/ci.yml)

简单调试最终配置文件如下：
```
name: Deploy by Astro

  

on:

push:

branches: [ "astro-paper" ] # 当 astro-paper 分支有推送时触发

  

jobs:

build:

name: Code standards & build

runs-on: ubuntu-latest

timeout-minutes: 3

  

strategy:

matrix:

node-version: [20]

steps:

- name: "☁️ Checkout repository"

uses: actions/checkout@v4

  

- name: "📦 Install pnpm"

uses: pnpm/action-setup@v4

with:

version: 10

  

- name: Use Node.js ${{ matrix.node-version }}

uses: actions/setup-node@v4

with:

node-version: ${{ matrix.node-version }}

cache: "pnpm"

  

- name: "📦 Install dependencies"

run: pnpm install

  

- name: "🚀 Build the project"

run: pnpm run build

  

# 8. 部署到 GitHub Pages

- name: Deploy

uses: peaceiris/actions-gh-pages@v3

with:

github_token: ${{ secrets.PAT }}

publish_dir: ./dist # Astro 构建输出目录是 dist
```

后续当有新的 `commit` 推送时便可以进行自动构建

## 结尾
todo：
- seo
- 访问计数