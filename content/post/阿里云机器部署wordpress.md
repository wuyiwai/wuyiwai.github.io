---
title: 阿里云机器部署wordpress、typecho记录
date: 2025-02-11
summary: 记录了用阿里云机器部署wordpress、typecho的详细过程
tags: ["技术", "博客", "linux"]
---

## 部署目的及机器选择
- 目的：部署个人网站、个人项目（以下的所有配置选项都是基于该目的）
- 机器选择：
	- 服务器类型：ECS(弹性计算服务)：适合个人项目、博客网站和智能家居项目
	- 地域和可用区：选择离你用户群体最近的地域，一般在中国主要选择华东1（杭州）**或华北2（北京）
	- CPU和内存：1核2G或者2核4G即可
	- 存储：40-100G绰绰有余
	- 操作系统：
		- [x] aliyun发行版（不想多思考可以选这个）
		- 如果想做智能家居项目，运行一些特定的物联网框架（如Home Assistant、Node-RED等），建议选择 **Ubuntu** 或 **Debian**，这些可能支持更好一点
		- 不推荐选择LTS版本或者已经停止维护的发行版
	- 带宽：固定带宽 + （1Mbps到5Mbps），注意：99元套餐3Mbps也够用了
	- 安全组：配置安全组规则，确保只开放必要的端口（如HTTP 80、HTTPS 443、SSH 22）等
	- 云监控：记得开，监控内存和cpu等，还可以配置告警规则
	- ssl证书：免费的也能用
	- DDoS：启用DDoS防护服务

## 配置远程登录
建议：使用`ssh`登录，禁用密码登录

### 在本地先生成ssh秘钥
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
默认会保存在 `~/.ssh/id_rsa`,其中` id_rsa` 是私钥(不要分享给别人),`id_rsa.pub`是公钥

### 将公钥上传到阿里云ECS实例
- [登录阿里云控制台](https://www.aliyun.com/)
- 进入ECS管理台
- 找到你的 ECS 实例，点击实例名称进入详情页
- 在左侧菜单中，点击 **本实例密钥对**
- 点击 **绑定密钥对**，选择 **使用已有密钥对** 或 **创建新密钥对**
- 选择 **使用已有密钥对**，将你的公钥内容（`id_rsa.pub` 文件内容）粘贴到输入框中
- 点击 **确定**，完成绑定

### 配置本地SSH登录
在本地配置了`iterm2`+`zsh`的情况下：
```bash
vim ~/.zshrc
# 添加以下内容
ssh-add /Users/username/.ssh/aliyun_rsa
alias aliyun='ssh root@your_server_ip'

source ~/.zshrc
```
接下来就可以用 `aliyun` 这个命令直接直接连接机器了

## 配置Nginx + PHP + Mysql

### 更新软件
```bash
sudo yum update -y
```

### 配置nginx
```bash
$ sudo yum install nginx -y
$ sudo systemctl start nginx // 启动nginx
$ sudo systemctl enable nginx // 设置为开机启动
```
编辑`nginx`配置文件
```
$ sudo vim /etc/nginx/conf.d/wordpress.conf
```

例子：
```
server {
    listen 80;
    server_name {your_domain};  # 改为你的域名或IP
    client_max_body_size 10M; // 单次请求的最大配置

    root /var/www/{your_blog_name};  # 改为你的博客目录
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass 127.0.0.1:9000;  // 这里要注意，用什么fastcgi取决于php.ini里面listen的配置
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

```bash
# 检查nginx配置文件是否正确
$ sudo nginx -t

# 重启nginx
$ sudo systemctl restart nginx
```

#### 访问服务
```
http://{your_domain}
```

#### 配置数据库
```bash
# 安装mysql
$ sudo yum install mysql-server -y
$ sudo systemctl start mysqld
$ sudo systemctl enable mysqld
$ sudo mysql_secure_installation // 这一步开始交互式配置数据库密码

# 配置数据库
$ sudo mysql -u root -p // 以root账户进行登录
$ > CREATE DATABASE wordpress; 创建wordpress用户
$ > CREATE USER '{your_username}'@'localhost' IDENTIFIED BY '{your_password}';
$ > GRANT ALL PRIVILEGES ON wordpress.* TO '{your_username}'@'localhost';
$ > FLUSH PRIVILEGES; // 刷新权限
$ > EXIT;
```
注意：
	- 这里的`{your_username}`是额外创建给wordpress这个应用的用户，主要用来隔离数据库权限的，可以修改成自己想要的用户名
	- `'{your_username}'@'localhost'`这里的单引号一个都别省略，语法就是这样的，`localhost`这里要特别注意，如果是单纯在内网访问，可以只给一个`localhost`就可以了,如果想用`datagrip`或者`navicat`这样的管理工具远程访问，可以额外创建一个``'{your_username}'@'xxx.xxx.xxx.xxx'``这样user用来给特定ip进行访问
	- `{your_password}`就填你想要的密码
	- `grant`语句里的`wordpress.*`指的是`wordpress`数据库的`*`,如果想所有数据库都对这个用户开放的话，就写`*.*`
特别注意：
- 要用`datagrip`这样的管理工具去管理数据库，就要用到远程连接，记得要开放对应的远程端口，如果只是自己用，可以配置开放特定ip

#### 阿里云对特定ip开放特定端口白名单
- 打开阿里云ECS控制台,找到你需要配置的 ECS 实例，点击实例名称进入详情页
- 在实例详情页的左侧菜单中，点击 **安全组**,找到当前实例绑定的安全组，点击安全组 ID 进入安全组详情页
- 在安全组详情页，点击 **配置规则**，选择 **入方向** 标签页，点击 **手动添加**，
- 填写以下信息：
    - **授权策略**：允许。
    - **协议类型**：MySQL（3306）。
    - **端口范围**：3306/3306。
    - **优先级**：1（数字越小，优先级越高）。
    - **授权类型**：IPv4 地址段访问。
    - **授权对象**：填写你需要允许的特定 IP 地址。例如：
        - 如果只允许单个 IP，填写 `x.x.x.x/32`（例如 `192.168.1.100/32`）。
        - 如果允许一个 IP 段，填写 `x.x.x.x/24`（例如 `192.168.1.0/24`）。

#### 安装php
```bash
$ sudo yum install epel-release -y
$ sudo yum install https://rpms.remirepo.net/enterprise/remi-release-7.rpm -y
$ sudo yum install yum-utils -y
$ sudo yum-config-manager --enable remi-php81
$ sudo yum install php php-mysqlnd php-gd php-xml php-mbstring php-json -y
$ php -v //验证php是否安装成功
$ sudo yum install php-fpm -y // 安装php-fpm

# 启动 PHP-FPM 并设置开机自启动：
$ sudo systemctl start php-fpm
$ sudo systemctl enable php-fpm

# 验证 PHP-FPM 是否正常运行：
$ sudo systemctl status php-fpm
```

#### 安装wordpress
```bash
# 下载wordpress
$ cd /var/www
$ sudo wget https://cn.wordpress.org/wordpress-6.7.1-zh_CN.tar.gz

# 解压wordpress
$ sudo tar -xvzf latest.tar.gz

# 重命名wordpress目录（可选）
$ sudo mv wordpress your_blog_name // 最后一个参数是自己的博客名

# 设置wordpress权限
$ sudo chmod -R 755 /var/www/your_blog_name
$ sudo chown -R nginx:nginx /var/www/wordpress (可选：这里要注意启动nginx的linux用户和用户组是哪个，这里保持跟nginx的一致就行，如果启动nginx的是root用户，就不要动)

# 配置 WordPress**
$ cd /var/www/your_blog_name
$ sudo cp wp-config-sample.php wp-config.php

$ sudo vim wp-config.php // 改一下DB_NAME、DB_USER、DB_PASSWORD就可以了
> define('DB_NAME', 'wordpress'); // 这个是刚刚在mysql创建的wordpress数据库名
> define('DB_USER', '{your_username}'); // 这个就是刚刚在mysql创建的给wordpress用的用户名
> define('DB_PASSWORD', '{your_password}');
> define('DB_HOST', 'localhost');
```

#### wordpress的一些其他踩坑点
##### 上传主题时 或 健康检查没有写入权限
原因是用户组没有配置对，检查用户和用户组具备`755`权限
##### 单次请求上传提示文件过大
- **`Nginx`**：设置 `client_max_body_size 100M;`
- **`PHP`**：调整 `upload_max_filesize` 和 `post_max_size`
- 修改`wordpress`根目录的`wp-config.php`配置: `define('WP_MEMORY_LIMIT', '256M');`

#### 一些定位方法:
##### 查看nginx报错日志：
```bash
$ tail -f /var/log/nginx/error.log
```