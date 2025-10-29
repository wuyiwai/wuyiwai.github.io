# Wuyiwai 的博客

记录折腾与灵感的个人博客，基于 [Astro](https://astro.build) 与 [AstroPaper](https://github.com/satnaing/astro-paper) 主题构建。这里收集了开发笔记、效率工具、生活记录等多样内容，并通过 GitHub Pages 持续更新。

## 简介
- **在线访问**：[`wuyiwai.github.io`](https://wuyiwai.github.io/)
- **作者**：Wuyiwai
- **描述**：一份持续打磨的数字花园，聚焦开发经验、好物分享与折腾记录。

## 功能特色
- **内容管理**：Markdown 驱动的写作体验，支持 frontmatter 元数据与草稿状态。
- **目录与折叠**：借助 `remark-toc` 与 `remark-collapse` 自动生成目录，并可折叠长列表。
- **亮暗主题**：内置亮/暗色模式切换，记忆用户偏好。
- **站内搜索**：构建时集成 [Pagefind](https://pagefind.app/)，支持全文检索与离线缓存。
- **RSS & Sitemap**：自动输出 `RSS` 订阅源与站点地图，便于订阅与 SEO。
- **归档视图**：提供最新文章、特色内容、标签与归档页面，快速定位感兴趣文章。

## 技术栈
- **框架**：Astro 5 + TypeScript
- **样式**：Tailwind CSS（含 `@tailwindcss/typography` 插件）
- **内容**：Astro Content Collections（自定义 `src/data/blog` 目录）
- **构建增强**：Shiki 代码高亮、Pagefind 搜索、Satori 动态 OG 大图

## 快速开始
### 环境要求
- Node.js ≥ 18
- 推荐使用 [pnpm](https://pnpm.io/) 管理依赖

### 安装与开发
```bash
# 安装依赖
pnpm install

# 启动本地开发服务（默认 http://localhost:4321）
pnpm dev
```

### 常用脚本
- `pnpm build`：运行 `astro check`、构建静态站点并生成 Pagefind 索引。
- `pnpm preview`：本地预览已构建的产物。
- `pnpm lint`：执行 ESLint 代码质量检查。
- `pnpm format` / `pnpm format:check`：使用 Prettier 格式化或校验代码。

## 内容与目录结构
- `src/data/blog/`：Markdown 文章与笔记，文件名即页面路径。
- `src/config.ts`：站点标题、简介、作者信息、分页数量等全局配置。
- `src/pages/`：页面路由（首页、归档、标签、搜索、RSS 等）。
- `src/components/`：复用组件（导航、页脚、文章卡片等）。
- `public/`：静态资源（Favicons、Pagefind UI、开放图像等）。

新增文章时，在 `src/data/blog` 下创建 Markdown 文件并补全 frontmatter，例如：

```md
---
title: 示例文章
description: 一句话描述
pubDatetime: 2025-01-01T08:00:00Z
tags: ["note", "astro"]
featured: true
draft: false
---

正文内容……
```

## 部署与发布
1. 更新 `astro.config.ts` 中的 `site` 与 `src/config.ts` 中的 `website`，确保使用正确域名。
2. 执行 `pnpm build` 生成 `dist/` 目录。
3. 将 `dist/` 部署到 GitHub Pages、Vercel、Netlify 或任意静态站点托管服务。
4. 通过 GitHub Actions 自动化部署时，可在构建完成后上传 `dist` 目录作为发布产物。

## 自定义
- **主题外观**：Tailwind 配置位于 `src/styles/`，可调整颜色、排版与组件样式。
- **社交信息**：在 `src/constants.ts` 中维护社交链接与联系方式。
- **动态 OG 图**：`src/pages/og.png.ts` 使用 Satori 生成分享图，可根据需要定制布局。
- **搜索体验**：如需调整 Pagefind 行为，可在 `package.json` 的 `build` 脚本中修改参数。

## 鸣谢
- [AstroPaper](https://github.com/satnaing/astro-paper)：提供简洁优雅的博客主题基础。
- [Pagefind](https://pagefind.app/)：高性能静态站点搜索。

## License

本项目在 `LICENSE` 文件中采用 **Creative Commons Attribution 4.0 International (CC BY 4.0)** 协议发布。欢迎引用与分享，请注明来源。
