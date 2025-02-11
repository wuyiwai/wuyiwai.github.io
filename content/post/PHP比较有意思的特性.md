---
title: 'PHP比较有意思的特性'
date: '2024-07-29'
summary: "记录PHP比较有意思的特性，不定期更新"
tags: ["技术", "php"]
---
# null合并运算符 - ??
- 5.6 -> 7.0 新特性 - [官方文档](https://www.php.net/manual/zh/language.operators.comparison.php#language.operators.comparison.coalesce)
```
<?php
// NULL 合并运算符的例子
$action = $_POST['action'] ?? 'default';

// 以上例子等同于于以下 if/else 语句
if (isset($_POST['action'])) {
    $action = $_POST['action'];
} else {
    $action = 'default';
}
?>
```

# 太空船操作符（组合比较符）- <>
- 5.6 -> 7.0 新特性 - [官方文档](https://www.php.net/manual/zh/migration70.new-features.php#migration70.new-features.spaceship-op)
- 太空船操作符用于比较两个表达式。当 $a 小于、等于或大于 $b 时它分别返回 -1、0 或 1。比较的原则是沿用 PHP 的 [常规比较规则](https://www.php.net/manual/zh/types.comparisons.php) 进行的。
```
<?php
// 整数
echo 1 <=> 1; // 0
echo 1 <=> 2; // -1
echo 2 <=> 1; // 1

// 浮点数
echo 1.5 <=> 1.5; // 0
echo 1.5 <=> 2.5; // -1
echo 2.5 <=> 1.5; // 1
 
// 字符串
echo "a" <=> "a"; // 0
echo "a" <=> "b"; // -1
echo "b" <=> "a"; // 1
?>
```

# 三元运算符 -  ?:
- [官方文档](https://www.php.net/manual/zh/language.operators.comparison.php#language.operators.comparison.ternary)
```
<?php
// 三元运算符的例子
$action = (empty($_POST['action'])) ? 'default' : $_POST['action'];

// 以上等同于以下的  if/else 语句
if (empty($_POST['action'])) {
    $action = 'default';
} else {
    $action = $_POST['action'];
}
?>
```

# 空合并运算符赋值 - ??=
- 7.4引入- [官方文档](https://www.php.net/manual/zh/migration74.new-features.php#migration74.new-features.core.null-coalescing-assignment-operator)
```
<?php
$array['key'] ??= computeDefault();
// 等同于以下旧写法
if (!isset($array['key'])) {
    $array['key'] = computeDefault();
}
?>
```

# 数组展开操作
- 7.4引入- [官方文档](https://www.php.net/manual/zh/migration74.new-features.php#migration74.new-features.core.unpack-inside-array)
```
<?php
$parts = ['apple', 'pear'];
$fruits = ['banana', 'orange', ...$parts, 'watermelon'];
// ['banana', 'orange', 'apple', 'pear', 'watermelon'];
?>
```

# Nullsafe 操作符
- 8.0引入 - [官方文档](https://www.php.net/manual/zh/language.oop5.basic.php#language.oop5.basic.nullsafe)
自 PHP 8.0.0 起，类属性和方法可以通过 "nullsafe" 操作符访问： ?->。 除了一处不同，nullsafe 操作符和以上原来的属性、方法访问是一致的： 对象引用解析（dereference）为 null 时不抛出异常，而是返回 null。 并且如果是链式调用中的一部分，剩余链条会直接跳过。

此操作的结果，类似于在每次访问前使用 is_null() 函数判断方法和属性是否存在，但更加简洁。
```
<?php

// 自 PHP 8.0.0 起可用
$result = $repository?->getUser(5)?->name;

// 上边那行代码等价于以下代码
if (is_null($repository)) {
    $result = null;
} else {
    $user = $repository->getUser(5);
    if (is_null($user)) {
        $result = null;
    } else {
        $result = $user->name;
    }
}
?>

注意:
仅当 null 被认为是属性或方法返回的有效和预期的可能值时，才推荐使用 nullsafe 操作符。如果业务中需要明确指示错误，抛出异常会是更好的处理方式。
```