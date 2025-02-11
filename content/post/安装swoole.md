---
title: 安装swoole
date: 2024-09-30
summary: 记录mac本地安装swoole的过程，方便自用
tags: ["技术", "swoole"]
---
# 准备材料
- [swoole 官网](https://wiki.swoole.com/zh-cn/#/environment)
- [源码发行版本](https://github.com/swoole/swoole-src/releases)

- 下载源码
- 解压源码，cd 到源码目录
```
$ phpize

$ ./configure

$ sudo make && sudo make install
```
- 找到 php. ini 的目录
```
$ php -i | grep php.ini

Configuration File (php.ini) Path => /opt/homebrew/etc/php/8.3
Loaded Configuration File => /opt/homebrew/etc/php/8.3/php.ini
```
- 在 `php. ini` 中加入一行 ` extension=swoole.so ` 来启用 swoole 扩展
- 检查是否启用了 `swoole` 扩展
```
$ php --ri swoole
swoole

Swoole => enabled
Author => Swoole Team <team@swoole.com>
Version => 6.0.0
Built => Sep 30 2024 15:10:53
coroutine => enabled with boost asm context
kqueue => enabled
rwlock => enabled
http2 => enabled
json => enabled
pcre => enabled
zlib => 1.2.12
brotli => E16781312/D16781312

Directive => Local Value => Master Value
swoole.enable_library => On => On
swoole.enable_fiber_mock => Off => Off
swoole.enable_preemptive_scheduler => Off => Off
swoole.display_errors => On => On
swoole.use_shortname => On => On
swoole.unixsock_buffer_size => 262144 => 262144
```
## 遇到的问题
### /opt/homebrew/Cellar/php/8.3.8/include/php/ext/pcre/php_pcre. h:23:10: fatal error: 'pcre 2. h' file not found

本质是系统缺少 pcre 2 库或者 pcre 2. h 头文件没有被正确地链接到 PHP 的安装目录

- 首先确保已经安装了 pcre 2 的库
```
brew install pcre2
```
- 创建软链, 注意替换正确的链接
```
ln -s /opt/homebrew/Cellar/pcre2/10.44/include/pcre2.h /opt/homebrew/Cellar/php/8.3.8/include/php/ext/pcre/pcre2.h
```
