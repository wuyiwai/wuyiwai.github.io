---
title: 'php-memory-tracker 测试'
date: '2024-11-20'
summary: "记录php-memory-tracker的一些测试"
tags: ["技术", "swoole"]
---
> 参考资料
> - [Swoole Tracker 内存泄漏分析器 v4.0 正式发布](https://mp.weixin.qq.com/s/V9YQKS97H-eWxj923Cqdhw)
> - [扩展下载链接](https://doc.swoole.com/@memory-tracker/download.html)

# 安装扩展
##### 查看php版本
```
$ php -v

PHP 8.0.20 (cli) (built: Jul  6 2022 20:19:43) ( NTS )
Copyright (c) The PHP Group
Zend Engine v4.0.20, Copyright (c) Zend Technologies
    with Zend OPcache v8.0.20, Copyright (c), by Zend Technologies
```
得到 php8.0 和 NTS 版本两个信息，去下载链接下载 `memory_tracker_4.0.0_linux_x64_80.so`

##### 查看PHP扩展目录并把.so文件复制到该目录中
```
$ php -i | grep extension_dir

xtension_dir => /usr/local/php/lib/php/extensions/no-debug-non-zts-20200930 => /usr/local/php/lib/php/extensions/no-debug-non-zts-20200930
sqlite3.extension_dir => no value => no value
```

##### 修改 `php.ini` 文件，启用扩展
```
# 找到 php.ini 文件的路径
$ php --ini

Configuration File (php.ini) Path: /usr/local/php/
Loaded Configuration File:         /usr/local/php/php.ini
Scan for additional .ini files in: (none)
Additional .ini files parsed:      (none)

# vim /usr/local/php/php.ini 文件
# 添加一行  extension=memory_tracker.so 以启用该扩展
```

#### 查看扩展是否启用成功
```
$ php --ri memory_tracker

memory_tracker

memory_tracker support => enabled
Copyright => 上海识沃网络科技有限公司
Email => service@swoole.com
Website => https://www.swoole.com/
Version => 4.0.0

Directive => Local Value => Master Value
memory_tracker.enable => Off => Off
You have mail in /var/spool/mail/roo
```

# 测试
## 普通数组、字符串无限扩容导致的内存泄漏
##### 普通的`cli`环境 `cli.php`
```
class ClassA
{
    public array $arr = [];
    public string $str = '';
}

function foo(ClassA $obj)
{
    $str = str_repeat("big string", 1024);
    $obj->arr[] = $str;
    $obj->str .= $str;
}

$obj = new ClassA();
$usage = memory_get_usage();
$n = 100;
while ($n--) {
    foo($obj);
}

var_dump(strlen($obj->str));
var_dump(memory_get_usage() - $usage);
memory_tracker_leak_check();
```

执行
```
# 不开启内存检测，不会有性能消耗  
$ php cli.php   

int(1024000)  
int(2259616)

--------------------------

# 开启检测  
$ php -d memory_tracker.enable=1 cli.php

int(1024000)
int(2270440)
[Round#0] leak 1000.03 KB bytes, alloc 99 times at /data/codebase/wuyiwai/debug/cli.php:12
#0 /data/codebase/wuyiwai/debug/cli.php(19): foo(Object(ClassA))

[Round#0] leak 1003.12 KB bytes, alloc 100 times at /data/codebase/wuyiwai/debug/cli.php:10
#0 /data/codebase/wuyiwai/debug/cli.php(10): str_repeat('...', 1024)
#1 /data/codebase/wuyiwai/debug/cli.php(19): foo(Object(ClassA))
```

##### 协程环境 `co_server.php`
```
<?php
class Test
{
    public $arr = [];

    function run()
    {
        $locals = '';
        $this->run2($locals);
    }

    function run2(&$locals)
    {
        global $global1, $global2;
        $http = new \Swoole\Http\Server("0.0.0.0", 9501, SWOOLE_BASE);
        $http->set([
            'worker_num' => 1
        ]);
        $http->on("start", function ($server) {

        });
        $http->on("request", function ($req, $resp) use (&$global1, &$global2, &$locals) {
            $global2 .= "2222222222";
            $locals .= "333333333333";
            $global1[] = random_bytes(random_int(256, 4096));
            $this->arr[] = "444444444";
            $resp->end("hello world");

            memory_tracker_leak_check(128);
        });

        $http->start();
    }
}

(new Test())->run();
```
执行
```
$ php -d memory_tracker.enable=1 co_server.php
```
发起请求
```
ab -c 5 -n 5000 http://127.0.0.1:9501/
```
检测结果
```
[Round#121] leak 271.35 KB bytes, alloc 128 times at /data/codebase/wuyiwai/debug/co_server.php:25

[Round#128] leak 1.54 KB bytes, alloc 128 times at /data/codebase/wuyiwai/debug/co_server.php:24

[Round#128] leak 1.29 KB bytes, alloc 128 times at /data/codebase/wuyiwai/debug/co_server.php:23

...

[Round#2909] leak 278.62 KB bytes, alloc 128 times at /data/codebase/wuyiwai/debug/co_server.php:25

[Round#2944] leak 34.54 KB bytes, alloc 128 times at /data/codebase/wuyiwai/debug/co_server.php:24

[Round#2944] leak 28.79 KB bytes, alloc 128 times at /data/codebase/wuyiwai/debug/co_server.php:23

...

[Round#4981] leak 272.08 KB bytes, alloc 128 times at /data/codebase/wuyiwai/debug/co_server.php:25

[Round#4992] leak 48.79 KB bytes, alloc 128 times at /data/codebase/wuyiwai/debug/co_server.php:23

[Round#4992] leak 58.54 KB bytes, alloc 128 times at /data/codebase/wuyiwai/debug/co_server.php:24
```

##### 代码解释
在代码中，一个请求会对4个不同的变量做操作，分别是：
```
$global2 .= "2222222222"; // 10 byte
$locals .= "333333333333"; // 12 byte
$global1[] = random_bytes(random_int(256, 4096));
$this->arr[] = "444444444";
```
其中
关于：`co_server.php:25`->`leak 271.35 KB bytes`对应`$global1[] = random_bytes(random_int(256, 4096));`，因为这个函数逻辑每次会产生 256 ~ 4096 范围的int，设定每 128 次打印一次内存泄漏。那么每128次泄漏的内存平均为 (256 + 4096) / 2 * 128 / 1024 = 272 KB

关于：`co_server.php:24`->`leak 1.54 KB bytes`对应`$locals .= "333333333333";`: 因为 `333333333333` 占用 12 个byte。每 128 次泄漏的内存为 128 * 12 / 1024 = 1.5 KB，而且由于写法是 `.=`，泄露的内存在一直不断的累加

关于`co_server.php:23`->`leak 1.29 KB bytes`对应`$global2 .= "2222222222";`：因为 `333333333333` 占用 10 个byte。每 128 次泄漏的内存为 128 * 10 / 1024 = 1.25 KB，而且由于写法是 `.=`，泄露的内存在一直不断的累加

关于`$this->arr[] = "444444444";`，由于该变量是个类实例变量，尽管每次请求都会往里添加一个元素，但这种增长方式是线性可预测的内存增长，并不算内存泄漏

## 循环引用
```
const N = 200;
class testA
{
    public $pro;
}
function foo()
{
    var_dump(memory_get_usage());
    for ($i = 0; $i < N; $i++) {
        $obj = new testA();
        $obj->pro = $obj;
        unset($obj);

        memory_tracker_leak_check(64);
    }
    var_dump(memory_get_usage());
}
foo();
```
执行
```
$ php -d memory_tracker.enable=1 gc.php

int(1757304)
[Round#63] leak 3.50 KB bytes, alloc 64 times at /data/codebase/wuyiwai/debug/gc.php:11
#0 /data/codebase/wuyiwai/debug/gc.php(19): foo()

[Round#96] leak 3.50 KB bytes, alloc 64 times at /data/codebase/wuyiwai/debug/gc.php:11
#0 /data/codebase/wuyiwai/debug/gc.php(19): foo()

[Round#129] leak 3.50 KB bytes, alloc 64 times at /data/codebase/wuyiwai/debug/gc.php:11
#0 /data/codebase/wuyiwai/debug/gc.php(19): foo()

[Round#161] leak 3.50 KB bytes, alloc 64 times at /data/codebase/wuyiwai/debug/gc.php:11
#0 /data/codebase/wuyiwai/debug/gc.php(19): foo()

[Round#194] leak 3.50 KB bytes, alloc 64 times at /data/codebase/wuyiwai/debug/gc.php:11
#0 /data/codebase/wuyiwai/debug/gc.php(19): foo()

int(1770792)
```