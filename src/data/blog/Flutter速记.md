---
title: Flutter速记
date: 2024-04-20
pubDatetime: 2024-04-20
description: 快速记录Flutter入坑记录，持续更新
summary: 快速记录Flutter入坑记录，持续更新
tags: ["技术", "flutter"]
---
## 参考资料
- [flutter中文站](https://docs.flutter.cn/get-started/install/macos/mobile-android#use-vs-code-to-install-flutter)

## 环境准备
- 设备: mac、安卓

### 安装Rosetta 2 
- 如果你的 Mac 是 [Apple silicon](https://support.apple.com/en-us/HT211814) 处理器，那么有些 Flutter 组件就需要通过 Rosetta 2 来转换适配（[详情](https://github.com/cfug/flutter.cn/pull/7119#issuecomment-1124537969)）。要在 Apple silicon 处理器上运行所有 Flutter 组件，请运行以下指令来安装 [Rosetta 2](https://support.apple.com/en-us/HT211861)。
```
sudo softwareupdate --install-rosetta --agree-to-license
```
### 下载flutter sdk
- [文档](https://docs.flutter.cn/get-started/install/macos/mobile-android#use-vs-code-to-install-flutter)
- 将 Flutter SDK 压缩文件 (zip) 解压到你想要存储的目录中。可以使用以下指令进行解压
```
unzip ~/Downloads/flutter_macos_arm64_3.29.3-stable.zip -d ~/development/
```
- 将flutter加入环境变量
```
vim ~/.zshrc

# 复制以下内容并粘贴到 `~/.zshenv` 文件内的末尾
export PATH=$HOME/development/flutter/bin:$PATH

# 生效环境变量
source ~/.zshrc
```