---
title: iTerm2冷启动加速
date: 2025-04-28
pubDatetime: 2025-04-28
author: wuyiwai
tags:
  - 技术
summary: 记录加速iIterm2冷启动的优化过程
description: 记录加速iIterm2冷启动的优化过程
---
## 前言
最近不知道更新了什么导致 `iTerm2` 启动时很慢，体感上时不时到10s，不一定能复现，所以希望定位出问题并解决启动慢的问题。

## 收集性能数据
如果把这个当成性能优化的问题来看，那么要解决性能问题得先知道性能数据继而分析出性能问题在哪。

`mac` 默认的 `shell` 是 `zsh`，而 `zsh` 自带了一个用来分析加载性能的工具 - `zprof`，详情文档可以参考 - [Profiling your zsh setup with zprof](https://www.bigbinary.com/blog/zsh-profiling),具体的操作是：

将以下内容添加到您的 `.zshrc` 文件顶部以加载 `zprof`

```
zmodload zsh/zprof
```

在你的 `.zshrc` 底部添加以下内容

```
zprof
```
这将分析你的 zsh 脚本，并打印出在 shell 启动期间运行的所有命令的摘要以及执行它们所需的时间。运行 `exec zsh` 以应用更改并重新启动你的 `shell`。你的 `shell` 将打印出类似以下内容

![](https://raw.githubusercontent.com/wuyiwai/Source/master/iterm2-prof.png)

就可以看到具体是哪些函数调用占用比较多，进而往下优化

## 优化策略

下面列举一些常见的函数描述和优化策略

|      函数       |                         描述                         |                                                                               优化策略                                                                               |
| :-----------: | :------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   compinit    |   初始化 Zsh 的补全系统，读取 `$fpath` 中的补全定义文件，并将它们加载到内存中。   | 1. 延迟加载 `compinit`，将其移动到 `~/.zshrc` 的末尾。<br>2. 使用 `compinit -C` 强制使用 `compdump` 文件。<br>3. 定期清理 `$fpath`，移除不必要的目录。<br>4. 使用 `zcompcache` 插件在后台异步生成 `compdump` 文件。 |
|    compdef    |            定义补全规则，允许为特定的命令或上下文指定如何进行补全。            |                                                                  确保只为必要的命令定义补全规则，避免定义过多或不必要的规则。                                                                  |
|   compdump    |         存储补全系统的缓存数据，用于提高后续 Shell 会话的启动速度。          |                                      1. 使用 `compinit -C` 强制使用 `compdump` 文件。<br>2. 定期手动删除 `compdump` 文件，以在添加或修改补全定义后强制重新生成。                                      |
|  _omz_source  |      Oh My Zsh 的内部函数，用于加载 Oh My Zsh 的核心库和插件。       |                            1. 减少 Oh My Zsh 插件的数量，在 `~/.zshrc` 中的 `plugins` 数组中移除不常用或不需要的插件。<br>2. 确保 `$ZSH_CUSTOM` 目录中只包含必要的自定义插件和主题。                            |
| handle_update |     Oh My Zsh 的自动更新机制，在每次启动 Shell 时检查是否有新版本可用。     |                                                      在 `~/.zshrc` 中设置 `DISABLE_AUTO_UPDATE="true"` 以禁用自动更新。                                                      |
|   compaudit   | Zsh 的内置函数，用于检查当前用户可写的目录是否存在于 `$PATH` 中，以防止潜在的安全风险。 |                                     1. 优化 `$PATH`，确保其中只包含必要的目录，移除不需要的或重复的目录。<br>2. 使用 `typeset -U path` 自动移除 `$PATH` 中的重复目录。                                     |
| test-ls-args  |        Oh My Zsh 的一个函数，用于测试 `ls` 命令的参数支持情况。        |                       1. 如果 `test-ls-args` 的执行时间较长，考虑使用更快的 `ls` 替代品，如 `exa` 或 `lsd`。<br>2. 如果不需要 `ls` 的特殊参数支持，可以考虑禁用或移除 `test-ls-args` 函数。                       |
|               |                                                    |                                                                                                                                                                  |
