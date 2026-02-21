---
title: Ghostty快捷键
date: 2026-02-19
pubDatetime: 2026-02-19
description: 记录Ghostty的常用快捷键
summary: 记录Ghostty的常用快捷键
tags: ["技术"]
---

> 参考文章：
>
> - [My Ghostty setup for Claude Code with SAND Keybindings](https://x.com/dani_avila7/status/2023151176758268349) - claude cli 工作流

# Ghostty 配置文档

 ## 基本信息

 - 配置文件：`~/.config/ghostty/config`
 - 重载配置：`Cmd+Shift+,`
 - 查看选项：`ghostty +show-config --default --docs`

 ## 外观配置

| 配置项                 | 值                     | 说明              |
| ---------------------- | ---------------------- | ----------------- |
| font-family            | JetBrainsMonoNerdFont  | 字体              |
| font-size              | 14                     | 字号              |
| theme                  | Catppuccin Latte/Mocha | 自动切换亮/暗主题 |
| background-opacity     | 0.9                    | 背景透明度        |
| background-blur-radius | 20                     | 背景模糊          |
| cursor-style           | bar                    | 光标样式          |

 ## 快捷键

 ### SAND 助记法

| 助记         | 功能     | 快捷键                            |
| ------------ | -------- | --------------------------------- |
| **S**plit    | 分割面板 | `Cmd+D` (右) / `Cmd+Shift+D` (下) |
| **A**cross   | 标签切换 | `Cmd+Shift+←/→`                   |
| **N**avigate | 面板导航 | `Cmd+Alt+方向键`                  |
| **D**estroy  | 关闭面板 | `Cmd+W`                           |

 ### 完整快捷键列表

 #### 标签管理

| 快捷键        | 功能         |
| ------------- | ------------ |
| `Cmd+T`       | 新建标签     |
| `Cmd+Shift+←` | 上一个标签   |
| `Cmd+Shift+→` | 下一个标签   |
| `Cmd+W`       | 关闭当前面板 |

 #### 分割面板

| 快捷键        | 功能                |
| ------------- | ------------------- |
| `Cmd+D`       | 向右分割            |
| `Cmd+Shift+D` | 向下分割            |
| `Cmd+Alt+←`   | 跳转左侧面板        |
| `Cmd+Alt+→`   | 跳转右侧面板        |
| `Cmd+Alt+↑`   | 跳转上方面板        |
| `Cmd+Alt+↓`   | 跳转下方面板        |
| `Cmd+Shift+E` | 均分所有面板        |
| `Cmd+Shift+F` | 最大化/还原当前面板 |

 #### 字体缩放

| 快捷键  | 功能         |
| ------- | ------------ |
| `Cmd++` | 放大字体     |
| `Cmd+-` | 缩小字体     |
| `Cmd+0` | 重置字体大小 |

 #### 其他

| 快捷键        | 功能             |
| ------------- | ---------------- |
| `` Ctrl+` ``  | 全局唤出快速终端 |
| `Cmd+Shift+,` | 重载配置         |

 ## 特性说明

 ### 快速终端 (Quick Terminal)

 Quake 风格的下拉终端，按 `` Ctrl+` `` 全局唤出。

 - 位置：屏幕顶部
 - 跟随鼠标所在屏幕
 - 失焦自动隐藏
 - 动画时长：0.15s

 ### 安全特性

 - 粘贴保护：开启
 - 括号粘贴安全模式：开启

 ### 性能

 - 滚动缓冲区：25MB