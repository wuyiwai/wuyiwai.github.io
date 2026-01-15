# Wuyiwai's Blog

基于 [AstroPaper](https://github.com/satnaing/astro-paper) 主题构建的个人博客。

## 常用命令

| 命令 | 说明 |
| :--- | :--- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动开发服务器 (localhost:4321) |
| `pnpm build` | 构建生产版本到 `./dist/` |
| `pnpm preview` | 本地预览构建结果 |
| `pnpm format` | 格式化代码 |
| `pnpm lint` | 代码检查 |

## 写文章

在 `src/data/blog/` 目录下创建 `.md` 文件：

```markdown
---
title: 文章标题
pubDatetime: 2026-01-15T10:00:00+08:00
description: 文章描述
tags:
  - 标签1
  - 标签2
---

正文内容...
```

### Frontmatter 字段说明

| 字段 | 必填 | 说明 |
| :--- | :---: | :--- |
| `title` | 是 | 文章标题 |
| `pubDatetime` | 是 | 发布时间 (ISO 8601 格式) |
| `description` | 是 | 文章描述，用于 SEO 和预览 |
| `tags` | 否 | 标签数组 |
| `featured` | 否 | 是否置顶 (true/false) |
| `draft` | 否 | 是否为草稿 (true/false) |

## 同步上游更新

```bash
# 1. 获取上游更新
git fetch upstream --tags

# 2. 查看最新版本
git tag -l | tail -5

# 3. 合并指定版本
git merge v5.x.x --allow-unrelated-histories

# 4. 解决冲突后安装依赖
pnpm install
```

> 首次使用需先添加 upstream: `git remote add upstream https://github.com/satnaing/astro-paper.git`

## 配置文件

- `src/config.ts` - 网站基本配置（标题、作者、描述等）
- `src/constants.ts` - 社交链接配置

## 目录结构

```
src/
├── data/blog/     # 博客文章 (.md)
├── pages/         # 页面
├── components/    # 组件
├── layouts/       # 布局
├── styles/        # 样式
└── config.ts      # 配置
```

## License

MIT
