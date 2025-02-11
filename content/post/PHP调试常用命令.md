---
title: 'PHP调试常用命令'
date: '2024-08-23'
summary: "记录PHP调试速查命令"
tags: ["技术", "php"]
---
#### 找到 php. ini 的位置
```
$ php --ini
Configuration File (php.ini) Path: /opt/homebrew/etc/php/8.3
Loaded Configuration File:         /opt/homebrew/etc/php/8.3/php.ini
Scan for additional .ini files in: /opt/homebrew/etc/php/8.3/conf.d
Additional .ini files parsed:      /opt/homebrew/etc/php/8.3/conf.d/ext-opcache.ini


# 运行脚本
<?php
var_dump(php_ini_loaded_file(), php_ini_scanned_files());

```