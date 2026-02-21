---
title: Claude code速记
date: 2026-01-01
pubDatetime: 2026-01-01
summary: 汇总一些不常用的用法，可能需要用到的用法
description: 汇总一些不常用的用法，可能需要用到的用法
tags:
  - 技术
---


- 自动编辑模式(不需要确认)：`shift + tab` 选择 `auto-accept edits on`
- plan模式：`shift + tab` 选择 `plan mode`
- 深度思考：提示词带上 `深度思考` 等关键词
- 清空所有聊天记录：`rm -rf ~/.claude/projects/*`
- yolo模式：`claude --dangerously-skip-permissions`，可以按 `shift + tab`取消
- 常用命令:

```
> /clear 清空上下文
> /compact 压缩对话
> /cost 查看花费
> /status 查看当前状态
> /doctor 检测当前状态
> /resume 恢复对话/查看聊天记录
```
- 维护全局记忆文件：`~/.claude/CLAUDE.md`
- 维护项目记忆文件：在对应项目目录下 `> /init`初始化项目记忆文件
- 执行终端命令： `!` 会进入命令模式，此时可以执行命令